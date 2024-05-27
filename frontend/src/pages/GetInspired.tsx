import React from 'react';
import { useForm } from 'react-hook-form';
import {
  Box,
  Text,
  Heading,
  Input,
  Button,
  useToast,
  FormErrorMessage,
  FormControl,
  Progress,
  Card,
  CardHeader,
  Divider,
  useColorModeValue,
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { BiLeftArrowAlt } from 'react-icons/bi';
import CaptionCard from '../components/CaptionCard';
import {
  GetPostIdeas,
  GenerateCaptionsFromIdea,
  SaveGeneratedContent,
} from '../services';

const getInspiredSchema = yup.object().shape({
  subject: yup.string().required('Topic is required'),
});

const selectedIdeaSchema = yup.object().shape({
  selectedSubject: yup.string().required('Selected subject is required'),
});

interface IGetInspiredProps {
  email: string;
}

const GetInspired = (props: IGetInspiredProps) => {
  const { email } = props;
  const getInspiredForm = useForm({ resolver: yupResolver(getInspiredSchema) });
  const selectedIdeaForm = useForm({
    resolver: yupResolver(selectedIdeaSchema),
  });

  const toast = useToast();
  const [ideas, setIdeas] = React.useState([]);
  const [captions, setCaptions] = React.useState([]);
  const [savedCaptions, setSavedCaptions] = React.useState<string[]>([]);

  const [fetching, setFetching] = React.useState(false);
  const hoverBg = useColorModeValue('gray.200', 'gray.700');

  const onSubmitGetInspired = getInspiredForm.handleSubmit(async (data) => {
    setFetching(true);
    try {
      const response = await GetPostIdeas(data.subject);
      setIdeas(response.data.postIdeas);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data.errorMessage ?? error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setFetching(false);
    }
  });

  const onSubmitSelectedIdea = selectedIdeaForm.handleSubmit(async (data) => {
    setFetching(true);
    try {
      const response = await GenerateCaptionsFromIdea(data.selectedSubject);
      setCaptions(response.data.captions);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data.errorMessage ?? error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setFetching(false);
    }
  });

  const saveGeneratedContent = async (caption: string) => {
    try {
      const { selectedSubject } = selectedIdeaForm.watch();
      await SaveGeneratedContent(email, {
        socialNetwork: 'Other',
        subject: selectedSubject,
        tone: 'Other',
        caption,
      });
      setSavedCaptions((prevSavedCaptions) => [...prevSavedCaptions, caption]);
      toast({
        title: 'Caption saved',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data.errorMessage ?? error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box>
      {!selectedIdeaForm.watch('selectedSubject') ? (
        <>
          <Heading size="md" marginBottom="4">
            Gets inspired
          </Heading>
          <Text marginBottom={4}>
            Have zero clue on what to post? Get inspired by generating post
            ideas and captions for a topic.
          </Text>

          <form onSubmit={onSubmitGetInspired}>
            <FormControl
              isInvalid={Boolean(getInspiredForm.formState.errors.subject)}
            >
              <Input
                placeholder="Enter topic"
                {...getInspiredForm.register('subject', { required: true })}
              />
              <FormErrorMessage>
                {getInspiredForm.formState.errors.subject &&
                  getInspiredForm.formState.errors.subject.message?.toString()}
              </FormErrorMessage>
            </FormControl>
            <Button marginTop={4} type="submit">
              Generate Ideas
            </Button>
          </form>

          <Heading size="md" marginTop={4}>
            Generated ideas
          </Heading>
          <Text>
            If the results are a little bit weird, try generate again a few
            times.
          </Text>

          {!fetching &&
            ideas.map((idea: string, index: number) => (
              <Card
                key={index}
                marginTop={2}
                _hover={{ bg: hoverBg, cursor: 'pointer' }}
                onClick={() =>
                  selectedIdeaForm.setValue('selectedSubject', idea)
                }
              >
                <CardHeader>
                  <Text>{idea}</Text>
                </CardHeader>
                <Divider />
              </Card>
            ))}
        </>
      ) : (
        <>
          <Button
            leftIcon={<BiLeftArrowAlt />}
            onClick={() => selectedIdeaForm.setValue('selectedSubject', '')}
            marginBottom={4}
          >
            Back
          </Button>
          <Heading size="md" marginBottom="4">
            Your Selected Idea
          </Heading>

          <form onSubmit={onSubmitSelectedIdea}>
            <FormControl
              isInvalid={Boolean(
                selectedIdeaForm.formState.errors.selectedSubject
              )}
            >
              <Input
                placeholder="Enter topic"
                {...selectedIdeaForm.register('selectedSubject', {
                  required: true,
                })}
              />
              <FormErrorMessage>
                {selectedIdeaForm.formState.errors.selectedSubject &&
                  selectedIdeaForm.formState.errors.selectedSubject.message?.toString()}
              </FormErrorMessage>
            </FormControl>
            <Button marginTop={4} type="submit">
              Generate Captions
            </Button>
          </form>
          <Heading size="md" marginTop={4}>
            Generated captions
          </Heading>
          <Text>
            If the results are a little bit weird, try generate again a few
            times.
          </Text>
          {!fetching &&
            captions.map((caption: string, index: number) => (
              <CaptionCard
                key={index}
                caption={caption}
                index={index}
                savedCaptions={savedCaptions}
                saveGeneratedContent={saveGeneratedContent}
              />
            ))}
        </>
      )}
      {fetching && <Progress size="xs" isIndeterminate marginTop={2} />}
    </Box>
  );
};

export default GetInspired;
