// // Debts.js
import React, { useState } from 'react'
import { Box, Grid, Card, CardContent, Typography, Button, TextField, List, ListItem, ListItemText, Alert, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'

// Function to calculate the number of payments required to pay off the debt
const calculatePayoffTime = (principal, interestRate, minPayment) => {
  if (interestRate === 0) {
    return principal / minPayment
  }

  const monthlyRate = interestRate / 12 / 100
  return Math.log(minPayment / (minPayment - principal * monthlyRate)) / Math.log(1 + monthlyRate)
}

export function Debts () {
  const [debts, setDebts] = useState([])
  const [formState, setFormState] = useState({
    description: '',
    principal: '',
    interestRate: '',
    minPayment: ''
  })
  const [paymentDialog, setPaymentDialog] = useState({
    open: false,
    debtId: null,
    paymentAmount: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormState((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddDebt = () => {
    const { description, principal, interestRate, minPayment } = formState

    if (!description || !principal || !interestRate || !minPayment) {
      return
    }

    const newDebt = {
      id: debts.length + 1,
      description,
      principal: parseFloat(principal),
      interestRate: parseFloat(interestRate),
      minPayment: parseFloat(minPayment),
      payoffTime: calculatePayoffTime(parseFloat(principal), parseFloat(interestRate), parseFloat(minPayment))
    }

    setDebts((prev) => [...prev, newDebt])

    // Reset form
    setFormState({
      description: '',
      principal: '',
      interestRate: '',
      minPayment: ''
    })
  }

  const handleOpenPaymentDialog = (debtId) => {
    setPaymentDialog({ open: true, debtId, paymentAmount: '' })
  }

  const handleClosePaymentDialog = () => {
    setPaymentDialog({ open: false, debtId: null, paymentAmount: '' })
  }

  const handlePaymentChange = (e) => {
    setPaymentDialog((prev) => ({ ...prev, paymentAmount: e.target.value }))
  }

  const handlePayDebt = () => {
    const { debtId, paymentAmount } = paymentDialog
    const payment = parseFloat(paymentAmount)

    setDebts((prev) =>
      prev.map((debt) => {
        if (debt.id === debtId) {
          const updatedPrincipal = debt.principal - payment
          const newPayoffTime = calculatePayoffTime(updatedPrincipal, debt.interestRate, debt.minPayment)

          return {
            ...debt,
            principal: updatedPrincipal > 0 ? updatedPrincipal : 0,
            payoffTime: updatedPrincipal > 0 ? newPayoffTime : 0
          }
        }
        return debt
      })
    )

    handleClosePaymentDialog()
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Manage Your Debts
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Add a New Debt
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Description"
                name="description"
                value={formState.description}
                onChange={handleChange}
                variant="outlined"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Principal Amount (€)"
                name="principal"
                value={formState.principal}
                onChange={handleChange}
                variant="outlined"
                fullWidth
                type="number"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Interest Rate (%)"
                name="interestRate"
                value={formState.interestRate}
                onChange={handleChange}
                variant="outlined"
                fullWidth
                type="number"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Minimum Payment (€)"
                name="minPayment"
                value={formState.minPayment}
                onChange={handleChange}
                variant="outlined"
                fullWidth
                type="number"
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddDebt}
                fullWidth
              >
                Add Debt
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Your Debts
          </Typography>
          {debts.length > 0
            ? (
            <List>
              {debts.map((debt) => (
                <ListItem key={debt.id} divider>
                  <ListItemText
                    primary={`${debt.description}: €${debt.principal.toFixed(2)}`}
                    secondary={`Interest Rate: ${debt.interestRate}% - Minimum Payment: €${debt.minPayment.toFixed(2)} - Payoff Time: ${debt.payoffTime.toFixed(2)} months`}
                  />
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleOpenPaymentDialog(debt.id)}
                    disabled={debt.principal <= 0}
                  >
                    Pay this Month
                  </Button>
                </ListItem>
              ))}
            </List>
              )
            : (
            <Alert severity="info">No debts added yet.</Alert>
              )}
        </CardContent>
      </Card>

      <Dialog open={paymentDialog.open} onClose={handleClosePaymentDialog}>
        <DialogTitle>Make a Payment</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter the amount you want to pay this month:
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Payment Amount (€)"
            type="number"
            fullWidth
            value={paymentDialog.paymentAmount}
            onChange={handlePaymentChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePaymentDialog}>Cancel</Button>
          <Button onClick={handlePayDebt} variant="contained" color="primary">
            Pay
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
