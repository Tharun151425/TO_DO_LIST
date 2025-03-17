import React, { useState } from 'react';
import { ThemeProvider } from './ThemeContext.jsx';
import Navbar from './Components/Navbar.jsx';
import TodoList from './Components/TodoList.jsx';

const App = () => {
  const [activeTab, setActiveTab] = useState("todo");
  
  const renderContent = () => {
    switch (activeTab) {
      case "todo":
        return <TodoList />;
      case "high":
        return <div className="coming-soon">High Priorities Feature Coming Soon!</div>;
      case "kanban":
        return <div className="coming-soon">Kanban Feature Coming Soon!</div>;
      default:
        return <TodoList />;
    }
  };

  return (
    <ThemeProvider>
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      {renderContent()}
    </ThemeProvider>
  );
};

export default App;