import { useEffect, useCallback, useState } from "react"
import { useHttp } from "../hooks/http.hook";
import { HeaderDark } from "../components/Header_Dark";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AdsList } from "../components/AdsList";
import { FilterSidebar } from "../components/FilterSidebar";


export const LostAds = () => {
    const { request, loading, error } = useHttp();
    const [ads, setAds] = useState();
    const [type, setType] = useState("lost");
    const getAdsHandler = useCallback(async () => {
        try {
            const formData = new FormData();
            formData.append("type", type);
            const res = await request('/api/ad/getads', 'POST', formData);
            console.log(res.data);
            setAds(res.data);
        } catch (e) {
            if (error != null) {
                ToastErrorHandler(error);
            } else {
                ToastErrorHandler("Сталася помилка");
            }
        }
    }, [error, request]);

    useEffect(() => {
        getAdsHandler();
    }, []);

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
    
    const opencloseSidebarHandler = () =>{
        const sidebar = document.getElementById("sidebar");
        sidebar.classList.toggle('open');
    }

    return (
        <div className="main-dark">
            <ToastContainer />
            <HeaderDark type="lost"></HeaderDark>
            <div className="main-second-frame flex-column ">
                {/* <img src={img} /> */}
                <div className="ad-container">
                    {ads != null && ads.map((ad) => {
                        return <AdsList key={ad.AdId} ad={ad}></AdsList>
                    })
                    }
                    {ads == null || (Array.isArray(ads) && ads.length == 0) && <h1 className="info-h txt-center">Оголошень не знайдено</h1>}
                </div>
                <button className="open-filter-button" onClick={opencloseSidebarHandler}></button>
                <FilterSidebar type = {type} ToastErrorHandler = {ToastErrorHandler} setAds = {setAds}></FilterSidebar>
            </div>
            


        </div>
    )
}