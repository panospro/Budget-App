import mongoose from 'mongoose'

const debtSchema = new mongoose.Schema({
  description: { type: String, required: true },
  principal: { type: Number, required: true },
  interestRate: { type: Number, required: true },
  minPayment: { type: Number, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  paymentHistory: [
    {
      amount: { type: Number, required: true },
      date: { type: Date, default: Date.now }
    }
  ]
})

const Debt = mongoose.model('Debt', debtSchema)

export default Debt
