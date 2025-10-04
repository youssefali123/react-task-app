import {  memo, useReducer } from "react";
import { useRef, useOptimistic, startTransition } from "react";

const todoReducer = (state, action)=>{
    switch(action.type){
        case "add":
            return [...state, action.payload];
        case "delete":
            return state.filter((e)=>e.id !== action.payload.id);
        default:
            return state;
    }
}

const TodoList = () => {
    const [todos, setTodos] = useReducer(todoReducer, []);
    // optimistic like usestat
    const [opTodos, setOpTodos] = useOptimistic(todos);
    const deleteTodo = (e)=>{
        setTodos({type: "delete", payload: e});
        // setTodos(todos.filter((e)=>e.id !== e.id))
        console.log(todos);
    } 
    const inputRef = useRef(null);
    async function addTodo(e) {
        e.preventDefault();
        const todo = {title:inputRef.current.value, id:inputRef.current.value.length, isPending: true};
        if(inputRef.current == null || inputRef.current.value == "") return;

        startTransition(async()=>{
            setOpTodos([...opTodos, todo]);
                        
            const newTodo = await creatTodo(todo.title);
            // setTodos([...todos, newTodo]);
            setTodos({type: "add", payload: newTodo})
            inputRef.current.value = "";
        });
        
    }
    const Icon = ({color}) => <ion-icon name="rocket-sharp" style={{color: `"${color}"`, opacity: 0.5}}></ion-icon>;
    return(
        <>
        <form onSubmit={addTodo}>
            <input type="text" ref={inputRef} />
            <button type="submit">Add Todo</button>
        </form>
        <ul>
            {opTodos.map((todo, index) => (
                <li onClick={()=>{
                    deleteTodo(todo);
                    // console.log(todo);
                }} id={ todo.id }style={{opacity: todo.isPending ? "0.5" : "1"}} key={index}>
                    {todo.title}
                    {todo.isPending && <Icon color="red" />}
                </li>
            ))}
            </ul>
        </>

    )
}
const creatTodo = (title)=>{
    return wait({id:title.length, title: title, isPending: false}, 1000);
}
const wait = (value, dur)=>{
    return new Promise((res)=>{
        setTimeout(()=>{
            res(value);
        }, dur)
    })
}
export default memo(TodoList);