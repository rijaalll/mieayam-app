import MenuLoader from "../template/MenuLoader";
import websiteData from '../website_data.json';
import { useState, useEffect } from "react";

function OrderPage({ setCustomerName, setIsLogin, customerName, isLogin }) {
  const [showThisPage, setShowThisPage] = useState(false);
  const [showLoader, setShowLoader] = useState(true);
  const [customerNameLocal, setCustomerNameLocal] = useState('');
  const [isNameConfirmed, setIsNameConfirmed] = useState(false);
  const [orderData, setOrderData] = useState([]);
  const [menuData, setMenuData] = useState([]);
  const [totalHarga, setTotalHarga] = useState(0);

  document.title = websiteData.website.name;

  useEffect(() => {
    setTimeout(() => setShowThisPage(true), 1000);
    setTimeout(() => setShowLoader(false), 3500);

    const orderId = localStorage.getItem('orderId');
    if (orderId) {
      fetch(`http://127.0.0.1/tes/api-mieayam/?view_order=${orderId}`)
        .then(res => res.json())
        .then(data => {
          if (data.status === "success") {
            setOrderData(data.data[0]);
          }
        });
    }

    fetch(`http://127.0.0.1/tes/api-mieayam/?menu=all`)
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
                  <p className="text-xl">Nama Customer</p>
                  <input
                    value={customerNameLocal}
                    onChange={handleNameChange}
                    type="text"
                    className="bg-transparent border-b border-black/40 p-2 text-xl"
                  />
                  <button onClick={handleConfirmName} className="text-sky-600 hover:underline">
                    Konfirmasi
                  </button>
                </div>
              </div>
            </div>
          ) : ''}

          <div className="w-full flex justify-center items-center">
            <div className="w-[80%] mt-[10rem]">
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

              <div className="mt-[4rem]">
                <p className="text-2xl mb-4">Semua pesanan</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {Object.entries(orderData).map(([key, value]) => {
                    if (['food', 'drink', 'snack'].some(prefix => key.startsWith(prefix)) && parseInt(value) > 0) {
                      const menuItem = menuData.find(item => item.menu_uid === key);
                      if (!menuItem) return null;
                      return (
                        <div key={key} className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center">
                          <img src={menuItem.menu_img} alt={menuItem.menu_name} className="w-32 h-32 object-cover rounded" />
                          <p className="text-xl mt-2 font-semibold">{menuItem.menu_name}</p>
                          <p className="text-md">Jumlah: {value}</p>
                          <p className="text-md text-sky-600">Harga: Rp {menuItem.price.toLocaleString()}</p>
                          <p className="text-md font-bold mt-1">Subtotal: Rp {(menuItem.price * parseInt(value)).toLocaleString()}</p>
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
                <div className="text-right mt-8 text-2xl font-bold">
                  Total: Rp {totalHarga.toLocaleString()}
                </div>
              </div>

              <div className="h-[7rem]"></div>
            </div>
          </div>
        </div>
      ) : ''}
    </div>
  );
}

export default OrderPage;
