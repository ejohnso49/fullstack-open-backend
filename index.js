let phonebook = require('./db.json');
const express = require('express');

app = express();
app.use(express.json());

app.get('/api/persons', (request, response) => {
  response.json(phonebook);
});

app.get('/api/persons/:id', (request, response) => {
  const person = phonebook.find(value => value.id === request.params.id);
  if (person === undefined) {
    response.status(404).end();
    return;
  }

  response.json(person);
});

app.get('/info', (request, response) => {
  const date = new Date().toUTCString();
  const length = phonebook.length;

  const payload = `<p>Phonebook has info for ${length} people</p>` + `<p>${date}</p>`;

  response.send(payload);
  response.end();
});

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id;

  phonebook = phonebook.filter(person => person.id !== id);
  response.status(204).end();
});

const genId = () => {
  return String(Math.floor(Math.random() * Math.pow(2, 16)));
};

app.post('/api/persons', (request, response) => {
  const id = genId();

  const newPerson = {...request.body, id};
  phonebook = phonebook.concat(newPerson);
  response.status(201);
  response.json(newPerson);
  response.end();
})

const PORT = 3001;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
