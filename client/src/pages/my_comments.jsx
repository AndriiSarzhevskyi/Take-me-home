import { useEffect, useCallback, useState, useContext } from "react"
import { useHttp } from "../hooks/http.hook";
import { HeaderDark } from "../components/Header_Dark";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AdsList } from "../components/AdsList";
import { AuthContext } from "../context/Auth.context";

export const MyComments = () =>{
    const auth = useContext(AuthContext);
    const { request, loading, error } = useHttp();
    const [ads, setAds] = useState();

    const getAdsHandler = useCallback(async () => {
        try {
            const formData = new FormData();
            formData.append("UserId", auth.userId);
            const res = await request('/api/ad/getusercomments', 'POST', formData, { Authorization: `Bearer ${auth.token}` });
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

    return (
        <div>
            <div className="main-dark">
                <ToastContainer />
                <HeaderDark></HeaderDark>
                <div className="main-second-frame flex-column ">
                    <div className="flex-column">
                        <div className="orange-color myads-h">Прокоментовані оголошення</div>

                        {/* <img src={img} /> */}
                        <div className="ad-container">

                            {ads != null && ads.map((ad) => {
                                return <AdsList key={ad.AdId} ad={ad}></AdsList>
                            })
                            }
                            {ads == null || (Array.isArray(ads) && ads.length == 0) && <h1 className="info-h txt-center">Оголошень не знайдено</h1>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}