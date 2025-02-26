import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';



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


    return (
        <div className="p-5 border-2 w-[20em] rounded-2xl bg-[#f7fff4] border-[#979896] m-10 relative">
            <h2 className="pb-20 text-[24px] text-blue-400 text-center">{props.lName}</h2>
            <div className="m-20 flex-col justify-center items-center">
                {todos.map((t, index) => {
                    return (
                        <div className="cursor-pointer p-2 border-2 border-red-900 grid grid-cols-4 w-[19em]" key={t.uID}>
                            <input type="checkbox" value={t.isCompleted} name={t.uID} id={t.uID} onChange={HandleCheckBox} />
                            <label htmlFor={t.uID} className={t.isCompleted ? "line-through" : ""}>{t.lname}</label>
                                <img src="src\assets\edit-pen-svgrepo-com.svg" alt="Edit Icon" style={{ cursor: "pointer", width: "24px", height: "24px" }} />
                                <img src="src\assets\delete-2-svgrepo-com.svg" alt="Delete Icon" style={{ cursor: "pointer", width: "24px", height: "24px" }} />
                        </div>
                    );
                })}
            </div>
            <div className="absolute bottom-2 p-2 flex-col">
                <input type="text" name="element-name" placeholder="Enter List Items" value={listName} onChange={(e) => setListName(e.target.value)} />
                <button onClick={HandleAddList}>Add</button>
            </div>
        </div>
    )
}

export default List;