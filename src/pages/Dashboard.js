/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Alert, Tabs, Tab, Box, CircularProgress } from '@mui/material'
import { Budgeting, Savings, Debts, Investments } from '../components/index.js'

function TabPanel (props) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  )
}

function Dashboard () {
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [tabValue, setTabValue] = useState(0)

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await axios.get('http://localhost:4000/api/expenses', {
          headers: { Authorization: `Bearer ${token}` }
        })
        setExpenses(response.data)
      } catch (err) {
        setError('Failed to fetch expenses. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchExpenses()
  }, [])

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  return (
    <div>
      <h2>Budgeting App</h2>
      <Tabs value={tabValue} onChange={handleTabChange} aria-label="financial dashboard tabs">
        <Tab label="Budgeting" />
        <Tab label="Savings" />
        <Tab label="Debts" />
        <Tab label="Investments" />
      </Tabs>

      {loading
        ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px' }}>
          <CircularProgress />
        </Box>
          )
        : error
          ? (
        <Box sx={{ p: 3 }}>
          <Alert severity="error">{error}</Alert>
        </Box>
            )
          : (
        <>
          <TabPanel value={tabValue} index={0}>
            <Budgeting expenses={expenses} setExpenses={setExpenses} />
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <Savings />
          </TabPanel>
          <TabPanel value={tabValue} index={2}>
            <Debts />
          </TabPanel>
          <TabPanel value={tabValue} index={3}>
            <Investments />
          </TabPanel>
        </>
            )}
    </div>
  )
}

export default Dashboard
