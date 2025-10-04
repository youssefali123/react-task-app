
const countReducer = (state, action)=>{
    switch(action.type){
        case "INCREMENT":
            return state + action.payload;
        case "DECREMENT":
            return (state > 0) ? state - action.payload : state;

        case "RESET":
            return 0;
        default:
            return state
    }
}
export default  countReducer