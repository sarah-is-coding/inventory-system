// server.js

// Importing necessary modules
const express = require('express'); // Express framework for creating the server
const XLSX = require('xlsx'); // Library for working with Excel files
const bodyParser = require('body-parser'); // Middleware for parsing incoming request bodies
const session = require('express-session'); // Import express-session

const app = express(); // Creating an instance of Express
const port = 3000; // Setting the port number for the server

// Set up session middleware
app.use(session({
    secret: 'your_secret_key', // Replace with a real secret in production
    resave: false,
    saveUninitialized: true,
}));

// Middleware setup for parsing request bodies
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));

// Helper function to read and write Excel files
function readWriteExcel(action) {
    const workbook = XLSX.readFile('inventory.xlsx'); // Reads the Excel file
    const sheetName = workbook.SheetNames[0]; // Gets the first sheet name
    const worksheet = workbook.Sheets[sheetName]; // Gets the worksheet
    let data = XLSX.utils.sheet_to_json(worksheet); // Converts the worksheet data to JSON

    action(data); // Executes the action function passed as an argument on the data

    // Writing back to Excel
    const newWorksheet = XLSX.utils.json_to_sheet(data); // Converts JSON data back to worksheet format
    workbook.Sheets[sheetName] = newWorksheet; // Updates the workbook with the new worksheet
    XLSX.writeFile(workbook, 'inventory.xlsx'); // Writes the updated workbook back to the Excel file
}

// Helper function to read users from Excel
function getUsers() {
    const workbook = XLSX.readFile('inventory.xlsx');
    const sheetName = workbook.SheetNames.find(name => name === "Users"); // Find the 'Users' sheet
    if (!sheetName) return []; // If 'users' sheet doesn't exist, return empty array
    const worksheet = workbook.Sheets[sheetName];
    return XLSX.utils.sheet_to_json(worksheet); // Convert sheet to JSON and return
}

// Route for handling login
app.post('/login', (req, res) => {
    const { name, pin } = req.body; // Extract name and pin from request body
    const users = getUsers(); // Get the list of users

    // Find the user with matching name and pin
    // Convert both values to strings and trim them before comparison
    // Also, use a case-insensitive comparison for the name
    const user = users.find(u => 
        u.name.toLowerCase().trim() === name.toLowerCase().trim() && 
        u.pin.toString().trim() === pin.trim()
    );

    if (user) {
        req.session.loggedIn = true; // Set a flag in the session
        res.json({ success: true, message: 'Login successful' });
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
});


// Protect the main route
app.get('/', (req, res) => {
    if (req.session.loggedIn) {
        res.sendFile(__dirname + '/public/index.html');
    } else {
        res.redirect('/login');
    }
});

// Serve the login page
app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/public/login.html');
});

// Serve the login page
app.get('/addItem', (req, res) => {
    res.sendFile(__dirname + '/public/addItem.html');
});

// Serve the login page
app.get('/removeItem', (req, res) => {
    res.sendFile(__dirname + '/public/removeItem.html');
});

// Serve the login page
app.get('/printQR', (req, res) => {
    res.sendFile(__dirname + '/public/printQR.html');
});

// Serve the login page
app.get('/scanQR', (req, res) => {
    res.sendFile(__dirname + '/public/scanQR.html');
});

// Route to get inventory items
app.get('/getInventory', (req, res) => {
    const workbook = XLSX.readFile('inventory.xlsx'); // Reads the Excel file
    const sheetName = workbook.SheetNames[0]; // Gets the first sheet name
    const worksheet = workbook.Sheets[sheetName]; // Gets the worksheet
    const data = XLSX.utils.sheet_to_json(worksheet); // Converts the worksheet data to JSON
    res.json(data); // Sends the JSON data as a response
});

// Route to add an item
app.post('/addItem', (req, res) => {
    const addItem = req.body; // Gets the new item data from the request body
    readWriteExcel(data => {
        const existingItem = data.find(item => item.name === addItem.name); // Looks for an existing item with the same name
        if (existingItem) {
            existingItem.quantity += parseInt(addItem.quantity); // If found, increases its quantity
        } else {
            data.push({ name: addItem.name, quantity: parseInt(addItem.quantity) }); // If not found, adds the new item
        }
    });
    res.json({ message: 'Item added' }); // Sends a response indicating the item was added
});

// Route to remove an item
app.post('/removeItem', (req, res) => {
    const removeItem = req.body; // Gets the item to be removed from the request body
    readWriteExcel(data => {
        const index = data.findIndex(item => item.name === removeItem.name); // Finds the index of the item to be removed
        if (index !== -1) {
            data.splice(index, 1); // If the item exists, removes it from the data
        }
    });
    res.json({ message: 'Item removed' }); // Sends a response indicating the item was removed
});

// Logout route
app.get('/logout', (req, res) => {
    req.session.destroy(); // Destroys session
    res.redirect('/login'); // Redirects to the login page
});

// Static file serving, placed after session-based routes
app.use(express.static('public')); 

// Starting the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
