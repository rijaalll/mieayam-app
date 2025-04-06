import MenuLoader from "../template/MenuLoader";
import websiteData from '../website_data.json';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function OrderPage({ setCustomerName, setIsLogin, customerName, isLogin, setIsCashier }) {
  const [showThisPage, setShowThisPage] = useState(false);
  const [showLoader, setShowLoader] = useState(true);
  const [customerNameLocal, setCustomerNameLocal] = useState('');
  const [isNameConfirmed, setIsNameConfirmed] = useState(false);
  const [orderData, setOrderData] = useState([]);
  const [menuData, setMenuData] = useState([]);
  const [totalHarga, setTotalHarga] = useState(0);
  const DataApi = websiteData.website["API-URL"];
  const navigate = useNavigate();

  useEffect(() => {
    document.title = websiteData.website.name;
    setIsCashier(false);
  }, [setIsCashier]);

  useEffect(() => {
    setTimeout(() => setShowThisPage(true), 1000);
    setTimeout(() => setShowLoader(false), 3500);

    const orderId = localStorage.getItem('orderId');
    if (orderId) {
      fetch(`${DataApi}view_order=${orderId}`)
        .then(res => res.json())
        .then(data => {
          if (data.status === "success") {
            setOrderData(data.data[0]);
          }
        });
    }

    fetch(`${DataApi}menu=all`)
      .then(res => res.json())
      .then(data => {
        if (data.status === "success") {
          setMenuData(data.data);
        }
      });
  }, []);

  useEffect(() => {
    if (orderData && menuData.length > 0) {
      let total = 0;
      Object.entries(orderData).forEach(([key, value]) => {
        if (['food', 'drink', 'snack'].some(prefix => key.startsWith(prefix)) && parseInt(value) > 0) {
          const menuItem = menuData.find(item => item.menu_uid === key);
          if (menuItem) {
            total += menuItem.price * parseInt(value);
          }
        }
      });
      setTotalHarga(total);
    }
  }, [orderData, menuData]);

  const handleNameChange = (event) => {
    setCustomerNameLocal(event.target.value);
  };

  const handleConfirmName = () => {
    if (customerNameLocal.trim()) {
      setCustomerName(customerNameLocal);
      setIsLogin(true);
      setIsNameConfirmed(true);
      fetch(`http://127.0.0.1/tes/api-mieayam/?add=order&full_name=${customerNameLocal}`)
        .then(response => response.json())
        .then(data => {
          localStorage.setItem('customerName', customerNameLocal);
          localStorage.setItem('orderId', data.id);
          localStorage.setItem('login', 'true');
        });
    } else {
      alert("Nama tidak boleh kosong!");
    }
  };

  const customerLogout = () => {
    setCustomerName('');
    setIsLogin(false);
    localStorage.removeItem('customerName');
    localStorage.removeItem('orderId');
    localStorage.removeItem('login');
    window.location.reload();
  };

  return (
    <div className='w-full h-auto min-h-screen truncate'>
      {showLoader ? <MenuLoader MenuPage={'Halaman Pemesanan'} /> : ''}
      {showThisPage ? (
        <div className="w-full h-screen overflow-y-auto">
          {!isLogin ? (
            <div className="z-[5] fixed top-0 left-auto w-[80%] h-screen bg-slate-100/50 backdrop-blur-sm">
              <div className="w-full h-screen flex justify-center items-center">
                <div className="flex flex-col gap-8 items-center">
                  <p className="text-2xl">Nama Customer</p>
                  <input
                    value={customerNameLocal}
                    onChange={handleNameChange}
                    type="text"
                    className="bg-transparent border-b border-black/40 p-2 text-xl"
                  />
                  <div className="flex flex-col gap-4">
                    <button onClick={handleConfirmName} className="text-sky-600 hover:underline text-lg">
                      Konfirmasi
                    </button>
                    <div className="flex">
                      <p className="text-lg">Masuk Sebagai &nbsp;</p>
                      <button className="text-lg text-sky-600 hover:underline" onClick={() => navigate('/kasir')} type="button">Kasir</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : ''}

          <div className="w-full flex justify-center items-center">
            <div className="w-[80%] mt-[4rem]">
              <div className="w-full sticky z-[4] flex justify-between top-[2rem] bg-slate-100/50 py-4 backdrop-blur-md">
                <p className='text-5xl'>Pemesanan</p>
                <div className="flex gap-3 items-center">
                  {isLogin && (
                    <>
                      <p className="text-2xl">{customerName}</p>
                      <button onClick={customerLogout}>
                        <span className="text-xl text-sky-400">(Keluar)</span>
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div className="mt-[1rem]">
                <p className="text-2xl mb-4">Semua pesanan</p>
                  <div className="w-full h-auto overflow-y-auto flex flex-col mt-[4rem]">
                    <div className="w-full h-auto">
                      <div className="w-full h-auto flex flex-col items-center gap-8">
                        {Object.entries(orderData).map(([key, value]) => {
                          if (['food', 'drink', 'snack'].some(prefix => key.startsWith(prefix)) && parseInt(value) > 0) {
                            const menuItem = menuData.find(item => item.menu_uid === key);
                            if (!menuItem) return null;
                            return (
                              <div key={key} className="w-full h-auto flex flex-row justify-between items-start px-5 py-3 bg-gray-400/10">
                                <div className="w-auto flex gap-4 items-center">
                                  <p className="text-lg">{value} x</p>
                                  <p className="text-xl">{menuItem.menu_name}</p>
                                </div>
                                <div className="w-auto flex flex-col">
                                  <p className="text-base text-sky-600">Rp {menuItem.price.toLocaleString()} x {value}</p>
                                  <p className="text-lg">Rp {(menuItem.price * parseInt(value)).toLocaleString()}</p>
                                </div>
                              </div>
                            );
                          }
                          return null;
                        })}
                      </div>
                    </div>
                  </div>
                <div className="w-auto h-auto p-4 fixed bottom-[2rem] right-[3rem] flex items-center gap-[4rem] bg-slate-300/20 backdrop-blur-md rounded-md">
                  <p className="text-xl">Total : Rp {totalHarga.toLocaleString()}</p>
                  <button className="text-xl px-5 py-1 hover:text-sky-600 transition-all duration-300">Bayar</button>
                </div>
              </div>

              <div className="h-[10rem]"></div>
            </div>
          </div>
        </div>
      ) : ''}
    </div>
  );
}

export default OrderPage;
