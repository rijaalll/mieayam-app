import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

// STYLE IMPORT
import './index.css';
import './font/MyFont.css';
import './style/custom.css';
import './style/animation.css';
import './bi-icon/font/bootstrap-icons.min.css';
import 'animate.css';

// PAGE, COMPONENT IMPORT
import LoaderApp from './template/LoaderApp.jsx';
import SideNavbar from './template/SideNavbar.jsx';
import OrderPage from './page/OrderPage.jsx';
import FoodPage from './page/FoodPage.jsx';
import DrinkPage from './page/DrinkPage.jsx';
import SnackPage from './page/SnackPage.jsx';
import CashierPage from './page/CashierPage.jsx';
import NotFound from './page/NotFound.jsx';

function App() {
  const [customerName, setCustomerName] = useState('');
  const [ isLogin, setIsLogin ] = useState(false);
  const [ isCashier, setIsCashier ] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('login') && localStorage.getItem('login') === 'true') {
      setCustomerName(localStorage.getItem('customerName'));
      setIsLogin(true);
    }
  })

  return (
    <div className={`w-full h-auto min-h-screen bg-slate-100`}>
      <LoaderApp />
      <div className='w-full h-auto min-h-screen flex flex-row'>
        <Router>
          {isCashier ? '' : 
          <SideNavbar />
          }
          <Routes>
            <Route path='/' element={<OrderPage setCustomerName={setCustomerName} setIsLogin={setIsLogin} customerName={customerName} isLogin={isLogin} />} />
            <Route path='/food' element={<FoodPage customerName={customerName} isLogin={isLogin} />} />
            <Route path='/drink' element={<DrinkPage customerName={customerName} isLogin={isLogin} />} />
            <Route path='/snack' element={<SnackPage customerName={customerName} isLogin={isLogin} />} />
            <Route path='/kasir' element={<CashierPage setIsCashier={setIsCashier}  />} />
            <Route path='/*' element={<NotFound />} />
          </Routes>
        </Router>
      </div>
    </div>
  );
}

export default App;
