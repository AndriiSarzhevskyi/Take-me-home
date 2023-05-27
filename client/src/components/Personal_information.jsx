import { useEffect, useState } from "react";
import { encode } from "base64-arraybuffer";
import { useHttp } from "../hooks/http.hook";
import { showError, clearError, checkFields, initTimer, timer, showhidepassHandler } from "../functions";
import { CloseSvg } from "./Close_svg";
import { Update_info } from "./Update_info";

export const Personal_information = ({ user }) => {
    const { request,/*loading,*/ error } = useHttp();
    const [img, setImg] = useState();
    const [gender, setGender] = useState();
    const [code, setCode] = useState();
    const [statuscode, setStatuscode] = useState("check");
    const [status, setStatus] = useState(false);
    const [age, setAge] = useState();
    const [date, setDate] = useState();
    const [form, setForm] = useState({
        name: '', surname: '', age: '', gender: '',email: '', password: '', photo: ''
    })

    useEffect(() => {
    }, [statuscode]);

    useEffect(() => {
        if (error) {
            showError(error);
        }
    }, [error]);

    useEffect(() => {
        setImg("data:image/ ;base64 , " + encode(user.photo.data));
        if (user.gender == "man") {
            setGender("Чоловік")
        }
        if (user.gender == "woman") {
            setGender("Жінка");
        }
        const now = new Date(user.age);

        let t = (now.getFullYear() + "-").toString();
        if (now.getMonth() < 10) {
            t += ("0" + now.getMonth()+"-").toString();
        }
        else if (now.getMonth() >= 10) {
            t += (now.getMonth()+"-").toString();
        }
        if (now.getDate() < 10) {
            t += ("0" + now.getDate()).toString();
        }
        else {
            t += now.getDate().toString();
        }
        setDate(t);
        let tmp = now.toLocaleDateString('eu');
        setAge(tmp);
    }, [user]);

    const closeHandler = async event => {
        event.preventDefault();
        const dialog = document.getElementById("dialog-code-check");
        dialog.close();
    }

    const sendcodeHandler = async event => {
        event.preventDefault();
        const dialog = document.getElementById("dialog-code-check");
        const formData = new FormData();
        formData.append('email', user.email);
        try {
            clearError();
            const data = await request('/api/email/sendforgotkode', 'POST', formData).then(res => {
                if (!dialog.open) {
                    dialog.showModal();
                }
                setCode(res.code);
                clearInterval(timer);
                initTimer();
            });
        } catch (e) {
            showError(error);
        }
    }

    const checkCodeHandler = async event => {
        event.preventDefault();
        const form = event.target;
        if (form.code.value == code) {
            clearError();
            setStatuscode("reset");
        }
        else {
            showError("Невірний код");
            setStatuscode("check");
        }
    }

    const resetpasswordHandler = async event => {
        event.preventDefault();
        const dialog = document.getElementById("dialog-code-check");
        if (checkFields("password1", "lblpassword1") === true) {
            if (checkFields("password2", "lblpassword2") === true) {
                try {
                    clearError();
                    const formData = new FormData(event.target);
                    formData.append('email', user.email);
                    await request('/api/email/resetpassword', 'POST', formData).then(res => {
                        if (res.message == "Пароль успішно змінено") {
                            alert(res.message);
                            dialog.close();
                        }
                    });
                }
                catch (e) {
                    if (error) {
                        showError(error);
                    }
                }
            }
        }
    }

    const showchangeHandler = async event => {

        if (status === false) {
            setStatus(true);
        }
        else {
            setStatus(false);
        }
    }

    return (
        <div className="information_container flex-column  flex-center">
            {status === false &&
                <div className="flex-column  flex-center">
                    <div id="registration-photo" className="photo flex-row flex-justify-center margin-top-bottom">
                        <img id="uploadPreview" className="uploadPreview" src={img} alt="img" />
                    </div>
                    <table className="table-info">

                        <tbody>
                            <tr>
                                <td>Ім'я:</td>
                                <td>{user.name}</td>
                            </tr>
                            <tr>
                                <td>Прізвище:</td>
                                <td>{user.surname}</td>
                            </tr>
                            <tr>
                                <td>Вік:</td>
                                <td>{age}</td>
                            </tr>
                            <tr>
                                <td>Стать:</td>
                                <td>{gender}</td>
                            </tr>
                            <tr>
                                <td>Електронна адреса:</td>
                                <td>{user.email}</td>
                            </tr>
                        </tbody>
                    </table>
                    <div className="flex-row flex-center gap">
                        <button className="info-btn" onClick={sendcodeHandler}>Змінити пароль</button>
                        <button className="info-btn" onClick={showchangeHandler}>Редагувати профіль</button>
                    </div>
                </div>
            }

            {status === true &&
            <Update_info showchangeHandler = {showchangeHandler} user = {user} date = {date} gender = {gender} img = {img} getuserinfoHandler = {user.getuserinfoHandler}></Update_info>
            }

            <dialog id="dialog-code-check" className="dialog-code">
                <CloseSvg id ={"dialog-code-check"}></CloseSvg>
                <h1 className="h-about-txt h-center">Зміна паролю</h1>
                <div className="row">
                    <div id="error" className="error display-none">dsss</div>
                </div>
                {statuscode == "check" && <form id="codecheckForm" className="entrance-form" method="dialog" onSubmit={checkCodeHandler}>
                    <div className="row">
                        <input className="inp" required type="number" minLength="6" maxLength="6" name="code" />
                        <label htmlFor="code" className="lb1" id="check-code-label">Введіть код з повідомлення</label>
                    </div>
                    <input type="submit" className="submitbtn" value="Перевірити" />
                    <div id="send-again-timer" className="timer"></div>
                    <button id="send-again" className="display-none timer send-again-btn" onClick={sendcodeHandler}>Відправити код повторно</button>
                </form>}
                {statuscode == "reset" && <form id="change-pass-form" className="entrance-form" onSubmit={resetpasswordHandler}>
                    <div className="row">
                        <div className="pass"><input className="inp paswidth" required type="password" id="password1" name="password1" placeholder="Введіть пароль" />
                            <button className="password-control" type='button' onClick={showhidepassHandler}></button></div>
                        <label htmlFor="password1" className="lb1" id="lblpassword1">Новий пароль</label>
                    </div>
                    <div className="row">
                        <div className="pass"><input className="inp paswidth" required type="password" id="password2" name="password2" placeholder="Повторіть пароль" />
                            <button className="password-control" type='button' onClick={showhidepassHandler}></button></div>
                        <label htmlFor="password2" className="lb1" id="lblpassword2">Повторіть пароль</label>
                    </div>
                    <input type="submit" className="submitbtn" value="Змінити пароль" />
                </form>}
            </dialog>
            <dialog id="sure-dialog" className="dialog-code">

            </dialog>
           
        </div>
    )
}