import { useEffect, useContext, useState, useRef } from "react"
import { Link } from "react-router-dom"
import { AuthContext } from "../context/Auth.context";
import { useHttp } from "../hooks/http.hook";

export const Comment = (props) => {
    const auth = useContext(AuthContext);
    const { request,/*loading,*/ error } = useHttp();
    const [showdelete, setShowDelete] = useState(false);
    const delRef = useRef(null);

    let timer = null;

    const handleMouseDown = () => {
        timer = setTimeout(() => {
            setShowDelete(true);
        }, 1000); // устанавливаем время ожидания в 1 секунду
    };

    const handleMouseUp = () => {
        clearTimeout(timer);
    };


    useEffect(() => {
        const handleClickOutside = (event) => {
            if (delRef.current && !delRef.current.contains(event.target)) {
                setShowDelete(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [delRef]);

    const showDeleteHandler = () => {
        console.log("showdel");
        setShowDelete(true);
    };

    const closeDeleteHandler = () => {
        console.log("closeDel");
        setShowDelete(false);
    };

    const deleteHandler = async event => {
        event.preventDefault();
        console.log(props.comment);
        try{
            const formData = new FormData();
            formData.append("CommentId", props.comment.CommentId);
            formData.append("UserId", auth.userId);
            const res = await request('/api/comments/delete', 'POST', formData, { Authorization: `Bearer ${auth.token}` }).then(res=>{
                props.getcommentsHandler();
            })

        }
        catch(e){
            console.log(e);
            props.ToastErrorHandler(error);
        }
    }

    return (
        <>
            {(auth.userId == props.comment.UserUserId) &&
                <div className="flex-column my-comment comment">
                    <div className="flex-row my-com-row">
                        <div className="flex-row my-com-row">
                            <div className="comment-avatar-div flex-justify-center flex-row ord-1">
                                <img className="comment-img" src={props.comment.User.Photo_avatar.ImagePath}></img>
                            </div>
                            <div className="comment-name">{props.comment.User.name}</div>
                        </div>
                    </div>
                    <div className="flex-column">
                        {showdelete === true && <button  ref={delRef} className="color-red" onClick={deleteHandler}>Видалити</button>}
                        <div className="comment-text" onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} >{props.comment.text}</div>
                    </div>

                </div>
            }
            {auth.userId != props.comment.UserUserId &&
                <div className="flex-column  comment another-comment">
                    <div className="flex-row ">
                        <div className="comment-avatar-div flex-justify-center flex-row">
                            <img className="comment-img" src={props.comment.User.Photo_avatar.ImagePath}></img>
                        </div>
                        <div className="flex-column align-center">
                            {!auth.isAuthenticated && <div className="comment-name">{props.comment.User.name}</div>}
                            {auth.isAuthenticated && <Link to={`/userdetailinfo/${props.comment.UserUserId}`} className="comment-name">{props.comment.User.name}</Link>}
                            {props.ad.User.UserId == props.comment.UserUserId && <div className="comment-name font-size-12">(Автор оголошення)</div>}
                        </div>
                    </div>
                    <div className="flex-column">
                        {showdelete === true && auth.status == "admin" && <button ref={delRef} onClick={deleteHandler} className="color-red">Видалити</button>}
                        {auth.status == "admin" ? <div className="comment-text" onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}>{props.comment.text}</div> : <div className="comment-text">{props.comment.text}</div>}
                    </div>

                </div>
            }
        </>
    )
}