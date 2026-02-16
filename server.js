// Imports
// Import express using ESM syntax
import express from 'express';

/**
 * Declare Important Variables
 */
// Start the server and listen on the specified port

const PORT = process.env.PORT || 3000;

/**
 * Setup Express Server
 */
const app = express();

const name = process.env.NAME; //NEWWWW
/**
 * Declare Routes
 */

// Define a route handler for the root URL ('/')
app.get('/', (req, res) => {
    res.send(`Welcome, ${name}!`);
});

//New route to demonstrate dynamic content
app.get('/new-route', (req, res) => {
    res.send('This is a new route!');
});


// Start the server and listen on the specified port
app.listen(PORT, () => {
    console.log(`Server is running on http://127.0.0.1:${PORT}`);
});