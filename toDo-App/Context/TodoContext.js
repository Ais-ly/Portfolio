import React, { createContext, useState, useEffect, useContext } from "react";
import { getTodoLists } from "../Api/todoList";
import { getTodos, createTodo, updateTodo, deleteTodo } from "../Api/todo";
import { TokenContext, UsernameContext } from "./Context";

export const TodoContext = createContext();

export function TodoProvider({ children }) {
  const [username] = useContext(UsernameContext);
  const [token] = useContext(TokenContext);

  const [lists, setLists] = useState([]);         
  const [todosByList, setTodosByList] = useState({});

  const loadLists = async () => {
    const data = await getTodoLists(username, token);
    setLists(data);
  };

  const loadTodos = async (listId) => {
    const data = await getTodos(listId, token);
    setTodosByList(prev => ({ ...prev, [listId]: data }));
  };


  const addTodo = async (text, listId) => {
    const newTodo = await createTodo(text, listId, token);
    setTodosByList(prev => ({
      ...prev,
      [listId]: [...prev[listId], newTodo]
    }));
  };

  const toggleTodo = async (id, done, listId) => {
    const updated = await updateTodo(id, done, token);
    setTodosByList(prev => ({
      ...prev,
      [listId]: prev[listId].map(t => t.id === id ? updated : t)
    }));
  };


  const removeTodo = async (id, listId) => {
    await deleteTodo(id, token);
    setTodosByList(prev => ({
      ...prev,
      [listId]: prev[listId].filter(t => t.id !== id)
    }));
  };

  useEffect(() => {
    if (token) loadLists();
  }, [token]);

  return (
    <TodoContext.Provider
      value={{
        lists,
        todosByList,
        loadLists,
        loadTodos,
        addTodo,
        toggleTodo,
        removeTodo,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
}
