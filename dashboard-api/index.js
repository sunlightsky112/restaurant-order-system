const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { connectMongo } = require('./services/db');
const orderRoutes = require('./routes/orders');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use('/orders', orderRoutes);

connectMongo().then(() => {
  app.listen(PORT, () => console.log(`Dashboard API running on port ${PORT}`));
});
