require('dotenv').config()

const express = require('express')
const router = express.Router()
const { dbUserPool } = require('../db/db')
const format = require('pg-format')
const bcrypt = require('bcryptjs')

const jwt = require('jsonwebtoken')

router.get('/',(req,res) => {
    return res.status(200).json({
        message:"You are in user endpoint"
    })
})

router.post('/email/register',(req,res) => {

    if(!req.body.email)
    {
        return res.status(400).json({
            message:"Missing Required Body Content"
        })
    }

    if(!req.body.password)
    {
        return res.status(400).json({
            message:"Missing Required Body Content"
        })
    }

    if(!req.body.first_name)
    {
        return res.status(400).json({
            message:"Missing Required Body Content"
        })
    }

    if(!req.body.last_name)
    {
        return res.status(400).json({
            message:"Missing Required Body Content"
        })
    }

    if(!req.body.address)
    {
        return res.status(400).json({
            message:"Missing Required Body Content"
        })
    }

    

    const email = req.body.email
    const first_name = req.body.first_name
    const last_name = req.body.last_name
    const address = req.body.address

    dbUserPool.connect()
    .then(client => {
        client.query("BEGIN")
            .then(() => {

                const query = format(
                    "SELECT * FROM users WHERE email = %L",
                    email
                )

                client.query(query)
                    .then(result => {

                        if (result.rows.length > 0) {
                            
                            client.release()

                            return res.status(409).json({
                              message: "Email already exists"
                            })
                        }
                        
                        const salt = bcrypt.genSaltSync(10)
                        const passwordHash = bcrypt.hashSync(req.body.password, salt)
                        
                        const insertQuery = format(
                            "INSERT INTO users (email, password, wallet_address, first_name, last_name, address) VALUES (%L, %L, %L, %L) RETURNING *",
                            email,
                            passwordHash,
                            req.body.wallet_address || null,
                            first_name,
                            last_name,
                            address
                        )

                        client.query(insertQuery)
                            .then(insertResult => {
                                client.query("COMMIT")
                                client.release()

                                return res.status(200).json({
                                    message: "User added successfully"
                                  })
                            }).catch(err => {
                                client.query("ROLLBACK")
                                client.release()
                                
                                console.log("Error: ", err)
                                return res.status(500).json({
                                    message: "Error Adding User",
                                    error: err
                                })
                            })
                        
                    })
                    .catch(err => {
                        client.query("ROLLBACK")
                        client.release()

                        console.log("Error: ", err)
                        return res.status(500).json({
                            message: "Query error",
                            error: err
                        })
                    })
            })
            .catch(err => {
                console.log("Error: ", err)
                client.release()

                return res.status(500).json({
                    message: "Database transaction error",
                    error: err
                })
            })
    })
    .catch(err => {
        console.log(err)
        return res.status(200).json({
            message: "Database Connection Error",
            error: err
        })
    })

})


router.post('/email/login', (req, res) => {
    
    if ( !req.body.password) {
      return res.status(400).json({
        message: "Missing Required Body Content"
      })
    }

    if ( !req.body.email) {
        return res.status(400).json({
          message: "Missing Required Body Content"
        })
      }
  
    const email = req.body.email
  
    dbUserPool.connect()
      .then(client => {
        client.query("BEGIN")
          .then(() => {
            const query = format(
              "SELECT * FROM users WHERE email = %L",
              email
            )
  
            client.query(query)
              .then(result => {
                
                if (result.rows.length === 0) {
                  client.release()

                  return res.status(401).json({
                    message: "Email or password is incorrect"
                  })
                }
  
                const user = result.rows[0]
                const passwordMatch = bcrypt.compareSync(req.body.password, user.password)
  
                if (!passwordMatch) {
                  client.release()

                  return res.status(401).json({
                    message: "Email or password is incorrect"
                  })
                }
  
                
                const token = jwt.sign(
                  { userId: user.user_id},
                  process.env.JWT_SECRET,
                  { expiresIn: process.env.JWT_EXPIRY }
                )
  
                client.release()
                return res.status(200).json({
                  message: "Login successful",
                  token: token
                })
              })
              .catch(err => {
                client.query("ROLLBACK")
                client.release()
                console.log("Error: ", err)
                return res.status(500).json({
                  message: "Query error",
                  error: err
                })
              })
          })
          .catch(err => {
            console.log("Error: ", err)
            client.release()
            return res.status(500).json({
              message: "Database transaction error",
              error: err
            })
          })
      })
      .catch(err => {
        console.log(err)
        return res.status(500).json({
          message: "Database Connection Error",
          error: err
        })
      })
  })

module.exports = router