const express = require('express');
const cors = require('cors');
const pool = require('./db');
const bcrypt = require('bcrypt');
const path = require('path'); 

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const frontendPath = path.join(__dirname, '../frontend');

app.use(express.static(frontendPath));

app.get('/', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
});


const LOGIN_API_URL = '/api/login';
const REGISTER_API_URL = '/api/register';
const VEHICLES_API_URL = '/api/vehicles';

const getUserIdFromToken = (req) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return null;
    const token = authHeader.split(' ')[1]; 
    if (!token || !token.startsWith('user_')) return null;
    const parts = token.split('_');
    return parts[1]; 
};

app.post(REGISTER_API_URL, async (req, res) => {
    const { username, password, email } = req.body;

    if (!username || !password || !email) {
        return res.status(400).json({ success: false, message: 'All fields are required.' });
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

        return res.status(201).json({ success: true, message: 'User registered successfully.' });

    } catch (error) {
        console.error('Registration failed:', error.message);
        return res.status(500).json({ success: false, message: 'Server error during registration.' });
    }
});

app.post(LOGIN_API_URL, async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ success: false, message: 'Username and password required.' });
    }

    try {
        const query = 'SELECT user_id, password_hash FROM users WHERE username = ?';
        const [rows] = await pool.query(query, [username]);

        if (rows.length === 0) {
            return res.status(401).json({ success: false, message: 'Invalid credentials.' });
        }

        const user = rows[0];
        const match = await bcrypt.compare(password, user.password_hash);

        if (match) {
            const token = `user_${user.user_id}_session_token`;
            return res.status(200).json({ 
                success: true, 
                message: 'Login successful!', 
                token: token, 
                user: { username, userId: user.user_id } 
            });
        } else {
            return res.status(401).json({ success: false, message: 'Invalid credentials.' });
        }
    } catch (error) {
        console.error('Login failed:', error.message);
        return res.status(500).json({ success: false, message: 'Server error during login.' });
    }
});

app.get(VEHICLES_API_URL, async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM vehicles ORDER BY created_at DESC');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post(VEHICLES_API_URL, async (req, res) => {
    const userId = getUserIdFromToken(req);
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const { make, image_url, guide_count } = req.body;
    
    try {
        const query = 'INSERT INTO vehicles (user_id, make, image_url, guide_count) VALUES (?, ?, ?, ?)';
        const [result] = await pool.query(query, [userId, make, image_url, guide_count]);
        res.status(201).json({ id: result.insertId, message: 'Vehicle added' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put(`${VEHICLES_API_URL}/:id`, async (req, res) => {
    const userId = getUserIdFromToken(req);
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const { id } = req.params;
    const { make, image_url, guide_count } = req.body;

    try {
        const checkOwner = 'SELECT user_id FROM vehicles WHERE id = ?';
        const [rows] = await pool.query(checkOwner, [id]);
        
        if (rows.length === 0) return res.status(404).json({ message: 'Vehicle not found' });
        if (rows[0].user_id != userId) return res.status(403).json({ message: 'Not authorized to edit this vehicle' });

        const query = 'UPDATE vehicles SET make = ?, image_url = ?, guide_count = ? WHERE id = ?';
        await pool.query(query, [make, image_url, guide_count, id]);
        res.json({ message: 'Vehicle updated' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete(`${VEHICLES_API_URL}/:id`, async (req, res) => {
    const userId = getUserIdFromToken(req);
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const { id } = req.params;

    try {
        const checkOwner = 'SELECT user_id FROM vehicles WHERE id = ?';
        const [rows] = await pool.query(checkOwner, [id]);
        
        if (rows.length === 0) return res.status(404).json({ message: 'Vehicle not found' });
        if (rows[0].user_id != userId) return res.status(403).json({ message: 'Not authorized to delete this vehicle' });

        await pool.query('DELETE FROM vehicles WHERE id = ?', [id]);
        res.json({ message: 'Vehicle deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
    console.log('Use CTRL+C to stop the server.');
});