import { useEffect, useState, useContext, Component } from "react";
import { HeaderDark } from "../components/Header_Dark";
import { encode } from "base64-arraybuffer";
import { useHttp } from "../hooks/http.hook";
import { showError, clearError, checkFields, initTimer, timer, showhidepassHandler } from "../functions";
import { CloseSvg } from "../components/Close_svg";
import { Update_info } from "../components/Update_info";
import { AuthContext } from "../context/Auth.context";
import { Checkcodeform } from "../components/Check_code_form";
import { ModalImage } from "../components/Modal_image_full_screen";

export const Personal_information_Dark = () => {
    const auth = useContext(AuthContext);
    const { request,/*loading,*/ error } = useHttp();
    const [userinfo, setUserinfo] = useState();
    const [img, setImg] = useState();
    const [gender, setGender] = useState();
    const [code, setCode] = useState();
    const [statuscode, setStatuscode] = useState("check");
    const [status, setStatus] = useState(false);
    const [age, setAge] = useState();
    const [date, setDate] = useState();
    const [showModal, setShowModal] = useState(false);
    const [showImageSrc, setShowImageSrc] = useState();

    const [form, setForm] = useState({
        name: '', surname: '', age: '', gender: '', email: '', password: '', photo: ''
    })


    useEffect(() => {
        console.log("effect");
        getuserinfoHandler();
        console.log(userinfo);
    }, []);

    useEffect(() => {
        console.log(userinfo);
    }, [userinfo])

    useEffect(() => {
    }, [statuscode]);

    useEffect(() => {
        if (error) {
            showError(error);
        }
    }, [error]);

    useEffect(() => {
        if (userinfo != null) {
            if (userinfo.photo_path != null){
                setImg(userinfo.photo_path);
            }
            if (userinfo.gender == "man") {
                setGender("Чоловік")
            }
            if (userinfo.gender == "woman") {
                setGender("Жінка");
            }
            const now = new Date(userinfo.age);

            let t = (now.getFullYear() + "-").toString();
            if (now.getMonth() < 10) {
                t += ("0" + now.getMonth() + "-").toString();
            }
            else if (now.getMonth() >= 10) {
                t += (now.getMonth() + "-").toString();
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
        }
    }, [userinfo]);

    const getuserinfoHandler = async event => {
        try {
            console.log("get handler");
            await request(`/api/user/${auth.userId}`, 'GET', null, { Authorization: `Bearer ${auth.token}` })
                .then(res => {
                    console.log(res);
                    setUserinfo(res);

                });
        }
        catch (e) { }
    }

    const closeHandler = async event => {
        event.preventDefault();
        const dialog = document.getElementById("dialog-code-check");
        dialog.close();
    }

    const sendcodeHandler = async event => {
        event.preventDefault();
        const dialog = document.getElementById("dialog-code-check");
        const formData = new FormData();
        formData.append('email', userinfo.email);
        try {
            clearError();
            const data = await request('/api/email/sendforgotkode', 'POST', formData).then(res => {
                if (!dialog.open) {
                    dialog.showModal();
                }
                setCode(res.code);
                if (statuscode == "check") {
                    clearInterval(timer);
                    initTimer();
                }
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

    const chanchestatusdialogHandler = event => {
        setStatuscode("reset");
    }

    const resetpasswordHandler = async event => {
        event.preventDefault();
        const dialog = document.getElementById("dialog-code-check");
        if (checkFields("password1", "lblpassword1") === true) {
            if (checkFields("password2", "lblpassword2") === true) {
                try {
                    clearError();
                    const formData = new FormData(event.target);
                    formData.append('email', userinfo.email);
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

    const showImageFullscreenHandler = event => {
        const dialog = document.getElementById("img-dialog");
        console.log("img");
        setShowImageSrc(event.target.src);
        setShowModal(true);
        if (!dialog.open) dialog.showModal();
    }

    const handleCloseModal = () => {
        const dialog = document.getElementById("img-dialog");
        setShowModal(false);
        dialog.Close();
    };

    return (
        <div className="main-dark">
            <HeaderDark></HeaderDark>
            <div className="main-second-frame flex-column background-paws">
                <div className="information-block form-castom margin-registration width-80-percent">
                    <h1 className="info-h">Особиста інформація</h1>
                    {status === false && userinfo != undefined &&
                        <div className="info-flex-block">
                            <div id="registration-photo" className="photo-info flex-row flex-justify-center">
                                <img id="uploadPreview" className="infoPreview" src={img} alt="img" onClick={showImageFullscreenHandler} />
                            </div>
                            <div className="flex-column  flex-center">
                                <table className="table-info-dark">

                                    <tbody>
                                        <tr>
                                            <td>Ім'я:</td>
                                            <td>{userinfo.name}</td>
                                        </tr>
                                        <tr>
                                            <td>Прізвище:</td>
                                            <td>{userinfo.surname}</td>
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
                                            <td>{userinfo.email}</td>
                                        </tr>
                                    </tbody>
                                </table>
                                <div className="flex-row flex-center gap">
                                    <button className="info-btn-dark" onClick={sendcodeHandler}>Змінити пароль</button>
                                    <button className="info-btn-dark" onClick={showchangeHandler}>Редагувати профіль</button>
                                </div>
                            </div>
                        </div>
                    }

                    {status === true &&
                        <Update_info showchangeHandler={showchangeHandler} setStatus={setStatus} user={userinfo} date={date} gender={gender} img={img} getuserinfoHandler={getuserinfoHandler}></Update_info>
                    }

                    <dialog id="dialog-code-check" className="dialog-code">
                        <CloseSvg id={"dialog-code-check"}></CloseSvg>
                        <h1 className="h-about-txt h-center">Зміна паролю</h1>
                        <div className="row">
                            <div id="error" className="error display-none">dsss</div>
                        </div>
                        {statuscode == "check" &&
                            <Checkcodeform code={code} sendcodeHandler={sendcodeHandler} changeStatusdialog={chanchestatusdialogHandler} htext={``}></Checkcodeform>
                        }
                        {statuscode == "reset" && <form id="change-pass-form" className="form-dark flex-column" onSubmit={resetpasswordHandler}>
                            <div className="row-dark flex-column">
                                <div className="pass"><input className="dark-inp paswidth" required type="password" id="password1" name="password1" placeholder="Введіть пароль" />
                                    <button className="password-control" type='button' onClick={showhidepassHandler}></button></div>
                                <label htmlFor="password1" className="lb2" id="lblpassword1">Новий пароль</label>
                            </div>
                            <div className="row-dark flex-column">
                                <div className="pass"><input className="dark-inp paswidth" required type="password" id="password2" name="password2" placeholder="Повторіть пароль" />
                                    <button className="password-control" type='button' onClick={showhidepassHandler}></button></div>
                                <label htmlFor="password2" className="lb2" id="lblpassword2">Повторіть пароль</label>
                            </div>
                            <input type="submit" className="submit-dark" value="Змінити пароль" />
                        </form>}
                    </dialog>
                    {showModal === true &&
                        <dialog id="img-dialog" className="dialog-img">
                            <CloseSvg id={"img-dialog"}></CloseSvg>
                            <ModalImage src={showImageSrc} ></ModalImage>
                        </dialog>
                    }
                </div>
            </div>
        </div>
    )
}