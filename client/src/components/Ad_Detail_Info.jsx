import { useState, useEffect, useContext } from 'react'
import { useNavigate } from "react-router-dom"
import { useHttp } from "../hooks/http.hook";
import { AuthContext } from "../context/Auth.context";
import { Comment } from './Comment';
import { AdUpdate } from './Ad_Update';
import { CloseSvg } from './Close_svg';

export const AdDetailInfo = (props) => {
    const auth = useContext(AuthContext);
    const navigate = useNavigate();
    const { request,/*loading,*/ error } = useHttp();
    const [comments, setComments] = useState();
    const [update, setUpdate] = useState(false);
    const [statusPart, setStatusPart] = useState();
    const [greencolor, setGreenColor] = useState("");
    const [greenborder, setGreenBorder] = useState("");

    useEffect(() => {
        getcommentsHandler();
        console.log(auth.status);
        if (props.adinfo != null) {
            if (props.adinfo.status == "found") {
                const spaceIndex = props.adinfo.status.indexOf(' ');
                let tmp = [];

                tmp.push(props.adinfo.status.substring(0, spaceIndex));
                tmp.push(props.adinfo.status.substring(spaceIndex + 1));
                setStatusPart(tmp);
            }
            if (props.adinfo.status == "Знайдено" || props.adinfo.status == "Володаря знайдено") {
                console.log("done");
                setGreenColor("green-color");
                setGreenBorder("green-border");
            }
        }
    }, [props]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            getcommentsHandler();
        }, 60000);

        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        console.log(comments);
    }, [comments]);

    const sliderImgHandler = event => {
        event.preventDefault();
        let imgmas = [];
        for (let i in props.photobase64) {
            imgmas.push(props.photobase64[i].ImagePath);
        }
        const position = imgmas.indexOf(props.img);
        console.log(imgmas);
        if (event.target.name == "previous") {
            if (position == 0) {
                props.setImg(imgmas[imgmas.length - 1]);
            }
            else {
                props.setImg(imgmas[position - 1]);
            }
        }
        if (event.target.name == "next") {
            if (position == imgmas.length - 1) {
                props.setImg(imgmas[0]);
            }
            else {
                props.setImg(imgmas[position + 1]);
            }
        }
    }

    const updateStatusHandler = async event => {
        const type = event.target.name;
        console.log(type);
        let newstatus;
        if (type == "status-pet") {
            newstatus = "Знайдено";
        }
        else {
            newstatus = "Володаря знайдено";
        }
        try {
            const formData = new FormData();
            formData.append("AdId", props.adinfo.AdId);
            formData.append("status", newstatus);
            await request(`/api/ad/updatestatus`, 'POST', formData, { Authorization: `Bearer ${auth.token}` }).then(res => {
                props.getadinfoHandler();
            });
        }
        catch (e) { }
    }

    const sendcommentHandler = async event => {
        event.preventDefault();
        console.log("send");
        if (auth.isAuthenticated == true) {
            try {
                const formData = new FormData(event.target);
                event.target.reset();
                formData.append("UserId", auth.userId);
                formData.append("AdId", props.adinfo.AdId);
                const res = await request('/api/comments/create', 'POST', formData, { Authorization: `Bearer ${auth.token}` });
                getcommentsHandler();
            }
            catch (e) { }
        }
    }

    const getcommentsHandler = async () => {
        try {
            console.log("getcom");
            const formData = new FormData();
            formData.append("AdId", props.adinfo.AdId);
            const res = await request('/api/comments/getcomments', 'POST', formData);
            setComments(res.comments);
        }
        catch (e) { console.log(e) };
    }

    const showupdateHandler = () => {
        if (update == false) {
            setUpdate(true);
        }
        else {
            setUpdate(false);
        }
    }

    const deleteAdHandler = async () => {
        try {
            const formData = new FormData();
            formData.append("UserId", auth.userId);
            formData.append("AdId", props.adinfo.AdId);
            const res = await request('/api/ad/delete', 'POST', formData, { Authorization: `Bearer ${auth.token}` });
            navigate("/");
        }
        catch (e) {
            props.ToastErrorHandler(error);
        }
    }

    const showhidedialogHandler = event => {
        event.preventDefault();
        console.log("dialog");
        const dialog = document.getElementById("dialog-sure-delete-ad");
        if (!dialog.open) {
            dialog.showModal();
        }
        else {
            dialog.close();
        }
    }

    return (
        <div className="main-second-frame flex-column">
            <div className={`information-block ${props.class} form-castom margin-registration width-80-percent`}>
                <h1 className={`info-h ${greencolor}`}>Детальна інформація</h1>
                {update == false && <div className={`info-flex-block ${greenborder}`}>
                    <div className='flex-column flex-center'>
                        {!Array.isArray(props.photobase64) || props.photobase64.length <= 1 && props.photobase64 != null &&
                            <div id="registration-photo" className="photo-info flex-row flex-justify-center">
                                <img id="adPreview" className="infoPreview" alt="img" onClick={props.showImageFullscreenHandler} src={props.img} />
                            </div>
                        }
                        {Array.isArray(props.photobase64) && props.photobase64.length > 1 &&
                            <div className="flex-row flex-center">
                                <div id="registration-photo" className="photo-info flex-row flex-justify-center position-relative">
                                    <button className="img-btn previous-img" name="previous" onClick={sliderImgHandler}></button>
                                    <button className="img-btn next-img" name="next" onClick={sliderImgHandler}></button>
                                    <img id="adPreviewslider" className="infoPreview" alt="img" onClick={props.showImageFullscreenHandler} src={props.img} />
                                </div>
                            </div>}
                        {props.adinfo != null && auth.isAuthenticated === true && (props.adinfo.User.UserId == auth.userId || auth.status == "admin") && props.adinfo.status == "Не знайдено" && props.adinfo.type == "lost" &&
                            <button className='change-status-btn' name="status-pet" onClick={updateStatusHandler}>Змінити статус на знайдено</button>
                        }
                        {props.adinfo != null && auth.isAuthenticated === true && (props.adinfo.User.UserId == auth.userId || auth.status == "admin") && props.adinfo.status == "Володаря не знайдено" && props.adinfo.type == "found" &&
                            <button className='change-status-btn' name="status-owner" onClick={updateStatusHandler}>Змінити статус на володаря знайдено</button>
                        }
                    </div>
                    {props.adinfo != null &&
                        <div className='flex-row justify-around'>
                            <div className="flex-column  flex-center">
                                <div className={`orange-color ad-mini-h ${greencolor}`}>Інформація про оголошення</div>
                                <table className="table-info-dark right-border-orange">
                                    <tbody>
                                        <tr>
                                            <td>Статус оголошення:</td>
                                            <td>{props.adinfo.status}</td>
                                            {/* {props.adinfo.type == "found" ?<td>{statusPart[0]}<br></br>{statusPart[1]}</td>: <td>{props.adinfo.status}</td> } */}
                                        </tr>
                                        {props.adinfo.type == "lost" &&
                                            <tr>
                                                {props.adinfo.Pet.gender == "woman" ? <td>Зникла:</td> : <td>Зник:</td>}
                                                <td>{props.adinfo.Date}</td>
                                            </tr>
                                        }
                                        <tr>
                                            <td>Де:</td>
                                            <td>{props.adinfo.Ukraine.public_name_uk}</td>
                                        </tr>
                                        <tr>
                                            <td>Кличка:</td>
                                            <td>{props.adinfo.Pet.name}</td>
                                        </tr>
                                        {props.adinfo.type == "found" &&
                                            <tr>
                                                {props.adinfo.Pet.gender == "woman" ? <td>Знайдена:</td> : <td>Знайдений:</td>}
                                                <td>{props.adinfo.Date}</td>
                                            </tr>
                                        }

                                        <tr>
                                            <td>Категорія тварин:</td>
                                            {props.adinfo.Pet.Pet_category.category == "cat" && <td>Кішки</td>}
                                            {props.adinfo.Pet.Pet_category.category == "dog" && <td>Собаки</td>}
                                            {props.adinfo.Pet.Pet_category.category == "another" && <td>Інші</td>}
                                        </tr>

                                        {props.adinfo.Pet.chipnumber != "" &&
                                            <tr>
                                                <td>Номер чіпу:</td>
                                                <td>{props.adinfo.Pet.chipnumber}</td>
                                            </tr>
                                        }
                                        <tr>
                                            <td>Стать:</td>
                                            {props.adinfo.Pet.gender == "man" ? <td>Чоловіча</td> : <td>Жіноча</td>}
                                        </tr>
                                        <tr>
                                            <td>Колір:</td>
                                            <td>{props.adinfo.Pet.color}</td>
                                        </tr>
                                        <tr>
                                            <td className="text-align">Опис:</td>

                                        </tr>
                                        <tr>
                                            <td colSpan="2" className="padding-none width-about">
                                                {props.adinfo.About}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>

                            </div>
                            <div className="flex-column">
                                {props.adinfo.type == "lost" ?
                                    <div className={`orange-color ad-mini-h ${greencolor}`}>Контактні дані власника</div> :
                                    <div className={`orange-color ad-mini-h ${greencolor}`}>Контактні дані знайшовшого</div>
                                }
                                <table className="table-info-dark">

                                    <tbody>
                                        <tr>
                                            <td>Ім'я:</td>
                                            <td>{props.adinfo.User.name}</td>
                                        </tr>
                                        <tr>
                                            <td>Прізвище:</td>
                                            <td>{props.adinfo.User.surname}</td>
                                        </tr>
                                        <tr>
                                            <td className="text-align">Пошта:</td>

                                        </tr>
                                        <tr>
                                            <td colSpan="2" className="padding-none width-about">{props.adinfo.User.email}</td>
                                        </tr>
                                    </tbody>
                                </table>
                                {auth.isAuthenticated == true && (props.adinfo.User.UserId == auth.userId || auth.status == "admin")&&
                                    <div className="flex-column flex-center">
                                        <button className="info-btn-dark" onClick={showupdateHandler}>Редагувати</button>
                                        <button className="info-btn-dark" onClick={showhidedialogHandler}>Видалити</button>
                                    </div>
                                }
                            </div>
                        </div>
                    }

                    <div className='flex-column comment-block'>
                        <div className={`orange-color ad-mini-h ${greencolor}`}>Коментарі</div>
                        <div className='comment-section scrollable'>
                            {comments != null && comments.length == 0 && <>Для цього оголошення ще немає коментарів, станьте першим.</>}

                            {comments != null && comments.length > 0 && comments.map((comment) => {
                                return <Comment key={comment.CommentId} comment={comment} ad={props.adinfo} ToastErrorHandler = {props.ToastErrorHandler} getcommentsHandler = {getcommentsHandler}></Comment>
                            })
                            }

                        </div>
                        {auth.isAuthenticated == true &&
                            <form className='comment-form' onSubmit={sendcommentHandler}>
                                <input type='text' name='comment' className='comment-inp' placeholder='Додайте коментар' minLength="1" maxLength="255"></input>
                                <input type='submit' className='send-comment-btn' value=""></input>
                            </form>
                        }
                    </div>
                </div>}
                {update == true &&
                    <div className="info-flex-block">
                        <AdUpdate showImageFullscreenHandler={props.showImageFullscreenHandler} ToastErrorHandler={props.ToastErrorHandler} adinfo={props.adinfo} img={props.img} photobase64={props.photobase64} getadinfoHandler={props.getadinfoHandler} setUpdate={setUpdate}></AdUpdate>
                    </div>
                }
            </div>
            <dialog id="dialog-sure-delete-ad" className="dialog-code">
                <CloseSvg id="dialog-sure-delete-ad"></CloseSvg>
                <form id="codecheckForm" className="form-dark flex-column" method="dialog" onSubmit={deleteAdHandler}>
                    <div className="row flex-center">
                        <h1 className="h-about-txt h-center">Ви впевнені, що хочете видалити оголошення?</h1>
                    </div>
                    <div className="flex-row flex-center gap">
                        <button className="cancel-btn" onClick={showhidedialogHandler}>Відмінити</button>
                        <input type="submit" className="approve-btn" value="Зберегти" />
                    </div>
                </form>
            </dialog>
        </div>
    )
}