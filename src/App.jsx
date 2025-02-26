import React, { useState } from "react";
import Navbar from "./Components/Navbar.jsx";
import TodoList from "./Components/TodoList.jsx";
import HighPriorities from "./Components/HighPriorities.jsx";
import Kanban from "./Components/Kanban.jsx";

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