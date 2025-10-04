import { memo, useEffect, useRef, useState } from "react"
import gsap from "gsap";
import Swal from "sweetalert2";
const editTodo = (id, title, edit)=>{
    Swal.fire({
        title: 'Edit Todo',
        input: 'text',
        inputValue: title,
        showCancelButton: true,
        confirmButtonText: 'Save',
        cancelButtonText: 'Cancel',
        inputValidator: (value) => {
            if (!value) {
                return 'You need to write something!'
            }
        }
    }).then((result) => {
        if (result.isConfirmed) {
            const newTitle = result.value.trim();
            if (newTitle && newTitle !== title) {
                // edit({type: "edit", payload: {id, title: newTitle}});
                edit(id, newTitle);
                Swal.fire('Saved!', '', 'success');
            } else if (newTitle === title) {
                Swal.fire('No changes made', '', 'info');
            }
        }
    });
}

const Item = ({title, del, id, edit, style})=>{
    const itemRef = useRef(null);
    const [editing, setEditing] = useState(false);
    const titleRef = useRef(null);
    
    const deleteAnimation = ()=>{
    gsap.to(itemRef.current, {duration: 0.3, opacity: 0, x: 50, height: 0, margin: 0, padding: 0, ease: "power1.in", onComplete: ()=>{
        del(id);
    }})
    }
    useEffect(()=>{
        titleRef.current.addEventListener("click", ()=>{
            setEditing(true);
            console.log("focused");
        });
        titleRef.current.addEventListener("blur", ()=>{
            setEditing(false);
            if(titleRef.current.innerText.trim() === ""){
                titleRef.current.innerText = title;
                return;
            }
            if(titleRef.current.innerText.trim() !== title){
                edit(id, titleRef.current.innerText.trim());
            }
        });
        titleRef.current.addEventListener("keydown", (e)=>{
            if(e.key === "Enter"){
                e.preventDefault();
                titleRef.current.blur();
            }
        });
    }, [])
    
    return(
        <>
        <div style={style} ref={itemRef} className="item" id={id}>
            <div contentEditable={editing} ref={titleRef}> {title} </div>
            <div className="delete">
                <ion-icon name="trash" onClick={()=>{
                    deleteAnimation();
                }}></ion-icon>
                <ion-icon name="create" onClick={()=>{
                    editTodo(id, title, edit);
                }}></ion-icon>
            </div>
            
        </div>
        </>
    )
}

export default memo(Item);