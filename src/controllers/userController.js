const express = require('express');
const Yup = require('yup');

const User = require('../models/user');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    return res.status(200).send({users})    
  } catch (error) {
    return res.status(400).send({error: 'Error loading users'});
  }
});

router.get('/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    return res.status(200).send({user})
    
  } catch (error) {
    return res.status(400).send({error: 'Error loading users'})
  }
});


router.post('/register', async (req, res) => {
  const schema = Yup.object({
    name: Yup.string().required(),
    email: Yup.string().email().required(),
  });

  if (!(await schema.isValid(req.body))) {
    return res.status(400).send({error: 'Validation Fails'});
  }

  const {email} = req.body;
  try {

    if (await User.findOne({email})) {
      return res.status(400).send({error: 'User already exists'});
    }
    const user = await User.create(req.body);

    return res.status(200).send({user})
  } catch (error) {
    return res.status(400).send({error: 'Registration failed'})
  }
});

router.put('/:userId', async (req, res) => {
  const schema = Yup.object({
    name: Yup.string().required(),
    email: Yup.string().email().required(),
  });

  if (!(await schema.isValid(req.body))) {
    return res.status(400).send({error: 'Validation Fails'});
  }
  
  try {
    const {name, email} = req.body;

    const userId = req.params.userId;
    const user = await User.findByIdAndUpdate(userId, {
      name,
      email
    }, {new: true});

    await user.save();

    return res.status(200).send({user})
  } catch (error) {
    return res.status(400).send({error: 'Updated user failed'})
  }
})

router.delete('/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    await User.findByIdAndRemove(userId);
    
    return res.send();
  } catch (error) {
    return res.status(400).send({error: 'Error deleting user'})
  }
})

module.exports = app => app.use('/users', router);