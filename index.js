const express = require('express');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Endpoint to get the whitelist
app.get('/whitelist', (req, res) => {
  fs.readFile('whitelist.json', (err, data) => {
    if (err) {
      res.status(500).send('Error reading whitelist file');
    } else {
      res.json(JSON.parse(data));
    }
  });
});

// Endpoint to add HWID to the whitelist
app.post('/whitelist/add', (req, res) => {
  const hwid = req.body.hwid;
  if (!hwid) {
    return res.status(400).send('HWID is required');
  }

  fs.readFile('whitelist.json', (err, data) => {
    if (err) {
      return res.status(500).send('Error reading whitelist file');
    }

    const whitelist = JSON.parse(data);
    if (!whitelist.whitelisted_hwid.includes(hwid)) {
      whitelist.whitelisted_hwid.push(hwid);
    }

    fs.writeFile('whitelist.json', JSON.stringify(whitelist, null, 2), (err) => {
      if (err) {
        return res.status(500).send('Error writing to whitelist file');
      }
      res.send('HWID added to whitelist');
    });
  });
});

// Endpoint to remove HWID from the whitelist
app.post('/whitelist/remove', (req, res) => {
  const hwid = req.body.hwid;
  if (!hwid) {
    return res.status(400).send('HWID is required');
  }

  fs.readFile('whitelist.json', (err, data) => {
    if (err) {
      return res.status(500).send('Error reading whitelist file');
    }

    const whitelist = JSON.parse(data);
    const index = whitelist.whitelisted_hwid.indexOf(hwid);
    if (index > -1) {
      whitelist.whitelisted_hwid.splice(index, 1);
    }

    fs.writeFile('whitelist.json', JSON.stringify(whitelist, null, 2), (err) => {
      if (err) {
        return res.status(500).send('Error writing to whitelist file');
      }
      res.send('HWID removed from whitelist');
    });
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
