import { Center, Spinner, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react'
import { isMobileOrTabletUserAgent } from '../utils/isMobileOrTabletUserAgent';

interface UserAgentCheckProps {
  children: any
}

const UserAgentCheck: React.FC<UserAgentCheckProps> = ({children}) => {

  const router = useRouter();

  useEffect(() => {
    if (isMobileOrTabletUserAgent()) {
      router.push("/");
    }
  })

  return (
    <div>
      {isMobileOrTabletUserAgent() ? (
        <>
          <Center>
            <Text>
              Redirecting...
            </Text>
            <Spinner />
          </Center>
        </>
      ) : children}
    </div>
  );
}

export default UserAgentCheck;