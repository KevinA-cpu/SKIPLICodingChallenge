import { useToast } from '@chakra-ui/react';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  FormErrorMessage,
  FormLabel,
  FormControl,
  Button,
  Card,
  Flex,
  Heading,
  Text,
  Box,
  PinInput,
  PinInputField,
  HStack,
  Input,
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { CreateNewAccessCode, ValidateAccessCode } from '../services';

// const phoneRegExp =
//   /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

interface IAuthenticationProps {
  setAuthenticatedEmail: (email: string) => void;
}

const schema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
  pin: yup.string().matches(/^\d{6}$/, 'PIN must be exactly 6 digits'),
});

export default function Authentication(props: IAuthenticationProps) {
  const toast = useToast();
  const { setAuthenticatedEmail } = props;
  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');

  const onSubmit = async (values: any) => {
    try {
      if (step === 1) {
        // Handle sending verification code to phone number here
        await CreateNewAccessCode(values.email);
        setEmail(values.email);
        setStep(2);
      } else {
        // Handle verification of the PIN here
        await ValidateAccessCode(email, values.pin);
        setAuthenticatedEmail(email);
        localStorage.setItem('email', email);
      }
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
    <Flex
      height="100vh"
      justifyContent="center"
      alignItems="center"
      flexDir="column"
    >
      <Box>
        <Heading mb={1}>Authentication</Heading>
        <Text>Enter your email to receive a access code.</Text>
        <Text mb={4}>This email will be used to login to your account.</Text>
        <Card p={4}>
          <form onSubmit={handleSubmit(onSubmit)}>
            {step === 1 ? (
              <FormControl isInvalid={Boolean(errors.email)}>
                <FormLabel htmlFor="email">Email</FormLabel>
                <Controller
                  name="email"
                  defaultValue=""
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="email"
                      placeholder="Email"
                      type="email"
                    />
                  )}
                />
                <FormErrorMessage>
                  {errors.email && errors.email.message?.toString()}
                </FormErrorMessage>
              </FormControl>
            ) : (
              <FormControl isInvalid={Boolean(errors.pin)}>
                <FormLabel htmlFor="pin">PIN code</FormLabel>
                <HStack spacing={7}>
                  <PinInput
                    onChange={(value) => {
                      setValue('pin', value);
                    }}
                  >
                    <PinInputField />
                    <PinInputField />
                    <PinInputField />
                    <PinInputField />
                    <PinInputField />
                    <PinInputField />
                  </PinInput>
                </HStack>

                <FormErrorMessage>
                  {errors.pin && errors.pin.message?.toString()}
                </FormErrorMessage>
              </FormControl>
            )}

            <Button
              mt={4}
              width={'100%'}
              colorScheme="teal"
              isLoading={isSubmitting}
              type="submit"
            >
              {step === 1 ? 'Send verification code' : 'Verify'}
            </Button>
          </form>
        </Card>
      </Box>
    </Flex>
  );
}
