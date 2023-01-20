import { Box, Divider, Flex, Heading, Text } from '@chakra-ui/layout';
import { Button, useDisclosure } from '@chakra-ui/react';
import { NextPage } from 'next';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React from 'react';
import short from "short-uuid";
import { ConvoEntryEditTreeView } from '../../components/ConvoEntryEditTreeView';
import { Layout } from '../../components/Layout';
import { UpdateConvoModalButton } from '../../components/UpdateConvoModalButton';
import UserAgentCheck from '../../components/UserAgentCheck';
import { useConvoQuery } from '../../generated/graphql';
import { createUrqlClient } from '../../utils/createUrqlClient';
import { useIsAuth } from '../../utils/useIsAuth';

const Convo: NextPage<{shortid: string}> = () => {

  useIsAuth(false);

  const router = useRouter();
  const translator = short();

  const convoId = translator.toUUID(router.query.shortid ? router.query.shortid.toString() : "").toString();

  const [{data, fetching}, reexecuteUseConvoQuery] = useConvoQuery({
    variables: {
      convoId
    }
  });
  const convoEditDrawerButtonRef = React.useRef();
  const { isOpen: isDrawerOpen, onOpen: onDrawerOpen, onClose: onDrawerClose } = useDisclosure();


  if (!fetching && !data) {
    // TODO shouldn't happen, but need to think of a better screen
    return <div>Query failed...</div>
  }

  return (
    <UserAgentCheck>
      <Layout variant='xlarge'>
        {fetching && !data ? (
          <div>Loading...</div>
        ) : (
          <Box>
            <Flex>
              <Heading>{data.convo.title}</Heading>
              <Box ml="auto">
                <Text>Native language: {data.convo.nativeLanguage}</Text>
                <Text>Target language: {data.convo.targetLanguage}</Text>
              </Box>
            </Flex>
            <Divider p={3}/>
            <Flex>
              <Button
                ref={convoEditDrawerButtonRef}
                mt={4}
                onClick={onDrawerOpen}
              >
                Edit Entry
              </Button>
              <Flex ml="auto">
                <Button mt={4} onClick={() => router.push(`/execute/${router.query.shortid}`)}>Execute</Button>
                <UpdateConvoModalButton
                  initialTitle={data.convo.title}
                  initialNativeLanguage={data.convo.nativeLanguage}
                  initialTargetLanguage={data.convo.targetLanguage}
                  convoId={convoId}
                  reexecuteUseConvoQuery={reexecuteUseConvoQuery}
                />
                <Button mt={4} ml={4} onClick={() => router.push("/")}>Return to Home</Button>
              </Flex>
            </Flex>
            <Box mt={4}>
              <ConvoEntryEditTreeView
                convoId={convoId}
                isDrawerOpen={isDrawerOpen}
                onDrawerClose={onDrawerClose}
                buttonRef={convoEditDrawerButtonRef}
              />
            </Box>
          </Box>
        )}
      </Layout>
    </UserAgentCheck>
  );
}

export default withUrqlClient(createUrqlClient)(Convo);