var mongoose = require('mongoose');

var ticketSchema = mongoose.Schema({
        // The _id property serves as the primary key. If you don't include it
        // the it is added automatically. However, you can add it in if you
        // want to manually include it when creating an object.

        // _id property is created by default when data is inserted.
        ticket_id: {
            "type" : "string",
            required: [true, 'required']
        },
        username: {
            "type" : "string",
            required: [true, 'required']
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
        date: {
            "type" : "string",
            required: [true, 'required']
        },
        description: {
            "type" : "string",
            required: [true, 'required']
        },
        assigned_name: {
            "type" : "string",
        },
        assigned_email: {
            "type" : "string",
        },
        assigned_phone: {
            "type" : "string",
        },
        status: {
            "type" : "string",
            enum : ['Pending', 'In Progress', 'On Hold', 'Closed'],
            default: 'Pending'
        },
        admin_note : {
            "type" : "string",
        },
        downloadJson : [{filename: String, fileDisplayName: String, filesize: Number}]
    },
    {   // Include this to eliminate the __v attribute which otherwise gets added
        // by default.
        versionKey: false
    });
var Ticket    = mongoose.model('Ticket', ticketSchema);
module.exports = Ticket;