import { createContext, useState } from "react";

const UserNameContext = createContext();

const UserNameContextProvider = ({children}) => {
    const [userName, dispatch] = useState("John Doe");
    return (
        <UserNameContext.Provider value={"John Doe"}>
            {children}
        </UserNameContext.Provider>
    )
}

export default UserNameContextProvider;
