const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = new Schema({
    title: {type: String, required: true},
    description: String,
    coordinates: {
        latitude: {type: Number, required: true},
        longtitude: {type: Number, required: true},
    },
    photos: []
})

const Event = mongoose.model('Event', eventSchema);
module.exports = Event;