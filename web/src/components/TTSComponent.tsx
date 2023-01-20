import { useTts } from 'tts-react'
import type { TTSHookProps } from 'tts-react'
import { Text, Flex, IconButton } from '@chakra-ui/react'
import { BellIcon } from '@chakra-ui/icons'

interface TTSComponentProps extends TTSHookProps {
  highlight?: boolean
}

export const TTSComponent = ({ children, highlight = false, lang }: TTSComponentProps) => {
  const { ttsChildren, play } = useTts({
    children,
    autoPlay: true,
    markTextAsSpoken: highlight,
    lang
  });

  return (
    <Flex>
      <IconButton aria-label='Play' icon={<BellIcon />} onClick={play} />
      <Text as="p" ml={3} mt={1} alignContent="center">
        {ttsChildren}
      </Text>
    </Flex>
  )
}