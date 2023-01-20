import { Button, Box, Link, Flex } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import { NextPage } from 'next';
import { withUrqlClient } from 'next-urql';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { InputField } from '../../components/InputField';
import UserAgentCheck from '../../components/UserAgentCheck';
import { Wrapper } from '../../components/Wrapper';
import { useChangePasswordMutation } from '../../generated/graphql';
import { createUrqlClient } from '../../utils/createUrqlClient';
import { toErrorMap } from '../../utils/toErrorMap';


const ChangePassword: NextPage<{token: string}> = () => {

  const router = useRouter();
  const [,changePassword] = useChangePasswordMutation();
  const [tokenError, setTokenError] = useState('');

  return (
    <UserAgentCheck>
      <Wrapper variant='small'>
        <Formik
          initialValues={{
            newPassword: ""
          }}
          onSubmit={async (values, {setErrors}) => {
            const response = await changePassword({
              newPassword: values.newPassword,
              token: typeof router.query.token === "string" ? router.query.token : ""
            });
            if (response.data?.changePassword.errors) {
              const errorMap = toErrorMap(response.data.changePassword.errors);
              if ('token' in errorMap) {
                setTokenError(errorMap.token);
              }
              setErrors(errorMap);
            } else if (response.data?.changePassword.user) {
              router.push('/');
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <InputField
                name='newPassword'
                placeholder='New Password'
                label='New Password'
                type='password'
              />
              {tokenError
                ? (
                  <Flex>
                    <Box mr={2} color="red">{tokenError}</Box>
                    <Link as={NextLink} href="/forgot-password">Return to Forgot Password</Link>
                  </Flex>
                )
                : null}
              <Button mt={4} type="submit" colorScheme="cyan" isLoading={isSubmitting}>
                Change Password
              </Button>
            </Form>
          )}
        </Formik>
      </Wrapper>
    </UserAgentCheck>
  );
}

export default withUrqlClient(createUrqlClient)(ChangePassword);