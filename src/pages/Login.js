/* eslint-disable react/prop-types */
// TODO: Create a forgot password option
// TODO: Make the user able to see his password
import React, { useState } from 'react'
import axios from 'axios'
import { Box, TextField, Button, Typography, Paper, Divider } from '@mui/material'

function Login ({ navigate }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('') // Clear any previous errors
    try {
      const response = await axios.post('http://localhost:4000/api/auth/login', { email, password })
      localStorage.setItem('token', response.data.token)
      navigate('dashboard') // Use navigate prop to change page
    } catch (error) {
      setError('Invalid email or password')
    }
  }

  return (
    <Box sx={{ height: '90vh', width: '110vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#fafafa', margin: '0 auto', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
      <Box sx={{ display: 'flex', width: '80%', height: '70%', boxShadow: '0 8px 16px rgba(0, 0, 0, 0.15)', borderRadius: 2, overflow: 'hidden' }}>
        {/* Left Image Section */}
        <Box sx={{ flex: 1, backgroundImage: `url(${process.env.PUBLIC_URL}/loginImage1.png)`, backgroundSize: 'contain', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}/>

        {/* Right Form Section */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 4, backgroundColor: '#ffffff' }}>
          <Typography variant="h4" component="h1" sx={{ mb: 4, fontWeight: 'bold' }}>Budget Tracker</Typography>
          <Paper elevation={0} sx={{ width: '100%', textAlign: 'center', padding: '16px 32px' }}>
            <form onSubmit={handleSubmit}>
              <Box mb={2}>
                <TextField
                  fullWidth
                  label="Email or Username"
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
                Log In
              </Button>
              {/* <Box mt={2} mb={2}>
                <Link
                  href="#"
                  onClick={() => navigate('forgot-password')}
                  underline="none"
                  sx={{ color: '#0288d1', fontSize: '0.875rem' }}
                >
                  Forgot Password?
                </Link>
              </Box> */}
              <Divider sx={{ my: 2 }} />
              <Button
                variant="contained"
                color="secondary"
                fullWidth
                onClick={() => navigate('signup')}
                sx={{ backgroundColor: '#4caf50', fontWeight: 'bold', padding: '10px 0', borderRadius: '4px', '&:hover': { backgroundColor: '#43a047' } }}
              >
                Create New Account
              </Button>
            </form>
          </Paper>
        </Box>
      </Box>
    </Box>
  )
}

export default Login
