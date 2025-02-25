const phonebook = require('./db.json');
const express = require('express');

app = express();
app.use(express.json());

app.get('/api/persons', (request, response) => {
  response.json(phonebook);
});

const PORT = 3001;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
