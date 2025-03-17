// List.jsx
import React, { useState, useContext, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ThemeContext } from '../ThemeContext';
import './TodoList.css';

const List = (props) => {
    const { theme } = useContext(ThemeContext);
    const [listName, setListName] = useState("");
    const [todos, setTodos] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);
    
    // Load todos from localStorage
    useEffect(() => {
        const storedTodos = localStorage.getItem(`todos-${props.lName}`);
        if (storedTodos) {
            setTodos(JSON.parse(storedTodos));
        }
    }, [props.lName]);
    
    // Save todos to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem(`todos-${props.lName}`, JSON.stringify(todos));
    }, [todos, props.lName]);

    const HandleAddList = () => {
        if (listName.trim() !== '') {
            if (isEditing && editingId) {
                // Update existing todo
                const newTodos = todos.map((t) => {
                    if (t.uID === editingId) {
                        return { ...t, lname: listName };
                    }
                    return t;
                });
                setTodos(newTodos);
                setIsEditing(false);
                setEditingId(null);
            } else {
                // Add new todo
                setTodos([...todos, { 
                    lname: listName, 
                    uID: uuidv4(), 
                    isCompleted: false,
                    createdAt: new Date().toISOString()
                }]);
            }
            setListName('');
        }
    }

    const HandleCheckBox = (e) => {
        const newTodos = todos.map((t) => {
            if (t.uID === e.target.id) {
                return { ...t, isCompleted: !t.isCompleted };
            }
            return t;
        });
        setTodos(newTodos);
    };

    const HandleDelete = (id) => {
        setTodos(todos.filter((t) => t.uID !== id));
    };

    const HandleEdit = (id) => {
        const itm = todos.find((t) => t.uID === id);
        if (itm) {
            setListName(itm.lname);
            setIsEditing(true);
            setEditingId(id);
        }
    };

    const HandleKeyPress = (e) => {
        if (e.key === 'Enter') {
            HandleAddList();
        }
    };

    return (
        <div className={`list-card ${theme}`}>
            <h2 className="list-title">{props.lName}</h2>
            
            <div className="todos-container">
                {todos.length > 0 ? (
                    todos.map((t) => (
                        <div className="todo-item fade-in" key={t.uID}>
                            <input 
                                type="checkbox" 
                                checked={t.isCompleted}
                                id={t.uID}
                                onChange={HandleCheckBox}
                                className="todo-checkbox"
                            />
                            <span 
                                className={`todo-label ${t.isCompleted ? 'todo-completed' : ''}`}
                                onClick={() => document.getElementById(t.uID).click()}
                            >
                                {t.lname}
                            </span>
                            <div className="todo-actions">
                                <button 
                                    className={`todo-action-btn ${t.isCompleted ? 'disabled' : ''}`}
                                    onClick={() => !t.isCompleted && HandleEdit(t.uID)}
                                    disabled={t.isCompleted}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                    </svg>
                                </button>
                                <button 
                                    className="todo-action-btn"
                                    onClick={() => HandleDelete(t.uID)}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M3 6h18"></path>
                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path>
                                        <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="empty-state">
                        <div className="empty-state-icon">📝</div>
                        <p className="empty-state-text">No tasks yet. Add one below!</p>
                    </div>
                )}
            </div>
            
            <div className="list-input-group">
                <input 
                    type="text" 
                    placeholder="Enter task..."
                    value={listName}
                    onChange={(e) => setListName(e.target.value)}
                    onKeyPress={HandleKeyPress}
                    className="list-input"
                />
                <button 
                    onClick={HandleAddList}
                    className="list-add-btn"
                >
                    {isEditing ? 'Update' : 'Add'}
                </button>
            </div>
        </div>
    );
};

export default List;