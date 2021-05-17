const express = require('express');
const router = express.Router();
const Itinerary = require('../models/itinerary-model');
const fileUpload= require('../configs/cloudinary');

//Show all itinerary to one user
router.get('/mytrips', async (req, res) => {
  try {
    
    res.status(200).json(await Itinerary.find({ user: req.user}));
  } catch (e) {
    res.status(500).json(`error occured ${e}`);
  }
});

//Show all itineraries by all users
router.get('/trips', async (req, res) => {
  try {
    res.status(200).json(await Itinerary.find());
  } catch (e) {
    res.status(500).json(`error occured ${e}`);
  }
});

router.get('/trip/:id', async (req, res) => {
  try {
    const itinerary = await Itinerary.findById(req.params.id);
    res.status(200).json(itinerary);
  } catch (e) {
    res.status(500).json(`error occured ${e}`);
  }
});


router.post('/trip/:id', async (req, res) => {
  const id = req.params.id;
  const { name, lat, long } = req.body;
  if (!name) {
    res.status(400).json('missing fields');
    return;
  }
  const thisItinerary = Itinerary.findById(id)
  console.log(req.user)
  console.log(thisItinerary)
  if (req.user._id != thisItinerary.user) {
    res.status(400).json('user doesnt match');
    return;
  }
  try {

    const response = await Itinerary.findByIdAndUpdate(id, {$push: {destinations: {name, lat, long}}}, {new: true})
    res.status(200).json(response);
  } catch (e) {
    res.status(500).json(`error occured ${e}`);
  }
});

router.delete('/trip/:id', async (req, res) => {
  try {
    await Project.findByIdAndRemove(req.params.id);
    res.status(200).json(`itinerary with id ${req.params.id} is deleted`);
  } catch (e) {
    res.status(500).json(`error occured ${e}`);
  }
});


router.put('/itinerary/:id', async (req, res) => {
  try {
    const { title, description } = req.body;
    await Itinerary.findByIdAndUpdate(req.params.id, {
      title,
      description
    });
    res.status(200).json(`itinerary with id ${req.params.id} was updated`)
  } catch (e) {
    res.status(500).json(`error occured ${e}`);
  }
});

//Upload image to cloudinary
router.post('/upload', fileUpload.single('file'), (req,res)=>{
  try{
res.status(200).json({fileUrl: req.file.path});
  } catch(e){
    res.status(500).json(`error occured ${e}`);
  }
})

module.exports = router;
