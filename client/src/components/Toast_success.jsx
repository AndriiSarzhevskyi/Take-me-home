import { ToastContainer, toast } from 'react-toastify';

export const ToastSuccessHandler = (text, onClose) =>{
    console.log("Toast");
    toast.success(`${text}`, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        onClose: onClose()
    });
}