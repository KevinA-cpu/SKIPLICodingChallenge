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

interface ICaptionCardProps {
  caption: string;
  index: number;
  savedCaptions: string[];
  saveGeneratedContent: (caption: string) => void;
}

const CaptionCard = (props: ICaptionCardProps) => {
  const { caption, index, savedCaptions, saveGeneratedContent } = props;
  const [isLoading, setIsLoading] = React.useState(false);
  return (
    <Card key={index} marginTop={2}>
      <CardHeader>
        <Text fontSize="xl">{caption}</Text>
      </CardHeader>
      <Divider />
      <CardFooter>
        <ButtonGroup>
          <Button
            variant="solid"
            colorScheme="blue"
            isDisabled={savedCaptions.includes(caption)}
            onClick={async () => {
              setIsLoading(true);
              await saveGeneratedContent(caption);
              setIsLoading(false);
            }}
            isLoading={isLoading}
          >
            Save
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

export default CaptionCard;
