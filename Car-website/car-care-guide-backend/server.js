const express = require('express');
const cors = require('cors');
const pool = require('./db');
const bcrypt = require('bcrypt');

const app = express();
const port = 3000;

const LOGIN_API_URL = '/api/login'; 
const REGISTER_API_URL = '/api/register';

app.use(cors()); 
app.use(express.json());

app.post(REGISTER_API_URL, async (req, res) => {
    const { username, password, email } = req.body;

    if (!username || !password || !email) {
        return res.status(400).json({ success: false, message: 'All fields are required (username, password, email).' });
    }

    try {
        const checkQuery = 'SELECT user_id FROM users WHERE username = ? OR email = ?';
        const [existingUsers] = await pool.query(checkQuery, [username, email]);

        if (existingUsers.length > 0) {
            return res.status(409).json({ success: false, message: 'Username or email already exists.' });
        }

        const saltRounds = 10;
        const password_hash = await bcrypt.hash(password, saltRounds);

        const insertQuery = 'INSERT INTO users (username, password_hash, email) VALUES (?, ?, ?)';
        await pool.query(insertQuery, [username, password_hash, email]);

        return res.status(201).json({ success: true, message: 'User registered successfully. You can now log in.' });

    } catch (error) {
        console.error('Registration failed:', error.message);
        return res.status(500).json({ success: false, message: 'An internal server error occurred during registration. (Check your database connection or table structure.)' });
    }
});


app.post(LOGIN_API_URL, async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ success: false, message: 'Username and password are required.' });
    }

    console.log(`Login attempt for user: ${username}`);
    
    try {
        const query = 'SELECT user_id, password_hash FROM users WHERE username = ?';
        
        const [rows] = await pool.query(query, [username]); 

        if (rows.length === 0) {
            return res.status(401).json({ success: false, message: 'Invalid username or password. Please check your credentials or sign up.' });
        }

        const user = rows[0];
        
        const match = await bcrypt.compare(password, user.password_hash); 

        if (match) {
            const token = `user_${user.user_id}_session_token`; 
            return res.status(200).json({ success: true, message: 'Login successful!', token: token, user: { username, userId: user.user_id } });
        } else {
            return res.status(401).json({ success: false, message: 'Invalid username or password. Please check your credentials or sign up.' });
        }
    } 
    catch (error) {
        console.error('Login process failed:', error.message);
        return res.status(500).json({ success: false, message: 'An internal server error occurred during login processing.' });
    }
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
    console.log('Use CTRL+C to stop the server.');
});