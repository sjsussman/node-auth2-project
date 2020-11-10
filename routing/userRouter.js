const express = require('express')
const router = express.Router();
const bcrypt = require('bcryptjs') // bcrypt to hash user password on requests
const secure = require('../authorization-MW.js')

const Users = require('./userModel');

router.get('/', (req, res) => {
    res.json({ api : 'running'})
})

router.get('/users', secure, (req, res) => {
    Users.find()
    .then(users => {
        res.status(200).json(users)
    })
    .catch(err => res.send(err))
})

router.post('/register', async (req, res) => {
    try{
        const { username, password } = req.body
        const hash = bcrypt.hashSync(password, 10)
        const user = { username, password: hash }
        const addedUser = await Users.add(user)
        res.json(addedUser)
    } catch(err) {
        res.status(500).json({
            message: err.message
        })
    }
})

router.post('/login', async (req, res) => {
    try {
        const [user] = await Users.findBy({ username: req.body.username })
        if(user && bcrypt.compareSync(req.body.password, user.password)){
            req.session.user = user
            res.json({
                message: `Welcome back, ${user.username}`
            })
        } else {
            res.status(401).json({
                message: 'You shall not pass!'
            })
        }
    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
})

module.exports = router;