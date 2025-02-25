import React, { useState } from "react";
import Navbar from "./Navbar.jsx";
import TodoList from "./TodoList.jsx";
import HighPriorities from "./HighPriorities.jsx";
import Kanban from "./Kanban.jsx";

const App = () => {
  const [activeTab, setActiveTab] = useState("todo");

  return (
    <div>
      <Navbar setActiveTab={setActiveTab} activeTab={activeTab} />
      {activeTab === "todo" && <TodoList />}
      {activeTab === "high" && <HighPriorities />}
      {activeTab === "kanban" && <Kanban />}
    </div>
  );
};

export default App;