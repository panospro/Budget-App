// src/App.js
import React, { useState } from 'react'
import AuthForm from './pages/AuthForm.js'
import Dashboard from './pages/Dashboard.js'
import { Container, CssBaseline } from '@mui/material'

function App () {
  const [currentPage, setCurrentPage] = useState('login') // Default to login page

  const renderPage = () => {
    const pageComponents = {
      login: <AuthForm isSignup={false} navigate={setCurrentPage} />,
      signup: <AuthForm isSignup={true} navigate={setCurrentPage} />,
      dashboard: <Dashboard navigate={setCurrentPage} />
    }

    return pageComponents[currentPage] || pageComponents.login
  }

  return (
    <Container maxWidth="sm">
      <CssBaseline />
      {renderPage()}
    </Container>
  )
}

export default App
