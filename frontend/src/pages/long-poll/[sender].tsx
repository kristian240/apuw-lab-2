import { Box, Center, Flex, HStack, Input, Text, VStack } from '@chakra-ui/react';
import { Button } from '@chakra-ui/button';
import { Spinner } from '@chakra-ui/spinner';
import { useEffect, useRef } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Footer } from '../../components/Footer';
import { Header } from '../../components/Header';
import { SenderPicker } from '../../components/SenderPicker';
import { CommunicationTypePicker } from '../../components/CommunicationTypePicker';
import { CommunicationType } from '../../enums/CommunicationType';
import { IMessage } from '../../interfaces/IMessage';
import { fetchAllMessages, longPoolNewMessage, sendMessage } from '../../utils/messages';
import { useRouter } from 'next/router';
import useSWR from 'swr';

interface IFormValues {
  message: string;
}

const Index = () => {
  const router = useRouter();

  const sender = parseInt(router.query.sender as string);

  const { data: messages, mutate: mutateMessages } = useSWR<{ data: Array<IMessage> }>(
    'messages',
    fetchAllMessages
  );

  const { register, formState, handleSubmit, reset } = useForm<IFormValues>({ mode: 'all' });

  const onSubmit: SubmitHandler<IFormValues> = ({ message }) => {
    const messageBody: IMessage = { message, time: new Date().toISOString(), sender };

    sendMessage(messageBody).then(() => {
      mutateMessages((prev) => ({ data: [...prev.data, messageBody] }), false);
      reset();
    });
  };

  useEffect(() => {
    if (!messages) return;

    const controller = new AbortController();

    const longPoolCallback = () => {
      console.groupCollapsed('Long poll');
      console.log(`As: sender-${sender}`);
      longPoolNewMessage(sender, { signal: controller.signal }).then((res) => {
        console.log('Data: ', res.data);
        if (res.data) {
          mutateMessages((prev) => ({ data: [...prev.data, res.data] }), false);
        }
        longPoolCallback();
      });
      console.groupEnd();
    };

    longPoolCallback();

    return () => controller.abort();
  }, [sender]);

  const messagesRef = useRef(null);
  useEffect(() => {
    if (!messagesRef.current || !messages) return;
    messagesRef.current.scrollTo(0, messagesRef.current.scrollHeight);
  }, [messages]);

  return (
    <>
      <Flex direction='column' h='100vh' overflow='hidden'>
        <Header />

        <Flex as='main' direction='column' flex={1} minH={0}>
          <SenderPicker
            value={sender}
            onChange={(newValue) => {
              router.query.sender = newValue;
              router.push(router);
            }}
          />
          <CommunicationTypePicker
            value={CommunicationType.LongPolling}
            onChange={(newValue) => {
              if (newValue === '1') router.push(`/poll/${sender}`);
              else if (newValue === '2') router.push(`/long-poll/${sender}`);
              else if (newValue === '3') router.push(`/socket/${sender}`);
            }}
          />

          <VStack ref={messagesRef} spacing={4} overflowY='auto' flex={1} p={4}>
            {!messages && (
              <Center>
                <Spinner />
              </Center>
            )}
            {messages?.data.map((message) => {
              const currentSender = sender === message.sender;

              return (
                <Box
                  key={message._id ?? new Date(message.time).toISOString()}
                  maxW='70%'
                  p={2}
                  bgColor='primary.200'
                  borderRadius='md'
                  alignSelf={currentSender ? 'flex-end' : 'flex-start'}
                >
                  <Text flex={1} color='blackAlpha.600'>
                    {new Date(message.time).toLocaleString()}
                  </Text>
                  <Text flex={1}>{message.message}</Text>
                </Box>
              );
            })}
          </VStack>

          <HStack as='form' p={4} bgColor='primary.300' onSubmit={handleSubmit(onSubmit)}>
            <Input {...register('message', { required: true })} colorScheme='primary' />
            <Button
              type='submit'
              colorScheme='primary'
              disabled={!messages || !formState.isValid || formState.isSubmitting}
            >
              Send
            </Button>
          </HStack>
        </Flex>

        <Footer />
      </Flex>
    </>
  );
};

export default Index;
