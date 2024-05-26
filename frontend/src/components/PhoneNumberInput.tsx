import {
  Box,
  Text,
  Input,
  InputGroup,
  useDisclosure,
  useOutsideClick,
  InputLeftElement,
} from '@chakra-ui/react';
import { useState, useEffect, useRef } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import { AsYouType } from 'libphonenumber-js';
import Countries from '../countries.json';
import CountryList, { Country } from './CountryList';

export default function PhoneNumberInput({
  onChange,
}: {
  onChange: (arg: string) => void;
}) {
  const ref = useRef(null);
  const [number, setNumber] = useState('');
  const [country, setCountry] = useState('');
  const [countryFlag, setCountryFlag] = useState(`🇻🇳`);
  const { isOpen, onToggle, onClose } = useDisclosure();

  useOutsideClick({
    ref: ref,
    handler: () => onClose(),
  });

  useEffect(() => {
    if (country !== '' || number !== '') {
      onChange(`${country}${number}`);
    }
  }, [country, number, onChange]);

  const onCountryChange = (item: Country) => {
    const parsedNumber = new AsYouType().input(`${country}${number}`);

    setCountry(item?.dial_code);
    setCountryFlag(item?.flag);
    onChange(parsedNumber);
    onClose();
  };

  const onPhoneNumberChange = (event: any) => {
    const value = event.target.value;
    const parsedNumber = new AsYouType().input(`${country}${number}`);

    setNumber(value);
    onChange(parsedNumber);
  };

  return (
    <>
      <Box as="section" ref={ref} position="relative">
        <InputGroup>
          <InputLeftElement width="5em" cursor="pointer" onClick={onToggle}>
            <Text as="span" mr={3}>
              {countryFlag}
            </Text>
            {isOpen ? (
              <ChevronUpIcon boxSize={6} color="gray.500" />
            ) : (
              <ChevronDownIcon boxSize={6} color="gray.500" />
            )}
          </InputLeftElement>
          <Input
            pl="5em"
            type="tel"
            value={number}
            placeholder="Enter phone number"
            onChange={onPhoneNumberChange}
          />
        </InputGroup>

        {isOpen ? (
          <CountryList data={Countries} onChange={onCountryChange} />
        ) : null}
      </Box>
    </>
  );
}
