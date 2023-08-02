require('dotenv').config()
const express = require('express')
const router = express.Router()
const { dbUserPool } = require('../db/db')
const format = require('pg-format')
const bcrypt = require('bcryptjs')
const nodemailer = require('nodemailer');

// Nodemailer configuration
const transporter = nodemailer.createTransport({
    service: 'Gmail', // Use Gmail as the email service
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD
    }
  })

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

                        if(req.body.wallet_address)
                        {
                            const query = format(
                                "SELECT * FROM users WHERE wallet_address = %L",
                                req.body.wallet_address
                            )

                            client.query(query)
                            .then(result => {

                                if (result.rows.length > 0) {
                                    
                                    client.release()
        
                                    return res.status(409).json({
                                      message: "User already exists."
                                    })
                                }

                                const salt = bcrypt.genSaltSync(10)
                                const passwordHash = bcrypt.hashSync(req.body.password, salt)
                                
                                const insertQuery = format(
                                    "INSERT INTO users (email, password, wallet_address, first_name, last_name, address) VALUES (%L, %L, %L, %L, %L, %L) RETURNING *",
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


                            }).catch(err => {
                                client.query("ROLLBACK")
                                client.release()
                                
                                console.log("Error: ", err)
                                return res.status(500).json({
                                    message: "Error Adding User",
                                    error: err
                                })
                            })
                        }
                        else
                        {
                            const salt = bcrypt.genSaltSync(10)
                            const passwordHash = bcrypt.hashSync(req.body.password, salt)
                            
                            const insertQuery = format(
                                "INSERT INTO users (email, password, wallet_address, first_name, last_name, address) VALUES (%L, %L, %L, %L, %L, %L) RETURNING *",
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
                        }
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


  router.post('/metaMask/login',(req,res) => {

    if(!req.body.wallet_address)
    {
        return res.status(400).json({
            message:"Missing Required Body Content"
        })
    }

    const wallet_address = req.body.wallet_address

    dbUserPool.connect()
    .then(client => {
        client.query("BEGIN")
            .then(() => {

                const query = format(
                    "SELECT * FROM users WHERE wallet_address = %L",
                    wallet_address
                )

                client.query(query)
                    .then(result => {

                        if (result.rows.length > 0) {
                            
                            const token = jwt.sign(
                                { userId: result.rows[0].user_id},
                                process.env.JWT_SECRET,
                                { expiresIn: process.env.JWT_EXPIRY }
                              )
                
                              client.release()
                              return res.status(200).json({
                                message: "Login successful",
                                token: token
                              })
                        }
                        
                        
                        const insertQuery = format(
                            "INSERT INTO users (wallet_address) VALUES (%L) RETURNING *",
                            wallet_address
                        )

                        client.query(insertQuery)
                            .then(insertResult => {
                                
                                client.query("COMMIT")

                                const token = jwt.sign(
                                    { userId: insertResult.rows[0].user_id},
                                    process.env.JWT_SECRET,
                                    { expiresIn: process.env.JWT_EXPIRY }
                                  )
                    
                                  client.release()
                                  return res.status(200).json({
                                    message: "Login successful",
                                    token: token
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

router.post('/recover-password',(req,res)=> {
    
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
                  message: "Email does not exists"
                })
              }

              const newPassword = generateRandomPassword();
              const salt = bcrypt.genSaltSync(10)
              const passwordHash = bcrypt.hashSync(newPassword, salt)
              
              const updateQuery = format(
                  "UPDATE users SET password = %L WHERE email = %L",
                  passwordHash,
                  email
              )

              client.query(updateQuery)
                .then(result => {


                    
                    const mailOptions = {
                        from: process.env.EMAIL,
                        to: email,
                        subject: 'Password Recovery',
                        text: `Your new password: ${newPassword}`
                    }

                    transporter.sendMail(mailOptions, (err, info) => {
                        if (err)
                        {
                            client.query("ROLLBACK")
                            client.release()
                            console.log(" Mailing Error: ", err)

                            return res.status(500).json({
                                message: "Mailing error",
                                error: err
                            })
                        } 
                        return res.status(200).json({
                            message: "Password Recovery Mail Sent"
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

function generateRandomPassword() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let newPassword = '';
    for (let i = 0; i < 8; i++) {
      newPassword += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return newPassword;
  }

module.exports = router