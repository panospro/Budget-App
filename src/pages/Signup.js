/* eslint-disable react/prop-types */
import React, { useState } from 'react'
import axios from 'axios'
import {
  Box,
  TextField,
  Button,
  Typography,
  Link,
  Paper
} from '@mui/material'

function Signup ({ navigate }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      await axios.post('http://localhost:4000/api/auth/signup', { name, email, password })
      navigate('/login')
    } catch (error) {
      alert('Error signing up')
    }
  }

  return (
    <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Sign Up
      </Typography>
      <form onSubmit={handleSubmit}>
        <Box mb={2}>
          <TextField
            fullWidth
            label="Name"
            variant="outlined"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Box>
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
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Sign Up
        </Button>
        <Box mt={2}>
          <Typography>
            Already have an account?{' '}
            <Link href="/login" variant="body2">
              Login
            </Link>
          </Typography>
        </Box>
      </form>
    </Paper>
  )
}

export default Signup
