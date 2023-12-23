// server.js
const express = require('express');
const XLSX = require('xlsx');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Middleware for parsing JSON and urlencoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from 'public' directory
app.use(express.static('public'));

// Add more routes here as needed

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
