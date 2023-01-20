import { Button, IconButton } from '@chakra-ui/button';
import { Flex, Heading, Stack, Box, Text } from '@chakra-ui/layout';
import { ArrowForwardIcon, EditIcon } from "@chakra-ui/icons";
import { rest } from 'lodash';
import { NextPage } from 'next';
import { withUrqlClient } from 'next-urql';
import { useEffect, useState } from 'react';
import { CreateConvoModalButton } from '../../components/CreateConvoModalButton';
import { Layout } from '../../components/Layout';
import { useConvosQuery } from '../../generated/graphql';
import { createUrqlClient } from '../../utils/createUrqlClient';
import { useIsAuth } from '../../utils/useIsAuth';
import { DeleteConvoModalButton } from '../../components/DeleteConvoModalButton';
import { useRouter } from 'next/router';
import short from "short-uuid";
import { useColorModeValue } from '@chakra-ui/react';
import UserAgentCheck from '../../components/UserAgentCheck';


const User: NextPage<{username: string}> = () => {

  useIsAuth(false);

  const [variables, setVariables] = useState({limit: 10, skip: 0})
  const router = useRouter();
  const translator = short();
  const [{data, fetching}, reexecuteUseConvoQuery] = useConvosQuery({ variables });

  const bg = useColorModeValue("bg-surface", "blackAlpha.300");


  // TODO remove in favor of caching
  useEffect(() => {

    if (fetching) { return; }

    const timerId = setTimeout(() => {
      reexecuteUseConvoQuery({requestPolicy: 'network-only'});
    }, 500);

    return () => clearTimeout(timerId);
  }, [fetching, reexecuteUseConvoQuery]);


  if (!fetching && !data) {
    // TODO shouldn't happen, but need to think of a better screen
    return <div>Query failed...</div>
  }

  return (
    <UserAgentCheck>
      <Layout>
        <Flex align="center">
          <Heading>Hi, {router.query.username}</Heading>
          <CreateConvoModalButton />
        </Flex>
        <br />
        {fetching && !data ? (
          <div>Loading...</div>
        ) : (
          <Stack spacing={8}>
            {data.convos.convos.map((convo, i) => (
              <Flex
                key={i}
                p={5}
                shadow='md'
                rounded="md"
                borderWidth='1px'
                bg={bg}
                {...rest}
              >
                <Box>
                  <Heading fontSize='xl'>{convo.title}</Heading>
                  <Text>Language: {convo.targetLanguage}</Text>
                  {convo.rootConvoEntry
                    ? <Text mt={4}>{convo.rootConvoEntry.promptText}</Text>
                    : null}
                </Box>
                <Flex ml="auto">
                <IconButton aria-label='Execute conversation' icon={<ArrowForwardIcon />} onClick={() => {
                    router.push(`/execute/${translator.fromUUID(convo.id)}`);
                  }}/>
                  <IconButton aria-label='Edit conversation' icon={<EditIcon />} ml="2" onClick={() => {
                    router.push(`/convo/${translator.fromUUID(convo.id)}`);
                  }}/>
                  <DeleteConvoModalButton convoId={convo.id}/>
                </Flex>
              </Flex>
            ))}
          </Stack>
        )}
        {data && data.convos.hasMore ? (
          <Flex>
            <Button isLoading={fetching} m="auto" my={8} onClick={() => {
              setVariables({
                limit: variables.limit,
                skip: variables.limit + variables.limit
              })
            }}>
              Load more
            </Button>
          </Flex>
        ) : null}
      </Layout>
    </UserAgentCheck>
  );
}

export default withUrqlClient(createUrqlClient)(User);