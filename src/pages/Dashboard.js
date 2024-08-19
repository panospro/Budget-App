import React, { useState, useEffect } from 'react'
import axios from 'axios'
import ExpenseForm from '../components/ExpenseForm.js'
import ExpenseList from '../components/ExpenseList.js'

function Dashboard () {
  const [expenses, setExpenses] = useState([])

  useEffect(() => {
    const fetchExpenses = async () => {
      const token = localStorage.getItem('token')
      const response = await axios.get('http://localhost:4000/api/expenses', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setExpenses(response.data)
    }

    fetchExpenses()
  }, [])

  return (
    <div>
      <h2>Dashboard</h2>
      <ExpenseForm setExpenses={setExpenses} />
      <ExpenseList expenses={expenses} />
    </div>
  )
}

export default Dashboard
