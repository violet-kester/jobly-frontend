import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  InputAdornment,
  IconButton,
  Stack,
  TextField,
} from '@mui/material';
import {
  AccountCircle,
  Email,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import GlassBox from './Box/Box';
import StyledButton from './Button/Button';
import StyledTypography from './Typography/Typography';

const DEFAULT_FORM_DATA = {
  username: '',
  firstName: '',
  lastName: '',
  password: '',
  email: '',
};

/** SignupForm
 *
 * Props:
 * - signup: signup function to be called App component
 * - login: login function to be called in App component
 * - error: API error message
 * - setError: function for setting error state in App component
 *
 * State:
 * - showPassword: boolean
 *
 * Component hierarchy:
 * RoutesList -> SignupForm
 *
 */

function SignupForm({ signup, login, error, setError }) {
  const [showPassword, setShowPassword] = useState(false);
  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm(DEFAULT_FORM_DATA);
  const navigate = useNavigate();

  // reset error state when component mounts
  useEffect(() => {
    setError(null);
  }, [setError]);

  // show and hide password
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (evt) => {
    evt.preventDefault();
  };

  // handle form submission
  async function onSubmit(data) {
    try {
      await signup(data);
      await login(data.username, data.password);
      navigate('/');
    } catch (err) {
      console.debug('Signup error: ', err);
    }
  }

  return (
    <GlassBox>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Stack
          spacing={3}
          width={{
            xs: 250,
            sm: 400,
          }}
          sx={{
            margin: '0 auto',
            alignItems: 'center',
          }}>

          <TextField
            label='Username'
            type='text'
            {...register('username', {
              required: 'Invalid username'
            })}
            error={!!errors.username}
            helperText={errors.username?.message}
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <AccountCircle />
                </InputAdornment>
              ),
            }}
            fullWidth
          />

          <TextField
            label='Password'
            type={showPassword ? 'text' : 'password'}
            {...register('password', {
              required: 'Invalid password'
            })}
            error={!!errors.password}
            helperText={errors.password?.message}
            InputProps={{
              endAdornment: (
                <InputAdornment position='end'>
                  <IconButton
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge='end'
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            fullWidth
          />

          <TextField
            label='First name'
            type='text'
            {...register('firstName', {
              required: 'First name required'
            })}
            error={!!errors.firstName}
            helperText={errors.firstName?.message}
            fullWidth
          />

          <TextField
            label='Last name'
            type='text'
            {...register('lastName', {
              required: 'Last name required'
            })}
            error={!!errors.lastName}
            helperText={errors.lastName?.message}
            fullWidth
          />

          <TextField
            label='Email'
            type='email'
            {...register('email', {
              required: 'Invalid email'
            })}
            error={!!errors.email}
            helperText={errors.email?.message}
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <Email />
                </InputAdornment>
              ),
            }}
            fullWidth
          />

          <StyledButton
            variant='contained'
            type='submit'
            disableElevation
          >
            Sign up
          </StyledButton>

          {error && (
            <StyledTypography color='error'>{error[0]}</StyledTypography>
          )}

        </Stack>
      </form>
    </GlassBox >
  );
}

export default SignupForm;