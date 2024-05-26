import { IconButton, Heading, Text } from '@chakra-ui/react';
import { BiGridAlt, BiUserCircle } from 'react-icons/bi';
import { FiMenu } from 'react-icons/fi';
import { useOutlet } from 'react-router-dom';
import SidenavContainer from '../components/Sidenav/SidenavContainer';
import Sidenav from '../components/Sidenav/Sidenav';
import { useSidenav } from '../components/Sidenav/SidenavContext';
import { SidenavItem } from '../components/Sidenav/SidenavItems';

const Dashboard = () => {
  const navItems: SidenavItem[] = [
    { icon: BiGridAlt, label: 'Services', to: 'services' },
    { icon: BiUserCircle, label: 'Profile', to: 'profile' },
  ];
  const { onOpen } = useSidenav();
  const outlet = useOutlet();

  return (
    <SidenavContainer sidenav={<Sidenav navItems={navItems} />}>
      <main>
        {outlet || (
          <>
            <Heading size="lg" textAlign="center" marginTop="20">
              Welcome to the Dashboard
            </Heading>
            <Text textAlign="center" marginTop="5">
              Select an option from the sidebar to get started
            </Text>
          </>
        )}
      </main>
      <IconButton
        aria-label="menu"
        display={{ base: 'flex', md: 'none' }}
        onClick={onOpen}
        icon={<FiMenu />}
      />
    </SidenavContainer>
  );
};

export default Dashboard;
