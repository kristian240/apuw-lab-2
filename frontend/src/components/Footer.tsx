import { Box, Text } from '@chakra-ui/react';
import React, { FC } from 'react';

export const Footer: FC = () => {
  return (
    <Box as='footer' bgColor='primary.300' py={1}>
      <Text w='full' textAlign='center'>
        2022 &copy; Kristian Djaković
      </Text>
    </Box>
  );
};
