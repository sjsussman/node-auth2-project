const express = require('express')
const router = express.Router();
const bcrypt = require('bcryptjs') // bcrypt to hash user password on requests
const jwt = require('jsonwebtoken') // for token creation / managment
const Users = require('./userModel');
const { jwtSecret } = require('../data/secrets.js');
const accessGuard = require('../restrictionMW')

router.get('/', (req, res) => {
    res.json({ api : 'running'})
})

router.get('/users', accessGuard, (req, res) => {
    Users.find()
    .then(users => {
        res.status(200).json(users)
    })
    .catch(err => res.send(err))
})

router.post('/register', (req, res) => {
    const credentials = req.body
    if(credentials) {
        const hashCycles = process.env.HASH_CYCLES || 10;
        const hash = bcrypt.hashSync(credentials.password, hashCycles)
        credentials.password = hash;
        Users.add(credentials)
            .then(user => {
                res.status(201).json({
                    data: user
                })
            })
            .catch(error => {
                res.json(500).json({
                    message: error.message
                })
            })
    } else {
        res.status(400).json({
            message: "please provide a username and password that meets our guidelines"
        })
    }
})

router.post('/login', (req, res) => {
    const { username, password } = req.body;

    if({ username, password }) {
        Users.findBy({ username: username })
        .then(([user]) => {
            if(user && bcrypt.compareSync(password, user.password)) {
                const token = createToken(user)
                res.status(200).json({
                    message: 'You have successfully logged in', token
                })
            } else {
                res.status(401).json({
                    message: 'Invalid Credentials'
                })
            }
        })
        .catch(error => {
            res.status(500).json({
                message: error.message
            })
        })
    } else {
        res.status(400).json({
            message: ' please provide an exisiting username and password combination'
        })
    }
})

function createToken(user) {
    const payload = {
        subject: user.id,
        username: user.username,
    }
    const options = {
        expiresIn: '60 seconds'
    }
    return jwt.sign(payload, jwtSecret, options)
}

module.exports = router;