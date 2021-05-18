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
      lat: String,
      lng: String,
    },
  ],
});

const Itinerary = mongoose.model('Itinerary', itinerarySchema);

module.exports = Itinerary;
