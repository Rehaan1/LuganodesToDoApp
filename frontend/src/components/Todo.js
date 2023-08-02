import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
export const Todo = ({task, deleteTodo, editTodo, toggleComplete}) => {
 
  return (
    <div className="Todo">
        <p className={`${task.marked ? 'completed' : ""}`} onClick={() => toggleComplete(task.task_id)}>{task.task}</p>
        <div>
        <FontAwesomeIcon icon={faPenToSquare} onClick={() => editTodo(task.task_id)} />
        <FontAwesomeIcon icon={faTrash} onClick={() => deleteTodo(task.task_id)} />
        </div>
    </div>
  )
}