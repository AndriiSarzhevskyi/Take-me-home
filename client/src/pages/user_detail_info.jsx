import { useEffect, useState, useContext, useCallback } from "react";
import { HeaderDark } from "../components/Header_Dark";
import { useHttp } from "../hooks/http.hook";
import { CloseSvg } from "../components/Close_svg";
import { AuthContext } from "../context/Auth.context";
import { ModalImage } from "../components/Modal_image_full_screen";
import { ToastErrorHandler } from "../handlers/ToastError";
import { ToastContainer } from "react-toastify"
import { AdsList } from "../components/AdsList";
import 'react-toastify/dist/ReactToastify.css';

export const UserDetail = () => {
    const auth = useContext(AuthContext);
    const { request,/*loading,*/ error } = useHttp();
    const [userinfo, setUserinfo] = useState();
    const [img, setImg] = useState();
    const [gender, setGender] = useState();
    const [age, setAge] = useState();
    const [date, setDate] = useState();
    const [showModal, setShowModal] = useState(false);
    const [showImageSrc, setShowImageSrc] = useState();
    const [ads, setAds] = useState();
    const [comments, setComments] = useState();

    useEffect(() => {
        getuserinfoHandler();
        getAdsHandler();
        getCommentsHandler();
        console.log(comments);
    }, []);

    useEffect(() => {
        if (userinfo != null) {
            if (userinfo.photo_path != null) {
                setImg(userinfo.photo_path);
            }
            if (userinfo.gender == "man") {
                setGender("Чоловік")
            }
            if (userinfo.gender == "woman") {
                setGender("Жінка");
            }
            const now = new Date(userinfo.age);

            // let t = (now.getFullYear() + "-").toString();
            // if (now.getMonth() < 10) {
            //     t += ("0" + now.getMonth() + "-").toString();
            // }
            // else if (now.getMonth() >= 10) {
            //     t += (now.getMonth() + "-").toString();
            // }
            // if (now.getDate() < 10) {
            //     t += ("0" + now.getDate()).toString();
            // }
            // else {
            //     t += now.getDate().toString();
            // }
            // setDate(t);
            let tmp = now.toLocaleDateString('eu');
            setAge(tmp);
        }
    }, [userinfo]);

    useEffect(() => {
        console.log(comments);
    }, [comments]);

    const getuserinfoHandler = async event => {
        try {
            const pathArray = window.location.pathname.split('/');
            const value = pathArray.pop();
            await request(`/api/user/${value}`, 'GET', null, { Authorization: `Bearer ${auth.token}` })
                .then(res => {
                    setUserinfo(res);

                });
        }
        catch (e) {
            if (error) {
                ToastErrorHandler(error);
            }
        }
    }

    const getAdsHandler = useCallback(async () => {
        try {
            const pathArray = window.location.pathname.split('/');
            const value = pathArray.pop();
            const formData = new FormData();
            formData.append("UserId", value);
            const res = await request('/api/ad/getuserads', 'POST', formData, { Authorization: `Bearer ${auth.token}` });
            setAds(res.data);
        } catch (e) {
            if (error != null) {
                ToastErrorHandler(error);
            } else {
                ToastErrorHandler("Сталася помилка");
            }
        }
    }, [error, request]);

    const getCommentsHandler = useCallback(async () => {
        try {
            const pathArray = window.location.pathname.split('/');
            const value = pathArray.pop();
            const formData = new FormData();
            formData.append("UserId", value);
            const res = await request('/api/ad/getusercomments', 'POST', formData, { Authorization: `Bearer ${auth.token}` });
            setComments(res.data);
        } catch (e) {
            if (error != null) {
                ToastErrorHandler(error);
            } else {
                ToastErrorHandler("Сталася помилка");
            }
        }
    }, [error, request]);

    const showImageFullscreenHandler = event => {
        const dialog = document.getElementById("img-dialog");
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
            <ToastContainer />
            <HeaderDark></HeaderDark>
            <div className="main-second-frame flex-column background-paws">
                <div className="information-block form-castom margin-registration width-80-percent ad-res-margin-bottom">
                    <h1 className="info-h">Особиста інформація</h1>
                    {userinfo != undefined &&
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
                            </div>
                            {showModal === true &&
                                <dialog id="img-dialog" className="dialog-img">
                                    <CloseSvg id={"img-dialog"}></CloseSvg>
                                    <ModalImage src={showImageSrc} ></ModalImage>
                                </dialog>
                            }
                        </div>
                    }
                </div>

                <div className="flex-column no-wrap">
                    <div className="orange-color myads-h">Оголошення користувача</div>

                    {/* <img src={img} /> */}
                    <div className="ad-container">

                        {ads != null && ads.map((ad) => {
                            return <AdsList key={ad.AdId} ad={ad}></AdsList>
                        })
                        }
                        {ads == null || (Array.isArray(ads) && ads.length == 0) && <h1 className="info-h txt-center">Оголошень не знайдено</h1>}
                    </div>
                </div>

                <div className="flex-column no-wrap">
                    <div className="orange-color myads-h">Прокоментовані оголошення</div>

                    {/* <img src={img} /> */}
                    <div className="ad-container">

                        {comments != null && comments.map((ad) => {
                            return <AdsList key={ad.AdId} ad={ad}></AdsList>
                        })
                        }
                        {comments == null || (Array.isArray(comments) && comments.length == 0) && <h1 className="info-h txt-center">Оголошень не знайдено</h1>}
                    </div>
                </div>

            </div>
        </div>
    )
}