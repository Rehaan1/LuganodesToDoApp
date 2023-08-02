import React, { useState, useEffect } from "react";
import { Todo } from "./Todo";
import { TodoForm } from "./TodoForm";
import { v4 as uuidv4 } from "uuid";
import { EditTodoForm } from "./EditTodoForm";
import fetch from 'isomorphic-fetch';
import Cookies from 'js-cookie';

export const TodoWrapper = () => {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    fetchTodos();
  }, []);

  const addTodo = async (todo) => {

    try{
        const endpoint = "http://todo:5001/todo/add";
        const data = {task: todo};

        var token =  Cookies.get('jwtToken');
       
        if (!token) {
            token = ""
          }

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        };

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(data),
          });
        
        if (response.status === 401) {
            
            console.error('Unauthorized access: JWT token is invalid or expired');
            
            //@TODO: add Redirect
            return;
        }

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
  }

  const fetchTodos = async() =>{
    
    try
    {
        const endpoint = "http://todo:5001/todo";
        var token =  Cookies.get('jwtToken');

        if (!token) {
            token = ""
          }

        const headers = {
            'Authorization': `Bearer ${token}`,
          };

        const response = await fetch(endpoint, {
            method: 'GET',
            headers: headers,
        });

        if (response.status === 401) {
            
            console.error('Unauthorized access: JWT token is invalid or expired');
            
            //@TODO: add Redirect
            return;
        }

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

  const deleteTodo = async (id) =>{
    try
    {
        const endpoint = "http://todo:5001/todo/remove";
        const data = { taskId: id };
        var token =  Cookies.get('jwtToken');

        if (!token) {
            token = ""
          }

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          };

        const response = await fetch(endpoint, {
            method: 'DELETE',
            headers: headers,
            body: JSON.stringify(data),
          });

        if (response.status === 401) {
            
            console.error('Unauthorized access: JWT token is invalid or expired');
            
            //@TODO: add Redirect
            return;
        }

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        await fetchTodos();

        const result = await response.json();
        console.log(result);
    }
    catch (error) 
    {
        console.error('Error deleting todo:', error);
        throw error;
    }
  }

  const toggleComplete = async (id) => {

    console.log(id)

    try
    {
        const endpoint = "http://todo:5001/todo/update/mark";
        const data = { taskId: id };
        var token =  Cookies.get('jwtToken');

        if (!token) {
            token = ""
          }

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        };

        const response = await fetch(endpoint, {
            method: 'PATCH',
            headers: headers,
            body: JSON.stringify(data),
        });

        if (response.status === 401) {
            
            console.error('Unauthorized access: JWT token is invalid or expired');
            
            //@TODO: add Redirect
            return;
        }

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        await fetchTodos();

        const result = await response.json();
        console.log(result);
    }
    catch (error) 
    {
        console.error('Error toggling completion:', error);
        throw error;
    }
  }

  const editTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.task_id === id ? { ...todo, isEditing: !todo.isEditing } : todo
      )
    );
  }

  const editTask = async (task, id) => {
    
    try
    {
        const endpoint = "http://todo:5001/todo/update/task";
        const data = { taskId: id, task: task };
        var token =  Cookies.get('jwtToken');

        if (!token) {
            token = ""
          }

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        };

        const response = await fetch(endpoint, {
            method: 'PATCH',
            headers: headers,
            body: JSON.stringify(data),
        });


        if (response.status === 401) {
            
            console.error('Unauthorized access: JWT token is invalid or expired');
            
            //@TODO: add Redirect
            return;
        }

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        await fetchTodos();

        setTodos(
            todos.map((todo) =>
                todo.task_id === id ? { ...todo, task, isEditing: !todo.isEditing } : todo
            )
        );

        const result = await response.json();
        console.log(result);
    
    }
    catch (error) 
    {
      console.error('Error editing task:', error);
      throw error;
    }
    
   
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