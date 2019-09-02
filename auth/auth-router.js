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

router.post('/login', async (req, res) => {
  req.session.isAuthenticated = false
  const { username, password } = req.body
  if (!username || !password) {
    return res.status(400).json({
      error: 'username and password are mandatory DUDE!'
    })
  }
  try {
    // get user from db by username
    const [user] = await db('users').where({ username })
    // use compareSync to check if password matches the stored hashed password
    if (user && bcrypt.compareSync(password, user.password)) {
      req.session.isAuthenticated = true
      return res.status(200).end()
    } else {
      return res.status(401).json({
        error: 'Wrong username or password DUDE!'
      })
    }
  } catch (error) {
    res.status(500).json({
      error: error.message
    })
  }
});

module.exports = router;
