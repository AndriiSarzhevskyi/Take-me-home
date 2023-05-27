import { useEffect, useState, useContext } from "react";
import { useHttp } from "../hooks/http.hook";
import { CloseSvg } from "./Close_svg";
import { Checkcodeform } from "./Check_code_form";
import { AuthContext } from "../context/Auth.context";
import { initTimer, timer } from "../functions";
import { ToastSuccessHandler } from "./Toast_success";
import { ToastContainer } from "react-toastify";

export const Update_info = (props) => {
    const auth = useContext(AuthContext);
    const { request,/*loading,*/ error } = useHttp();
    const [newimg, setNewimg] = useState(props.img);
    const [code, setCode] = useState();

    const [form, setForm] = useState({
        name: '', surname: '', age: '', gender: '', email: '', password: '', photo: ''
    })

    function filechangehandler(event) {
        let fileName = '';
        let label = event.target.nextElementSibling;
        setForm({ ...form, [event.target.name]: event.target.files[0] });

        const labelVal = "Змінити фото";
        if (event.target.files && event.target.files.length > 1)
            fileName = (event.target.getAttribute('data-multiple-caption') || '').replace('{count}', event.target.files.length);
        else
            fileName = event.target.value.split("\\").pop(); console.log(fileName);

        if (fileName) {
            label.innerHTML = fileName;
            let oFReader = new FileReader();
            oFReader.readAsDataURL(event.target.files[0])

            oFReader.onload = function (oFREvent) {
                setNewimg(oFREvent.target.result);
            }
        }
        else {
            label.innerHTML = labelVal;
        }
    }

    const sureHandler = async event => {
        event.preventDefault();
        const form = document.getElementById("update-form");
        const dialog = document.getElementById("dialog-sure");
        console.log(form.name.value);
        if (form.name.value != props.user.name || form.surname.value != props.user.surname || form.gender.value != props.user.gender || form.age.value != props.date || form.email.value != props.user.email || newimg != props.img) {
            try {
                const formData = new FormData();
                formData.append("email", form.email.value);
                const data = await request('/api/email/sendforgotkode', 'POST', formData).then(res => {
                    dialog.showModal();
                    setCode(res.code);
                    clearInterval(timer);
                    initTimer();

                });
            } catch (e) { }
        }
    }

    const showhidedialogHandler = () => {
        console.log("dialog");
        const dialog = document.getElementById("dialog-sure");
        if (!dialog.open) {
            dialog.showModal();
        }
        else {
            dialog.close();
        }
    }

    const changeStatusdialog = async event => {
        const form = document.getElementById("update-form");
        const formData = new FormData(form);
        showhidedialogHandler();
        try {
            await request(`/api/auth/updateinfo/${auth.userId}`, 'POST', formData, { Authorization: `Bearer ${auth.token}` }).then(res => {
                    auth.changeName(res.name);
                    // ToastSuccessHandler(res.message, props.showchangeHandler());
                    props.getuserinfoHandler();
                    props.setStatus(false);

            });
        }
        catch (e) { }
    }

    return (
        <>
            <div className="flex-column  flex-center">
                <form className="form-dark flex-column" id="update-form" onSubmit={sureHandler}>
                    <div id="registration-photo" className="photo flex-row flex-justify-center margin-top-bottom">
                        <img id="uploadPreview-update" className="uploadPreview" src={newimg} alt="img" />
                    </div>
                    <div className="row-dark flex-column">
                        <div id="error" className="error display-none"></div>
                    </div>
                    <div className="row-dark flex-column">
                        <input className="dark-inp" required type="text" minLength="2" maxLength="30" name="name" placeholder="Введіть ім'я" defaultValue={props.user.name} />
                        <label htmlFor="name" className="lb1">Ім'я</label>
                    </div>
                    <div className="row-dark flex-column">
                        <input className="dark-inp" required type="text" minLength="2" maxLength="30" name="surname" placeholder="Введіть прізвище" defaultValue={props.user.surname} />
                        <label htmlFor="surname" className="lb1">Прізвище</label>
                    </div>
                    <div className="row-dark flex-column">
                        <input className="dark-inp" name="age" type="date" required defaultValue={props.date} max="2018-01-01"></input>
                        <label htmlFor="age" className="lb1">Дата народження</label>
                    </div>
                    <div className="row-dark flex-column">
                        <select className="dark-inp" name="gender" required>

                            <option value={props.user.gender}>{props.gender}</option>
                            {props.user.gender == "man" ? <option value="woman">Жінка</option> : <option value="man">Чоловік</option>}
                        </select>
                        <label htmlFor="gender" className="lb1">Стать</label>
                    </div>
                    <div className="row-dark flex-column">
                        <input className="dark-inp" required type="email" minLength="4" maxLength="80" name="email" placeholder="Введіть email" defaultValue={props.user.email} />
                        <label htmlFor="email" className="lb1">Електронна пошта</label>
                    </div>
                    <div className="row-dark flex-column">
                        <input className="inp-file" type="file" id="photo" name="photo" accept=".jpg, .png, .gif" onChange={filechangehandler} />
                        <label htmlFor="photo" className="lb-photo">Змінити фото</label>
                        <label className="lb1">Фото</label>
                    </div>
                    <div className="flex-row flex-center gap">
                        <button className="cancel-btn" onClick={props.showchangeHandler}>Відмінити</button>
                        <input type="submit" className="approve-btn" value="Зберегти" />
                    </div>
                </form>
            </div>
            <dialog id="dialog-sure" className="dialog-code">
                <CloseSvg id="dialog-sure"></CloseSvg>
                <Checkcodeform code={code} sendcodeHandler={sureHandler} changeStatusdialog={changeStatusdialog} htext="Підтвердження дії"></Checkcodeform>
            </dialog>
            <ToastContainer />
        </>
    )
}