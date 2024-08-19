/* eslint-disable react/prop-types */
import React, { useState } from 'react'
import axios from 'axios'
import { Box, TextField, Button, Typography, Paper, Alert } from '@mui/material'

// TODO: Create a forgot password option
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
    <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Login
      </Typography>
      <form onSubmit={handleSubmit}>
        <Box mb={2}>
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
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
          />
        </Box>
        {error && (
          <Box mb={2}>
            <Alert severity="error">{error}</Alert>
          </Box>
        )}
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Login
        </Button>
        <Box mt={2}>
          <Typography>
            Don{'`'}t have an account?{' '}
            <Button variant="text" onClick={() => navigate('signup')}>
              Sign Up
            </Button>
          </Typography>
        </Box>
      </form>
    </Paper>
  )
}

export default Login
