import { useState, useContext } from "react"
import { AuthContext } from "../context/Auth.context";
import { useHttp } from "../hooks/http.hook";
// import { AutosuggestComp } from "./Autosuggest_comp"
import { CloseSvg } from "./Close_svg";


export const AdUpdate = (props) => {
    const auth = useContext(AuthContext);
    const { request,/*loading,*/ error } = useHttp();
    const [img, setImg] = useState(props.img);
    // const [citie, setCitie] = useState({Id: props.adinfo.Ukraine.Id, public_name_uk: props.adinfo.Ukraine.public_name_uk});
    const [photobase64, setPhotobase64] = useState(props.photobase64);
    const [form, setForm] = useState({
        name: '', surname: '', age: '', gender: '', email: '', password: '', photo: ''
    })

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
            setPhotobase64(arr);
        }
        else {
            let oFReader = new FileReader();
            oFReader.readAsDataURL(event.target.files[0])

            oFReader.onload = function (oFREvent) {
                setPhotobase64(oFREvent.target.result);
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

    const updateAdHandler = async event => {
        event.preventDefault();
        try {
            const form = document.getElementById("updateAd-form");
            const formData = new FormData(form);
            formData.append("AdId", props.adinfo.AdId);
            formData.append("UserId", auth.userId);
            formData.append("PetId", props.adinfo.Pet.PetId);
            const res = await request('/api/ad/update', 'POST', formData, { Authorization: `Bearer ${auth.token}` });
            console.log(res.message);
            window.location.reload();
            // showhidedialogHandler();
            // props.getadinfoHandler();
            // props.setUpdate();
        }
        catch (e) { 
            props.ToastErrorHandler(error);
        }
    }

    const showhidedialogHandler = event => {
        event.preventDefault();
        console.log("dialog");
        const dialog = document.getElementById("dialog-sure");
        if (!dialog.open) {
            dialog.showModal();
        }
        else {
            dialog.close();
        }
    }

    return (

        <div className="info-flex-block">
            <h1 className="info-h">Редагування оголошення</h1>
            <div className="info-flex-block">
                {((Array.isArray(photobase64) && photobase64.length <= 1) || (!Array.isArray(photobase64))) && (
                    <div className="flex-row">
                        <div id="registration-photo" className="photo-info-ad-update flex-row flex-justify-center">
                            <img id="adPreview" className="infoPreview" alt="img" onClick={props.showImageFullscreenHandler} src={img} />
                        </div>
                    </div>
                )}
                {Array.isArray(photobase64) && photobase64.length > 1 &&
                    <div className="flex-row">
                        <div id="registration-photo" className="photo-info-ad-update flex-row flex-justify-center position-relative">
                            <button className="img-btn previous-img" name="previous" onClick={sliderImgHandler}></button>
                            <button className="img-btn next-img" name="next" onClick={sliderImgHandler}></button>
                            <img id="adPreviewslider" className="infoPreview" alt="img" onClick={props.showImageFullscreenHandler} src={img} />
                        </div>
                    </div>}
                <div className="flex-column  flex-center">
                    <form className="form-dark flex-column" id="updateAd-form" onSubmit={showhidedialogHandler}>
                        <div className=" flex-column">
                            <table className="table-info-dark">

                                <tbody>
                                    <tr>
                                        <td>Фото тварини:</td>
                                        <td>
                                            <div className="ad-inp-width  flex-row">
                                                <input className="ad-inp-file" type="file" multiple id="photo" name="photo" onChange={filechangehandler} accept=".jpg, .png, .gif" />
                                                <label htmlFor="photo" className="lb-photo">Оберіть фото</label>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Тип оголошення:</td>
                                        <td>
                                            <div className="ad-inp-width flex-row">
                                                <select className="dark-inp-ad cll" name="adtype" required>
                                                    {props.adinfo.type == "lost" ? <option value="lost" className="color-black">Зниклі</option> : <option value="found" className="color-black">Знайдені</option>}
                                                    {props.adinfo.type != "lost" ? <option value="lost" className="color-black">Зниклі</option> : <option value="found" className="color-black">Знайдені</option>}
                                                </select>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Категорія тварин:</td>
                                        <td>
                                            <div className="ad-inp-width flex-row">
                                                <select className="dark-inp-ad cll" name="petcategory" required>
                                                    {props.adinfo.Pet.Pet_category.category == "cat" && <>
                                                        <option value="cat" className="color-black">Кішки</option>
                                                        <option value="dog" className="color-black">Собаки</option>
                                                        <option value="another" className="color-black">Інші</option>
                                                    </>}
                                                    {props.adinfo.Pet.Pet_category.category == "dog" && <>
                                                        <option value="dog" className="color-black">Собаки</option>
                                                        <option value="cat" className="color-black">Кішки</option>
                                                        <option value="another" className="color-black">Інші</option>
                                                    </>}
                                                    {props.adinfo.Pet.Pet_category.category == "another" && <>
                                                        <option value="another" className="color-black">Інші</option>
                                                        <option value="dog" className="color-black">Собаки</option>
                                                        <option value="cat" className="color-black">Кішки</option>
                                                    </>}

                                                </select>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Кличка тварини<br></br>(якщо відома):</td>

                                        <td>
                                            <div className="ad-inp-width  flex-row"><input className="dark-inp-ad" type="text" minLength="2" maxLength="30" name="name" placeholder="Введіть кличку тварини якщо відома" defaultValue={props.adinfo.Pet.name} />
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Номер чіпу <br></br>(якщо є):</td>
                                        <td>
                                            <div className="ad-inp-width flex-row">
                                                <input className="dark-inp-ad" type="text" minLength="15" maxLength="15" name="chipnumber" placeholder="Введіть номер чіпу якщо є" defaultValue={props.adinfo.Pet.chipnumber} />
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Колір:</td>
                                        <td>
                                            <div className="ad-inp-width flex-row">
                                                <input className="dark-inp-ad" required type="text" minLength="4" maxLength="100" name="color" placeholder="Опишіть колір тварини" defaultValue={props.adinfo.Pet.color} />
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Стать:</td>
                                        <td>
                                            <div className="ad-inp-width flex-row">
                                                <select className="dark-inp-ad cll" name="gender" required>
                                                    {props.adinfo.Pet.gender == "man" ?
                                                        <>
                                                            <option value="man" className="color-black">Чоловіча</option>
                                                            <option value="woman" className="color-black">Жіноча</option>
                                                        </> :
                                                        <>
                                                            <option value="woman" className="color-black">Жіноча</option>
                                                            <option value="man" className="color-black">Чоловіча</option>
                                                        </>}

                                                </select>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Дата зникнення:</td>
                                        <td>
                                            <div className="ad-inp-width flex-row">
                                                <input className="dark-inp-ad" name="date" required type="date" defaultValue={props.adinfo.Date}></input>
                                            </div>
                                        </td>
                                    </tr>
                                    {/* <tr>
                                        <td>Місто:</td>
                                        <td>
                                            <div className="ad-inp-width flex-row">
                                                <AutosuggestComp citie={citie} setCitie={setCitie}></AutosuggestComp>
                                            </div>
                                        </td>
                                    </tr> */}
                                    <tr>
                                        <td className="text-align">Опис:</td>
                                        <td>
                                            <div className="ad-inp-width flex-row">
                                                <textarea name="about" className="about-area" maxLength="1000" defaultValue={props.adinfo.About}></textarea>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <input type="submit" className="info-btn-dark" value="Редагувати оголошення" />
                        </div>
                    </form>
                </div>
            </div>
            <dialog id="dialog-sure" className="dialog-code">
                <CloseSvg id="dialog-sure"></CloseSvg>
                <form id="codecheckForm" className="form-dark flex-column" method="dialog" onSubmit={updateAdHandler}>
                    <div className="row flex-center">
                        <h1 className="h-about-txt h-center">Ви впевнені, що хочете внести зміни до оголошення?</h1>
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