require('dotenv').config()
const express = require('express')
const router = express.Router()
const { dbUserPool } = require('../db/db')
const format = require('pg-format')

const jwt = require('jsonwebtoken')

router.get('/',(req,res) => {
    return res.status(200).json({
        message:"You are in user endpoint"
    })
})

module.exports = router