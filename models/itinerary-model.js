const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const itinerarySchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  destinations: [
    {
      name: String,
      lat: String,
      long: String,
      isDeleted: {
        type: Boolean,
        default: false
      }
    }
  ],
 
});

const Itinerary = mongoose.model('Itinerary', itinerarySchema);

module.exports = Itinerary;
