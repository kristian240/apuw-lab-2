import { Flex, Radio, RadioGroup, RadioGroupProps } from '@chakra-ui/react';
import React, { FC } from 'react';

export const SenderPicker: FC<Omit<RadioGroupProps, 'children'>> = (props) => {
  return (
    <RadioGroup p={2} bgColor='primary.300' {...props}>
      <Flex justify='space-evenly'>
        <Radio colorScheme='primary' value={0}>
          Sender 0
        </Radio>

        <Radio colorScheme='primary' value={1}>
          Sender 1
        </Radio>
      </Flex>
    </RadioGroup>
  );
};
