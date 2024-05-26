import React from 'react';
import {
  Button,
  ButtonGroup,
  Divider,
  Text,
  Card,
  CardHeader,
  CardFooter,
} from '@chakra-ui/react';
import { shareCaptionThroughEmail, shareCaptionOnFacebook } from '../utils';

interface ICaptionCardUnsaveProps {
  captionId: string;
  caption: string;
  socialNetwork: string;
  tone: string;
  index: number;
  unsaveContent: (captionId: string) => void;
}

const CaptionCardUnsave = (props: ICaptionCardUnsaveProps) => {
  const { socialNetwork, tone, captionId, caption, index, unsaveContent } =
    props;
  const [isLoading, setIsLoading] = React.useState(false);

  return (
    <Card key={index} marginTop={2}>
      <CardHeader>
        <Text fontSize="xl">{caption}</Text>
        <Text fontSize="md" fontWeight="bold">
          Social network: {socialNetwork}
        </Text>
        <Text fontSize="md" fontWeight="bold">
          Tone: {tone}
        </Text>
      </CardHeader>

      <Divider />
      <CardFooter>
        <ButtonGroup>
          <Button
            variant="solid"
            colorScheme="red"
            onClick={async () => {
              setIsLoading(true);
              await unsaveContent(captionId);
              setIsLoading(false);
            }}
            isLoading={isLoading}
          >
            Unsave
          </Button>
          <Button
            variant="solid"
            colorScheme="blue"
            onClick={() => shareCaptionThroughEmail(caption)}
          >
            Share through email
          </Button>
          <Button
            variant="solid"
            colorScheme="blue"
            onClick={() => shareCaptionOnFacebook(caption)}
          >
            Share on Facebook
          </Button>
        </ButtonGroup>
      </CardFooter>
    </Card>
  );
};

export default CaptionCardUnsave;
