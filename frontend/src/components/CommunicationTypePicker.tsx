import { Flex, Radio, RadioGroup, RadioGroupProps } from '@chakra-ui/react';
import React, { FC } from 'react';
import { CommunicationType } from '../enums/CommunicationType';

export const CommunicationTypePicker: FC<Omit<RadioGroupProps, 'children'>> = (props) => {
  return (
    <RadioGroup p={2} bgColor='primary.300' boxShadow='md' zIndex={1} {...props}>
      <Flex justify='space-evenly'>
        <Radio colorScheme='primary' value={CommunicationType.Polling}>
          Polling
        </Radio>
        <Radio colorScheme='primary' value={CommunicationType.LongPolling}>
          Long polling
        </Radio>
        <Radio colorScheme='primary' value={CommunicationType.WebSocket}>
          Web socket
        </Radio>
      </Flex>
    </RadioGroup>
  );
};
