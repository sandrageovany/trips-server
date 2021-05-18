const express = require('express');
const router = express.Router();
const Itinerary = require('../models/itinerary-model');
const fileUpload = require('../configs/cloudinary');

// Show Itinirary details (destinations)
router.get('/trip/:id', async (req, res) => {
  try {
    const itinerary = await Itinerary.findById(req.params.id);
    res.status(200).json(itinerary);
  } catch (e) {
    res.status(500).json(`error occured ${e}`);
  }
});

//Show all itinerary to one user
router.get('/trips', async (req, res) => {
  try {
    res.status(200).json(await Itinerary.find({ user: req.user }));
  } catch (e) {
    res.status(500).json(`error occured ${e}`);
  }
});

//Add new Itinerary
router.post('/trips', async (req, res) => {
  try {
    if (!req.user) {
      res.status(400).json('user must be logged in');
      return;
    }
    
    const itinerary = await Itinerary.create({
      title: req.body.title,
      user: req.user._id,
      destinations: req.body.destinations,
    });
    res.status(200).json(itinerary);
  } catch (e) {
    res.status(400).json(e);
  }
});

//Update new Itinerary
router.put('/trip/:id', async (req, res) => {
  try {
    // check if user is logged in
    if (!req.user) {
      res.status(400).json('user must be logged in');
      return;
    }
    //check if user owns the trip
    const id = req.params.id;
    let trip= await Itinerary.findById(id);
    console.log(trip.user);
    console.log(req.user._id != trip.user)

    // if (req.user.id !== trip.user) {
    //       res.status(400).json('user doesnt match');
    //       return;
    //     }
    
    //Updating the db with what the user entered in the front end
    const itinerary = await Itinerary.findOne({ _id: id })
 
    if (req.body.title) {
      itinerary.title = req.body.title
    }
     
    if (req.body.destinations) {
      itinerary.destinations = req.body.destinations
    }
     
    await itinerary.save()
    
    res.status(200).json(itinerary);
  } catch (e) {
    res.status(400).json(e);
  }
});

// //Add destinations to Itinerary
// router.post('/trip/:id', async (req, res) => {
//   const id = req.params.id;
//   const { name, lat, long } = req.body;
//   if (!name) {
//     res.status(400).json('missing fields');
//     return;
//   }
//   const thisItinerary = Itinerary.findById(id);
//   console.log(req.user);
//   console.log(thisItinerary);
//   if (req.user._id != thisItinerary.user) {
//     res.status(400).json('user doesnt match');
//     return;
//   }
//   try {
//     const response = await Itinerary.findByIdAndUpdate(
//       id,
//       { $push: { destinations: { name, lat, lng } } },
//       { new: true }
//     );
//     res.status(200).json(response);
//   } catch (e) {
//     res.status(500).json(`error occured ${e}`);
//   }
// });

module.exports = router;
