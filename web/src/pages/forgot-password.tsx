import { Button, Box } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import { withUrqlClient } from 'next-urql';
import React, { useState } from 'react'
import { InputField } from '../components/InputField';
import UserAgentCheck from '../components/UserAgentCheck';
import { Wrapper } from '../components/Wrapper';
import { useForgotPasswordMutation } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';


const ForgotPassword: React.FC<{}> = ({}) => {

  const [complete, setComplete] = useState(false);
  const [,forgotPassword] = useForgotPasswordMutation();

  return (
    <UserAgentCheck>
      <Wrapper variant='small'>
        <Formik
          initialValues={{
            email: "",
          }}
          onSubmit={async (values) => {
            await forgotPassword(values);
            setComplete(true);
          }}
        >
          {({ isSubmitting }) => (complete)
          ? <Box>If an account with this email exists, we will send you a link to reset your password</Box>
          : (
            <Form>
              <InputField
                name='email'
                placeholder='Email'
                label='Email'
                type='email'
              />
              <Button mt={4} type="submit" isLoading={isSubmitting}>
                Send Email
              </Button>
            </Form>
          )}
        </Formik>
      </Wrapper>
    </UserAgentCheck>
  );
}

export default withUrqlClient(createUrqlClient)(ForgotPassword);
