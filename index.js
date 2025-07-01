const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'data.json');

app.use(cors());
app.use(bodyParser.json());

// Initialize the file if it doesn't exist
if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([]));
}

// GET route - returns all job applications
app.get('/applications', (req, res) => {
    const data = JSON.parse(fs.readFileSync(DATA_FILE));
    res.json(data);
});

// POST route - stores a new job application
app.post('/applications', (req, res) => {
    const { timestamp, company, position } = req.body;

    if (!timestamp || !company || !position) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    const newEntry = { timestamp, company, position };
    const data = JSON.parse(fs.readFileSync(DATA_FILE));
    data.push(newEntry);
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));

    res.status(201).json({ message: 'Application saved successfully.', data: newEntry });
});

app.listen(PORT, () => {
    console.log(`✅ Job application API running at http://localhost:${PORT}`);
});
