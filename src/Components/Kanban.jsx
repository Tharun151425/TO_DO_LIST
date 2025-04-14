import React, { useState, useContext, useRef, useEffect } from 'react';
import { ThemeContext } from '../ThemeContext';

const Kanban = () => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';
  
  // Initial columns setup
  const [columns, setColumns] = useState({
    'to-do': {
      id: 'to-do',
      title: 'To Do',
      tasks: []
    },
    'in-progress': {
      id: 'in-progress',
      title: 'In Progress',
      tasks: []
    },
    'done': {
      id: 'done',
      title: 'Done',
      tasks: []
    }
  });
  
  // Task creation modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    id: '',
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    tags: [],
    columnId: 'to-do'
  });
  
  // Tag input state
  const [tagInput, setTagInput] = useState('');
  
  // For drag and drop functionality
  const [draggedItem, setDraggedItem] = useState(null);
  const [activeColumn, setActiveColumn] = useState(null);
  
  // Refs for drag effects
  const dragItemNode = useRef(null);
  
  // Load from localStorage on initial render
  useEffect(() => {
    const savedColumns = localStorage.getItem('kanbanColumns');
    if (savedColumns) {
      setColumns(JSON.parse(savedColumns));
    }
  }, []);
  
  // Save to localStorage whenever columns change
  useEffect(() => {
    localStorage.setItem('kanbanColumns', JSON.stringify(columns));
  }, [columns]);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      const modal = document.getElementById('task-modal');
      if (isModalOpen && modal && !modal.contains(e.target) && !e.target.closest('.add-task-btn')) {
        setIsModalOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isModalOpen]);
  
  // Handle opening the task creation modal
  const handleOpenModal = (columnId) => {
    setNewTask({
      id: Date.now().toString(),
      title: '',
      description: '',
      priority: 'medium',
      dueDate: '',
      tags: [],
      columnId
    });
    setIsModalOpen(true);
  };
  
  // Handle closing the modal and resetting form
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTagInput('');
  };
  
  // Handle input changes for the new task form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle tag input
  const handleTagInputChange = (e) => {
    setTagInput(e.target.value);
  };
  
  // Add tag to the new task
  const handleAddTag = () => {
    if (tagInput.trim() && !newTask.tags.includes(tagInput.trim())) {
      setNewTask(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };
  
  // Remove tag from the new task
  const handleRemoveTag = (tagToRemove) => {
    setNewTask(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };
  
  // Submit the new task form
  const handleSubmitTask = (e) => {
    e.preventDefault();
    const columnId = newTask.columnId;
    
    setColumns(prev => {
      const column = prev[columnId];
      const updatedTasks = [...column.tasks, newTask];
      
      return {
        ...prev,
        [columnId]: {
          ...column,
          tasks: updatedTasks
        }
      };
    });
    
    handleCloseModal();
  };
  
  // Delete a task
  const handleDeleteTask = (columnId, taskId) => {
    setColumns(prev => {
      const column = prev[columnId];
      const updatedTasks = column.tasks.filter(task => task.id !== taskId);
      
      return {
        ...prev,
        [columnId]: {
          ...column,
          tasks: updatedTasks
        }
      };
    });
  };
  
  // Handle the start of dragging a task
  const handleDragStart = (e, columnId, taskId) => {
    // This data is required for Firefox
    if (e.dataTransfer) {
      e.dataTransfer.setData('text/plain', taskId);
      e.dataTransfer.effectAllowed = 'move';
    }
    
    dragItemNode.current = e.target;
    dragItemNode.current.addEventListener('dragend', handleDragEnd);
    
    setTimeout(() => {
      setDraggedItem({ columnId, taskId });
    }, 0);
  };
  
  // Handle dragging over a column
  const handleDragOver = (e, columnId) => {
    e.preventDefault();
    setActiveColumn(columnId);
  };
  
  // Handle dropping a task into a column
  const handleDrop = (e, columnId) => {
    e.preventDefault();
    
    if (!draggedItem) return;
    
    const { columnId: sourceColumnId, taskId } = draggedItem;
    
    // Don't do anything if dropping in the same column
    if (sourceColumnId === columnId) {
      setActiveColumn(null);
      setDraggedItem(null);
      return;
    }
    
    setColumns(prev => {
      // Get the task from the source column
      const sourceColumn = prev[sourceColumnId];
      const task = sourceColumn.tasks.find(t => t.id === taskId);
      
      // Remove the task from the source column
      const sourceColumnTasks = sourceColumn.tasks.filter(t => t.id !== taskId);
      
      // Add the task to the target column
      const targetColumn = prev[columnId];
      const updatedTask = { ...task, columnId };
      
      return {
        ...prev,
        [sourceColumnId]: {
          ...sourceColumn,
          tasks: sourceColumnTasks
        },
        [columnId]: {
          ...targetColumn,
          tasks: [...targetColumn.tasks, updatedTask]
        }
      };
    });
    
    setActiveColumn(null);
    setDraggedItem(null);
  };
  
  // Handle the end of dragging
  const handleDragEnd = () => {
    if (dragItemNode.current) {
      dragItemNode.current.removeEventListener('dragend', handleDragEnd);
      dragItemNode.current = null;
    }
    setDraggedItem(null);
    setActiveColumn(null);
  };
  
  // Get the color for task priority badges
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return isDark 
          ? 'bg-red-900/60 text-red-200 border-red-700' 
          : 'bg-red-100 text-red-800 border-red-300';
      case 'medium':
        return isDark 
          ? 'bg-yellow-900/60 text-yellow-200 border-yellow-700' 
          : 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low':
        return isDark 
          ? 'bg-green-900/60 text-green-200 border-green-700' 
          : 'bg-green-100 text-green-800 border-green-300';
      default:
        return isDark 
          ? 'bg-blue-900/60 text-blue-200 border-blue-700' 
          : 'bg-blue-100 text-blue-800 border-blue-300';
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  // Get color for tags
  const getTagColor = (tag) => {
    // Simple hash function to deterministically assign colors
    const hash = tag.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const colors = [
      isDark ? 'bg-indigo-900/50 text-indigo-200' : 'bg-indigo-100 text-indigo-800',
      isDark ? 'bg-purple-900/50 text-purple-200' : 'bg-purple-100 text-purple-800',
      isDark ? 'bg-blue-900/50 text-blue-200' : 'bg-blue-100 text-blue-800',
      isDark ? 'bg-teal-900/50 text-teal-200' : 'bg-teal-100 text-teal-800',
      isDark ? 'bg-emerald-900/50 text-emerald-200' : 'bg-emerald-100 text-emerald-800',
      isDark ? 'bg-amber-900/50 text-amber-200' : 'bg-amber-100 text-amber-800',
    ];
    return colors[hash % colors.length];
  };

  return (
    <div className={`mt-20 p-4 md:p-6 ${isDark ? 'bg-slate-900 text-slate-200' : 'bg-slate-50 text-slate-800'} min-h-screen`}>
      <h1 className={`text-2xl md:text-3xl font-bold mb-6 ${isDark ? 'text-white' : 'text-slate-800'}`}>
        Kanban Board
      </h1>
      
      {/* Kanban Board */}
      <div className="flex flex-col md:flex-row gap-6 overflow-x-auto pb-4">
        {Object.values(columns).map(column => (
          <div 
            key={column.id}
            className={`flex-1 min-w-[280px] max-w-full md:max-w-sm ${
              activeColumn === column.id ? (isDark ? 'bg-slate-800/80' : 'bg-slate-100/80') : ''
            } rounded-lg transition-colors duration-200`}
            onDragOver={(e) => handleDragOver(e, column.id)}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between p-3 border-b border-dashed mb-3">
              <h2 className={`font-semibold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                {column.title} <span className="text-sm ml-2 opacity-70">({column.tasks.length})</span>
              </h2>
              <button 
                className={`add-task-btn p-1.5 rounded-md ${
                  isDark ? 'bg-slate-700 hover:bg-slate-600' : 'bg-white hover:bg-slate-100'
                } transition-colors duration-200 shadow-sm`}
                onClick={() => handleOpenModal(column.id)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
            
            {/* Tasks Container */}
            <div className={`p-2 min-h-[200px] rounded-b-lg ${
              isDark ? 'bg-slate-800/50' : 'bg-white/50'
            } backdrop-blur-sm`}>
              {column.tasks.length === 0 ? (
                <div className={`flex flex-col items-center justify-center h-32 rounded-lg ${
                  isDark ? 'bg-slate-800/50 border border-slate-700/50' : 'bg-slate-50 border border-slate-200/50'
                } text-center p-4`}>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    No tasks yet
                  </p>
                  <button
                    className={`mt-2 px-3 py-1 text-xs rounded-md ${
                      isDark ? 'bg-slate-700 hover:bg-slate-600 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    } transition-colors duration-200`}
                    onClick={() => handleOpenModal(column.id)}
                  >
                    Add a task
                  </button>
                </div>
              ) : (
                column.tasks.map(task => (
                  <div 
                    key={task.id}
                    className={`mb-3 p-3 rounded-lg ${
                      isDark 
                        ? 'bg-slate-700/70 hover:bg-slate-700 border border-slate-600/50' 
                        : 'bg-white hover:bg-slate-50 border border-slate-200/50'
                    } shadow-sm cursor-grab transition-all duration-200 transform hover:translate-y-[-2px]`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, column.id, task.id)}
                  >
                    {/* Task Header with Title and Delete */}
                    <div className="flex justify-between items-start mb-2">
                      <h3 className={`font-medium text-sm ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                        {task.title}
                      </h3>
                      <button
                        className={`p-1 rounded-full ${
                          isDark ? 'hover:bg-slate-600' : 'hover:bg-slate-200'
                        } transition-colors duration-200`}
                        onClick={() => handleDeleteTask(column.id, task.id)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-3.5 w-3.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    
                    {/* Task Description */}
                    {task.description && (
                      <p className={`text-xs mb-3 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        {task.description}
                      </p>
                    )}
                    
                    {/* Task Meta Info */}
                    <div className="flex flex-wrap gap-2 mt-2">
                      {/* Priority Badge */}
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${getPriorityColor(task.priority)}`}>
                        {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                      </span>
                      
                      {/* Due Date Badge */}
                      {task.dueDate && (
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          isDark ? 'bg-slate-800 text-slate-300 border border-slate-700' : 'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}>
                          {formatDate(task.dueDate)}
                        </span>
                      )}
                    </div>
                    
                    {/* Task Tags */}
                    {task.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {task.tags.map(tag => (
                          <span key={tag} className={`text-xs px-1.5 py-0.5 rounded ${getTagColor(tag)}`}>
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
      
      {/* New Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div 
            id="task-modal"
            className={`w-full max-w-md rounded-lg shadow-xl ${
              isDark ? 'bg-slate-800 text-slate-200' : 'bg-white text-slate-800'
            } p-6 max-h-[90vh] overflow-y-auto`}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                Create New Task
              </h3>
              <button
                className={`p-1.5 rounded-full ${
                  isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-100'
                } transition-colors duration-200`}
                onClick={handleCloseModal}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleSubmitTask}>
              {/* Task Title */}
              <div className="mb-4">
                <label 
                  htmlFor="title"
                  className={`block text-sm font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}
                >
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={newTask.title}
                  onChange={handleInputChange}
                  required
                  className={`w-full p-2 rounded-md border ${
                    isDark 
                      ? 'bg-slate-700 border-slate-600 text-white focus:border-indigo-500' 
                      : 'bg-white border-slate-300 text-slate-900 focus:border-indigo-500'
                  } focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition-colors duration-200`}
                  placeholder="Task title"
                />
              </div>
              
              {/* Task Description */}
              <div className="mb-4">
                <label 
                  htmlFor="description"
                  className={`block text-sm font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={newTask.description}
                  onChange={handleInputChange}
                  rows="3"
                  className={`w-full p-2 rounded-md border ${
                    isDark 
                      ? 'bg-slate-700 border-slate-600 text-white focus:border-indigo-500' 
                      : 'bg-white border-slate-300 text-slate-900 focus:border-indigo-500'
                  } focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition-colors duration-200`}
                  placeholder="Task description"
                ></textarea>
              </div>
              
              {/* Task Priority */}
              <div className="mb-4">
                <label 
                  htmlFor="priority"
                  className={`block text-sm font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}
                >
                  Priority
                </label>
                <select
                  id="priority"
                  name="priority"
                  value={newTask.priority}
                  onChange={handleInputChange}
                  className={`w-full p-2 rounded-md border ${
                    isDark 
                      ? 'bg-slate-700 border-slate-600 text-white focus:border-indigo-500' 
                      : 'bg-white border-slate-300 text-slate-900 focus:border-indigo-500'
                  } focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition-colors duration-200`}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              
              {/* Due Date */}
              <div className="mb-4">
                <label 
                  htmlFor="dueDate"
                  className={`block text-sm font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}
                >
                  Due Date
                </label>
                <input
                  type="date"
                  id="dueDate"
                  name="dueDate"
                  value={newTask.dueDate}
                  onChange={handleInputChange}
                  className={`w-full p-2 rounded-md border ${
                    isDark 
                      ? 'bg-slate-700 border-slate-600 text-white focus:border-indigo-500' 
                      : 'bg-white border-slate-300 text-slate-900 focus:border-indigo-500'
                  } focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition-colors duration-200`}
                />
              </div>
              
              {/* Tags */}
              <div className="mb-4">
                <label 
                  className={`block text-sm font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}
                >
                  Tags
                </label>
                <div className="flex">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={handleTagInputChange}
                    className={`flex-1 p-2 rounded-l-md border-y border-l ${
                      isDark 
                        ? 'bg-slate-700 border-slate-600 text-white focus:border-indigo-500' 
                        : 'bg-white border-slate-300 text-slate-900 focus:border-indigo-500'
                    } focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition-colors duration-200`}
                    placeholder="Add tag"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className={`px-4 rounded-r-md border-y border-r ${
                      isDark 
                        ? 'bg-slate-600 hover:bg-slate-500 border-slate-600 text-white' 
                        : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800'
                    } transition-colors duration-200`}
                  >
                    Add
                  </button>
                </div>
                
                {/* Tag list */}
                {newTask.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {newTask.tags.map(tag => (
                      <span 
                        key={tag} 
                        className={`inline-flex items-center text-xs px-2 py-1 rounded ${getTagColor(tag)}`}
                      >
                        #{tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-1.5 text-opacity-70 hover:text-opacity-100"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Column Selection */}
              <div className="mb-6">
                <label 
                  htmlFor="columnId"
                  className={`block text-sm font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}
                >
                  Column
                </label>
                <select
                  id="columnId"
                  name="columnId"
                  value={newTask.columnId}
                  onChange={handleInputChange}
                  className={`w-full p-2 rounded-md border ${
                    isDark 
                      ? 'bg-slate-700 border-slate-600 text-white focus:border-indigo-500' 
                      : 'bg-white border-slate-300 text-slate-900 focus:border-indigo-500'
                  } focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition-colors duration-200`}
                >
                  {Object.values(columns).map(column => (
                    <option key={column.id} value={column.id}>
                      {column.title}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Submit Button */}
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className={`px-4 py-2 rounded-md ${
                    isDark 
                      ? 'bg-slate-700 hover:bg-slate-600 text-slate-200' 
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  } transition-colors duration-200`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 rounded-md ${
                    isDark 
                      ? 'bg-indigo-600 hover:bg-indigo-700 text-white' 
                      : 'bg-indigo-500 hover:bg-indigo-600 text-white'
                  } transition-colors duration-200`}
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Kanban;