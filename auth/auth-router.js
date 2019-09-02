const router = require('express').Router();
const bcrypt = require('bcryptjs');
const db = require('../database/dbConfig');

router.post('/register', async (req, res) => {
  const { username, password } = req.body
  if (!username || !password) {
    return res.status(400).json({
      error: 'username and password are mandatory DUDE!'
    })
  }
  try {
    // hash password synchronously
    const hash = bcrypt.hashSync(password, 10)
    // insert user's username and hashed password into db
    const [id] = await db('users').insert({ username, password: hash })
    // get user just added to db
    const [user] = await db('users').where({ id })
    // return the user that was added
    return res.status(201).json(user)
  } catch (err) {
    res.status(500).json({
      error: err.message
    })
  }
});

router.post('/login', (req, res) => {
  // implement login
});

module.exports = router;
