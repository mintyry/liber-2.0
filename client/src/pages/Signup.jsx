import * as React from 'react';
import MenuBook from '@mui/icons-material/MenuBook';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { outlinedInputClasses } from '@mui/material/OutlinedInput';
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';
import { useMutation } from '@apollo/client';
import { CREATE_USER } from '../utils/mutations';
import { useState } from 'react';
import Auth from '../utils/auth';





function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}

      Liber&nbsp;

      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

export default function SignUp() {
  const [formState, setFormstate] = useState({
    username: '',
    email: '',
    password: ''
  })
  const [formValid, setFormValid] = useState(true)
  const [createUser, { error, data }] = useMutation(CREATE_USER);
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormstate({
      ...formState,
      [name]: value,
    })
  }
  const handleSubmit = async (event) => {
    event.preventDefault();


    if (!formState.username || !formState.email || !formState.password) {
      setFormValid(false)
      return;
    }

    const usernameRegex = /^[a-zA-Z0-9]+$/;
    if (!usernameRegex.test(formState.username)) {
      setFormValid(false);
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formState.email)) {
      setFormValid(false);
      return;
    }

    // 8 characters, one lowercase, one uppercase, and one digit 
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(formState.password)) {
      setFormValid(false);
      return;
    }

    try {
      const { data } = await createUser({
        variables: { ...formState },
      })
      Auth.login(data.createUser.token)
    } catch (error) {
      // if (error.code === 11000) {
      //   // Duplicate key error

      //   setError('Email or username already exists');

      // } else {
      //   // Other errors
        console.log(error);
      }
    // }
  };

  const theme = createTheme({
    palette: {
      background: {
        default: '#f3f3ec'
      },
    },

  });

  // modify outline of textfield
  const customTheme = (outerTheme) =>
    createTheme({
      palette: {
        mode: outerTheme.palette.mode,
      },
      components: {
        MuiTextField: {
          styleOverrides: {
            root: {
              '--TextField-brandBorderColor': '#E0E3E7',
              '--TextField-brandBorderHoverColor': '#B2BAC2',
              '--TextField-brandBorderFocusedColor': '#6F7E8C',
              '& label.Mui-focused': {
                color: 'var(--TextField-brandBorderFocusedColor)',
              },
            },
          },
        },
        MuiOutlinedInput: {
          styleOverrides: {
            notchedOutline: {
              borderColor: 'var(--TextField-brandBorderColor)',
            },
            root: {
              [`&:hover .${outlinedInputClasses.notchedOutline}`]: {
                borderColor: 'var(--TextField-brandBorderHoverColor)',
              },
              [`&.Mui-focused .${outlinedInputClasses.notchedOutline}`]: {
                borderColor: 'var(--TextField-brandBorderFocusedColor)',
              },
            },
          },
        },
        MuiFilledInput: {
          styleOverrides: {
            root: {
              '&::before, &::after': {
                borderBottom: '2px solid var(--TextField-brandBorderColor)',
              },
              '&:hover:not(.Mui-disabled, .Mui-error):before': {
                borderBottom: '2px solid var(--TextField-brandBorderHoverColor)',
              },
              '&.Mui-focused:after': {
                borderBottom: '2px solid var(--TextField-brandBorderFocusedColor)',
              },
            },
          },
        },
        MuiInput: {
          styleOverrides: {
            root: {
              '&::before': {
                borderBottom: '2px solid var(--TextField-brandBorderColor)',
              },
              '&:hover:not(.Mui-disabled, .Mui-error):before': {
                borderBottom: '2px solid var(--TextField-brandBorderHoverColor)',
              },
              '&.Mui-focused:after': {
                borderBottom: '2px solid var(--TextField-brandBorderFocusedColor)',
              },
            },
          },
        },
      },
    });

  const outerTheme = useTheme();


  return (
    <ThemeProvider theme={theme} >
      <Container component="main" maxWidth="xs" sx={{ bgcolor: '#f3f3ec' }} >

        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: '#eed6c5' }}>
            <MenuBook style={{ color: 'black' }} />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          {error && (
            <div style={{ color: 'red' }}>
              {error.message || error.toString()} {/* Use error.message or toString() */}
            </div>
          )}
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            {/* Display error message if form is invalid */}
            {!formValid && (
              <Typography variant="body2" color="error" align="center" sx={{ mb: 2 }}>
                Please fill in all required fields. <br />
                Username takes alphanumeric {'('}a-zA-Z0-9{')'} characters,<br />
                and email should contain '@' and '.'.<br />
                Password Requires{'('}Uppercase, number, special character, and must be 8 characters long{')'} 
              </Typography>
            )}
            <Grid container spacing={2}>
              <ThemeProvider theme={customTheme(outerTheme)}>
                <Grid item xs={12} >

                  <TextField
                    className="input-override"
                    autoComplete="given-name"
                    name="username"
                    required
                    fullWidth
                    id="username"
                    label="User Name"
                    autoFocus
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    className="input-override"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    className="input-override"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="new-password"
                    onChange={handleChange}
                  />

                </Grid>
              </ThemeProvider>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                mb: 2,
                bgcolor: '#eed6c5',
                color: '#000',
                '&:hover': {
                  backgroundColor: '#eed6c5',
                }
              }}
            >
              Sign Up
            </Button>

          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
}