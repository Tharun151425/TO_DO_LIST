import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import './ToDoList.css'

const List = (props) => {
    const [listName, setListName] = useState("");
    const [todos, setTodos] = useState([]);
    const HandleAddList = () => {
        if (listName.trim() !== '') {
            setTodos([...todos, { lname: listName, uID: uuidv4(), isCompleted: false }]);
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
        setTodos(todos.filter((t) => t.uID !== id));
    }
};


    return (
        <>
            <div className="border-2 w-[22em] rounded-xl bg-[#f7fff4] border-[#979896] m-6 p-4 shadow-md">
                <h2 className="py-2 text-[1.8em] text-[#5F634F]-400 text-center montserrat-subhead">{props.lName}</h2>
                <div className="flex flex-col w-full gap-3">
                    {todos.map((t, index) => {
                        return (
                            <div className="cursor-pointer px-4 py-2 flex items-center w-full rounded-md bg-white shadow-sm" key={t.uID}>
                                <input type="checkbox" checked={t.isCompleted} id={t.uID} onChange={HandleCheckBox} className="w-[1.5em] h-[1.5em] m-[0.5em]" />
                                <div className="flex-1 overflow-hidden">
                                    <label htmlFor={t.uID} className={`text-wrap text-[1.1em] rubik-text ${t.isCompleted ? "line-through text-gray-500 w-[]" : "text-black"}`}>{t.lname}</label>
                                </div>
                                <div className="flex space-x-2 ml-2">
                                    <img src="src/assets/edit-pen-svgrepo-com.svg" alt="Edit" className={`transition-transform duration-200 ease-in-out hover:scale-120 w-6 h-6 cursor-pointer ${t.isCompleted ? "grayscale opacity-50 pointer-events-none" : ""}`} onClick={() => HandleEdit(t.uID)}/>
                                    <img src="src/assets/delete-2-svgrepo-com.svg" alt="Delete" className={`transition-transform duration-200 ease-in-out hover:scale-120 w-6 h-6 cursor-pointer ${t.isCompleted ? "grayscale" : ""}`} onClick={() => HandleDelete(t.uID)}/>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className="mt-4 flex items-center gap-2">
                    <input type="text" placeholder="Enter List Items" value={listName} onChange={(e) => setListName(e.target.value)} className="heading-input !mb-0" />
                    <button onClick={HandleAddList} className="Add-list">Add</button>
                </div>
            </div>
        </>
    )
}

export default List;