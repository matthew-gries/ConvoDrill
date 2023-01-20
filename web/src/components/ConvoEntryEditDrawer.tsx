import { Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerHeader, DrawerOverlay } from '@chakra-ui/react';
import React from 'react'

export interface ConvoEntryEditDrawerProps {
  isDrawerOpen: boolean;
  onDrawerClose: () => void;
  buttonRef: React.MutableRefObject<undefined>;
  bodyContents: JSX.Element
}

export const ConvoEntryEditDrawer: React.FC<ConvoEntryEditDrawerProps> = ({
  isDrawerOpen,
  onDrawerClose,
  buttonRef,
  bodyContents
}) => {

  return (
    <>
      <Drawer
        isOpen={isDrawerOpen}
        placement='right'
        onClose={onDrawerClose}
        finalFocusRef={buttonRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Modify Entry</DrawerHeader>

          <DrawerBody>
            {bodyContents}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}