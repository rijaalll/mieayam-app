import { useState, useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';
import { Slide } from 'react-toastify';

import MenuLoader from "../template/MenuLoader";
import 'react-toastify/dist/ReactToastify.css';
import webData from './../website_data.json';

function FoodPage({ customerName, isLogin, setIsCashier }) {
    const [showThispage, setShowThisPage] = useState(false);
    const [showLoader, setShowLoader] = useState(true);
    const [foodData, setFoodData] = useState([]);
    const [orderQuantity, setOrderQuantity] = useState({});
    const [textQuote, setTextQuote] = useState([]);
    const [moonNameId, setMoonNameId] = useState([]);
    const foodDataApi = webData.website["API-URL"];
    const order_id = localStorage.getItem('orderId');
    document.title = 'Menu Makanan';

    useEffect(() => {
        setTextQuote(webData.MieAyamQuote);
        setMoonNameId(webData.MoonName);
    }, [])
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
    }, [textQuote, moonNameId]);

    useEffect(() => {
        const getFoodData = async () => {
            try {
                const response = await fetch(foodDataApi + 'menu=food');
                const data = await response.json();
                if (data.status === 'success' && Array.isArray(data.data)) {
                    setFoodData(data.data);
                } else {
                    setFoodData([]);
                    console.warn("Data menu tidak tersedia:", data.message);
                }
            } catch (error) {
                console.log("Error fetching menu:", error);
            }
        };

        getFoodData();
    }, []);

    useEffect(() => {
        if (!order_id) return;
        const getAllQuantities = async () => {
            try {
                const response = await fetch(`${foodDataApi}view_order=${order_id}`);
                const data = await response.json();
                const order = data.data[0];

                if (order) {
                    const quantities = {};
                    Object.entries(order).forEach(([key, value]) => {
                        if (key.startsWith("food")) {
                            quantities[key] = value;
                        }
                    });
                    setOrderQuantity(quantities);
                }
            } catch (error) {
                console.log("Error fetching quantities:", error);
            }
        };

        getAllQuantities();
    }, [order_id]);

    const handleQuantityUpdate = async (menu_uid, type) => {
        try {
            const response = await fetch(`${foodDataApi}quantity_update=${menu_uid}&update=${type}&id=${order_id}`);
            const result = await response.json();

            if (result.status === "success") {
                const updatedQuantities = await fetch(`${foodDataApi}view_order=${order_id}`);
                const updatedData = await updatedQuantities.json();
                const updatedOrder = updatedData.data[0];

                if (updatedOrder) {
                    setOrderQuantity(prev => ({
                        ...prev,
                        [menu_uid]: updatedOrder[menu_uid]
                    }));
                }
            } else {
                console.warn("Update gagal:", result.message);
            }
        } catch (error) {
            console.error('Gagal update quantity:', error);
        }
    };

    const handleAddQuantity = (menu_uid) => {
        handleQuantityUpdate(menu_uid, 1); // tambah
    };

    const handleSubtractQuantity = (menu_uid) => {
        handleQuantityUpdate(menu_uid, 0); // kurang
    };

    useEffect(() => {
        setTimeout(() => {
            setShowThisPage(true);
        }, 1000);

        setTimeout(() => {
            setShowLoader(false);
        }, 3500);
        setIsCashier(false);
    }, []);

    return (
        <div className='w-full h-auto min-h-screen'>
            {showLoader ? <MenuLoader MenuPage={'Menu Makanan'} /> : ''}
            {showThispage &&
                <div className="w-full h-screen overflow-y-auto">
                    <div className="w-full h-full flex justify-center items-center">
                        <div className="w-[80%] h-full mt-[10rem]">
                            <ToastContainer className={`z-[100]`} position="bottom-right" autoClose={5000} limit={2} hideProgressBar={false} newestOnTop={false} closeOnClick={false} rtl={false} pauseOnFocusLoss draggable={false} pauseOnHover theme="light" transition={Slide} />  
                            <div id="titlePage" className="w-full h-auto flex justify-between sticky z-[10] top-[2rem] bg-slate-100/70 py-4">
                                <p className='text-5xl scale-100 hover:scale-[1.05] active:rotate-[5deg] active:scale-[0.95] transition-all duration-300 will-change-transform'>Menu Makanan</p>
                                <div className="w-auto h-auto flex flex-row items-end gap-4">
                                    <p className="text-xl"><span>Hallow, </span><span className="text-sky-400">{isLogin ? `${customerName}` : 'Tulis Nama'}</span></p>
                                    <span className={`bi bi-person-${isLogin ? 'fill-check' : 'exclamation'} text-2xl`}></span>
                                </div>
                            </div>

                            <div className="w-full h-full flex flex-col mt-[3rem] gap-6">
                                {Array.isArray(foodData) && foodData.length > 0 ? (
                                    foodData.map((food, index) => (
                                        <div className="w-full h-auto px-4 py-2 rounded-xl flex flex-row border-[1px] border-transparent justify-between will-change-transform hover:scale-[1.03] hover:border-[1px] hover:border-black/20 active:scale-[0.98] transition-all myduration_400" key={index}>
                                            <div className="w-full h-auto flex flex-row gap-6">
                                                <div className="w-[90%] max-w-[90px] h-auto">
                                                    <img className="rounded-sm hover:scale-[1.05] will-change-transform active:scale-[0.8] active:rotate-[10deg] transition-all myduration_400" src={food.menu_img} alt={food.menu_name} />
                                                </div>
                                                <div className="w-auto h-auto flex flex-col justify-between">
                                                    <p className="text-2xl mt-1">{food.menu_name}</p>
                                                    <p className="text-lg text-gray-600">Rp. {food.price.toLocaleString()}</p>
                                                </div>
                                            </div>

                                            <div className="w-auto h-full flex flex-col justify-end mr-5">
                                                {isLogin ? (
                                                    <div className="flex flex-row gap-5">
                                                        <button
                                                            className="text-lg px-1 rounded-full hover:scale-[1.4] will-change-transform active:-rotate-45 transition-all duration-300 bg-slate-200"
                                                            onClick={() => handleSubtractQuantity(food.menu_uid)}
                                                            disabled={(orderQuantity?.[food.menu_uid] ?? 0) <= 0}
                                                        >
                                                            <span className="bi bi-dash-lg"></span>
                                                        </button>
                                                        <p className="text-lg will-change-transform">{orderQuantity?.[food.menu_uid] ?? 0}</p>
                                                        <button
                                                            className="text-lg px-1 rounded-full hover:scale-[1.4] will-change-transform active:rotate-45 transition-all duration-300 bg-slate-200"
                                                            onClick={() => handleAddQuantity(food.menu_uid)}
                                                        >
                                                            <span className="bi bi-plus-lg"></span>
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <p className="text-xs">Tulis Nama untuk membeli</p>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-center text-gray-500 text-lg">Tidak ada menu makanan tersedia.</p>
                                )}
                            </div>

                            <div className="w-full h-[7rem]"></div>
                        </div>
                    </div>
                </div>
            }
        </div>
    );
}

export default FoodPage;
