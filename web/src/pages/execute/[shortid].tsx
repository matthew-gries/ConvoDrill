import { Box, Text } from '@chakra-ui/layout';
import { Button, Flex, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import { NextPage } from 'next';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import short from "short-uuid";
import { Layout } from '../../components/Layout';
import { Wrapper } from '../../components/Wrapper';
import { ConvoEntry, ConvoEntryResponse, useConvoEntriesQuery, useConvoQuery } from '../../generated/graphql';
import { createUrqlClient } from '../../utils/createUrqlClient';
import { useIsAuth } from '../../utils/useIsAuth';
import { useColorModeValue } from '@chakra-ui/react';
import levenshtein from "fast-levenshtein";

import { TTSComponent } from '../../components/TTSComponent';
import { SpeechToTextComponent } from '../../components/SpeechToTextComponent';
import UserAgentCheck from '../../components/UserAgentCheck';
import { ChevronDownIcon } from '@chakra-ui/icons';


const Execute: NextPage<{shortid: string}> = () => {

  useIsAuth(false);

  const router = useRouter();
  const translator = short();

  const convoId = translator.toUUID(router.query.shortid ? router.query.shortid.toString() : "").toString();

  const [{data: convoData, fetching: convoFetching}] = useConvoQuery({
    variables: {
      convoId
    }
  });
  const [{data: convoEntriesData, fetching: convoEntriesFetching}] = useConvoEntriesQuery({
    variables: {
      convoId
    }
  });

  const [isStarted, setIsStarted] = useState(false);
  const [currentConvoEntry, setCurrentConvoEntry] = useState<ConvoEntry | null>(null);
  const [currentAnswer, setCurrentAnswer] = useState<string | null>(null);
  const [bestMatchToAnswerEntryResponse, setBestMatchToAnswerEntryResponse] = useState<ConvoEntryResponse | null>(null);

  const bg = useColorModeValue("bg-surface", "blackAlpha.300");

  useEffect(() => {
    if ((!convoEntriesFetching && !convoEntriesData) || convoEntriesFetching) { return; }

    const rootEntry = convoEntriesData.convoEntries.find(convoEntry => convoEntry.isRoot);

    if (!rootEntry) {
      console.error("Root entry could not be found!");
      return;
    }

    setCurrentConvoEntry(rootEntry as ConvoEntry);

  }, [convoEntriesFetching, convoEntriesData, setCurrentConvoEntry]);

  // calculate hamming distance when new ang
  useEffect(() => {

    if (!currentConvoEntry || !currentAnswer) { return; }

    const responses = currentConvoEntry.childConvoEntryResponses;
    let bestResponse: ConvoEntryResponse | null = null;
    let currentShortestDistance = Number.POSITIVE_INFINITY;
    responses.forEach(response => {
      // const {ans, res} = makeStringsSameLength(currentAnswer, response.responseText);
      const distance = levenshtein.get(currentAnswer, response.responseText);
      console.log(distance + " " + currentAnswer + " " + response.responseText);
      if (distance < currentShortestDistance) {
        currentShortestDistance = distance;
        bestResponse = response;
      }
    });

    setBestMatchToAnswerEntryResponse(bestResponse);
  }, [currentAnswer, currentConvoEntry]);

  if ((!convoEntriesFetching && !convoEntriesData) || (!convoFetching && !convoData)) {
    // TODO shouldn't happen, but need to think of a better screen
    return <div>Query failed...</div>
  }

  return (
    <UserAgentCheck>
      <Layout variant='large'>
        {(convoEntriesFetching && !convoEntriesData) || (convoFetching && !convoData) ? (
          <div>Loading...</div>
        ) : (
          <Wrapper variant='small'>
            {!isStarted ? (
              <Box>
                <Flex
                  p={5}
                  shadow='md'
                  rounded="md"
                  bg={bg}
                  borderWidth='1px'
                >
                  <Flex direction="column">
                    <Text>{currentConvoEntry ? currentConvoEntry.promptText : null}</Text>
                    <Text as="i" mt={2}>
                      {currentConvoEntry ? "Suggestion: " + currentConvoEntry.answerSuggestion : null}
                    </Text>
                  </Flex>
                </Flex>
                {currentConvoEntry ? (
                  <Button onClick={() => setIsStarted(true)} mt={3}>
                    Start
                  </Button>
                ) : null}
                <Button onClick={() => router.push(`/convo/${router.query.shortid}`)} ml={3} mt={3}>
                  Return
                </Button>
              </Box>
            ) : (
              <Box>
                <Flex
                  p={5}
                  shadow='md'
                  borderWidth='1px'
                  rounded="md"
                  bg={bg}
                >
                  {currentConvoEntry ? (
                    <Flex direction="column">
                      <TTSComponent highlight lang={convoData.convo.targetLanguage}>
                        {currentConvoEntry.promptText}
                      </TTSComponent>
                      <Text as="i" mt={2}>
                        Suggestion: {currentConvoEntry.answerSuggestion}
                      </Text>
                    </Flex>
                  ): (
                    <Box>Finished!</Box>
                  )}
                </Flex>
                <Box ml={3}>
                  <SpeechToTextComponent
                    language={convoData.convo.nativeLanguage}
                    setCurrentAnswer={setCurrentAnswer}
                  />
                {bestMatchToAnswerEntryResponse ? (
                  <Box>
                    <Text>Best match: {bestMatchToAnswerEntryResponse.responseText}</Text>
                  </Box>
                ) : null}
                </Box>
                <Flex>
                  {currentConvoEntry ? (
                    <Button ml={3} mt={3} onClick={() => {
                      if (currentConvoEntry) {
                        // TODO maybe pick a random response here rather than early return
                        if (!bestMatchToAnswerEntryResponse) {
                          return;
                        }
                        const nextEntry = convoEntriesData.convoEntries.find(
                          convoEntry => convoEntry.id === bestMatchToAnswerEntryResponse.childConvoEntryId);
                        if (!nextEntry) {
                          setCurrentConvoEntry(null);
                        } else {
                          setCurrentConvoEntry(nextEntry as ConvoEntry);
                        }
                        setCurrentAnswer(null);
                        setBestMatchToAnswerEntryResponse(null);
                      }
                    }}>
                      Next
                    </Button>
                  ) : null}
                  <Button ml={3} mt={3} onClick={() => router.push(`/convo/${router.query.shortid}`)}>
                    Return
                  </Button>
                  {currentConvoEntry ? (
                    <Menu>
                      <MenuButton
                        ml="auto"
                        mr={3}
                        mt={3}
                        as={Button}
                        rightIcon={<ChevronDownIcon />}
                      >
                        Override
                      </MenuButton>
                      <MenuList>
                        {currentConvoEntry.childConvoEntryResponses.map((convoEntryResponse, i) => (
                          <MenuItem
                            key={i}
                            onClick={() => {
                              const nextEntry = convoEntriesData.convoEntries.find(
                                convoEntry => convoEntry.id === convoEntryResponse.childConvoEntryId);
                              if (!nextEntry) {
                                setCurrentConvoEntry(null);
                              } else {
                                setCurrentConvoEntry(nextEntry as ConvoEntry);
                              }
                              setCurrentAnswer(null);
                              setBestMatchToAnswerEntryResponse(null);
                            }}
                          >
                            {convoEntryResponse.responseText}
                          </MenuItem>
                        ))}
                      </MenuList>
                    </Menu>
                  ) : null}
                </Flex>
              </Box>
            )}
          </Wrapper>
        )}
      </Layout>
    </UserAgentCheck>
  );
}

export default withUrqlClient(createUrqlClient)(Execute);