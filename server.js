// server.js

// Importing necessary modules
const express = require('express'); // Express framework for creating the server
const XLSX = require('xlsx'); // Library for working with Excel files
const bodyParser = require('body-parser'); // Middleware for parsing incoming request bodies
const session = require('express-session'); // Import express-session

const app = express(); // Creating an instance of Express
const port = 3000; // Setting the port number for the server
const mysql = require('mysql');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'sarah123',
    database: 'nexgen_inventory'
});

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connected to MySQL Database');
});

// Set up session middleware
app.use(session({
    secret: 'secret_key', // Replace with a real secret in production
    resave: false,
    saveUninitialized: true,
}));

// Middleware setup for parsing request bodies
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));


app.post('/login', (req, res) => {
    const { name, pin } = req.body; // Extract name and pin from request body
    
    // Query the database to find the user
    db.query('SELECT * FROM users WHERE name = ? AND pin = ?', [name, pin], (err, result) => {
        if (err) {
            res.status(500).json({ success: false, message: 'Error checking credentials' });
            throw err;
        }

        if (result.length > 0) {
            req.session.loggedIn = true; // Set a flag in the session
            res.json({ success: true, message: 'Login successful' });
        } else {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
    });
});

app.post('/addItem', (req, res) => {
    const { barcode, name, quantity } = req.body;

    // Check if barcode is provided
    if (!barcode) {
        return res.status(400).json({ success: false, message: 'Barcode is required' });
    }

    // First, check if an item with this barcode already exists
    db.query('SELECT quantity FROM inventory WHERE barcode = ?', [barcode], (err, result) => {
        if (err) {
            res.status(500).json({ success: false, message: 'Error accessing the database' });
            throw err;
        }

        if (result.length > 0) {
            // Item exists (even if quantity is zero), so update its quantity
            const newQuantity = result[0].quantity + quantity;
            db.query('UPDATE inventory SET quantity = ? WHERE barcode = ?', [newQuantity, barcode], (err, result) => {
                if (err) {
                    res.status(500).json({ success: false, message: 'Error updating item' });
                    throw err;
                }
                res.json({ success: true, message: 'Item quantity updated' });
            });
        } else {
            // Item does not exist, so add a new item
            db.query('INSERT INTO inventory (name, quantity, barcode) VALUES (?, ?, ?)', [name, quantity, barcode], (err, result) => {
                if (err) {
                    res.status(500).json({ success: false, message: 'Error adding new item' });
                    throw err;
                }
                res.json({ success: true, message: 'New item added' });
            });
        }
    });
});



// Endpoint to lookup items by name
app.get('/lookupItemByName', (req, res) => {
    const itemName = req.query.itemName;

    // Query the database for items that match the provided name
    db.query('SELECT * FROM inventory WHERE name LIKE ?', [`%${itemName}%`], (err, results) => {
        if (err) {
            res.status(500).json({ success: false, message: 'Error querying the database' });
            console.error(err);
            return;
        }

        if (results.length > 0) {
            res.json({ success: true, items: results });
        } else {
            res.json({ success: false, message: 'No items found with this name' });
        }
    });
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


// Route to add an item
app.post('/addItem', (req, res) => {
    const addItem = req.body; // Gets the new item data from the request body
    // fill in
});

// Route to remove an item
app.post('/removeItem', (req, res) => {
    const removeItem = req.body; // Gets the item to be removed from the request body
    // fill in
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
