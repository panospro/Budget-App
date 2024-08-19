import express from 'express'
import Expense from '../models/Expense.js'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config({ path: '../../.env' })

const router = express.Router()

// Middleware to check JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) return res.status(401).json({ message: 'No token provided' })

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' })
    req.user = user
    next()
  })
}

// Add a new expense
router.post('/', authenticateToken, async (req, res) => {
  const { title, amount, date } = req.body
  const userId = req.user.userId

  try {
    const expense = new Expense({ title, amount, date, user: userId })
    await expense.save()
    res.status(201).json(expense)
  } catch (error) {
    res.status(500).json({ message: 'Error adding expense', error })
  }
})

// Get all expenses for the logged-in user
router.get('/', authenticateToken, async (req, res) => {
  const userId = req.user.userId

  try {
    const expenses = await Expense.find({ user: userId }).sort({ date: -1 })
    res.json(expenses)
  } catch (error) {
    res.status(500).json({ message: 'Error fetching expenses', error })
  }
})

export default router
