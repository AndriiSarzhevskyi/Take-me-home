import { useHttp } from "../hooks/http.hook";
import { showError, clearError, checkFields, showhidepassHandler } from "../functions";

export const Resetpass_form_Dark = (props) => {
    const { request, /*loading,*/ error } = useHttp();

    const resetpasswordHandler = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        formData.append("email", props.email);
        if (checkFields("password1", "lblpassword1") === true) {
            if (checkFields("password2", "lblpassword2") === true) {
                try {
                    clearError();
                    await request("/api/email/resetpassword", "POST", formData).then(
                        (res) => {
                            if (res.message == "Пароль успішно змінено") {
                                props.changeStatus();
                            }
                        }
                    );
                } catch (e) {
                    if (error) {
                        showError(error);
                    }
                }
            }
        }
    };

    return (
        <form id="change-pass-form" className="form-dark flex-column" onSubmit={resetpasswordHandler}>
            <div className="row-dark flex-column">
                <div className="pass">
                    <input className="dark-inp paswidth" required type="password" id="password1" name="password1" placeholder="Введіть пароль" />
                    <button className="password-control" type="button" onClick={showhidepassHandler}></button>
                </div>
                <label htmlFor="password1" className="lb1" id="lblpassword1">
                    Новий пароль
                </label>
            </div>
            <div className="row-dark flex-column">
                <div className="pass">
                    <input className="dark-inp paswidth" required type="password" id="password2" name="password2" placeholder="Повторіть пароль" />
                    <button className="password-control" type="button" onClick={showhidepassHandler}></button>
                </div>
                <label htmlFor="password2" className="lb1" id="lblpassword2">
                    Повторіть пароль
                </label>
            </div>
            <input type="submit" className="submit-dark" value="Змінити пароль" />
        </form>
    );
};
