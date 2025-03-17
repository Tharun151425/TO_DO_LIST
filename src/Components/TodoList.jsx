import React, { useState, useContext, useEffect } from 'react';
import { ThemeContext } from '../ThemeContext';
import List from './List';
import './TodoList.css';

const TodoList = () => {
  const { theme } = useContext(ThemeContext);
  const [inputHeading, setInputHeading] = useState("");
  const [todoMain, setTodoMain] = useState([]);
  
  // Load headings from localStorage
  useEffect(() => {
    const storedHeadings = localStorage.getItem('todo-headings');
    if (storedHeadings) {
      setTodoMain(JSON.parse(storedHeadings));
    }
  }, []);
  
  // Save headings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('todo-headings', JSON.stringify(todoMain));
  }, [todoMain]);

  const HandleAddHeading = () => {
    if (inputHeading.trim() !== '') {
      setTodoMain([...todoMain, inputHeading]);
      setInputHeading('');
    }
  }
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      HandleAddHeading();
    }
  };
  
  const handleDeleteHeading = (indexToDelete) => {
    const newTodoMain = todoMain.filter((_, index) => index !== indexToDelete);
    
    // Remove the associated todos from localStorage
    localStorage.removeItem(`todos-${todoMain[indexToDelete]}`);
    
    // Update the state
    setTodoMain(newTodoMain);
  };
  
  return (
    <div className={`app-container ${theme}`}>
      <div className="todo-container">
        <h1 className="heading">My Task Collections</h1>
        
        <div className={`inputbox ${theme}`}>
          <input 
            type="text" 
            className="heading-input"
            placeholder="Enter list name..." 
            value={inputHeading} 
            onChange={(e) => setInputHeading(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button 
            className="Add-list"
            onClick={HandleAddHeading}
          >
            CREATE NEW LIST
          </button>
        </div>
        
        <div className="todo-lists-container">
          {todoMain.length > 0 ? (
            todoMain.map((heading, index) => (
              <div className="list-wrapper" key={index}>
                <div className="list-header">
                  <button 
                    className="delete-heading-btn"
                    onClick={() => handleDeleteHeading(index)}
                    aria-label="Delete list"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 6 6 18"></path>
                      <path d="m6 6 12 12"></path>
                    </svg>
                  </button>
                </div>
                <List lName={heading} />
              </div>
            ))
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">📋</div>
              <p className="empty-state-text">No lists yet. Create one above!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TodoList;