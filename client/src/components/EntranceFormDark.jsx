import React from "react";
import { useHttp } from "../hooks/http.hook";
import { AuthContext } from '../context/Auth.context';
import { useContext } from 'react';
import { showError, clearError, checkFields, initTimer, timer, showhidepassHandler } from "../functions";
import { Link } from "react-router-dom";
export const EntranceformDark = () => {

    const auth = useContext(AuthContext);
    const { request,/*loading,*/ error } = useHttp();

    const forgotpassHandler = event => {
        event.preventDefault();
        const dialog = document.getElementById("dialog-code-check");
        dialog.showModal();
    }

    const loginHandler = async event => {
        event.preventDefault();
        const loginform = event.target;
        const formData = new FormData(loginform);
        if (checkFields("password", "lblpassword") === true) {
            try {
                clearError();
                await request('/api/entrance/login', 'POST', formData).then(res => {
                    auth.login(res.token, res.userId, res.name, res.status);
                });

            } catch (e) {
                if (error) {
                    showError(error);
                }
            }
        }
    }

    return (
        <form className="form-dark flex-column" id="entrance-form" onSubmit={loginHandler}>
            <div className="row-dark flex-column">
                <input id = "email" className="dark-inp" required type="email" minLength="4" maxLength="30" name="email" placeholder="Введіть пошту" />
                <label htmlFor="email" className="lb1">
                    Пошта
                </label>
            </div>
            <div className="row-dark flex-column">
                <div className="pass">
                    <input className="dark-inp paswidth" required type="password" id="password" name="password" placeholder="Введіть пароль" />
                    <button className="password-control" type="button" onClick={showhidepassHandler}></button>
                </div>
                <label htmlFor="password" className="lb1" id="lblpassword">
                    Пароль
                </label>
            </div>
            <input type="submit" className="submit-dark" value="Увійти" />
            <p className="txt-or">Або</p>
            <div className="flex-row btn-line-group">
                <Link className="link orange-color" to={`/registration`}>
                    Зареєструватися
                </Link>
                <button className="link white-color" onClick={forgotpassHandler}>
                    Забули пароль?
                </button>
            </div>
        </form>
    );
}
