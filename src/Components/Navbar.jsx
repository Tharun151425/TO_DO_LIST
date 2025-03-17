import React, { useState, useContext, useEffect } from 'react';
import { ThemeContext } from '../ThemeContext.jsx';
import './Navbar.css';

const Navbar = ({ activeTab, setActiveTab }) => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };
  // const nav_names = ["TASK MANAGER", "ORGANISE IT", "TO DO LIST"];
  // const [nav_name, setNav_Name] = useState(nav_names[0]);
  // let i = 0;
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     i = (i + 1) % nav_names.length; 
  //     setNav_Name(nav_names[i]);
  //   }, 5000); 
  //   return () => clearInterval(interval);
  // }, [nav_name]);
  return (
    <>
      <nav className={`navbar ${theme}`}>
        <h2 className="navbar-brand">ORGANISE IT</h2>
        
        <ul className="nav-links">
          <li>
            <button 
              className={`nav-link ${activeTab === "todo" ? "active" : ""}`}
              onClick={() => setActiveTab("todo")}
            >
              To-Do List
            </button>
          </li>
          <li>
            <button 
              className={`nav-link ${activeTab === "high" ? "active" : ""}`}
              onClick={() => setActiveTab("high")}
            >
              High Priorities
            </button>
          </li>
          <li>
            <button 
              className={`nav-link ${activeTab === "kanban" ? "active" : ""}`}
              onClick={() => setActiveTab("kanban")}
            >
              Kanban
            </button>
          </li>
        </ul>
        
        <div className="navbar-controls">
          <button className="theme-toggle" onClick={toggleTheme}>
            {theme === 'light' ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="4"></circle>
                <path d="M12 2v2"></path>
                <path d="M12 20v2"></path>
                <path d="m4.93 4.93 1.41 1.41"></path>
                <path d="m17.66 17.66 1.41 1.41"></path>
                <path d="M2 12h2"></path>
                <path d="M20 12h2"></path>
                <path d="m6.34 17.66-1.41 1.41"></path>
                <path d="m19.07 4.93-1.41 1.41"></path>
              </svg>
            )}
          </button>
          
          <button className="mobile-menu-button" onClick={toggleMobileMenu}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" x2="20" y1="12" y2="12"></line>
              <line x1="4" x2="20" y1="6" y2="6"></line>
              <line x1="4" x2="20" y1="18" y2="18"></line>
            </svg>
          </button>
        </div>
      </nav>
      
      {/* Mobile drawer */}
      <div className={`mobile-drawer-overlay ${mobileMenuOpen ? 'open' : ''}`} onClick={() => setMobileMenuOpen(false)}></div>
      <div className={`mobile-drawer ${theme} ${mobileMenuOpen ? 'open' : ''}`}>
        <button className="mobile-drawer-close" onClick={() => setMobileMenuOpen(false)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18"></path>
            <path d="m6 6 12 12"></path>
          </svg>
        </button>
        
        <ul className="mobile-nav-links">
          <li>
          <button 
              className={`mobile-nav-link ${activeTab === "todo" ? "active" : ""}`}
              onClick={() => handleTabChange("todo")}
            >
              To-Do List
            </button>
          </li>
          <li>
            <button 
              className={`mobile-nav-link ${activeTab === "high" ? "active" : ""}`}
              onClick={() => handleTabChange("high")}
            >
              High Priorities
            </button>
          </li>
          <li>
            <button 
              className={`mobile-nav-link ${activeTab === "kanban" ? "active" : ""}`}
              onClick={() => handleTabChange("kanban")}
            >
              Kanban
            </button>
          </li>
          <li>
            <button 
              className="mobile-nav-link"
              onClick={toggleTheme}
            >
              {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
            </button>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Navbar;