import React, { useState, useEffect } from 'react'
import axios from 'axios'
import ExpenseForm from '../components/ExpenseForm.js'
import ExpenseList from '../components/ExpenseList.js'

// TODO: Improve if no expense is added
function Dashboard () {
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true) // Loading state
  const [error, setError] = useState(null) // Error state

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

  return (
    <div>
      <h2>Dashboard</h2>
      <ExpenseForm setExpenses={setExpenses} />
      {loading
        ? (
        <p>Loading expenses...</p>
          )
        : error
          ? (
        <p>{error}</p>
            )
          : expenses.length > 0
            ? (
        <ExpenseList expenses={expenses} />
              )
            : (
        <p>No expenses available. Please add some.</p>
              )}
    </div>
  )
}

export default Dashboard
