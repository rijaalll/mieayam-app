import MenuLoader from "../template/MenuLoader";
import { useState, useEffect } from "react";

function SnackPage({ customerName, isLogin }) {
    const [showThisPage, setShowThisPage] = useState(false);
    const [showLoader, setShowLoader] = useState(true);
    const [snackData, setSnackData] = useState([]);
    const [orderQuantity, setOrderQuantity] = useState({});
    const snackDataApi = 'http://127.0.0.1/tes/api-mieayam/?';
    const order_id = localStorage.getItem('orderId');
    document.title = 'Menu Cemilan';

    // Fetch data cemilan
    useEffect(() => {
        const getSnackData = async () => {
            try {
                const response = await fetch(snackDataApi + 'menu=snack');
                const data = await response.json();
                if (data.status === 'success' && Array.isArray(data.data)) {
                    setSnackData(data.data);
                } else {
                    setSnackData([]);
                    console.warn("Data snack tidak tersedia:", data.message);
                }
            } catch (error) {
                console.log("Error fetching snack data:", error);
            }
        };
        getSnackData();
    }, []);

    // Fetch quantity awal berdasarkan order ID
    useEffect(() => {
        if (!order_id) return;

        const getAllQuantities = async () => {
            try {
                const response = await fetch(`${snackDataApi}view_order=${order_id}`);
                const data = await response.json();
                const order = data.data[0];

                if (order) {
                    const quantities = {};
                    Object.entries(order).forEach(([key, value]) => {
                        if (key.startsWith("snack")) {
                            quantities[key] = value;
                        }
                    });
                    setOrderQuantity(quantities);
                }
            } catch (error) {
                console.log("Error fetching snack quantity:", error);
            }
        };

        getAllQuantities();
    }, [order_id]);

    // Update quantity ke server
    const handleQuantityUpdate = async (menu_uid, type) => {
        try {
            const response = await fetch(`${snackDataApi}quantity_update=${menu_uid}&update=${type}&id=${order_id}`);
            const result = await response.json();

            if (result.status === "success") {
                const updatedQuantities = await fetch(`${snackDataApi}view_order=${order_id}`);
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
            console.error('Gagal update quantity snack:', error);
        }
    };

    const handleAddQuantity = (menu_uid) => {
        handleQuantityUpdate(menu_uid, 1); // tambah
    };

    const handleSubtractQuantity = (menu_uid) => {
        handleQuantityUpdate(menu_uid, 0); // kurang
    };

    // Transisi halaman
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
            {showLoader ? <MenuLoader MenuPage={'Menu Cemilan'} /> : ''}

            {showThisPage &&
                <div className="w-full h-screen overflow-y-auto">
                    <div className="w-full h-full flex justify-center items-center">
                        <div className="w-[80%] h-full mt-[10rem]">
                            <div id="titlePage" className="w-full h-auto flex justify-between sticky top-[2rem] bg-slate-100/50 py-4 backdrop-blur-md">
                                <p className='text-5xl'>Menu Cemilan</p>
                                <div className="w-auto h-auto flex flex-row items-end gap-4">
                                    <p className="text-xl">{isLogin ? `Hallo, ${customerName}` : 'Tulis Nama'}</p>
                                    <span className={`bi bi-person-${isLogin ? 'fill-check' : 'exclamation'} text-2xl`}></span>
                                </div>
                            </div>

                            <div className="w-full h-full flex flex-col mt-[3rem] gap-10">
                                {Array.isArray(snackData) && snackData.length > 0 ? (
                                    snackData.map((snack, index) => (
                                        <div className="w-full h-auto flex flex-row justify-between" key={index}>
                                            <div className="w-full h-auto flex flex-row gap-6">
                                                <div className="w-[90%] max-w-[90px] h-auto">
                                                    <img className="rounded-sm" src={snack.menu_img} alt={snack.menu_name} />
                                                </div>
                                                <div className="w-auto h-auto flex flex-col justify-between">
                                                    <p className="text-2xl mt-1">{snack.menu_name}</p>
                                                    <p className="text-lg text-gray-600">Rp. {snack.price}</p>
                                                </div>
                                            </div>

                                            <div className="w-auto h-full flex flex-col justify-end mr-5">
                                                {isLogin ? (
                                                    <div className="flex flex-row gap-3">
                                                        <button
                                                            className="text-lg px-3"
                                                            onClick={() => handleSubtractQuantity(snack.menu_uid)}
                                                            disabled={(orderQuantity?.[snack.menu_uid] ?? 0) <= 0}
                                                        >
                                                            <span className="bi bi-dash-lg"></span>
                                                        </button>
                                                        <p className="text-lg">{orderQuantity?.[snack.menu_uid] ?? 0}</p>
                                                        <button
                                                            className="text-lg px-3"
                                                            onClick={() => handleAddQuantity(snack.menu_uid)}
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
                                    <p className="text-center text-gray-500 text-lg">Tidak ada menu cemilan tersedia.</p>
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

export default SnackPage;
