import React, { useState } from 'react'
import { Box, Grid, Card, CardContent, Typography, Button, TextField, List, ListItem, ListItemText, Alert, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Tooltip, IconButton } from '@mui/material'
import { Info } from '@mui/icons-material'

// Function to calculate the number of payments required to pay off the debt
const calculatePayoffTime = (principal, interestRate, minPayment) => {
  if (interestRate === 0) {
    return principal / minPayment
  }

  const monthlyRate = interestRate / 12 / 100
  return Math.log(minPayment / (minPayment - principal * monthlyRate)) / Math.log(1 + monthlyRate)
}

// Strategy to sort debts by the avalanche method
const sortByAvalanche = (debts) => {
  return [...debts].sort((a, b) => b.interestRate - a.interestRate)
}

// Strategy to sort debts by the snowball method
const sortBySnowball = (debts) => {
  return [...debts].sort((a, b) => a.principal - b.principal)
}

// Mock strategy to sort debts by the tsunami method (requires a 'stressLevel' attribute)
const sortByTsunami = (debts) => {
  return [...debts].sort((a, b) => b.stressLevel - a.stressLevel)
}

export function Debts () {
  const [debts, setDebts] = useState([])
  const [formState, setFormState] = useState({
    description: '',
    principal: '',
    interestRate: '',
    minPayment: '',
    stressLevel: ''
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
    const { description, principal, interestRate, minPayment, stressLevel } = formState

    if (!description || !principal || !interestRate || !minPayment || !stressLevel) {
      return
    }

    const newDebt = {
      id: debts.length + 1,
      description,
      principal: parseFloat(principal),
      interestRate: parseFloat(interestRate),
      minPayment: parseFloat(minPayment),
      stressLevel: parseFloat(stressLevel), // Mock stress level for tsunami method
      payoffTime: calculatePayoffTime(parseFloat(principal), parseFloat(interestRate), parseFloat(minPayment))
    }

    setDebts((prev) => [...prev, newDebt])

    // Reset form
    setFormState({
      description: '',
      principal: '',
      interestRate: '',
      minPayment: '',
      stressLevel: ''
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
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <TextField label="Description" name="description" value={formState.description} onChange={handleChange} variant="outlined" fullWidth style={{ marginRight: 8 }}/>
                <Tooltip title="A brief description of the debt (e.g., Credit Card, Car Loan).">
                  <IconButton size="small"><Info fontSize="small" /></IconButton>
                </Tooltip>
              </div>
            </Grid>
            <Grid item xs={12} sm={6}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <TextField label="Principal Amount (€)" name="principal" value={formState.principal} onChange={handleChange} variant="outlined" fullWidth type="number" style={{ marginRight: 8 }}/>
                <Tooltip title="The total amount of debt you owe.">
                  <IconButton size="small"><Info fontSize="small" /></IconButton>
                </Tooltip>
              </div>
            </Grid>
            <Grid item xs={12} sm={6}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <TextField label="Interest Rate (%)" name="interestRate" value={formState.interestRate} onChange={handleChange} variant="outlined" fullWidth type="number" style={{ marginRight: 8 }} />
                  <Tooltip title="The annual interest rate for this debt.">
                  <IconButton size="small"><Info fontSize="small" /></IconButton>
                </Tooltip>
              </div>
            </Grid>
            <Grid item xs={12} sm={6}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <TextField label="Minimum Payment (€)" name="minPayment" value={formState.minPayment} onChange={handleChange} variant="outlined" fullWidth type="number" style={{ marginRight: 8 }}/>
                <Tooltip title="The smallest amount you are required to pay each month.">
                  <IconButton size="small">
                    <Info fontSize="small" />
                  </IconButton>
                </Tooltip>
              </div>
            </Grid>
            <Grid item xs={12} sm={6}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <TextField label="Stress Level (1-10)" name="stressLevel" value={formState.stressLevel} onChange={handleChange} variant="outlined" fullWidth type="number" style={{ marginRight: 8 }}/>
                <Tooltip title="How much stress this debt causes you on a scale from 1 (low) to 10 (high).">
                  <IconButton size="small"><Info fontSize="small" /></IconButton>
                </Tooltip>
              </div>
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

      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Debt Repayment Strategies
            <Tooltip title="Choose a strategy that best suits your financial and emotional situation.">
              <IconButton size="small">
                <Info fontSize="small" />
              </IconButton>
            </Tooltip>
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6">
                Avalanche Method
                <Tooltip title="Pay off debts with the highest interest rates first to minimize total interest paid.">
                  <IconButton size="small">
                    <Info fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Typography>
              <List>
                {sortByAvalanche(debts).map((debt) => (
                  <ListItem key={debt.id}>
                    <ListItemText
                      primary={debt.description}
                      secondary={`Balance: €${debt.principal.toFixed(2)} - Interest Rate: ${debt.interestRate}%`}
                    />
                  </ListItem>
                ))}
              </List>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6">
                Snowball Method
                <Tooltip title="Pay off the smallest debts first to build momentum and see quick results.">
                  <IconButton size="small">
                    <Info fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Typography>
              <List>
                {sortBySnowball(debts).map((debt) => (
                  <ListItem key={debt.id}>
                    <ListItemText
                      primary={debt.description}
                      secondary={`Balance: €${debt.principal.toFixed(2)} - Interest Rate: ${debt.interestRate}%`}
                    />
                  </ListItem>
                ))}
              </List>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6">
                Tsunami Method
                <Tooltip title="Pay off the debts that cause the most stress first, regardless of balance or interest rate.">
                  <IconButton size="small">
                    <Info fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Typography>
              <List>
                {sortByTsunami(debts).map((debt) => (
                  <ListItem key={debt.id}>
                    <ListItemText
                      primary={debt.description}
                      secondary={`Balance: €${debt.principal.toFixed(2)} - Stress Level: ${debt.stressLevel}`}
                    />
                  </ListItem>
                ))}
              </List>
            </Grid>
          </Grid>
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
