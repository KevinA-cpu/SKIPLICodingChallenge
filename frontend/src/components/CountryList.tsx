import { useState } from 'react';
import { Box, List, ListItem, Text } from '@chakra-ui/react';

export type Country = {
  name: string;
  flag: string;
  code: string;
  dial_code: string;
};

type Props = {
  data: Country[];
  onChange: (args: Country) => void;
};

const CountryList = ({ data, onChange }: Props) => {
  const [selectedItem, setSelectedItem] = useState<Country | undefined>(
    undefined
  );
  return (
    <Box
      my={1}
      maxH="xs"
      bg="white"
      width="full"
      zIndex={999}
      height="auto"
      overflow="auto"
      borderRadius="lg"
      position="absolute"
      boxShadow="0px 1px 30px rgba(0, 0, 0, 0.1)"
    >
      <List>
        {data.map((item: Country, index: number) => (
          <ListItem
            key={index}
            paddingY={2}
            color="#ACB9C4"
            cursor="pointer"
            fontWeight="500"
            textTransform="capitalize"
            onClick={() => {
              onChange(item);
              setSelectedItem(item);
            }}
            style={{ transition: 'all .125s ease' }}
            _hover={{ bg: 'gray.50', color: '#396070' }}
            sx={
              item?.flag === selectedItem?.flag
                ? { backgroundColor: 'gray.50', color: '#396070' }
                : {}
            }
          >
            <Text as="span" mx={4}>
              {item?.flag}
            </Text>
            <Text as="span">{item?.name}</Text>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default CountryList;
