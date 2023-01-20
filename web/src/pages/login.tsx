import { Box, Button, Container, Flex, Heading, HStack, Link, Stack, useBreakpointValue, Text, useColorModeValue, Image } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React from 'react';
import NextLink from 'next/link';
import { InputField } from '../components/InputField';
import { useLoginMutation } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';
import { toErrorMap } from '../utils/toErrorMap';
import UserAgentCheck from '../components/UserAgentCheck';


export const Login: React.FC<{}> = ({}) => {

  const router = useRouter();
  const [, login] = useLoginMutation();

  return (
    <UserAgentCheck>
      <Container maxW="lg" py={{ base: '12', md: '24' }} px={{ base: '0', sm: '8' }}>
        <Stack spacing="8">
          <Stack spacing="6">
            <Flex justifyContent="center">
              <Image
                src="/drill_logo.png"
                alt='logo'
                boxSize="25%"
                alignItems="center"
              />
            </Flex>
            <Stack spacing={{ base: '2', md: '3' }} textAlign="center">
              <Heading size={useBreakpointValue({ base: 'xs', md: 'sm' })}>
                Log in to your account
              </Heading>
              <HStack spacing="1" justify="center">
                <Text color="muted">Don&apos;t have an account?</Text>
                <Button variant="link" colorScheme="blue" onClick={() => {
                  router.push("/register")
                }}>
                  Sign up
                </Button>
              </HStack>
            </Stack>
          </Stack>
          <Box
            py={{ base: '0', sm: '4' }}
            px={{ base: '4', sm: '10' }}
            bg={useBreakpointValue({ base: 'transparent', sm: useColorModeValue("bg-surface", "blackAlpha.300") })}
            boxShadow={{ base: 'none', sm: useColorModeValue('lg', 'lg-dark') }}
            borderRadius={{ base: 'none', sm: 'xl' }}
            borderWidth={{ base: "0px", sm: useColorModeValue("1px", "0px")}}
          >
            <Stack spacing="6">
              <Stack spacing="5">
                <Formik
                  initialValues={{
                    usernameOrEmail: "",
                    password: ""
                  }}
                  onSubmit={async (values, {setErrors}) => {
                    const response = await login(values);
                    if (response.data?.login.errors) {
                      setErrors(toErrorMap(response.data.login.errors));
                    } else if (response.data?.login.user) {
                      if (typeof router.query.next === 'string') {
                        router.push(router.query.next);
                      } else {
                        router.push(`/user/${response.data.login.user.username}`);
                      }
                    }
                  }}
                >
                  {({ isSubmitting }) => (
                    <Form>
                      <InputField
                        name='usernameOrEmail'
                        placeholder='Username or Email'
                        label='Username or Email'
                      />
                      <Box mt={4}>
                        <InputField
                          name='password'
                          placeholder='Password'
                          label='Password'
                          type='password'
                        />
                      </Box>
                      <Flex alignItems="center" mt={3}>
                        <Button mt={2} type="submit" isLoading={isSubmitting}>
                          Login
                        </Button>
                        <Link ml="auto" as={NextLink} href="/forgot-password">Forgot password?</Link>
                      </Flex>
                    </Form>
                  )}
                </Formik>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Container>
    </UserAgentCheck>
  );
}

export default withUrqlClient(createUrqlClient)(Login);