import { memo } from "react";
import { useCountContext } from "../contexts/CountContext";
function Count(){
    const {count} = useCountContext()
    console.log("hello from count")
    return (
        <h1>Count: {count}</h1>
    )
}
export default memo(Count);

