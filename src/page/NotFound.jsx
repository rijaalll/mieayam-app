import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import MenuLoader from "../template/MenuLoader.jsx";
import GifBunga from "../img/bunga.gif";
import GifNangis from "../img/peachsad1.gif";
import webData from '../website_data.json';

function NotFound({setIsCashier}) {
    const [showThispage, setShowThisPage] = useState(false);
    const [showLoader, setShowLoader] = useState(true);
    const [ allQuote, setAllQuote ] = useState([]);
    const [ quote, setQuote ] = useState('');
    const [ gifShow, setGifShow ] = useState(null);
    const navigate = useNavigate();

    const GifData = [
        GifBunga,
        GifNangis
    ];

    useEffect(() => {
        setAllQuote(webData.NotFoundQuote);
    }, []);

    const randomGif = () => {
        const randomGif = Math.floor(Math.random() * GifData.length);
        const randomQuote = Math.floor(Math.random() * allQuote.length);
        setGifShow(GifData[randomGif]);
        setQuote(allQuote[randomQuote]);
    }

    useEffect(() => {
        randomGif();
    }, [allQuote]);

    useEffect(() => {
        setTimeout(() => {
            setShowThisPage(true);
        }, 1000);
            
        setTimeout(() => {
            setShowLoader(false);
        }, 3500);
        document.title = '(404) Not Found';
        setIsCashier(false);
    }, []);

    return (
        <div className='w-full h-auto min-h-screen'>
            {showLoader ? <MenuLoader MenuPage={'Menu Makanan'}/> : ''}
        {showThispage ? 
            <div className="w-full h-screen overflow-y-auto">
                <div className="w-full h-full flex justify-center">
                    <div className="w-[80%] h-full">
                        <div className="w-full h-full flex justify-center">
                            <div className="w-auto max-w-[400px] h-auto flex flex-col items-center gap-7 mt-[30vh]">
                                <div className="w-[90%] max-w-[130px] h-auto">
                                    <img src={gifShow} />
                                </div>
                                <div className="flex flex-col w-auto h-auto items-center gap-4">
                                    <p className="text-2xl bg-gray-400/20 text-center">{quote}</p>
                                    <div className="flex flex-col gap-5 items-center mt-[4rem]">
                                        <p className="text-center">Kembali ke <button onClick={() => navigate('/')} className="text-sky-500">Halaman Utama</button> aja, klo kembali ke dia gk mungkin soalnya</p>
                                        <p className="text-center text-base">{`404 not found page`}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="fixed top-4 right-4 ">
                            <button onClick={randomGif} className="active:rotate-[90deg] transition-all duration-300"><span className="bi bi-arrow-clockwise text-2xl"></span></button>
                        </div>
                    </div>
                </div>
            </div>
        : ''}
        </div>
    )
}

export default NotFound;