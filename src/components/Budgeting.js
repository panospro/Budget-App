/* eslint-disable react/prop-types */
import React, { useState } from 'react'
import axios from 'axios'

function ExpenseForm ({ setExpenses }) {
  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    const token = localStorage.getItem('token')
    const response = await axios.post('http://localhost:4000/api/expenses', { title, amount }, {
      headers: { Authorization: `Bearer ${token}` }
    })
    setExpenses((prev) => [...prev, response.data])
    setTitle('')
    setAmount('')
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Expense Title" required />
      <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount" required />
      <button type="submit">Add Expense</button>
    </form>
  )
}

function ExpenseList ({ expenses }) {
  return (
    <ul>
      {expenses.map((expense) => (
        <li key={expense._id}>
          {expense.title}: ${expense.amount}
        </li>
      ))}
    </ul>
  )
}

export function Budgeting ({ expenses, setExpenses }) {
  return (
    <div>
      <ExpenseForm setExpenses={setExpenses} />
      {expenses.length > 0
        ? (
        <ExpenseList expenses={expenses} />
          )
        : (
        <p>No expenses available. Please add some.</p>
          )}
    </div>
  )
}
