import React, { useEffect, useRef, useState } from 'react';
import './App.css';

function App() {
    const [tasks, setTasks] = useState([]);
    const [refreshTasks, setRefreshTasks] = useState(false);
    const [title, setTitle] = useState("");
    const inputRef = useRef(null);

    const createTask = async () => {
        const taskObj = {
            title:title
        };

        const resp = await fetch("http://localhost:6789/tasks/", {
            method:"POST",
            body:JSON.stringify(taskObj),
            headers:{"content-type":"application/json"}
        });

        if(resp.ok) {
            //const json = await resp.json();
            getTasks();

            //console.log(inputRef.current);
            inputRef.current.value = "";
        }
    };

    const deleteTask = async (id) => {
        const resp = await fetch("http://localhost:6789/tasks/" + id, {
            method:"DELETE"
        });

        if(resp.ok) {
            getTasks();
        }
    };

    const getTasks = async ()=> {
        const resp = await fetch("http://localhost:6789/tasks");
        //console.log(resp);

        /**
         * HTTP status kód
            Visszajelzést ad arról, hogy rendben lezajlottak-e 
            a folyamatok, vagy sem.
            2xx -> minde OK
            3xx -> átirányítás
            4xx -> kliens hiba
                * nem létező erőforrás (404)
                * forbidden (nem jogosultságod) (401)
                * bad request (nem feldolgozható kérés) 400
            5xx -> szerver hiba
         */

        if(resp.ok) {
            const data = await resp.json();
            setTasks(data);
        }
    };

    useEffect(()=> {
        getTasks();
    }, [refreshTasks]);

    /**
     * Különböző változók változásaira reagál.
     */
    useEffect(()=> {
        console.log("Megváltozott a tasks változó értéke!");
    }, [tasks]);

    return (
        <>
            <h1>ToDo List</h1>
            <div id="menu">
                <label>Your new to-do</label>
                <input type="text" onChange={(e)=>setTitle(e.target.value)}
                placeholder="enter new task" ref={inputRef}/>
                <button onClick={createTask}>add task</button>
            </div>
            <div id="list">
                {tasks.map((task) => (
                    <div key={task.id}>
                        <button onClick={() => deleteTask(task.id)}>delete</button>

                        <li style={{ display: 'inline' }}>
                            {task.title}
                            </li>
                        <br></br>
                    </div>
                ))}
            </div>
        </>
    );
}

export default App;