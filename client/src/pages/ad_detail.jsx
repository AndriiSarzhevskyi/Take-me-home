import { useState, useEffect, useContext } from 'react'
import { HeaderDark } from "../components/Header_Dark"
import { ToastContainer, toast } from 'react-toastify';
import { useHttp } from "../hooks/http.hook";
import { AuthContext } from "../context/Auth.context";
import 'react-toastify/dist/ReactToastify.css';
import { CloseSvg } from '../components/Close_svg';
import { ModalImage } from '../components/Modal_image_full_screen';
import { AdDetailInfo } from '../components/Ad_Detail_Info';

export const AdDetail = () => {
    const auth = useContext(AuthContext);
    const { request,/*loading,*/ error } = useHttp();
    const [img, setImg] = useState();
    const [adinfo, setAdinfo] = useState();
    // const [comments, setComments] = useState();
    const [photobase64, setPhotobase64] = useState();
    const [showModal, setShowModal] = useState(false);
    const [showImageSrc, setShowImageSrc] = useState();
    const [res_ad_id, setRes_ad_id] = useState();
    const [res_ad, setRes_ad] = useState();
    const [resimg, setResimg] = useState();
    const [resphotobase64, setResphotobase64] = useState();
    const [classbottom, setClassbottom] = useState("");
    const [classtop, setClasstop] = useState("");

    useEffect(() => {
        getadinfoHandler();
    }, []);

    useEffect(() => {
        getresadHandler();
    }, [res_ad_id]);

    const getadinfoHandler = async () => {
        console.log("A");
        try {
            const pathArray = window.location.pathname.split('/');
            const value = pathArray.pop();
            await request(`/api/ad/getad/${value}`, 'GET', null).then(res => {
                console.log(res.ad);
                console.log(res.ad.Pet.name);
                setAdinfo(res.ad);
                // setComments(res.comments);
                setPhotobase64(res.ad.Pet.Photo_avatars);
                setImg(res.ad.Pet.Photo_avatars[0].ImagePath);
                if (res.ad.ResultAdId != null) {
                    setRes_ad_id(res.ad.ResultAdId);
                }
                // console.log(res.comments);
                console.log(res.ad.User.UserId);
            });
        }
        catch (e) {
            if (error) {
                ToastErrorHandler(error)
            }
            else {
                ToastErrorHandler("Сталася помилка");
            }
        }
    }

    const getresadHandler = async () => {
        try {
            if (res_ad_id != null) {
                setClasstop("ad-res-margin-top");
                setClassbottom("ad-res-margin-bottom");
                await request(`/api/ad/getad/${res_ad_id}`, 'GET', null).then(res => {
                    setRes_ad(res.ad);
                    setResphotobase64(res.ad.Pet.Photo_avatars);
                    setResimg(res.ad.Pet.Photo_avatars[0].ImagePath);
                });
            }
        }
        catch (e) {
            if (error != null) {
                ToastErrorHandler(error);
            }
        }
    }

    const sliderImgHandler = event => {
        event.preventDefault();
        let imgmas = [];
        for (let i in photobase64) {
            imgmas.push(photobase64[i].ImagePath);
        }
        const position = imgmas.indexOf(img);
        console.log(imgmas);
        if (event.target.name == "previous") {
            if (position == 0) {
                setImg(imgmas[imgmas.length - 1]);
            }
            else {
                setImg(imgmas[position - 1]);
            }
        }
        if (event.target.name == "next") {
            if (position == imgmas.length - 1) {
                setImg(imgmas[0]);
            }
            else {
                setImg(imgmas[position + 1]);
            }
        }
    }


    const showImageFullscreenHandler = event => {
        setShowModal(true);
        const dialog = document.getElementById("img-dialog");
        setShowImageSrc(event.target.src);
        setShowModal(true);
        if (!dialog.open) dialog.showModal();
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
            <HeaderDark></HeaderDark>
            <AdDetailInfo adinfo={adinfo} /*comments = {comments}*/ class={classbottom} ToastErrorHandler={ToastErrorHandler} photobase64={photobase64} img={img} setImg={setImg} showImageFullscreenHandler={showImageFullscreenHandler} getadinfoHandler={getadinfoHandler} /*setComments = {setComments}*/></AdDetailInfo>
            {res_ad_id != null && res_ad != null && <>
                <div className='flex-row arrows'>
                    <div className='arrow-down'></div>
                    <div className='arrow-up'></div>
                </div>
                <AdDetailInfo adinfo={res_ad} /*comments = {comments}*/ class={classtop} ToastErrorHandler={ToastErrorHandler} photobase64={resphotobase64} img={resimg} setImg={setResimg} showImageFullscreenHandler={showImageFullscreenHandler} getadinfoHandler={getresadHandler} /*setComments = {setComments}*/></AdDetailInfo>
            </>}
            {
                showModal === true &&
                <dialog id="img-dialog" className="dialog-img">
                    <CloseSvg id={"img-dialog"}></CloseSvg>
                    <ModalImage src={showImageSrc} ></ModalImage>
                </dialog>
            }
        </div >
    )
}