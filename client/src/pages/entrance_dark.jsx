
import { useHttp } from "../hooks/http.hook";
import { useState, useEffect, useContext } from 'react';
import { showError, clearError, initTimer, timer } from "../functions";

import { CloseSvg } from '../components/Close_svg';
import { HeaderDark } from "../components/Header_Dark";
import { EntranceformDark } from "../components/EntranceFormDark";
import { Resetpass_form_Dark } from "../components/Resertpass_form_Dark";
import { Emailverifyform } from "../components/Email_verify_form";
import { Checkcodeform } from "../components/Check_code_form";

export const EntranceDark = () => {
    const { request,/*loading,*/ error } = useHttp();
    const [code, setCode] = useState();
    const [email, setEmail] = useState();
    const [status, setStatus] = useState(false);
    const [statusdialog, setStatusdialog] = useState(false);
    const [htxt, setHtxt] = useState("Вхід");

    useEffect(() => {
        if (error) {
            showError(error);
        }
    }, [error]);

    const changeStatus = () => {
        setStatus(false);
        setHtxt("Вхід");
    }

    const changeStatusdialog = () => {
        setStatusdialog(false);
        setStatus(true);
        setHtxt("Зміна паролю");
    }

    const sendcodeHandler = async event => {
        event.preventDefault();
        const emailform = event.target;
        const formData = new FormData(emailform);
        const label = document.getElementById("email-code-label");
        try {
            clearError();
            const data = await request('/api/email/sendforgotkode', 'POST', formData).then(res => {
                label.innerHTML = "Електронна пошта";
                label.style.color = "black";
                
                setStatusdialog(true);
                setCode(res.code);
                setEmail(emailform.email.value);
                if(statusdialog === true){
                    clearInterval(timer);
                    console.log(timer);
                    initTimer();
                }
            });
        } catch (e) {
            label.innerHTML = error;
            label.style.color = "red";
        }
    }

    return (
        <div className="main-dark">
            <HeaderDark></HeaderDark>
            <div className="main-second-frame flex-column ">
                <div className="form-block form-castom margin-entrance">
                    <h1 className="form-h" id="h-entrance">{htxt}</h1>
                    <div className="row-dark flex-row flex-center">
                        <div id="error" className="error display-none">dsss</div>
                    </div>
                    {status === false ? <EntranceformDark></EntranceformDark> : <Resetpass_form_Dark email={email} changeStatus={changeStatus}></Resetpass_form_Dark>}
                </div>

                <dialog id="dialog-code-check" className="dialog-code">
                    <CloseSvg id="dialog-code-check"></CloseSvg>
                    {statusdialog === false ?
                        <Emailverifyform sendcodeHandler={sendcodeHandler}></Emailverifyform>
                        : <Checkcodeform code={code} sendcodeHandler={sendcodeHandler} changeStatusdialog={changeStatusdialog} htext={`Підтвердження дії`}></Checkcodeform>
                    }
                </dialog>f
            </div>
        </div>
    )
}