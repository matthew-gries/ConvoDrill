import { Box } from '@chakra-ui/react';
import React from 'react'
import { NavBar } from './NavBar';
import { Wrapper, WrapperVariant } from './Wrapper';

interface LayoutProps {
  children: React.ReactNode,
  variant?: WrapperVariant
}

export const Layout: React.FC<LayoutProps> = ({children, variant = "regular"}) => {
  return (
    <Box>
      <NavBar />
      <Wrapper variant={variant}>
        {children}
      </Wrapper>
    </Box>
  );
}