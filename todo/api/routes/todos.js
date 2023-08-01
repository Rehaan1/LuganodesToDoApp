require('dotenv').config()

const express = require('express')
const router = express.Router()
const format = require('pg-format')
const { dbUserPool } = require('../db/db')
const tokenCheck = require('../middlewares/tokenCheck')



router.get('/', tokenCheck, (req,res) =>{
    
    const userId = req.userId

    dbUserPool.connect()
    .then(client => {
        client.query("BEGIN")
            .then(() => {

                const query = format(
                    "SELECT * FROM todo WHERE user_id = %L",
                    userId
                )

                client.query(query)
                    .then(result => {
                        client.query("COMMIT")
                        client.release()

                        return res.status(200).json({
                            message: "Todos Retrieved Successfully",
                            data: result.rows
                        })
                    })
                    .catch(err => {
                        client.query("ROLLBACK")
                        console.log("Error: ", err)
                        client.release()
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

router.post('/add', tokenCheck,(req,res)=>{

    if(!req.body.task)
    {
        return res.status(400).json({
            message:"Missing Required Body Content"
        })
    }

    const userId = req.userId

    const task = req.body.task

    dbUserPool.connect()
        .then(client => {
            client.query("BEGIN")
            .then(()=>{

                const query = format(
                    "INSERT INTO todo (user_id, task) VALUES (%L, %L) RETURNING *",
                    userId, task
                )

                client.query(query)
                    .then(result =>{

                        client.query("COMMIT")
                        client.release()
                        return res.status(200).json({
                            message: "Data Inserted Successfully"
                        })
                    })
                    .catch(err => {
                        client.query("ROLLBACK")
                        client.release()
                        console.log("Error: ", err)
                        
                        return res.status(500).json({
                            message: "Query error",
                            error:err
                          })
                    })

            })
            .catch(err => {
                console.log("Error: ", err)
                client.release()
                return res.status(500).json({
                    message: "Database transaction error",
                    error:err
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


router.delete('/remove',tokenCheck, (req, res) => {

    if (!req.body.taskId) {
        return res.status(400).json({
            message: "Missing Required Body Content"
        })
    }

    const userId = req.userId

    const taskId = req.body.taskId

    dbUserPool.connect()
        .then(client => {
            client.query("BEGIN")
                .then(() => {
                    
                    const query = format(
                        "DELETE FROM todo WHERE user_id = %L AND task_id = %L RETURNING *",
                        userId, taskId
                    )

                    client.query(query)
                        .then(result => {
                            client.query("COMMIT")
                            client.release()
                            if (result.rowCount === 0) {
                                
                                return res.status(404).json({
                                    message: "Todo Not Found or User Unauthorized"
                                })
                            }

                            return res.status(200).json({
                                message: "Todo Deleted Successfully",
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


router.patch('/update/mark', tokenCheck, (req, res) => {
    
    if (!req.body.taskId) {
        return res.status(400).json({
            message: "Missing Required Body Content"
        })
    }

    const userId = req.userId

    const taskId = req.body.taskId

    dbUserPool.connect()
        .then(client => {
            client.query("BEGIN")
                .then(() => {
                    
                    const query = format(
                        "UPDATE todo SET marked = NOT marked WHERE user_id = %L AND task_id = %L RETURNING *",
                        userId, taskId
                    )

                    client.query(query)
                        .then(result => {
                            client.query("COMMIT")
                            client.release()
                            if (result.rowCount === 0) {
                                
                                return res.status(404).json({
                                    message: "Todo Not Found or User Unauthorized"
                                })
                            }

                            return res.status(200).json({
                                message: "Todo Marked/Unmarked Successfully",
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

router.patch('/update/task', tokenCheck, (req, res) => {
    
    if (!req.body.task) {
        return res.status(400).json({
            message: "Missing Required Body Content"
        })
    }

    if (!req.body.taskId) {
        return res.status(400).json({
            message: "Missing Required Body Content"
        })
    }
    
    const userId = req.userId

    const taskId = req.body.taskId
    const updatedTask = req.body.task

    dbUserPool.connect()
        .then(client => {
            client.query("BEGIN")
                .then(() => {
                   
                    const query = format(
                        "UPDATE todo SET task = %L WHERE user_id = %L AND task_id = %L RETURNING *",
                        updatedTask, userId, taskId
                    )

                    client.query(query)
                        .then(result => {
                            client.query("COMMIT")
                            client.release()
                            if (result.rowCount === 0) {
                                
                                return res.status(404).json({
                                    message: "Todo Not Found or User Unauthorized"
                                })
                            }

                            return res.status(200).json({
                                message: "Task Updated Successfully",
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