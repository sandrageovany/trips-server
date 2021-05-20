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
  const { title, destinations } = req.body;
  console.log("title", title);
  console.log("destinations", destinations)
  try {
    if (!req.user) {
      res.status(400).json('user must be logged in');
      return;
    }
    
    const itinerary = await Itinerary.create({
      title,
      user: req.user,
      destinations: destinations
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
   
     if (req.user._id.toString() !== trip.user._id.toString()) {
           res.status(400).json('user doesnt match');
           return;
    }
    
    //Updating the db with what the user entered in the frontend
    const itinerary = await Itinerary.findOne({ _id: id })
 
    if (req.body.title) {
      itinerary.title =req.body.title
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
