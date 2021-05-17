const express = require('express');
const Itinerary = require('../models/itinerary-model');
const router = express.Router();
// const fileUpload= require('../configs/cloudinary');
// const Destination = require('../models/destination-model');

router.get('/mytrip/:itineraryId/destinations', async (req, res) => {
  const itineraryId = req.params.itineraryId;
  try {
    const itinerary = await Itinerary.findById(itineraryId);
    res
      .status(200)
      .json(itinerary);
  } catch (e) {
    res.status(500).json(`error occured ${e}`);
  }
});

router.post('/destinations/:itineraryId/add', async (req, res) => {
  const id = req.params.itineraryId;
  const { name, lat, long } = req.body;

  if (!req.user) {
    res.status(400).json('user must be logged in');
    return;
  }
  const thisItinerary = await Itinerary.findById(id).populate('user');

  if (req.user.username != thisItinerary.user.username) {
    res.status(400).json('user doesnt match');
    return;
  }
  try {
    const response = await Itinerary.findByIdAndUpdate(
      id,
      { $push: { destinations: { name, lat, long, user: req.user } } },
      { new: true }
    );
    res.status(200).json(response);
  } catch (e) {
    res.status(500).json(`error occured ${e}`);
  }
});

router.post(
  '/destinations/:itineraryId/delete/:destinationId',
  async (req, res) => {
   let intineraryId=req.params.itineraryId
    let destinationId=req.params.destinationId
    try {
      res
        .status(200)
        .json(
          await Itinerary.findByIdAndUpdate(destinationId, {
            destinations: { isDeleted: true },
          })
        );
    } catch (e) {
      res.status(500).json(`error occured ${e}`);
    }
  }
);

module.exports = router;
