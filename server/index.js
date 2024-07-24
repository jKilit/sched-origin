const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const availabilityRoutes = require('./routes/availability.route');
const userRoutes = require('./routes/user.route');
const shiftRoutes = require('./routes/shift.route');
dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());




app.use('/api/availabilities', availabilityRoutes);
app.use('/api/users', userRoutes);
app.use('/api/shifts', shiftRoutes);
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: `https://sched-origin.onrender.com/`
}));


mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
.then(() => {
    console.log('Connected to MongoDB');
  app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
  });
})
.catch(err => {
  console.error('Connection error', err.message);
});
