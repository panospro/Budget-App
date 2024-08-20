/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
/* eslint-disable no-unused-vars */
// TODO: Fix backend for savings
// TODO: Make recent transactions be seperated by month and year e.g 10/2024 and also have the total saved on each month
import React, { useState } from 'react'
import { Box, Grid, Card, CardContent, Typography, Button, TextField, List, ListItem, ListItemText, CircularProgress, LinearProgress, CardHeader, Divider, Alert, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import { Add, Savings as SavingsIcon, AccountBalance, Settings } from '@mui/icons-material'

const formatCurrency = (value) => `${value.toFixed(1).replace('.', ',')} €`

const SavingsProgress = React.memo(({ title, current, goal, amount, setAmount, handleAdd, loading, icon, onEditGoal }) => {
  return (
    <Card>
      <CardHeader
        avatar={icon}
        action={onEditGoal && (
          <IconButton onClick={onEditGoal}>
            <Settings />
          </IconButton>
        )}
        title={title}
        titleTypographyProps={{ variant: 'h6' }}
        sx={{ backgroundColor: '#f5f5f5' }}
      />
      <CardContent>
        <Typography variant="body1">Current Balance: {formatCurrency(current)}</Typography>
        {goal !== undefined && (
          <>
            <Typography variant="body1">Goal: {formatCurrency(goal)}</Typography>
            <LinearProgress
              variant="determinate"
              value={(current / goal) * 100}
              sx={{ mt: 2, mb: 2 }}
            />
            <Typography variant="body2" color="textSecondary">
              Progress: {((current / goal) * 100).toFixed(2)}%
            </Typography>
          </>
        )}
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

const EditGoalDialog = ({ open, onClose, currentGoal, onSave }) => {
  const [newGoal, setNewGoal] = useState(currentGoal)

  const handleSave = () => {
    onSave(parseFloat(newGoal))
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Goal</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Enter the new goal amount:
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          label="New Goal"
          type="number"
          fullWidth
          value={newGoal}
          onChange={(e) => setNewGoal(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export function Savings () {
  const [state, setState] = useState({
    savings: 1000,
    emergencyFund: 2000,
    emergencyFundGoal: 3000,
    amount: '',
    savingsTransactions: [],
    emergencyTransactions: [],
    loading: false,
    isEditingGoal: false
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

  const handleEditGoal = (newGoal) => {
    setState((prevState) => ({
      ...prevState,
      emergencyFundGoal: newGoal
    }))
  }

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item p={1} xs={12} md={6}>
          <Card>
            <CardContent>
              <Grid container direction="column" spacing={2}>
                <Grid item>
                  <SavingsProgress
                    title="Emergency Fund"
                    current={state.emergencyFund}
                    goal={state.emergencyFundGoal}
                    amount={state.amount}
                    setAmount={(value) => setState((prevState) => ({ ...prevState, amount: value }))}
                    handleAdd={handleAddToEmergencyFund}
                    loading={state.loading}
                    icon={<SavingsIcon />}
                    onEditGoal={() => setState((prevState) => ({ ...prevState, isEditingGoal: true }))}
                  />
                </Grid>
                <Grid item>
                  <TransactionList transactions={state.emergencyTransactions} />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Grid container direction="column" spacing={2}>
                <Grid item>
                  <SavingsProgress
                    title="General Savings"
                    current={state.savings}
                    amount={state.amount}
                    setAmount={(value) => setState((prevState) => ({ ...prevState, amount: value }))}
                    handleAdd={handleAddTransaction}
                    loading={state.loading}
                    icon={<AccountBalance />}
                  />
                </Grid>
                <Grid item>
                  <TransactionList transactions={state.savingsTransactions} />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <EditGoalDialog
        open={state.isEditingGoal}
        onClose={() => setState((prevState) => ({ ...prevState, isEditingGoal: false }))}
        currentGoal={state.emergencyFundGoal}
        onSave={handleEditGoal}
      />
    </Box>
  )
}
