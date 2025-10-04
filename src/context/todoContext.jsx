import { createContext } from "react";

export const TodoContext = createContext(null);

const TodoContextProvider = ({children, value})=>{
    return <TodoContext.Provider value={value}>
        {children}
    </TodoContext.Provider>
}

export default TodoContextProvider;