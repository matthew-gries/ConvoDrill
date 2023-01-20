import { Button } from '@chakra-ui/button';
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay } from '@chakra-ui/modal';
import { Box, useDisclosure, useToast } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { useRouter } from 'next/router';
import short from "short-uuid";
import React from 'react'
import { useCreateConvoEntryMutation, useCreateConvoMutation, useDeleteConvoMutation } from '../generated/graphql';
import { InputField } from './InputField';
import { LanguageSelect } from './LanguageSelect';


export const CreateConvoModalButton: React.FC<{}> = () => {

  const [,createConvo] = useCreateConvoMutation();
  const [,createConvoEntry] = useCreateConvoEntryMutation();
  const [,deleteConvo] = useDeleteConvoMutation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const translator = short();
  const toast = useToast({
    title: "Create Failed",
    status: 'error',
    duration: 9000,
    isClosable: true
  });

  return (
    <>
      <Button onClick={onOpen} ml="auto">Create Convo</Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Convo</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Formik
              initialValues={{
                title: '',
                targetLanguage: 'fr',
                nativeLanguage: 'en'
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

                const {data, error} = await createConvo({input: values});

                if (error || !data) {
                  toast({ description: "Convo could not be updated." });
                  onClose();
                  return;
                }

                const convoEntryResult = await createConvoEntry({
                  input: {
                    convoId: data.createConvo.id,
                    label: "root",
                    parentConvoEntryResponseId: null,
                    promptText: "Write a prompt here!",
                    answerSuggestion: "Put an answer suggestion here..."
                  }
                });

                if (convoEntryResult.error) {
                  toast({ description: "Convo could not be updated." });
                  // Attempt to delete the convo
                  const deleteResult = await deleteConvo({
                    deleteConvoId: data.createConvo.id
                  });
                  if (deleteResult.error) {
                    toast({
                      title: "Delete failed",
                      description: "Convo failed to be deleted. Please remove the convo manually and try again."
                    })
                  }
                } else if (convoEntryResult.data) {
                  toast({
                    title: "Create Succeeded",
                    status: 'success'
                  });
                  onClose();
                  router.push(`/convo/${translator.fromUUID(data.createConvo.id)}`);
                }
              }}
            >
              {({ isSubmitting }) => (
                <Form>
                  <InputField
                    name='title'
                    placeholder='Title'
                    label='Title'
                  />
                  {/* TODO add language select */}
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