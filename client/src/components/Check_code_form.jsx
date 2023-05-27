import { useEffect } from "react";
import { initTimer, timer } from "../functions";
export const Checkcodeform = (props) => {

    useEffect(() => {
        clearInterval(timer);
        console.log(timer);
        initTimer();
    }, [props]);

    const checkCodeHandler = async event => {
        event.preventDefault();
        const form = event.target;
        const label = document.getElementById("check-code-label");
        const dialog = document.getElementById("dialog-code-check");
        try {
            if (form.code.value == props.code) {
                label.innerHTML = "Введіть код з повідомлення";
                label.style.color = "black";
                if (props.htext != "") {
                    dialog.close();
                }
                props.changeStatusdialog();

            }
            else {
                label.innerHTML = "Невірний код";
                label.style.color = "red";
            }
        } catch (e) { }
    }

    return (
        <form id="codecheckForm" className="form-dark flex-column" method="dialog" onSubmit={checkCodeHandler}>
            <div className="row flex-center">
                <h1 className="h-about-txt h-center">{props.htext}</h1>
            </div>
            < div className="row-dark flex-column ">
                <input className="dark-inp" required type="number" minLength="6" maxLength="6" name="code" />
                <label htmlFor="code" className="lb2" id="check-code-label">Введіть код з повідомлення</label>
            </div>
            <div div className="row-dark flex-column flex-center">
                <input type="submit" className="submit-dark" value="Перевірити" />
                <div id="send-again-timer" className="timer"></div>
                <button id="send-again" className="display-none timer send-again-btn" onClick={props.sendcodeHandler}>Відправити код повторно</button>
            </div>
        </form>
    );
};
