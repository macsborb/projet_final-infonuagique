require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors'); // import cors
const paymentRoutes = require('./routes/paymentRoutes');

const PORT = process.env.PORT || 3003;

app.use(cors());

app.use(express.json());
app.use('/api/payment', paymentRoutes);

app.listen(PORT, () => {
  console.log(`Payment service running on port ${PORT}`);
});
