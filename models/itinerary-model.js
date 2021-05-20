const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const itinerarySchema = new Schema({
  title: String,
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  destinations: [
    {
      name: String,
      lat: Number,
      lng: Number,
    },
  ],
});

const Itinerary = mongoose.model('Itinerary', itinerarySchema);

module.exports = Itinerary;
