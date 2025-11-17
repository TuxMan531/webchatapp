const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

const port = 8080;

app.use(express.static('public')); // serve files from the public directory

app.listen(port, () => { // server starts
  console.log(`Website running at http://localhost:${port}`);
});

app.use((req, res) => { //404 page
  res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});