import MenuLoader from "../template/MenuLoader";
import { useState, useEffect } from "react";

function FoodPage({ customerName, isLogin }) {
    const [showThispage, setShowThisPage] = useState(false);
    const [showLoader, setShowLoader] = useState(true);
    const [foodData, setFoodData] = useState([]);
    const [orderQuantity, setOrderQuantity] = useState({});
    const foodDataApi = 'http://127.0.0.1/tes/api-mieayam/?';
    const order_id = localStorage.getItem('orderId');
    document.title = 'Menu Makanan';

    // Fetch data makanan
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

    // Fetch quantity awal
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

    // Update quantity
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

    // Animasi awal
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
            {showLoader ? <MenuLoader MenuPage={'Menu Makanan'} /> : ''}

            {showThispage &&
                <div className="w-full h-screen overflow-y-auto">
                    <div className="w-full h-full flex justify-center items-center">
                        <div className="w-[80%] h-full mt-[10rem]">
                            <div id="titlePage" className="w-full h-auto flex justify-between sticky top-[2rem] bg-slate-100/50 py-4 backdrop-blur-md">
                                <p className='text-5xl'>Menu Makanan</p>
                                <div className="w-auto h-auto flex flex-row items-end gap-4">
                                    <p className="text-xl">{isLogin ? `Hallo, ${customerName}` : 'Tulis Nama'}</p>
                                    <span className={`bi bi-person-${isLogin ? 'fill-check' : 'exclamation'} text-2xl`}></span>
                                </div>
                            </div>

                            <div className="w-full h-full flex flex-col mt-[3rem] gap-10">
                                {Array.isArray(foodData) && foodData.length > 0 ? (
                                    foodData.map((food, index) => (
                                        <div className="w-full h-auto flex flex-row justify-between" key={index}>
                                            <div className="w-full h-auto flex flex-row gap-6">
                                                <div className="w-[90%] max-w-[90px] h-auto">
                                                    <img className="rounded-sm" src={food.menu_img} alt={food.menu_name} />
                                                </div>
                                                <div className="w-auto h-auto flex flex-col justify-between">
                                                    <p className="text-2xl mt-1">{food.menu_name}</p>
                                                    <p className="text-lg text-gray-600">Rp. {food.price}</p>
                                                </div>
                                            </div>

                                            <div className="w-auto h-full flex flex-col justify-end mr-5">
                                                {isLogin ? (
                                                    <div className="flex flex-row gap-3">
                                                        <button
                                                            className="text-lg px-3"
                                                            onClick={() => handleSubtractQuantity(food.menu_uid)}
                                                            disabled={(orderQuantity?.[food.menu_uid] ?? 0) <= 0}
                                                        >
                                                            <span className="bi bi-dash-lg"></span>
                                                        </button>
                                                        <p className="text-lg">{orderQuantity?.[food.menu_uid] ?? 0}</p>
                                                        <button
                                                            className="text-lg px-3"
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
