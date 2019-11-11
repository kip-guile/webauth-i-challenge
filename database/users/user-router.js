const express = require('express')
const bcrypt = require('bcryptjs')

const Users = require('./user-model')

const router = express.Router()

router.get('/', (req, res) => {
    res.send("It's alive!");
  });

router.post('/register', (req, res) => {
    let user = req.body;
    const hash = bcrypt.hashSync(user.password, 11)
    const newUser = {
        username: req.body.username,
        password: hash,
    };

    Users.add(newUser)
        .then(saved => {
        res.status(201).json(saved);
        })
        .catch(error => {
        res.status(500).json(error);
        });
});

router.post('/login', (req, res) => {
    let { username, password } = req.body;
  
    Users.findBy({ username })
      .first()
      .then(user => {
        if (user && bcrypt.compareSync(password, user.password)) {
          res.status(200).json({ message: `Welcome ${user.username}!` });
        } else {
          res.status(401).json({ message: 'Invalid Credentials' });
        }
      })
      .catch(error => {
        res.status(500).json(error);
      });
  });

function restricted(req, res, next) {
    const {username, password} = req.headers

    if(username && password) {
    Users.findBy({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        next();
      } else {
        res.status(401).json({ message: 'Invalid Credentials' });
      }
    })
    .catch(error => {
      res.status(500).json({ message: error.message });
    })
    } else {
        res.status(400).json({ message: 'No credentials provided' });
    }
}

module.exports = router;