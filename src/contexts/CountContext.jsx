import { useReducer, useContext, createContext } from "react";
import countReducer from "../contexts/reducer";
const countContext = createContext();

const CountContextProvider = ({children}) => {
    const [count, dispatch] = useReducer(countReducer, 0);
    return (
        <countContext.Provider value={{count, dispatch}}>
            {children}
        </countContext.Provider>
    )
}

const useCountContext = () => useContext(countContext);
export default CountContextProvider;
export {useCountContext}