import { ChakraProvider } from '@chakra-ui/react';
import { useState } from 'react';
import Authentication from './pages/Authentication';
import Dashboard from './pages/Dashboard';
import Services from './pages/Services';
import GetInspired from './pages/GetInspired';
import StartFromScratch from './pages/StartFromScratch';
import Profile from './pages/Profile';
import SidenavProvider from './components/Sidenav/SidenavContext';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  const [authenticatedEmail, setAuthenticatedEmail] = useState(
    localStorage.getItem('email') || null
  );
  return (
    <ChakraProvider>
      {authenticatedEmail ? (
        <SidenavProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Dashboard />}>
                <Route path="services" element={<Services />} />
                <Route
                  path="services/start-from-scratch"
                  element={<StartFromScratch email={authenticatedEmail} />}
                />
                <Route
                  path="services/get-inspired"
                  element={<GetInspired email={authenticatedEmail} />}
                />

                <Route
                  path="profile"
                  element={<Profile email={authenticatedEmail} />}
                />
              </Route>
            </Routes>
          </BrowserRouter>
        </SidenavProvider>
      ) : (
        <Authentication setAuthenticatedEmail={setAuthenticatedEmail} />
      )}
    </ChakraProvider>
  );
}

export default App;
