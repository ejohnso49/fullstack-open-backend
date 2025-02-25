const phonebook = require('./db.json');
const express = require('express');

app = express();
app.use(express.json());

app.get('/api/persons', (request, response) => {
  response.json(phonebook);
});

app.get('/info', (request, response) => {
  const date = new Date().toUTCString();
  const length = phonebook.length;

  const payload = `<p>Phonebook has info for ${length} people</p>` + `<p>${date}</p>`;

  response.send(payload);
  response.end();
});

const PORT = 3001;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
