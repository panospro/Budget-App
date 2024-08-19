/* eslint-disable react/prop-types */
import React from 'react'

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

export default ExpenseList
