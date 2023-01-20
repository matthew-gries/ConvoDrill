import { Stack, Image, Heading, useBreakpointValue, Center, Container } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react'
import { isMobileOrTabletUserAgent } from '../utils/isMobileOrTabletUserAgent';

const Download: React.FC<{}> = ({}) => {

  const router = useRouter();

  useEffect(() => {
    if (!isMobileOrTabletUserAgent()) {
      router.push("/");
    }
  })

  return (
    <Container
      maxW="lg"
      py={{ base: '12', md: '24' }}
      px={{ base: '0', sm: '8' }}
    >
      <Stack spacing="8">
        <Stack spacing="6">
          <Center>
            <Image
              src="/drill_logo.png"
              alt='logo'
              boxSize="60%"
              alignItems="center"
            />
          </Center>
          <Stack spacing={{ base: '2', md: '3' }} textAlign="center">
            <Heading size={useBreakpointValue({ base: 'xs', md: 'sm' })}>
              Download the app today!
            </Heading>
          </Stack>
        </Stack>
      </Stack>
    </Container>
  );
}

export default Download;