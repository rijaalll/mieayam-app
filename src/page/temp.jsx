
import { useState, useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Slide } from 'react-toastify';

function FoodPage({ customerName, isLogin }) {
    const [ showThispage, setShowThisPage ] = useState(false);
    const [ showLoader, setShowLoader ] = useState(true);
    const foodDataApi = 'http://127.0.0.1/tes/api-mieayam/?';
    const [ foodData, setFoodData ] = useState([]);
    document.title = 'Menu Makanan';
    const textQuote = [
        "Melupakan butuh waktu dan tak sesingkat memasak Mie Ayam pesananmu.",
        "Hilang tanpa pesan, mie ayam tetap hadir dalam kenyataan.",
        "Dia boleh hilang tetapi perut harus tetap kenyang.",
        "Kalau hati gak kenyang, perut aja yang dibahagiain.",
        "Disaat hati lagi kelam, ada mie ayam yg siap menemani malam.",
        "Jangan lupa makan, jangan lupa minum, jangan lupa bersandar.",
        "Daripada bawa perasaan mending bawa Mie Ayam, kenyang berdua hehe.",
        "Jika tidak ada bahu untuk bersandar, masih ada Mie Ayam untuk didahar.",
        "Kamu kok berharap terus, makan Mie Ayam kapan?.",
        "Katanya pgn makan Mie Ayam bareng, kok malah pergi..? boong ya",
    ]

    const moonNameId = [
        "Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ]

    const pageNotif = (message) => {
        toast.info(message, {
            position: "bottom-right",
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
        let listQuote = Math.floor(Math.random() * textQuote.length);;
        const thisQuoterndm = setInterval(() => {  
            listQuote++;
            listQuote = listQuote >= textQuote.length ? 0 : listQuote++;
            pageNotif(textQuote[listQuote] + " " + (moonNameId[new Date().getMonth()]) + " " + new Date().getFullYear());
        }, 10500);

        return () => {
            clearInterval(thisQuoterndm);
        }
    }, [])


    useEffect(() => {
        const getFoodData = async () => {
            try {
                const response = await fetch(foodDataApi + 'menu=food');
                const data = await response.json();
                setFoodData(data.data);
                console.log(data);
            } catch (error) {
                console.log(error);
            }
        }
        getFoodData();
        console.log(customerName)
    }, [])

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
                        <ToastContainer position="bottom-right" autoClose={5000} limit={2} hideProgressBar={false} newestOnTop={false} closeOnClick={false} rtl={false} pauseOnFocusLoss draggable={false} pauseOnHover theme="light" transition={Slide} />  
                        <div id="titlePage" className="w-full h-auto flex justify-between sticky top-[2rem] bg-slate-100/50 py-4 backdrop-blur-md">
                            <p className='text-5xl'>Menu Makanan</p>
                            <div className="w-auto h-auto flex flex-row items-end gap-4">
                                <p className="text-xl">{isLogin ? ` Hallo, ${customerName}` : 'Tulis Nama'}</p>
                                <span className={`bi bi-person-${isLogin ? 'fill-check' : 'exclamation'} text-2xl`}></span>
                            </div>
                        </div>
                        <div className="w-full h-full flex flex-col mt-[3rem] gap-10">
                            {foodData.map((food, index) => {
                                return (
                                    <div className="w-full h-auto flex flex-row justify-between" key={index}>
                                        <div className="w-full h-auto flex flex-row gap-6">
                                            <div className="w-[90%] max-w-[90px] h-auto">
                                                <img className="rounded-sm" src={food.menu_img} />
                                            </div>
                                            <div className="w-auto h-auto flex flex-col justify-between">
                                                <p className="text-2xl mt-1">{food.menu_name}</p>
                                                <p className="text-lg text-gray-600">Rp. {food.price}</p>
                                            </div>
                                        </div>
                                        <div className="w-auto h-full flex flex-col justify-end mr-5">
                                        {isLogin ? (
                                            <div className="flex flex-row gap-3">
                                                <button className="text-lg px-3"><span className="bi bi-dash-lg"></span></button>
                                                <p className="text-lg">0</p>
                                                <button className="text-lg px-3"><span className="bi bi-plus-lg"></span></button>
                                            </div>
                                        ) : (
                                            <p className="text-xs">Tulis Nama untuk membeli</p>
                                        ) }
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                        <div className="w-full h-[7rem]"></div>
                    </div>
                </div>
            </div>
        : ''}
        </div>
    );
}

export default FoodPage;