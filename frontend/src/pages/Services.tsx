import React from 'react';
import { Box, Text, Heading, useColorModeValue } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

const Services = () => {
  const hoverBg = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box display="flex" flexDirection="column">
      <Link to="/services/start-from-scratch">
        <Box
          borderWidth="1px"
          borderRadius="lg"
          padding="6"
          _hover={{ bg: hoverBg }}
        >
          <Heading size="md" marginBottom="4">
            Start from scratch
          </Heading>
          <Text>Generate new captions to engage, delight, or sell</Text>
        </Box>
      </Link>
      <Link to="/services/get-inspired">
        <Box
          borderWidth="1px"
          borderRadius="lg"
          padding="6"
          marginTop={4}
          _hover={{ bg: hoverBg }}
        >
          <Heading size="md" marginBottom="4">
            Get inspired
          </Heading>
          <Text>Generate post ideas and captions for a topic</Text>
        </Box>
      </Link>
    </Box>
  );
};

export default Services;
