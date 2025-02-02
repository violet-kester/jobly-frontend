import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import JoblyApi from '../api';
import userContext from '../userContext';
import NavBar from './NavBar';
import RoutesList from './RoutesList';
import { theme } from '../theme';
import { Container, ThemeProvider, styled } from '@mui/material';

const DEFAULT_USER = {
  username: '',
  isLoggedIn: false,
  isAdmin: false,
};

const Background = styled('div')({
  width: '100%',
  height: '100%',
  minHeight: '100vh',
  background: 'linear-gradient(0deg, #a5ebc8, white)',
  backgroundAttachment: 'fixed',
});

const StyledContainer = styled(Container)({
  height: '100%',
  minHeight: '100vh',
  '@media (min-width: 600px)': {
    padding: '8px',
  },
  backgroundColor: 'rgba(165, 235, 200, .5)',
});

/** Jobly App -----------------------------------------------------
 *
 * State:
 * - currentUser:
 * {
 *   firstName: 'Test',
 *   lastName: 'User',
 *   username: 'testuser'
 *   email: 'test@mail.com',
 *   applications: [],
 *   isLoggedIn: true,
 *   isAdmin: false,
 * }
 * - token: string token
 * - error: API error message
 *
 * Component hierarchy:
 * App -> [NavBar, RoutesList]
 */

function App() {
  const [currentUser, setCurrentUser] = useState(DEFAULT_USER);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // login default user `testuser` on mount

  useEffect(function loginDefaultUser() {
    async function getDefaultUser() {
      const token = await JoblyApi.loginUser('testuser', 'password');
      localStorage.setItem('token', token);
      setToken(token);
      const user = await JoblyApi.getUser('testuser', 'password');
      setCurrentUser({ ...user, isLoggedIn: true });
    }
    getDefaultUser();
  }, []);

  // set user in localStorage on mount or updated token

  useEffect(function setLocalUserOnRefresh() {
    async function getLocalUser() {
      const localToken = localStorage.getItem('token');
      if (localToken !== JoblyApi.token) {
        JoblyApi.token = localToken;
        const decodedUserData = jwt_decode(localToken);
        const localUserData = await JoblyApi.getUser(decodedUserData.username);
        setCurrentUser({ ...localUserData, isLoggedIn: true });
      }
    }
    getLocalUser();
  }, [token]);

  /** User login -------------------------------------------------- */

  async function login(username, password) {
    try {
      const token = await JoblyApi.loginUser(username, password);
      localStorage.setItem('token', token);
      setToken(token);
      const user = await JoblyApi.getUser(username, password);
      setCurrentUser({ ...user, isLoggedIn: true });
      setError(null);
    } catch (err) {
      setError(err);
      throw err;
    }
  }

  /** User logout ------------------------------------------------- */

  function logout() {
    setCurrentUser(DEFAULT_USER);
    setToken('');
    localStorage.removeItem('token');
    // TODO:
    // a better way to navigate home after logout
    // <Navigate to='/' /> not working
    navigate('/');
  }

  /** User signup -------------------------------------------------
   *
   * Expected input:
   * { username, password, firstName, lastName, email }
   */
  async function signup(user) {
    try {
      const token = await JoblyApi.registerUser(user);
      setToken(token);
      setCurrentUser(currUser => ({ ...user, isLoggedIn: true }));
      setError(null);
    } catch (err) {
      setError(err);
      throw err;
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <userContext.Provider value={{
        user: {
          username: currentUser.username,
          isLoggedIn: currentUser.isLoggedIn,
          isAdmin: currentUser.isAdmin
        }
      }}>
        <Background>
          <StyledContainer>
            <NavBar logout={logout} />
            <RoutesList
              login={login}
              signup={signup}
              error={error}
              setError={setError} />
          </StyledContainer>
        </Background>
      </userContext.Provider>
    </ThemeProvider>
  );
}

export default App;