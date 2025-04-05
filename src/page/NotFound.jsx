import { useState, useEffect, use } from "react";
import MenuLoader from "../template/MenuLoader.jsx";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Slide } from 'react-toastify';

function NotFound() {
    const [showThispage, setShowThisPage] = useState(false);
    const [showLoader, setShowLoader] = useState(true);
        const pageNotif = (message) => {
            toast.info(message, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: false,
                progress: undefined,
                theme: "light",
                transition: Slide,
            });
        }

    useEffect(() => {
        setTimeout(() => {
            setShowThisPage(true);
        }, 1000);
            
        setTimeout(() => {
            setShowLoader(false);
        }, 3500);
    }, []);

    return (
        <div className='w-full h-auto min-h-screen'>
            {showLoader ? <MenuLoader MenuPage={'Menu Makanan'}/> : ''}
        {showThispage ? 
            <div className="w-full h-screen overflow-y-auto">
                <div className="w-full h-full flex justify-center items-center">
                    <div className="w-[80%] h-full mt-[10rem]">
                    <ToastContainer position="top-right" autoClose={5000} limit={3} hideProgressBar={false} newestOnTop={false} closeOnClick={false} rtl={false} pauseOnFocusLoss draggable={false} pauseOnHover theme="light" transition={Slide} />  
                        <div className="flex flex-col gap-4">
                            <button onClick={() => pageNotif('Jika tidak ada bahu untuk bersandar, masih ada Mie Ayam untuk didahar')}>tes</button>
                            <button onClick={() => pageNotif('Dia boleh hilang tetapi perut harus tetap kenyang')}>tes</button>
                        </div>
                    </div>
                </div>
            </div>
        : ''}
        </div>
    )
}

export default NotFound;