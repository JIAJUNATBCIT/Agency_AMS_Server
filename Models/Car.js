var mongoose = require('mongoose');

var carSchema = mongoose.Schema({
        // The _id property serves as the primary key. If you don't include it
        // the it is added automatically. However, you can add it in if you
        // want to manually include it when creating an object.

        // _id property is created by default when data is inserted.
        car_id: {
            "type" : "string",
            required: [true, 'required']
        },
        model: {
            type: "string",
            required: [true, 'required']
        },
        make: {
            type: "string",
            required: [true, 'required']
        },
        imgurl: {
            type: "string",
        },
        booked_user: {
            "type" : "string",
        },
        office: {
            "type" : "string",
        },
        schedule: {
            "type" : Array,
        },
    },
    {   // Include this to eliminate the __v attribute which otherwise gets added
        // by default.
        versionKey: false
    });
var Car = mongoose.model('Car', carSchema);
module.exports = Car;