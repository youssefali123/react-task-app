import { memo , useRef,  useReducer, useEffect, useState, useOptimistic, startTransition, useActionState} from "react"
import Swal from "sweetalert2";
import "../todo.css";
import toast from "react-hot-toast";
import Item from "./Item";
import {getTodos, addTodo, deleteTodo, updateTodo} from "../api/todoServices";
function generateId(){
    return `it${Date.now()}${Math.floor(Math.random() * 1000)}`;;
}
const initialState = window.localStorage.getItem("todos") ? JSON.parse(window.localStorage.getItem("todos")) : [];
const todoReducer = (state, action)=>{
    switch(action.type){
        case "set":
            return action.payload;
        case "add":
            return [...state, action.payload];
        case "delete":
            return state.filter((e)=>e.id !== action.payload.id);
        case "edit":
            return state.map((e)=>{
                if(e.id === action.payload.id){
                    return {...e, title: action.payload.title};
                }
                return e;
            });
        case "clear":
            return [];
        default:
            return state;
    }
}


const Todo = ()=>{
    const [todos, setTodos] = useReducer(todoReducer, initialState);
    const [optTodos, optSetTodos] = useOptimistic(todos);
    const [loading, setLoading] = useState(true);
    const [duplicated, setDuplicated] = useState(false);
    const inputRef = useRef(null);
    const itemRef = useRef(null);
    const submitRef = useRef(null);
    const addTodoButton = async()=>{
        // if input is empty retutn nothing
        if(inputRef.current == null || inputRef.current.value == "") return;
        const todo = {title:inputRef.current.value.trim(), id: generateId(), isPending: true};
        //check if the title is already exists
        for(let i = 0; i < todos.length; i++){
            if(todos[i].title === todo.title){
                setDuplicated(true);
                setTimeout(()=>{
                    setDuplicated(false);
                }, 2000);
                return;
            }
        }
        //add the todo to the api then retuen it
        startTransition( async()=>{
            optSetTodos([...optTodos, todo]);
            try{
                const newTodo = await addTodo({title: todo.title, isPending: false});//add to the api the store it
                setTodos({type: "add", payload: newTodo}); // store the value in todos reducer
                toast.success("Task added successfully");
            }catch(err){
                toast.error("Error adding task");
                optSetTodos(optTodos.filter((e)=>e.id !== todo.id));
                setTodos({type: 'add', payload: {...todo, isPending: false}});
                // setTodos({type: "delete", payload: {id: todo.id}}); // remove the optimistically added todo if there was an error
                console.error("add error", err);
            }
        })
        
        inputRef.current.value = "";
        console.log(todos);
    }
    const [actionState, setActionState, pending] = useActionState(addTodoButton, {});

    //for edit the todo
    const handleEditTodo = async(id, title)=>{
        try{
            const updatedTodo = await updateTodo(id, {title});
            setTodos({type: "edit", payload: updatedTodo});
            toast.success("Task updated successfully");
        }catch(err){
            setTodos({type: "edit", payload: {id, title}});
            console.error(err);
        }
    }
    // delete the todo
    const handelDeleteTodo = async(id)=>{
        try{
            await deleteTodo(id);
            setTodos({type: "delete", payload: {id}});
            toast.success("Task deleted successfully");
        }catch(err){
            setTodos({type: "delete", payload: {id}});
            console.error(err);
        }
    }
    //clear all todos
    const handleClearTodos = async()=>{
        try{
            // Assuming the API supports bulk deletion
            await Promise.all(todos.map(todo => deleteTodo(todo.id)));
            setTodos({type: "clear"});
            toast.success("All tasks cleared successfully");
        }catch(err){
            setTodos({type: "clear"});
            console.error(err);
        }
    }
    // all all todos form the server while the page laoding
    useEffect(()=>{
        (async ()=>{
            try{
                const data = await getTodos();
                // set all todos in the todos reducer
                setTodos({type: "set", payload: data});
                console.log(data);
            }catch(err){
                console.error(err);
            }finally{
                setLoading(false);
            }
        })();
    }, [])
    // set the data to the locaalstorage once the todos is changed
    useEffect(()=>{
        console.log("state: ", actionState)
        setDuplicated(false);
        window.localStorage.setItem("todos", JSON.stringify(todos));
    }, [todos]);
    // add a new todo once the user click on the enter button by call addTodoButton
    useEffect(()=>{
        const handleEnter = (e)=>{
            if(e.key === "Enter"){
                // addTodoButton();
                submitRef.current.click();
            }
        }
        document.addEventListener("keydown", handleEnter);
        return ()=>{
            document.removeEventListener("keydown", handleEnter);
        }
    }, []);
    // clear all todos with a confirmation alert usin swal
    const clearTodos = ()=>{
        Swal.fire({
            title: 'Clear All Tasks',
            text: "Are you sure you want to clear all tasks?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, clear them!',
            cancelButtonText: 'No, keep them'
        }).then((result) => {
            if (result.isConfirmed) {
                // setTodos({type: "clear"});
                handleClearTodos();
                Swal.fire('Cleared!', '', 'success');
            }
        });
    }
    return(
        <>
        <div className="container">
        {/* form div for input and add task button */}
        
        <form className="form" action={setActionState}>
            <input ref={inputRef} type="text" name="input" id="input" />
            <input ref={submitRef} disabled={pending} style={{opacity: pending ? "0.5" : "1"}}  type="submit" value="Add Task" className="add" />
        </form>

        <div className="tasks">
            {duplicated && <h2 style={{textAlign: "center", color: "rgb(179, 0, 0)"}}>This task already exists</h2>}
            { todos.length > 1 && <div className="clear">
                <button onClick={()=>{clearTodos()}}> Clear All</button>
            </div>}
            {  loading ? <h2 style={{textAlign: "center", color: "rgb(179, 0, 0)"}}>Loading...</h2> :
            todos.length > 0 ? 
                optTodos.map((todo)=>(
                <Item style={{opacity: todo.isPending ? "0.5" : "1"}} ref={itemRef} key={todo.id} id={todo.id} edit={handleEditTodo}   del={handelDeleteTodo} title={todo.title}></Item>
            )) : <h2 style={{textAlign: "center", color: "rgb(179, 0, 0)"}}>No Tasks Found</h2>
            }
        </div>
        </div>

        </>
    )
}

export default memo(Todo);
