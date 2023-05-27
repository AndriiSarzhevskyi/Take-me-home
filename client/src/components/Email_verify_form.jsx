
export const Emailverifyform = (props) => {
    return (
        <form id="emailForm" className="form-dark flex-column" method="dialog" onSubmit={props.sendcodeHandler}>
            <h1 className="h-about-txt h-center">Підтвердження пошти</h1>
            <div className="row-dark flex-column">
                <input className="dark-inp" required type="email" minLength="4" maxLength="30" name="email" placeholder="Введіть email" />
                <label htmlFor="email" className="lb2" id="email-code-label">Електронна пошта</label>
            </div>
            <input type="submit" className="submit-dark" value="Відправити код" />
        </form>
    );
};
