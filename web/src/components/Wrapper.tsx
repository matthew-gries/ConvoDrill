import { Box } from '@chakra-ui/react';
import React from 'react'

export type WrapperVariant = 'small' | 'regular' | 'large' | 'xlarge';

interface WrapperProps {
  children: React.ReactNode,
  variant?: WrapperVariant
}

export const Wrapper: React.FC<WrapperProps> = ({
  children,
  variant='regular'
}) => {
  return (
    <Box
      mt={8}
      mx="auto"
      maxW={(() => {
        if (variant === "regular") { return "800px" }
        else if (variant === "small") {return "400px" }
        else if (variant === "large") { return "1000px" }
        else { return "1200px" } // variant === "xlarge"
      })()}
      w="100%"
    >
      {children}
    </Box>
  );
}