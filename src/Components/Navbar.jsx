import './Navbar.css'

const Navbar = ({ activeTab, setActiveTab }) => {
    return (
      <nav className="Navbar">
        <h2 className="to_do_name">TO DO LIST</h2>
        <ul className="nav-links">
          <li><button className={activeTab === "todo" ? "active" : ""} onClick={() => setActiveTab("todo")}>To-Do List</button></li>
          <li><button className={activeTab === "high" ? "active" : ""} onClick={() => setActiveTab("high")}>High Priorities</button></li>
          <li><button className={activeTab === "kanban" ? "active" : ""} onClick={() => setActiveTab("kanban")}>Kanban</button></li>
        </ul>
      </nav>
    );
  };
  
  export default Navbar;