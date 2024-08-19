// src/App.js
import React, { useState } from 'react'
import Login from './pages/Login.js'
import Signup from './pages/Signup.js'
import Dashboard from './pages/Dashboard.js'
import { Container, CssBaseline } from '@mui/material'

function App () {
  const [currentPage, setCurrentPage] = useState('login') // Default to login page

  const renderPage = () => {
    switch (currentPage) {
      case 'login':
        return <Login navigate={setCurrentPage} />
      case 'signup':
        return <Signup navigate={setCurrentPage} />
      case 'dashboard':
        return <Dashboard navigate={setCurrentPage} />
      default:
        return <Login navigate={setCurrentPage} />
    }
  }
  return (
    <Container maxWidth="sm">
      <CssBaseline />
      {renderPage()}
    </Container>
  )
}

export default App
