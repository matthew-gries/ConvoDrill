import { Button } from '@chakra-ui/button';
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay } from '@chakra-ui/modal';
import { Box, useDisclosure, useToast } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import React from 'react'
import { useUpdateConvoMutation } from '../generated/graphql';
import { InputField } from './InputField';
import { LanguageSelect } from './LanguageSelect';
import { OperationContext } from 'urql';

type UpdateConvoModalButtonProps = {
  reexecuteUseConvoQuery: (opts?: Partial<OperationContext>) => void;
  convoId: string;
  initialTitle: string;
  initialNativeLanguage: string;
  initialTargetLanguage: string;
}

export const UpdateConvoModalButton: React.FC<UpdateConvoModalButtonProps> = ({
  reexecuteUseConvoQuery,
  convoId,
  initialTitle,
  initialNativeLanguage,
  initialTargetLanguage
}) => {

  const [,updateConvo] = useUpdateConvoMutation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast({
    title: "Update Failed",
    status: 'error',
    duration: 9000,
    isClosable: true
  });

  return (
    <>
      <Button onClick={onOpen} ml={4} mt={4}>Edit Convo</Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Convo</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Formik
              initialValues={{
                title: initialTitle,
                targetLanguage: initialTargetLanguage,
                nativeLanguage: initialNativeLanguage
              }}
              onSubmit={async (values) => {
                if (values.title.length === 0 || values.nativeLanguage.length === 0 || values.targetLanguage.length === 0) {

                  if (values.title.length === 0) {
                    toast({ description: "Title should not be empty." });
                  } else if (values.nativeLanguage.length === 0) {
                    toast({ description: "Native language should be selected." });
                  } else if (values.targetLanguage.length === 0) {
                    toast({ description: "Target language should be selected." });
                  }

                  return;
                }

                const {data, error} = await updateConvo({
                  input: values,
                  updateConvoId: convoId
                });

                if (error) {
                  toast({ description: "Convo could not be updated." });
                } else if (data) {
                  toast({
                    title: "Update Succeeded",
                    status: 'success',
                    duration: 9000,
                    isClosable: true
                  });
                  onClose();
                }

                reexecuteUseConvoQuery({requestPolicy: 'network-only'});
              }}
            >
              {({ isSubmitting }) => (
                <Form>
                  <InputField
                    name='title'
                    placeholder='Title'
                    label='Title'
                  />
                  {/* <Box mt={4}>
                    <LanguageSelect
                      name='targetLanguage'
                      placeholder='Target Language'
                    />
                  </Box>
                  <Box mt={4}>
                    <LanguageSelect
                      name='nativeLanguage'
                      placeholder='Native Language'
                    />
                  </Box> */}
                  <Button type="submit" mr={3} mt={4} mb={4} colorScheme='blue' isLoading={isSubmitting}>
                    Submit
                  </Button>
                  <Button mr={3} mt={4} mb={4} colorScheme='gray' onClick={onClose}>
                    Cancel
                  </Button>
                </Form>
              )}
            </Formik>
          </ModalBody>

        </ModalContent>
      </Modal>
    </>
  );
}