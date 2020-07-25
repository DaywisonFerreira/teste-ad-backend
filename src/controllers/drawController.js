const express = require('express');
const User = require('../models/user');
const sortArray = require('../util/sortArray');
const Mail = require('../lib/Mail');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const users = await User.find();

    if(users.length < 3) {
      return res.status(400).send({
        error: 'Para realizar o sorteio deve ter pelo menos 3 pessoas cadastradas'
      });
    }
    const allParticipants = users.map(user => {
     return {
       name: user.name,
       email: user.email
     } 
    });
    const sortedUsers = sortArray(allParticipants);

    const allUsers = [];
    allUsers.push({
      name: sortedUsers[sortedUsers.length - 1].name,
      email: sortedUsers[sortedUsers.length - 1].email,
      friend: sortedUsers[0].name
    })
    for(let i = 0; i < sortedUsers.length - 1; i++) {
      allUsers.push({
        name: sortedUsers[i].name,
        email: sortedUsers[i].email,
        friend: sortedUsers[i + 1].name
      })
    }

    const usersUpdated = await Promise.all(allUsers.map(async user => {
      return await User.findOneAndUpdate({name: user.name}, {
        friend: user.friend
      });
    }));
    
    allUsers.map(async user => {
      await Mail.sendMail({
        to: `${user.name} <${user.email}>`,
        subject: 'Sorteio de amigo secreto',
        text: `Você tirou ${user.friend}`
      })
    });    

    return res.status(200).json({usersUpdated})
      
  } catch (error) {
    return res.status(400).send({error});
  }
});


module.exports = app => app.use('/draw', router);