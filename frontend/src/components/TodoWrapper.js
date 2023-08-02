import React, { useState, useEffect } from "react";
import { Todo } from "./Todo";
import { TodoForm } from "./TodoForm";
import { v4 as uuidv4 } from "uuid";
import { EditTodoForm } from "./EditTodoForm";
import fetch from 'isomorphic-fetch';

export const TodoWrapper = () => {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    fetchTodos();
  }, []);

  const addTodo = async (todo) => {

    try{
        const endpoint = "http://192.168.10.3:5001/todo/add";
        const data = {task: todo};

        // @TODO: To get from Cookie in browser
        const token = process.env.REACT_APP_AUTH_TOKEN;
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        };

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(data),
          });
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        await fetchTodos();

        const result = await response.json();
        console.log(result);
    }
    catch (error) 
    {
        console.error('Error adding todo:', error);
        throw error;
    }

    // setTodos([
    //   ...todos,
    //   { task_id: uuidv4(), task: todo, marked: false, isEditing: false },
    // ]);
  }

  const fetchTodos = async() =>{
    
    try
    {
        const endpoint = "http://192.168.10.3:5001/todo";
        const token = process.env.REACT_APP_AUTH_TOKEN;

        console.log(token)

        const headers = {
            'Authorization': `Bearer ${token}`,
          };

        const response = await fetch(endpoint, {
            method: 'GET',
            headers: headers,
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
      
        const responseData = await response.json();

        const todosWithIsEditing = responseData.data.map(todo => ({
            ...todo,
            isEditing: false,
        }));

        setTodos(todosWithIsEditing);
    }
    catch (error) 
    {
        console.error('Error fetching todos:', error);
        throw error;
    }
  }

  const deleteTodo = (id) => setTodos(todos.filter((todo) => todo.task_id !== id));

  const toggleComplete = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.task_id === id ? { ...todo, marked: !todo.marked } : todo
      )
    );
  }

  const editTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.task_id === id ? { ...todo, isEditing: !todo.isEditing } : todo
      )
    );
  }

  const editTask = (task, id) => {
    setTodos(
      todos.map((todo) =>
        todo.task_id === id ? { ...todo, task, isEditing: !todo.isEditing } : todo
      )
    );
  };

  return (
    <div className="TodoWrapper">
      <h1>Finish Brewing!</h1>
      <TodoForm addTodo={addTodo} />
      {}
      {todos.map((todo) =>
        todo.isEditing ? (
          <EditTodoForm editTodo={editTask} task={todo} />
        ) : (
          <Todo
            key={todo.task_id}
            task={todo}
            deleteTodo={deleteTodo}
            editTodo={editTodo}
            toggleComplete={toggleComplete}
          />
        )
      )}
    </div>
  );
};