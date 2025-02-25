let phonebook = require('./db.json');
const morgan = require('morgan');
const express = require('express');

app = express();
app.use(express.json());
app.use(morgan('tiny'));

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
  const body = request.body;
  const newName = body.name;
  const newNumber = body.number;

  if (!newName || !newNumber) {
    response
      .status(400)
      .json({error: `Name: ${newName} or Number: ${newNumber} missing`});
      return;
  }

  if (phonebook.find(person => person.name === newName)) {
    response
      .status(409)
      .json({error: 'Name must be unique'});
      return;
  }

  const id = genId();

  const newPerson = {...request.body, id};
  phonebook = phonebook.concat(newPerson);
  response
    .status(201)
    .json(newPerson);
});

const PORT = 3001;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
