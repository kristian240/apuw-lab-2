import { Box, Heading } from '@chakra-ui/react';
import React, { FC } from 'react';

export const Header: FC = () => {
  return (
    <Box as='header' bgColor='primary.300' py={4}>
      <Heading w='full' textAlign='center'>
        Chat App
      </Heading>
    </Box>
  );
};
