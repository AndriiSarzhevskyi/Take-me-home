import { useEffect, useContext, useState } from "react"
import { HeaderDark } from "../components/Header_Dark"
import { AuthContext } from "../context/Auth.context"
import { useHttp } from "../hooks/http.hook"

import { ToastErrorHandler } from "../handlers/ToastError"
import { ToastSuccessHandler } from "../components/Toast_success"
import { ToastContainer, toast } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';
import { UserTableRow } from "../components/UserTableRow"
export const UsersList = () => {
    const { request, error } = useHttp();
    const auth = useContext(AuthContext);
    const [users, setUsers] = useState();

    useEffect(() => {
        isadminHandler();
        getusersHandler();
    }, [auth])

    const isadminHandler = async () => {
        try {
            await request('/api/admin/isadmin', 'POST', null, { Authorization: `Bearer ${auth.token}` });
        }
        catch (e) {
            ToastErrorHandler(error);
            auth.logout();
        }
    }

    const getusersHandler = async () => {
        try {
            await request('/api/admin/getusers', 'GET', null, { Authorization: `Bearer ${auth.token}` }).then(res => {
                setUsers(res.users);
                ToastSuccessHandler("admin");
                console.log(res.users);
            })
        }
        catch (e) {
            if (error) {
                ToastErrorHandler(error);
            }
        }
    }

    return (
        <div className="main-dark">
            <ToastContainer />
            <HeaderDark></HeaderDark>
            <div className="main-second-frame flex-column background-paws">
                <div className="information-block width-90 form-castom margin-registration width-80-percent">
                    <h1 className="info-h">Список користувачів</h1>
                    <div className="info-flex-block">
                        <table className="table-info-dark">
                            <thead>
                                <tr>
                                    <td>Id</td>
                                    <td>Прізвище</td>
                                    <td>Ім'я</td>
                                    <td>Пошта</td>
                                    {/* <td>Стать</td> */}
                                    <td>Дата народження</td>
                                    <td>Зареєстровано</td>
                                    <td>Оновлено</td>
                                </tr>
                            </thead>
                            <tbody>
                                {users != null && users.map((user) => {
                                    return <UserTableRow key={user.UserId} user={user} getusersHandler = {getusersHandler}></UserTableRow>
                                })
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}