import React,{useState} from 'react'
import './ToDoList.css'
import List from './List.jsx'

const TodoList = () => {
  const [inputHeading, setInputHeading] = useState("");
  const [todoMain, setTodoMain] = useState([]);
  const HandleAddHeading = () => {
    if (inputHeading.trim() !== ''){
      setTodoMain([...todoMain, <List lName={inputHeading} />])
      setInputHeading('');
    }
  }
  
  return (
    <div className="todo-container">
      <h1 className="heading">My To-Do-List</h1>
      <div className="inputbox">
        <input type="text" className="heading-input rubik-text" placeholder="Enter Heading" value={inputHeading} onChange={(e)=> setInputHeading(e.target.value)}/>
        <button className="Add-list rubik-text" onClick={HandleAddHeading}>ADD HEADING</button>
      </div>
      <div className="flex flex-wrap gap-2">
        {todoMain}
      </div>
    </div>
  )
}

export default TodoList;