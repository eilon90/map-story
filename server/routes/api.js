const express = require('express');
const router = express.Router();
const moment = require('moment');
const cloudinary = require('cloudinary').v2;
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const secret = 'secretMapStory';

router.use(express.json());
router.use(express.urlencoded({extended: false}));

const Story = require('../models/Story');
const Event = require('../models/Event');
const User = require('../models/User');

cloudinary.config({
    cloud_name: 'eilon90',
    api_key: '412834783134165',
    api_secret: 'KL9B1WJEtLAMl2TlhHbcYpKw6YE'
})

router.get('/user/:userId', async function(req, res) {
    const {userId} = req.params;
    const user = await User.findById(userId);
    res.send(user);
})

router.get('/watchedUser/:userId', async function(req, res) {
    const {userId} = req.params;
    const user = await User.findById(userId);
    const { password, email, stories, ...newData } = user.toObject()
    const filteredStories = user.stories.filter(s => s.private !== true);
    newData.stories = filteredStories;
    res.send(newData);
})

// router.get('/countries', async function(req, res) {
//     const result = await axios.get('https://restcountries.eu/rest/v2/all');
//     const countries = result.data.map(d => d.name)
//     res.send(countries);
// })

router.get('/bounds/:country', async function(req,res) {
    const result = await axios.get(`https://api.opencagedata.com/geocode/v1/json?q=${req.params.country}&key=91ffffa3e2f84a4f8ce2f9763bc49bce&pretty=1`);
    const data = result.data;
        const bounds = [
            [data.results[0].bounds.northeast.lat, data.results[0].bounds.northeast.lng],
            [data.results[0].bounds.southwest.lat, data.results[0].bounds.southwest.lng]
        ]
    res.send(bounds);
})

router.get('/search/:country/:address', async function(req, res) {
    const country = req.params.country;
    const address = req.params.address;
    const searching = await axios.get(`https://api.opencagedata.com/geocode/v1/json?q=${address}, ${country}&key=91ffffa3e2f84a4f8ce2f9763bc49bce&pretty=1`);
    const data = searching.data;
    if (data.results[0].confidence === 1) {
        res.send({error: true});
    }
    else {
        const results = data.results.map(d => {return {longtitude: d.geometry.lng, latitude: d.geometry.lat}});
        res.send(results);
    }
})

router.get('/search/users', async function (req, res) {
    const {q, firstName, lastName} = req.query;
    try {
        if (q) {
            const re = new RegExp(`.*${q}.*`, 'i');
            const users = await User.find({ $or: [{firstName: {$regex: re}}, {lastName: {$regex: re}}]}, {firstName: 1, lastName: 1});
            res.send(users);
        } else {
            const firstRe = new RegExp(`.*${firstName}.*`, 'i');
            const lastRe = new RegExp(`.*${lastName}.*`, 'i');
            const users = await User.find({firstName: {$regex: firstRe}, lastName: {$regex: lastRe}}, {firstName: 1, lastName: 1});
            res.send(users);
        }
    }
    catch (err) {
        res.status(401).send(err.message);
    }
})

router.get('/search/stories', async function (req, res) {
    const {q} = req.query;
    try {
        const re = new RegExp(`.*${q}.*`, 'i');
        const results = await User.find({stories: {$elemMatch: {title: re}}}, {firstName: 1, lastName: 1, stories: 1});
        const resultsForSending = [];
        results.forEach(r => {
            const stories = r.stories.filter(s => s.title.toLowerCase().includes(q.toLowerCase()));
            stories.forEach(s => {
                const story = {
                storyTitle: s.title,
                storyId: s._id,
                userId: r._id,
                userName: `${r.firstName} ${r.lastName}`
            }
            resultsForSending.push(story);
        })})
        res.send(resultsForSending);
    }
    catch (err) {
        res.status(401).send(err.message);
    }
})

router.post('/user', async function(req, res) {
    const u1 = new User({...req.body});
    const emailInUse = await User.find({email: u1.email});
    if (emailInUse[0]) {
        res.send({error: 'Email already in use'});
        return;
    }
    const user = await u1.save();
    res.send(user._id);
})

router.post('/story/:userId', async function(req, res) {
    const s1 = new Story({...req.body});
    const {userId} = req.params;
    await User.findByIdAndUpdate(userId, {$push: {stories: s1}}, {new: true});
    res.end();
})

router.post('/event/:userId/:storyId', async function(req, res) {
    const e1 = new Event({...req.body});
    const userId = req.params.userId;
    const storyId = `${req.params.storyId}`;
    const user = await User.findById(userId);
    const stories = user.stories;
    stories.find(s => s._id == storyId).events.push(e1);
    await User.findByIdAndUpdate(userId, {stories: stories}, {new: true});
    res.end();
})

router.post('/changeStory/:userId/:storyId', async function(req, res) {
    const stories = [];
    const s1 = new Story({...req.body});
    const userId = req.params.userId;
    const storyId = `${req.params.storyId}`;
    const user = await User.findById(userId);
    user.stories.forEach(s => stories.push(s));
    const index = stories.indexOf(stories.find(s => s._id == storyId));
    stories[index] = s1;
    await User.findByIdAndUpdate(userId, {stories: stories}, {new: true});
    res.end();
})

router.post('/authenticate', async function(req, res) {
    const { email, password } = req.body;
    await User.findOne({ email }, function(err, user) {
        if (err) {
            console.error(err);
            res.status(500).send({error: 'Internal error please try again'});
        } 
        else if (!user) {
            res.status(401).send({error: 'Incorrect email or password'});
        } 
        else {
        user.isCorrectPassword(password, function(err, same) {
          if (err) {res.status(500).send({error: 'Internal error please try again'});
          } 
          else if (!same) {
              res.status(401).send({error: 'Incorrect email or password'})
            } 
          else {
            const payload = { email };
            const token = jwt.sign(payload, secret, {expiresIn: '1h'});
            res.cookie('token', token, { httpOnly: true }).send(user._id);
            }
        });
      }
    });
  });

router.delete('/story/:userId/:storyId', async function(req, res) {
    const stories = [];
    const userId = req.params.userId;
    const storyId = `${req.params.storyId}`;
    try {
        const user = await User.findById(userId);
        user.stories.forEach(s => stories.push(s));
        const index = stories.indexOf(stories.find(s => s._id == storyId));
        stories.splice(index, 1);
        await User.findByIdAndUpdate(userId, {stories: stories}, {new: true});
        res.end();
    }
    catch (err) {
        res.send(err.message)
    }
})

// router.post('/image', async function(req, res) {
//     const image = req.body.image;
//     console.log(image);
//     const newFormData = new FormData();
//     newFormData.append('file', image);
//     newFormData.append('upload_preset', 'eilon90_map_story');
//     const result = await axios.post('https://api.cloudinary.com/v1_1/eilon90/image/upload', newFormData);
//     res.send(result.data);
// })

router.post('/coors/:userId/:storyId/:eventId', async function (req, res) {
    const coors = req.body;
    const userId = req.params.userId;
    const storyId = req.params.storyId;
    const eventId = req.params.eventId;
    const user = await User.findById(userId);
    const stories = user.stories;
    stories.find(s => s._id == storyId).events.find(e => e._id == eventId).coordinates = coors;
    await User.findByIdAndUpdate(userId, {stories: stories}, {new: true});
    res.end();
})

router.post('/deleteImage', async function(req, res) {
    let imageId = req.body.imageId;
    await cloudinary.uploader.destroy(imageId, function(err, result) {
        res.send(result)
    });
})

module.exports = router;