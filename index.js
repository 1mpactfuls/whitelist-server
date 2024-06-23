const express = require('express');
const fs = require('fs');
const app = express();
app.use(express.json());

const whitelistFile = './whitelist.json';

// Function to read the whitelist
function readWhitelist() {
    if (!fs.existsSync(whitelistFile)) {
        return [];
    }
    const data = fs.readFileSync(whitelistFile, 'utf8');
    return JSON.parse(data);
}

// Function to write to the whitelist
function writeWhitelist(data) {
    fs.writeFileSync(whitelistFile, JSON.stringify(data, null, 2), 'utf8');
}

app.post('/whitelist/add', (req, res) => {
    const { hwid } = req.body;
    let whitelist = readWhitelist();
    if (!whitelist.includes(hwid)) {
        whitelist.push(hwid);
        writeWhitelist(whitelist);
        res.status(200).json({ message: 'Added to whitelist' });
    } else {
        res.status(200).json({ message: 'Already in whitelist' });
    }
});

app.post('/whitelist/remove', (req, res) => {
    const { hwid } = req.body;
    let whitelist = readWhitelist();
    if (whitelist.includes(hwid)) {
        whitelist = whitelist.filter(id => id !== hwid);
        writeWhitelist(whitelist);
        res.status(200).json({ message: 'Removed from whitelist' });
    } else {
        res.status(404).json({ message: 'HWID not found in whitelist' });
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
