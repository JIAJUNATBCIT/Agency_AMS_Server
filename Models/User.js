var mongoose              = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

// User Schema
var userSchema = mongoose.Schema({
  username: {
    type: String,
    index: true, // Index ensures property is unique in db.
    validate: {
      validator: function(v) {
          return /^[a-zA-Z0-9][a-zA-Z0-9 \-']+$/.test(v)
      },
      message: `Only letters, numbers, hyphens(-) and apostrophes(') are allowed for the user name`
    },
  },
  password: {
    type: String
  },
  firstname: {
    "type" : "string",
    validate: {
      validator: function(v) {
          return /^[a-zA-Z][a-zA-Z \-']+$/.test(v)
      },
      message: `Only letters, hyphens(-) and apostrophes(') are allowed for the first name`
    },
  },
  lastname: {
    "type" : "string",
    validate: {
      validator: function(v) {
          return /^[a-zA-Z][a-zA-Z \-']+$/.test(v)
      },
      message: `Only letters, hyphens(-) and apostrophes(') are allowed for the last name`
    },
  },

  office: {
    "type" : "string",
    validator: function(v) {
      return /^[a-zA-Z][a-zA-Z \-']+$/.test(v)
    },
    message: `Incorrect office name format`
  },
  
  email: {
    type: "string",
    validate: {
      validator: function(v) {
          return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(v)
      },
      message: `Invalid email format, a proper format could be someone@mymail.com`
    },
  },

  phonenumber: {
    type: "string",
    validate: {
      validator: function(v) {
          return /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/.test(v)
      },
      message: `Invalid phone number format, a proper format could be (xxx)xxx-xxxx`
    },
  },

  roles: {
    type: Array
  },
  
  salary: {
    type: Number, min: 0.0,
    validate: {
        validator: function(v) {
            result = /^\s*(?=.*[1-9])\d*(?:\.\d{1,2})?\s*$/.test(v)
            return result
        },
        message: `Invalid salary value, a proper format could be: $.21, $100.00, 100.00, 100.1, 100, .21`
    },
  }
});
userSchema.plugin(passportLocalMongoose);
var User = module.exports = mongoose.model('User', userSchema);
module.exports = User;
