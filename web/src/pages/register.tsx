import { Box, Button, Container, Flex, Stack, Image, useBreakpointValue, Heading, HStack, Text, useColorModeValue } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React from 'react';
import { InputField } from '../components/InputField';
import UserAgentCheck from '../components/UserAgentCheck';
import { useRegisterMutation } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';
import { toErrorMap } from '../utils/toErrorMap';


export const Register: React.FC<{}> = ({}) => {

  const router = useRouter();
  const [, register] = useRegisterMutation();

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
                Sign up
              </Heading>
              <HStack spacing="1" justify="center">
                <Text color="muted">Already have an account?</Text>
                <Button variant="link" colorScheme="blue" onClick={() => {
                  router.push("/login")
                }}>
                  Sign in
                </Button>
              </HStack>
            </Stack>
          </Stack>
          <Box
            py={{ base: '0', sm: '4' }}
            px={{ base: '4', sm: '10' }}
            bg={useBreakpointValue({ base: 'transparent', sm: 'bg-surface' })}
            boxShadow={{ base: 'none', sm: useColorModeValue('lg', 'lg-dark') }}
            borderRadius={{ base: 'none', sm: 'xl' }}
            // borderWidth={window.innerWidth > 600 ? "1px" : "0px"}
          >
            <Stack spacing="6">
              <Stack spacing="5">
                <Formik
                  initialValues={{
                    username: "",
                    email: "",
                    password: ""
                  }}
                  onSubmit={async (values, {setErrors}) => {
                    const response = await register({options: values});
                    if (response.data?.register.errors) {
                      setErrors(toErrorMap(response.data.register.errors));
                    } else if (response.data?.register.user) {
                      router.push('/');
                    }
                  }}
                >
                  {({ isSubmitting }) => (
                    <Form>
                      <InputField
                        name='username'
                        placeholder='Username'
                        label='Username'
                      />
                      <Box mt={4}>
                        <InputField
                          name='email'
                          placeholder='Email'
                          label='Email'
                        />
                      </Box>
                      <Box mt={4}>
                        <InputField
                          name='password'
                          placeholder='Password'
                          label='Password'
                          type='password'
                        />
                      </Box>
                      <Button mt={4} type="submit" isLoading={isSubmitting}>
                        Register
                      </Button>
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

export default withUrqlClient(createUrqlClient, { ssr: false })(Register);