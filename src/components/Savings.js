/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import { Box, Typography, Button, TextField, List, ListItem, ListItemText, CircularProgress, Paper, Grid, LinearProgress, Card, CardContent, CardHeader, Divider, Alert } from '@mui/material'
import { Add, Savings as SavingsIcon, AccountBalance } from '@mui/icons-material'

const formatCurrency = (value) => `$${value.toFixed(2)}`

const SavingsProgress = React.memo(({ title, current, goal, amount, setAmount, handleAdd, loading, icon }) => {
  return (
    <Card>
      <CardHeader
        avatar={icon}
        title={title}
        titleTypographyProps={{ variant: 'h6' }}
        sx={{ backgroundColor: '#f5f5f5' }}
      />
      <CardContent>
        <Typography variant="body1">Current Balance: {formatCurrency(current)}</Typography>
        <Typography variant="body1">Goal: {formatCurrency(goal)}</Typography>
        <LinearProgress
          variant="determinate"
          value={(current / goal) * 100}
          sx={{ mt: 2, mb: 2 }}
        />
        <Typography variant="body2" color="textSecondary">
          Progress: {((current / goal) * 100).toFixed(2)}%
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mt: 3 }}>
          <TextField
            label="Amount"
            variant="outlined"
            fullWidth
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <Button
            variant="contained"
            color="primary"
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Add />}
            onClick={handleAdd}
            disabled={loading}
            sx={{ minWidth: 100 }}
          >
            {loading ? 'Adding...' : 'Add'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  )
})

const TransactionList = React.memo(({ transactions }) => {
  return (
    <Card>
      <CardHeader
        title="Recent Transactions"
        titleTypographyProps={{ variant: 'h6' }}
        sx={{ backgroundColor: '#f5f5f5' }}
      />
      <CardContent>
        {transactions.length > 0
          ? (
          <List>
            {transactions.map((transaction) => (
              <ListItem key={transaction.id} divider>
                <ListItemText
                  primary={formatCurrency(transaction.amount)}
                  secondary={transaction.date}
                />
              </ListItem>
            ))}
          </List>
            )
          : (
          <Alert severity="info">No transactions yet. Start adding to your savings!</Alert>
            )}
      </CardContent>
    </Card>
  )
})

export function Savings () {
  const [state, setState] = useState({
    savings: 1000,
    goal: 5000,
    emergencyFund: 2000,
    emergencyFundGoal: 3000,
    amount: '',
    savingsTransactions: [],
    emergencyTransactions: [],
    loading: false
  })

  const handleAddTransaction = () => {
    if (!state.amount || isNaN(state.amount)) return

    setState((prevState) => ({
      ...prevState,
      loading: true
    }))

    setTimeout(() => {
      const newTransaction = {
        id: state.savingsTransactions.length + 1,
        amount: parseFloat(state.amount),
        date: new Date().toLocaleDateString()
      }

      setState((prevState) => ({
        ...prevState,
        savings: prevState.savings + newTransaction.amount,
        savingsTransactions: [...prevState.savingsTransactions, newTransaction],
        amount: '',
        loading: false
      }))
    }, 500)
  }

  const handleAddToEmergencyFund = () => {
    if (!state.amount || isNaN(state.amount)) return

    setState((prevState) => ({
      ...prevState,
      loading: true
    }))

    setTimeout(() => {
      const newTransaction = {
        id: state.emergencyTransactions.length + 1,
        amount: parseFloat(state.amount),
        date: new Date().toLocaleDateString()
      }

      setState((prevState) => ({
        ...prevState,
        emergencyFund: prevState.emergencyFund + newTransaction.amount,
        emergencyTransactions: [...prevState.emergencyTransactions, newTransaction],
        amount: '',
        loading: false
      }))
    }, 500)
  }

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <SavingsProgress
            title="Emergency Fund"
            current={state.emergencyFund}
            goal={state.emergencyFundGoal}
            amount={state.amount}
            setAmount={(value) => setState((prevState) => ({ ...prevState, amount: value }))}
            handleAdd={handleAddToEmergencyFund}
            loading={state.loading}
            icon={<SavingsIcon />}
          />
          <TransactionList transactions={state.emergencyTransactions} />
        </Grid>

        <Grid item xs={12} md={6}>
          <SavingsProgress
            title="General Savings"
            current={state.savings}
            goal={state.goal}
            amount={state.amount}
            setAmount={(value) => setState((prevState) => ({ ...prevState, amount: value }))}
            handleAdd={handleAddTransaction}
            loading={state.loading}
            icon={<AccountBalance />}
          />
          <TransactionList transactions={state.savingsTransactions} />
        </Grid>
      </Grid>
    </Box>
  )
}
