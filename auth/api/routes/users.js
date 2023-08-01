require('dotenv').config()

const express = require('express')
const router = express.Router()
const { dbUserPool } = require('../db/db')
const format = require('pg-format')
const tokenCheck = require('../middlewares/tokenCheck')


router.get('/user', tokenCheck, (req,res) => {

    dbUserPool.connect()
    .then(client => {
        client.query("BEGIN")
            .then(() => {

                const query = format(
                    "SELECT name, email, wallet_address FROM users WHERE user_id = %L",
                    req.userId
                )

                client.query(query)
                    .then(result => {

                        if (result.rows.length == 0) {
                            
                            client.release()

                            return res.status(409).json({
                              message: "No User Data"
                            })
                        }
                        
                        client.release()
                        return res.status(200).json({
                            message: "Login successful",
                            data: result.rows[0]
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

module.exports = router