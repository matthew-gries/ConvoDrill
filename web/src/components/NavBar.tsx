import { SunIcon } from '@chakra-ui/icons';
import { Box, Button, Flex, IconButton, Link, useColorMode } from '@chakra-ui/react';
import NextLink from "next/link";
import { useRouter } from 'next/router';
import React from 'react'
import { useLogoutMutation, useMeQuery } from '../generated/graphql';

interface NavBarProps {

}

export const NavBar: React.FC<NavBarProps> = ({}) => {
  
  const router = useRouter();
  const { toggleColorMode } = useColorMode();
  const [{data, fetching}] = useMeQuery({
    // pause: isServer()
    // TODO fix this because checking for window is no longer a good idea
    pause: false
  });
  const [{fetching: logoutFetching}, logout] = useLogoutMutation();

  let body;

  // data is loading
  if (fetching) {
    body = null;
  } else if (!data?.me) {
    // user is not logged in
    body = (
      <>
        <Link href="/login" as={NextLink} mr={2}>Login</Link>
        <Link href="/register" as={NextLink}>Register</Link>
      </>
    );
  } else {
    body = (
      <Flex>
        <Box mr={2}>{data.me?.username}</Box>
        <Button
          variant={'link'}
          onClick={() => {
            logout({});
            router.push("/login");
          }}
          isLoading={logoutFetching}
        >
          Logout
        </Button>
      </Flex>
    );
  }

  return (
    <Flex zIndex={1} position="sticky" top={0} bg="blackAlpha.300" p={4}>
      <Link href="/" as={NextLink}>
          ConvoDrill
      </Link>
      <Box ml={"auto"}>
        {body}
      </Box>
      <Box ml="2">
        <IconButton
          icon={<SunIcon />}
          aria-label='Toggle color mode'
          size='xs'
          onClick={toggleColorMode}
        />
      </Box>
    </Flex>
  );
}