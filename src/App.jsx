import { useRef, useState , useEffect} from 'react'
// import Test from './componets/test'
// import './App.css'
// import axios from 'axios'
import Posts from './componets/posts';
import { useCountContext } from './contexts/CountContext';
import Count from './componets/count';
import TodoList from './componets/TodoList';
import Todo from './componets/Todo';

// export const UserNameContext = createContext();


function App() {
  const {count, dispatch} = useCountContext();
  const [timer, setTimer] = useState(0);
  const [stop, setStop] = useState(false);
  
  const handleStop = () => {
    setStop(!stop);
    if(!stop){
      clearInterval(intervalRef.current);
    }else{
      intervalRef.current = setInterval(() => {
        setTimer((timer) => timer + 1);
      }, 1000);
    }
  }
  const intervalRef = useRef(null);
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setTimer((timer) => timer + 1);
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [])
  return (
    <>
      
      {/* <TodoList></TodoList>
      <Count count={count}></Count>
      <h1>Timer: {timer}</h1>
      <button onClick={()=>{clearInterval(intervalRef.current); handleStop()}}>{stop ? "Start" : "Stop"} timer</button>
      <button onClick={() => dispatch({type: "INCREMENT", payload: 1})}>Increment</button>
      <button onClick={() => dispatch({type: "DECREMENT", payload: 1})}>Decrement</button>
      <button onClick={() => dispatch({type: "RESET"})}>Reset</button> */}

      {/* for todo list */}
      <Todo/>

    </>

  )
}

export default App
