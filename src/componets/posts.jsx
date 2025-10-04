import { useEffect, useReducer } from "react";
import axios from "axios";
import { useCountContext } from "../contexts/CountContext";
const initialState = {
  loading: true,
  posts: [],
  error: ""
}
const reducer = (state, action) => {
  switch(action.type){
    case "FETCH_SUCCESS":
      return {
        loading: false,
        posts: action.payload,
        error: ""
      }
    case "FETCH_FAILURE":
      return {
        loading: false,
        posts: [],
        error: JSON.stringify(action.payload) || "Something went wrong"
      }
    default:
      return state
  }
}
const Posts = ()=>{
      const [posts, dispatch] = useReducer(reducer, initialState);
      const {dispatch: dispatchINcrement} = useCountContext();
  useEffect(() => {
    const getData = async () => {
      try {
        const res = await axios("https://jsonplaceholder.typicode.com/posts");
        // const data = await res.json();
        dispatch({type: "FETCH_SUCCESS", payload: res.data})
      } catch (error) {
        dispatch({type: "FETCH_FAILURE", payload: error})
      }
    }
    getData();
  })

  return(
    <>
    {posts.loading ? (
      <h2>Loading...</h2>
    ) : posts.error ? (
      <h2>{posts.error}</h2>
    ) : (
      <div>
        <h2 onClick={()=>dispatchINcrement({type: "INCREMENT", payload: 1})}>Posts</h2>
        {posts.posts.map((post) => (
          <div key={post.id}>
            <h3>{post.title}</h3>
            <p>{post.body}</p>
          </div>
        ))}
      </div>
    )}
    </>
  )
}
export default Posts;