/* eslint-disable react/prop-types */
import React, { useState } from 'react'
import axios from 'axios'
import { Box, TextField, Button, Typography, Paper, Divider } from '@mui/material'

function AuthForm ({ isSignup, navigate }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('') // Clear any previous errors

    const url = isSignup ? 'http://localhost:4000/api/auth/signup' : 'http://localhost:4000/api/auth/login'
    const data = isSignup ? { name, email, password } : { email, password }

    try {
      const response = await axios.post(url, data)
      if (!isSignup) {
        localStorage.setItem('token', response.data.token)
        navigate('dashboard') // Navigate to dashboard after login
      } else {
        navigate('login') // Navigate to login after successful signup
      }
    } catch (error) {
      setError(isSignup ? 'Error signing up' : 'Invalid email or password')
    }
  }

  return (
    <Box sx={{ height: '90vh', width: '110vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#fafafa', margin: '0 auto', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
      <Box sx={{ display: 'flex', width: '80%', height: '70%', boxShadow: '0 8px 16px rgba(0, 0, 0, 0.15)', borderRadius: 2, overflow: 'hidden' }}>
        {/* Left Image Section */}
        <Box sx={{ flex: 1, backgroundImage: `url(${process.env.PUBLIC_URL}/loginImage1.png)`, backgroundSize: 'contain', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }} />

        {/* Right Form Section */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 4, backgroundColor: '#ffffff' }}>
          <Typography variant="h4" component="h1" sx={{ mb: 4, fontWeight: 'bold' }}>
            {isSignup ? 'Sign Up' : 'Log In'}
          </Typography>
          <Paper elevation={0} sx={{ width: '100%', textAlign: 'center', padding: '16px 32px' }}>
            <form onSubmit={handleSubmit}>
              {isSignup && (
                <Box mb={2}>
                  <TextField
                    fullWidth
                    label="Name"
                    variant="outlined"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required={isSignup}
                    sx={{ backgroundColor: '#f9f9f9', borderRadius: '4px' }}
                  />
                </Box>
              )}
              <Box mb={2}>
                <TextField
                  fullWidth
                  label="Email"
                  variant="outlined"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  sx={{ backgroundColor: '#f9f9f9', borderRadius: '4px' }}
                />
              </Box>
              <Box mb={2}>
                <TextField
                  fullWidth
                  label="Password"
                  variant="outlined"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  sx={{ backgroundColor: '#f9f9f9', borderRadius: '4px' }}
                />
              </Box>

              {error && (<Box mb={2}> <Typography color="error">{error}</Typography></Box>)}

              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ backgroundColor: '#0288d1', fontWeight: 'bold', padding: '10px 0', borderRadius: '4px', '&:hover': { backgroundColor: '#0277bd' } }}
              >
                {isSignup ? 'Sign Up' : 'Log In'}
              </Button>
              <Divider sx={{ my: 2 }} />
              <Button
                variant="contained"
                color="secondary"
                fullWidth
                onClick={() => navigate(isSignup ? 'login' : 'signup')}
                sx={{ backgroundColor: '#4caf50', fontWeight: 'bold', padding: '10px 0', borderRadius: '4px', '&:hover': { backgroundColor: '#43a047' } }}
              >
                {isSignup ? 'Already have an account? Log In' : 'Create New Account'}
              </Button>
            </form>
          </Paper>
        </Box>
      </Box>
    </Box>
  )
}

export default AuthForm
