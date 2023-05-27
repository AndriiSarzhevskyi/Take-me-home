import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom"
import { AuthContext } from "../context/Auth.context";
export const HeaderDark = (props) => {
    const auth = useContext(AuthContext);
    const [name, setName] = useState();
    const [showAdaptive, setShowAdaptive] = useState(false);

    useEffect(() => {
        console.log(auth.isAuthenticated);
        if (auth.isAuthenticated) {
            let nametxt = auth.userName.toString();
            if (nametxt.length > 10) {
                nametxt = nametxt.substring(0, 10) + "...";
            }
            setName(nametxt);
        }
    }, [auth.isAuthenticated]);

    const dropdownHandler = () => {
        document.getElementById("myDropdown").classList.toggle("show");
    }

    const logoutHandler = event => {
        event.preventDefault();
        auth.logout();
    }

    const showAdaptiveMenuHandler = () => {
        setShowAdaptive(true);
        const sidebar = document.getElementById("adaptive-menu");
        sidebar.classList.toggle('show-a');
    }

    return (
        <header className="header-dark flex-row flex-align-center">
            <div className="header-content  flex-row flex-align-center">

                <Link className="decoration-none logo" to={`/`}>
                    Take me home
                    <div className="logo-svg"></div>
                </Link>

                <div className="navigation-block flex-row flex-align-center">
                    <div className="navigate flex-row flex-align-center">
                        {props.type == "found" ? <Link to={`/found`} className="orange-color">Знайдені</Link> : <Link to={`/found`}>Знайдені</Link>}
                        {props.type == "lost" ? <Link to={`/lost`} className="orange-color">Зниклі</Link> : <Link to={`/lost`}>Зниклі</Link>}
                        {auth.isAuthenticated === false && <Link to={`/entrance`}>Додати оголошення</Link>}
                        {auth.isAuthenticated === true && props.type == "createad" && <Link to={`/create`} className="orange-color">Додати оголошення</Link>}
                        {auth.isAuthenticated === true && props.type != "createad" && <Link to={`/create`} >Додати оголошення</Link>}
                    </div>
                    {auth.isAuthenticated === false && <Link className="entrance-button" to={`/entrance`}>Увійти</Link>}
                    {auth.isAuthenticated === true && <button className="usermenu link white-color flex-row flex-center" onClick={dropdownHandler}>
                        <div className="flex-row flex-center">{name}<img className="user" src=" /svg/personal_cabinet.svg" /></div>
                    </button>}
                    {auth.isAuthenticated === true && <div className="dropdown-content flex-column" id="myDropdown">
                        <Link to={`/user/${auth.userId}`}>Особиста інформація</Link>
                        <Link to={`/myads`}>Мої оголошення</Link>
                        <Link to={`/mycomments`}>Мої коментарі</Link>
                        {auth.status == "admin" && <Link to={`/userslist`}>Список користувачів</Link>}
                        <button className="drop-btn" onClick={logoutHandler}>Вийти</button>
                    </div>
                    }
                </div>

                <div className="adaptive-navigate-none">
                    <button className="burger-btn" onClick={showAdaptiveMenuHandler}></button>
                </div>
                {/* {showAdaptive === true  && */}
                <div id="adaptive-menu" className="adaptive-navigation">
                    <nav className="flex-column">
                        <ul>
                            <li className="flex-column  nav-li">
                                {props.type == "found" ? <Link to={`/found`} className="orange-color">Знайдені</Link> : <Link to={`/found`}>Знайдені</Link>}
                            </li >
                            <li className="flex-column nav-li">
                                {props.type == "lost" ? <Link to={`/lost`} className="orange-color">Зниклі</Link> : <Link to={`/lost`}>Зниклі</Link>}
                            </li>
                            <li className="flex-column nav-li"> {auth.isAuthenticated === false && <Link to={`/entrance`}>Додати оголошення</Link>}
                                {auth.isAuthenticated === true && props.type == "createad" && <Link to={`/create`} className="orange-color">Додати оголошення</Link>}
                                {auth.isAuthenticated === true && props.type != "createad" && <Link to={`/create`} >Додати оголошення</Link>}
                            </li>
                            {auth.isAuthenticated === false &&
                                <li className="flex-column nav-li"><Link className="" to={`/entrance`}>Увійти</Link></li>
                            }
                            {auth.isAuthenticated === true &&
                                <li className="flex-column nav-li"> <div className="nav-h">Особистий кабінет</div>
                                    <ul>
                                        <li className="flex-column nav-li"><Link to={`/user/${auth.userId}`}>Особиста інформація</Link></li>
                                        <li className="flex-column nav-li"><Link to={`/myads`}>Мої оголошення</Link></li>
                                        <li className="flex-column nav-li"><Link to={`/mycomments`}>Мої коментарі</Link></li>
                                        {auth.status == "admin" && <li className="flex-column nav-li"><Link to={`/userslist`}>Список користувачів</Link></li>}
                                        <button className="nav-btn" onClick={logoutHandler}>Вийти</button>
                                    </ul>

                                </li>
                            }
                        </ul>
                    </nav>
                </div>

            </div>
        </header>
    )
}