const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  favorite: {
    type: Boolean,
  },
});

const Contact = mongoose.model('db-contacts', contactSchema, 'contacts');

module.exports = Contact;