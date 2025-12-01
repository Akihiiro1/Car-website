const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;
const db = require('./db');
const axios = require('axios');

app.use(cors());
app.use(express.json());

app.get('/users', (req, res) => {
    const sql = "SELECT * FROM users";
    db.query(sql, (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json(data);
    });
});

app.post('/users', (req, res) => {
    const sql = "INSERT INTO users (name, email) VALUES (?)";
    const values = [
        req.body.name,
        req.body.email
    ];
    
    db.query(sql, [values], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json({ message: "User added", id: data.insertId });
    });
});

app.delete('/users/:id', (req, res) => {
    const sql = "DELETE FROM users WHERE id = ?";
    const id = req.params.id;

    db.query(sql, [id], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json("User deleted");
    });
});

app.put('/users/:id', (req, res) => {
    const sql = "UPDATE users SET name = ?, email = ? WHERE id = ?";
    const id = req.params.id;
    const values = [req.body.name, req.body.email, id];

    db.query(sql, values, (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json("User updated");
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});