
// src/components/TodoList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'https://crudapi.co.uk/api/v1/bags'; // Replace with your actual endpoint

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Authorization': `Bearer ${process.env.REACT_APP_CRUD_API_KEY}`,
  },
});

const TodoList = () => {
  const [tasks, setTasks] = useState([]);
  const [newTaskName, setNewTaskName] = useState('');

  // Fetch tasks from the API on component mount
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await api.get('/');
        setTasks(response.data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, []);

  // Function to add a new task
  const addTask = async () => {
    if (newTaskName.trim() === '') return; // Prevent adding empty tasks

    const newTask = { name: newTaskName, isCompleted: false };
    try {
      const response = await api.post('/', newTask);
      setTasks((prevTasks) => [...prevTasks, response.data]); // Update state with new task
      setNewTaskName(''); // Clear input after adding
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  // Function to toggle task completion
  const toggleTaskCompletion = async (id, isCompleted) => {
    try {
      await api.patch(`/${id}`, { isCompleted: !isCompleted });
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === id ? { ...task, isCompleted: !isCompleted } : task
        )
      ); // Update local state immediately
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  return (
    <div>
      <h1>Todo List</h1>
      <input
        type="text"
        placeholder="Add new task"
        value={newTaskName}
        onChange={(e) => setNewTaskName(e.target.value)} // Update input value
      />
      <button onClick={addTask}>Add Task</button>

      <ul>
        {tasks.map((task) => (
          <li key={task._id}>
            <span style={{ textDecoration: task.isCompleted ? 'line-through' : 'none' }}>
              {task.name}
            </span>
            <button onClick={() => toggleTaskCompletion(task._id, task.isCompleted)}>
              {task.isCompleted ? 'Mark Incomplete' : 'Mark Complete'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
