require('dotenv').config();
const mongoose = require('mongoose');

const url = process.env.MONGODB_CONNECTION_STRING;

mongoose.set('strictQuery', false);
mongoose.connect(url)
  .then(() => {
    console.log('connected to MongoDB');
  })
  .catch(error => {
    console.log('error connectiong to MongoDB:', error.message);
  });

const validatorMessage = (props) => {
  return `${props.path} = ${props.value}, does not conform to xx-xxxxxx+ or xxx-xxxxx+`
};

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  number: {
    type: String,
    minLength: 8,
    required: true,
    validate: {
      validator: (v) => {
        return /^\d{2,3}-\d+$/.test(v);
      },
      message: validatorMessage,
    },
  },
});
personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

const Person = mongoose.model('Person', personSchema);
module.exports = Person;
