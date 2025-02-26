const mongoose = require('mongoose');
require('dotenv').config();

const addNewPerson = (name, number) => {
  const person = new Person({
    name: name,
    number: number,
  });

  person.save().then(result => {
    console.log('saved person');
    mongoose.connection.close();
  });
};

const printPhonebook = () => {
  Person.find({}).then(result => {
    result.forEach(person => console.log(person));
    mongoose.connection.close();
  });
};

if (process.env.MONGODB_CONNECTION_STRING === undefined) {
  console.log('Missing connection string definition in .env');
  process.exit(1);
}

const url = process.env.MONGODB_CONNECTION_STRING;
mongoose.set('strictQuery', false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = new mongoose.model('Person', personSchema);

// First arg is process.execPath, second is path to mongo.js, third is first arg if present
if (process.argv.length >= 4) {
  const name = process.argv[2];
  const number = process.argv[3];

  addNewPerson(name, number);
} else if (process.argv.length == 2) {
  printPhonebook();
} else {
  console.log('Wrong number of args. Either call with none or :name :number');
  process.exit(1);
}



