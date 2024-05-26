import React from 'react';
import { useForm } from 'react-hook-form';
import {
  Box,
  Text,
  Heading,
  Select,
  Input,
  Button,
  useToast,
  FormErrorMessage,
  FormControl,
  Progress,
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import CaptionCard from '../components/CaptionCard';
import { GeneratePostCaptions, SaveGeneratedContent } from '../services';

const schema = yup.object().shape({
  subject: yup.string().required('Topic is required'),
  socialNetwork: yup.string().required('Social network is required'),
  tone: yup.string().required('Tone is required'),
});

interface IStartFromScratchProps {
  email: string;
}

const StartFromScratch = (props: IStartFromScratchProps) => {
  const { email } = props;
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });
  const toast = useToast();
  const [fetchingCaptions, setFetchingCaptions] = React.useState(false);
  const [captions, setCaptions] = React.useState([]);
  const [savedCaptions, setSavedCaptions] = React.useState<string[]>([]);

  const onSubmit = async (data: any) => {
    setFetchingCaptions(true);
    try {
      const response = await GeneratePostCaptions(
        data.socialNetwork,
        data.subject,
        data.tone
      );
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
      setFetchingCaptions(false);
    }
  };

  const saveGeneratedContent = async (caption: string) => {
    try {
      const { socialNetwork, subject, tone } = watch();
      await SaveGeneratedContent(email, {
        socialNetwork,
        subject,
        tone,
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
      <Heading size="md" marginBottom="4">
        Start from scratch
      </Heading>
      <Text marginBottom={4}>
        Input a topic, platform, tone and we'll generate captions for you.
      </Text>

      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl isInvalid={Boolean(errors.subject)}>
          <Input
            placeholder="Enter topic"
            {...register('subject', { required: true })}
          />

          <FormErrorMessage>
            {errors.subject && errors.subject.message?.toString()}
          </FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={Boolean(errors.socialNetwork)} marginTop={2}>
          <Select
            placeholder="Select platform"
            {...register('socialNetwork', { required: true })}
          >
            <option value="Facebook">Facebook</option>
            <option value="Twitter">Twitter</option>
            <option value="Instagram">Instagram</option>
          </Select>

          <FormErrorMessage>
            {errors.socialNetwork && errors.socialNetwork.message?.toString()}
          </FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={Boolean(errors.tone)} marginTop={2}>
          <Select
            placeholder="Select tone"
            {...register('tone', { required: true })}
          >
            <option value="friendly">Friendly</option>
            <option value="luxury">Luxury</option>
            <option value="relaxed">Relaxed</option>
            <option value="professional">Professional</option>
            <option value="bold">Bold</option>
            <option value="adventurous">Adventurous</option>
            <option value="witty">Witty</option>
            <option value="persuasive">Persuasive</option>
            <option value="empathetic">Empathetic</option>
            <option value="description">Description</option>
          </Select>

          <FormErrorMessage>
            {errors.tone && errors.tone.message?.toString()}
          </FormErrorMessage>
        </FormControl>

        <Button marginTop={4} type="submit">
          Generate Captions
        </Button>
      </form>

      <Heading size="md" marginTop={4}>
        Generated captions
      </Heading>
      {fetchingCaptions && <Progress size="xs" isIndeterminate marginTop={2} />}
      {!fetchingCaptions &&
        captions.map((caption: string, index: number) => (
          <CaptionCard
            key={index}
            index={index}
            caption={caption}
            savedCaptions={savedCaptions}
            saveGeneratedContent={saveGeneratedContent}
          />
        ))}
    </Box>
  );
};

export default StartFromScratch;
