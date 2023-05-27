import { useEffect, useState, useContext} from "react"
import { ToastErrorHandler } from "../handlers/ToastError";
import { Link } from "react-router-dom"
import { ToastSuccessHandler } from "./Toast_success";
import { useHttp } from "../hooks/http.hook";
import { AuthContext } from "../context/Auth.context";

export const UserTableRow = (props) =>{
    const auth = useContext(AuthContext);
    const {request, error} = useHttp();
    const [birthday, setBirthday] = useState()
    const [created, setCreated] = useState();
    const [updated, setUpdated] = useState();

    useEffect(()=>{
        if(props.user){
            const age = new Date(props.user.age);
            const createddate = new Date(props.user.createdAt);
            const updateddate = new Date(props.user.updatedAt);
            setBirthday(age.toLocaleDateString('eu'));
            setCreated(createddate.toLocaleDateString('eu'));
            setUpdated(updateddate.toLocaleDateString('eu'));
        }
    },[props]);

    const deleteuserHandler = async () =>{
        try{
            const formData = new FormData();
            formData.append("UserId", props.user.UserId);
            await request('/api/admin/deleteuser','POST', formData, { Authorization: `Bearer ${auth.token}` }).then(res=>{
                props.getusersHandler();
                // ToastSuccessHandler(res.message);
            });
        }
        catch(e){
            ToastErrorHandler(error);
        }
    }


    return(
        <>
        {props.user != null &&
            <tr>
                <td>{props.user.UserId}</td>
                <td>{props.user.surname}</td>
                <td>{props.user.name}</td>
                <td>{props.user.email}</td>
                {/* <td>{props.user.gender}</td> */}
                <td>{birthday}</td>
                <td>{created}</td>
                <td>{updated}</td>
                <td><button className="color-red pointer" onClick={deleteuserHandler}>Видалити</button></td>
                <td><Link className="pointer" to={`/userdetailinfo/${props.user.UserId}`}>Детальніше</Link></td>
            </tr>
        }
        </>
    )
}