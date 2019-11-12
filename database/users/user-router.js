const express = require('express')
const bcrypt = require('bcryptjs')

const Users = require('./user-model')

const router = express.Router()

router.get('/', (req, res) => {
    res.send("It's alive!");
  });

router.delete('/logout', (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        res.json('you can not leave, actually')
      } else {
        res.json('goodbye, sad to see you go')
      }
    })
  } else {
    res.end();
  }
})

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
          req.session.user = user;
          res.status(200).json({ message: `Welcome ${user.username}!` });
        } else {
          res.status(401).json({ message: 'Invalid Credentials' });
        }
      })
      .catch(error => {
        res.status(500).json(error);
      });
  });


  router.get('/users', restricted, (req, res) => {
    // we don't know about sessions/cookies
    // we don't know about jwts 
    // ?
    // WE NEED TO PROVIDE CREDENTIALS EVERY TIME ?????
    Users.find()
      .then(users => {
        res.json(users);
      })
      .catch(err => res.send(err));
  });

function restricted(req, res, next) {

    if(req.session && req.session.user) {
        next();
    } else {
        res.status(400).json({ message: 'No credentials provided' });
    }
}

module.exports = router;