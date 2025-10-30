const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 3018;

app.use(cors());
app.use(express.json()); // Add this to parse JSON requests
app.use(express.static(__dirname));

mongoose.connect('mongodb://127.0.0.1:27017/students', {});
const db = mongoose.connection;
db.on('error', console.error.bind(console, '❌ MongoDB error:'));
db.once('open', () => {
  console.log('✅ Connected to MongoDB database "students"');
});

const studentSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email1: String,
  phone: String,
  password: String
});
const Student = mongoose.model('Student', studentSchema, 'students');

// Get all students
app.get('/api/students', async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    console.error('❌ Error fetching students:', err);
    res.status(500).send('Server Error');
  }
});

// Update a student
app.put('/api/students/:id', async (req, res) => {
  try {
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedStudent) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json(updatedStudent);
  } catch (err) {
    console.error('❌ Error updating student:', err);
    res.status(500).send('Server Error');
  }
});

// Delete a student
app.delete('/api/students/:id', async (req, res) => {
  try {
    const deletedStudent = await Student.findByIdAndDelete(req.params.id);
    if (!deletedStudent) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json({ message: 'Student deleted successfully' });
  } catch (err) {
    console.error('❌ Error deleting student:', err);
    res.status(500).send('Server Error');
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'dashboard.html'));
});

app.listen(port, () => {
  console.log(`✅ Server is running at http://localhost:${port}`);
});