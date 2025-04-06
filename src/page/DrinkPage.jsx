import MenuLoader from "../template/MenuLoader";
import { useState, useEffect } from "react";
import webData from '../website_data.json';

function DrinkPage({ customerName, isLogin }) {
    const [showThispage, setShowThisPage] = useState(false);
    const [showLoader, setShowLoader] = useState(true);
    const [drinkData, setDrinkData] = useState([]);
    const [orderQuantity, setOrderQuantity] = useState({});
    const drinkDataApi = webData.website["API-URL"];
    const order_id = localStorage.getItem('orderId');
    document.title = 'Menu Minuman';

    useEffect(() => {
        const getDrinkData = async () => {
            try {
                const response = await fetch(drinkDataApi + 'menu=drink');
                const data = await response.json();
                if (data.status === 'success' && Array.isArray(data.data)) {
                    setDrinkData(data.data);
                } else {
                    setDrinkData([]);
                    console.warn("Data menu tidak tersedia:", data.message);
                }
            } catch (error) {
                console.log("Error fetching menu:", error);
            }
        };

        getDrinkData();
    }, []);

    useEffect(() => {
        const getAllQuantities = async () => {
            try {
                const response = await fetch(`${drinkDataApi}view_order=${order_id}`);
                const data = await response.json();
                const order = data.data[0];

                if (order) {
                    const quantities = {};
                    Object.entries(order).forEach(([key, value]) => {
                        if (key.startsWith("drink")) {
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
            const response = await fetch(`${drinkDataApi}quantity_update=${menu_uid}&update=${type}&id=${order_id}`);
            const result = await response.json();

            if (result.status === "success") {
                // Ambil quantity baru dari server (atau fetch ulang)
                const updatedQuantities = await fetch(`${drinkDataApi}view_order=${order_id}`);
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
    }, []);

    return (
        <div className='w-full h-auto min-h-screen'>
            {showLoader ? <MenuLoader MenuPage={'Menu Minuman'} /> : ''}

            {showThispage &&
                <div className="w-full h-screen overflow-y-auto">
                    <div className="w-full h-full flex justify-center items-center">
                        <div className="w-[80%] h-full mt-[10rem]">
                            <div id="titlePage" className="w-full h-auto flex justify-between sticky z-[10] top-[2rem] bg-slate-100/70 py-4">
                                <p className='text-5xl max-[425px]:text-2xl scale-100 hover:scale-[1.05] active:rotate-[5deg] will-change-transform active:scale-[0.95] transition-all duration-300'>Menu Minuman</p>
                                <div className="w-auto h-auto flex flex-row max-[767px]:flex-col items-end gap-4 max-[767px]:gap-1">
                                    <p className="text-xl max-[425px]:text-sm">{isLogin ? `Hallo, ${customerName}` : 'Tulis Nama'}</p>
                                    <span className={`bi bi-person-${isLogin ? 'fill-check' : 'exclamation'} text-2xl`}></span>
                                </div>
                            </div>

                            <div className="w-full h-full flex flex-col mt-[3rem] gap-10">
                                {Array.isArray(drinkData) && drinkData.length > 0 ? (
                                    drinkData.map((drink, index) => (
                                        <div className="w-full h-auto px-4 py-2 rounded-xl flex flex-row border-[1px] border-transparent justify-between hover:scale-[1.03] hover:border-[1px] hover:border-black/30 active:scale-[0.98] transition-all myduration_400 will-change-transform" key={index}>
                                            <div className="w-full h-auto flex flex-row gap-6">
                                                <div className="w-[90%] max-w-[90px] h-auto">
                                                    <img className="rounded-sm hover:scale-[1.05] active:scale-[0.8] active:rotate-[10deg] transition-all myduration_400" src={drink.menu_img} alt={drink.menu_name} />
                                                </div>
                                                <div className="w-auto h-auto flex flex-col justify-between">
                                                    <p className="text-2xl mt-1">{drink.menu_name}</p>
                                                    <p className="text-lg text-gray-600">Rp. {drink.price.toLocaleString()}</p>
                                                </div>
                                            </div>

                                            <div className="w-auto h-full flex flex-col justify-end mr-5">
                                                {isLogin ? (
                                                    <div className="flex flex-row gap-5">
                                                        <button
                                                            className="text-lg px-1 rounded-full will-change-transform hover:scale-[1.4] active:-rotate-45 transition-all duration-300 bg-slate-200"
                                                            onClick={() => handleSubtractQuantity(drink.menu_uid)}
                                                            disabled={(orderQuantity[drink.menu_uid] ?? 0) <= 0}
                                                        >
                                                            <span className="bi bi-dash-lg"></span>
                                                        </button>
                                                        <p className="text-lg will-change-transform">{orderQuantity[drink.menu_uid] ?? 0}</p>
                                                        <button
                                                            className="text-lg px-1 rounded-full will-change-transform hover:scale-[1.4] active:rotate-45 transition-all duration-300 bg-slate-200"
                                                            onClick={() => handleAddQuantity(drink.menu_uid)}
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
                                    <p className="text-center text-gray-500 text-lg">Tidak ada menu minuman tersedia.</p>
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

export default DrinkPage;
