import { CloseIcon, PhoneIcon } from '@chakra-ui/icons';
import { Box, Flex, IconButton, Text } from '@chakra-ui/react';
import React, { useState } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

type SpeechToTextComponentProps = {
  language: string,
  setCurrentAnswer: React.Dispatch<React.SetStateAction<string>>
}

/**
 * TODO use Speechly it is free
 */
export const SpeechToTextComponent = ({language, setCurrentAnswer}: SpeechToTextComponentProps) => {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  const [previousTranscript, setPreviousTranscript] = useState("");

  if (!browserSupportsSpeechRecognition) {
    return <Box>Browser doesn&apos;t support speech recognition.</Box>;
  }

  return (
    <Flex>
      <Box>
        <IconButton aria-label='Start recording'
          icon={<PhoneIcon />}
          borderWidth="1px"
          shadow="md"
          colorScheme="green"
          mt={2}
          onClick={async () => {
            // TODO fix language codes, maybe make a list internal to here
            await SpeechRecognition.startListening({ language: "fr-FR" });
          }}
        />
        <IconButton
          aria-label='Stop recording'
          icon={<CloseIcon />}
          mt={2}
          ml={2}
          colorScheme="red"
          onClick={() => {
            console.log("NOT LISTENING");
            SpeechRecognition.stopListening();
            setPreviousTranscript(transcript);
            setCurrentAnswer(transcript);
            resetTranscript();
          }}
        />
      </Box>
      <Box ml={3} mt={4}>
        {(() => {
          if (listening) {
            return <Text as="i">Listening...</Text>
          }

          return <Text>{previousTranscript}</Text>
        })()}
      </Box>
    </Flex>
  );
};