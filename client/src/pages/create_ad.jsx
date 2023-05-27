import { useEffect, useState, useContext, Component } from "react";
import {useNavigate} from "react-router-dom"
import { HeaderDark } from "../components/Header_Dark"
import { CloseSvg } from "../components/Close_svg";
import { ModalImage } from "../components/Modal_image_full_screen";
import { useHttp } from "../hooks/http.hook";
import { AuthContext } from "../context/Auth.context";
import { AutosuggestComp } from "../components/Autosuggest_comp";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const CreateAd = () => {
    const auth = useContext(AuthContext);
    const navigate = useNavigate();
    const { request,/*loading,*/ error } = useHttp();
    const [img, setImg] = useState();
    const [showModal, setShowModal] = useState(false);
    const [showImageSrc, setShowImageSrc] = useState();
    const [form, setForm] = useState({
        name: '', surname: '', age: '', gender: '', email: '', password: '', photo: ''
    })
    const [photobase64, setPhotobase4] = useState();
    const [citie, setCitie] = useState();

    const showImageFullscreenHandler = event => {
        setShowModal(true);
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

    function filechangehandler(event) {
        let fileName = '';
        let label = event.target.nextElementSibling;
        setForm({ ...form, [event.target.name]: event.target.files[0] });

        const labelVal = "Оберіть фото";
        if (event.target.files.length > 1) {

            let arr = [];
            for (let i = 0; i < event.target.files.length; i++) {
                let oFReader = new FileReader();
                oFReader.readAsDataURL(event.target.files[i]);
                oFReader.onload = function (oFREvent) {
                    arr.push(oFREvent.target.result);
                    if (i == 0) {
                        setImg(oFREvent.target.result);
                    }
                }
            }
            setPhotobase4(arr);
        }
        else {
            let oFReader = new FileReader();
            oFReader.readAsDataURL(event.target.files[0])

            oFReader.onload = function (oFREvent) {
                setPhotobase4(oFREvent.target.result);
                setImg(oFREvent.target.result);
            }
        }
    }

    const sliderImgHandler = event => {
        event.preventDefault();
        const target = document.getElementById("adPreviewslider");
        const position = photobase64.indexOf(target.src);
        if (event.target.name == "previous") {
            if (position == 0) {
                setImg(photobase64[photobase64.length - 1]);
            }
            else {
                setImg(photobase64[position - 1]);
            }
        }
        if (event.target.name == "next") {
            if (position == photobase64.length - 1) {
                setImg(photobase64[0]);
            }
            else {
                setImg(photobase64[position + 1]);
            }
        }
    }

    const createAdHandler = async event => {
        event.preventDefault();
        if (citie == null) {
            ToastErrorHandler("Оберіть місто! Це обов'язкове поле");
        }
        else {
            try {
                const formData = new FormData(event.target);
                formData.append("city", citie.value);
                formData.append("Id", auth.userId);
                await request('/api/ad/create', 'POST', formData, { Authorization: `Bearer ${auth.token}`})
                    .then(res => {
                        ToastSuccessHandler(res.message);
                        navigate("/myads");
                    });
            }
            catch (e) {
                ToastErrorHandler(error);
            }
        }
    }

    const ToastErrorHandler = (text) => toast.error(`${text}`, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
    });
    const ToastSuccessHandler = (text) => toast.success(`${text}`, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
    });

    return (
        <div className="main-dark">
            <ToastContainer />
            <HeaderDark type = "createad"></HeaderDark>
            <div className="main-second-frame flex-column ">
                <div className="information-block form-castom margin-registration width-80-percent">
                    <h1 className="info-h">Створення оголошення</h1>
                    <div className="info-flex-block">
                        {!Array.isArray(photobase64) && photobase64 != null && <div id="registration-photo" className="photo-info flex-row flex-justify-center">
                            <img id="adPreview" className="infoPreview" alt="img" onClick={showImageFullscreenHandler} src={img} />
                        </div>}
                        {Array.isArray(photobase64) &&
                            <div className="flex-row">
                                <div id="registration-photo" className="photo-info flex-row flex-justify-center position-relative">
                                    <button className="img-btn previous-img" name="previous" onClick={sliderImgHandler}></button>
                                    <button className="img-btn next-img" name="next" onClick={sliderImgHandler}></button>
                                    <img id="adPreviewslider" className="infoPreview" alt="img" onClick={showImageFullscreenHandler} src={img} />
                                </div>
                            </div>}
                        <div className="flex-column  flex-center">
                            <form className="form-dark flex-column" id="regform" onSubmit={createAdHandler}>
                                <div className=" flex-column">
                                    <table className="table-info-dark">

                                        <tbody>
                                            <tr>
                                                <td>Фото тварини:</td>
                                                <td>
                                                    <div className="ad-inp-width  flex-row">
                                                        <input className="ad-inp-file" required type="file" multiple id="photo" name="photo" onChange={filechangehandler} accept=".jpg, .png, .gif" />
                                                        <label htmlFor="photo" className="lb-photo">Оберіть фото</label>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Тип оголошення:</td>
                                                <td>
                                                    <div className="ad-inp-width flex-row">
                                                        <select className="dark-inp-ad cll" name="adtype" required>
                                                            <option value="" className="color-black" disabled selected>Будь-ласка оберіть тип оголошення</option>
                                                            <option value="lost" className="color-black">Зниклі</option>
                                                            <option value="found" className="color-black">Знайдені</option>
                                                        </select>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Категорія тварин:</td>
                                                <td>
                                                    <div className="ad-inp-width flex-row">
                                                        <select className="dark-inp-ad cll" name="petcategory" required>
                                                            <option value="" className="color-black" disabled selected>Будь-ласка оберіть тип категорію</option>
                                                            <option value="cat" className="color-black">Кішки</option>
                                                            <option value="dog" className="color-black">Собаки</option>
                                                            <option value="another" className="color-black">Інші</option>
                                                        </select>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Кличка тварини<br></br>(якщо відома):</td>

                                                <td>
                                                    <div className="ad-inp-width  flex-row"><input className="dark-inp-ad" type="text" minLength="2" maxLength="30" name="name" placeholder="Введіть кличку тварини якщо відома" />
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Номер чіпу <br></br>(якщо є):</td>
                                                <td>
                                                    <div className="ad-inp-width flex-row">
                                                        <input className="dark-inp-ad" type="text" name="chipnumber" placeholder="Введіть номер чіпу якщо є" pattern="[0-9]*" minLength={15} maxLength={15} title="Будь ласка ведіть лише цифри"/>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Колір:</td>
                                                <td>
                                                    <div className="ad-inp-width flex-row">
                                                        <input className="dark-inp-ad" required type="text" minLength="4" maxLength="100" name="color" placeholder="Опишіть колір тварини" />
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Стать:</td>
                                                <td>
                                                    <div className="ad-inp-width flex-row">
                                                        <select className="dark-inp-ad cll" name="gender" required>
                                                            <option value="" className="color-black" disabled selected>Будь-ласка оберіть стать</option>
                                                            <option value="man" className="color-black">Чоловіча</option>
                                                            <option value="woman" className="color-black">Жіноча</option>
                                                        </select>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Дата зникнення/<br></br>знайдення:</td>
                                                <td>
                                                    <div className="ad-inp-width flex-row">
                                                        <input className="dark-inp-ad" name="date" required type="date"></input>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Місто:</td>
                                                <td>
                                                    <div className="ad-inp-width flex-row">
                                                        <AutosuggestComp citie={citie} setCitie={setCitie}></AutosuggestComp>

                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="text-align">Опис:</td>
                                                <td>
                                                    <div className="ad-inp-width flex-row">
                                                        <textarea name="about" className="about-area" maxLength="1000"></textarea>
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <input type="submit" className="info-btn-dark" value="Створити оголошення" />
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            {showModal === true &&
                <dialog id="img-dialog" className="dialog-img">
                    <CloseSvg id={"img-dialog"}></CloseSvg>
                    <ModalImage src={showImageSrc} ></ModalImage>
                </dialog>
            }
        </div>
    );
}