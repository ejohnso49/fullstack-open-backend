
const morgan = require('morgan');
const express = require('express');
const cors = require('cors');
const Person = require('./models/person');

app = express();
app.use(express.json());
app.use(cors());
app.use(express.static('dist'));

// :method :path :status :response_length - :response_time ms :request_body
morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

app.get('/api/persons', (request, response, next) => {
  Person.find({})
    .then(people => response.json(people))
    .catch(error => next(error));
});

app.get('/api/persons/:id', (request, response, next) => {
  const id = request.params.id;
  Person.findById(id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).json({ error: `Person with id[${id}] not found` });
      }
    })
    .catch(error => next(error));
});

app.get('/info', (request, response, next) => {
  const date = new Date().toUTCString();
  Person.estimatedDocumentCount({})
    .then(count => {
      const payload = `<p>Phonebook has info for ${count} people</p>` + `<p>${date}</p>`;
      response.send(payload);
    })
    .catch(error => next(error));
});

app.delete('/api/persons/:id', (request, response, next) => {
  const id = request.params.id;

  Person.findByIdAndDelete(id)
    .then(result => {
      if (result) {
        response.status(204).end();
      } else {
        response.status(404).json({ error: `Person with id[${id}] not found` });
      }
    })
    .catch(error => next(error));
});

app.post('/api/persons', (request, response, next) => {
  const body = request.body;
  const newName = body.name;
  const newNumber = body.number;

  if (!newName || !newNumber) {
    response
      .status(400)
      .json({error: `Name: ${newName} or Number: ${newNumber} missing`});
      return;
  }

  Person.create({ name: newName, number: newNumber })
    .then(person => {
      response.json(person);
    })
    .catch(error => next(error));
});

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body;
  const name = body.name;
  const newNumber = body.number;

  if (!name || !newNumber) {
    response
      .status(400)
      .json({ error: `Name: ${name} or Number: ${newNumber} missing` });
      return;
  }

  Person.findOneAndUpdate({ name: name }, { number: newNumber }, { new: true })
    .then(person => {
      response.json(person);
    })
    .catch(error => next(error));
});

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformed id' });
  }

  next(error);
}
app.use(errorHandler);

const PORT = 3001;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
