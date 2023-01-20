import { Button } from '@chakra-ui/button';
import { CloseIcon } from '@chakra-ui/icons';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalFooter, ModalBody } from '@chakra-ui/modal';
import { IconButton, useDisclosure } from '@chakra-ui/react';
import React from 'react'
import { useDeleteConvoMutation } from '../generated/graphql';

interface DeleteConvoModalProps {
  convoId: string
}

export const DeleteConvoModalButton: React.FC<DeleteConvoModalProps> = ({convoId}) => {

  const [,deleteConvo] = useDeleteConvoMutation();
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <IconButton aria-label="Delete conversaiton" icon={<CloseIcon />} ml="2" onClick={onOpen}/>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Convo</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Are you sure you want to delete this conversation?
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='red' onClick={async () => {
              await deleteConvo({deleteConvoId: convoId});
              onClose();
            }}>
              Yes
            </Button>
            <Button colorScheme='gray' m="2" onClick={onClose}>
              No
            </Button>
          </ModalFooter>

        </ModalContent>
      </Modal>
    </>
  );
}