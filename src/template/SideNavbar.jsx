import { useNavigate, useLocation } from 'react-router-dom';
import webIcon from './../img/loading-icon.png';

function SideNavbar() {
    const btnNavClass = 'w-full flex justify-start text-lg py-2 hover:text-sky-400 transition-all myduration_400 -translate-x-[1.5rem] hover:translate-x-0 active:scale-[0.8] will-change-transform';
    const navigate = useNavigate();

    const navMenuText = [
        { name: 'Pemesanan', path: '/' },
        { name: 'Makanan', path: '/food' },
        { name: 'Minuman', path: '/drink' },
        { name: 'Snack', path: '/snack' }
    ]
    const pageNavState = useLocation();

    const hrefTo = (path) => { 
        navigate(path);
    };

    return (
        <>
        <div className="w-[30%] max-w-[280px] max-[767px]:hidden flex items-center h-screen overflow-y-hidden">
            <div className="w-full h-[90%] flex flex-col justify-center items-center border-r-2 border-gray-600/50">
                <div className="w-[80%] h-full">
                    <div className='w-full h-full flex flex-col justify-between'>
                        <div className='w-full h-auto flex flex-col items-center mt-3'>
                            <div className='flex flex-col items-center'>
                                <div className='w-[90%] max-w-[110px]'>
                                    <img className='hover:scale-[1.1] will-change-transform transition-all myduration_400 active:scale-[0.9]' src={webIcon} />
                                </div>
                                <div className='flex flex-col mt-3 items-center'>
                                    <p className='text-2xl font-medium hover:rotate-[5deg] hover:scale-[1.1] active:scale-[0.8] transition-all myduration_400 will-change-transform'>Mie Ayam<span className='text-sky-400'>.ku</span></p>
                                    <p className='text-sm tracking-wide hover:scale-[1.1] active:scale-[0.8] transition-all myduration_400 will-change-transform'>Sejak <span className='text-gray-600'>Orde Baru</span></p>
                                </div>
                                <div className='mt-10 w-full h-auto flex flex-col items-start truncate'>
                                    {navMenuText.map((textMenu, index) => (
                                        <button key={index} className={`${btnNavClass} ${pageNavState.pathname == textMenu.path ? 'text-sky-400 translate-x-0' : ''}`} onClick={ () => hrefTo(textMenu.path) }><span className={`bi ${pageNavState.pathname == textMenu.path ? textMenu.name == 'Pemesanan' ? 'bi-person' : 'bi-clipboard' : 'bi-arrow-right-short'}`}></span>&nbsp; {textMenu.name}</button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className='w-full h-auto mt-3 flex justify-start'>
                            <div className='flex items-start'>
                                <div className="w-full h-auto flex flex-col">
                                    <button onClick={() => window.open('https://github.com/rijaalll/mie-ayam-app', '_blank')}><span>Github</span></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className='min-[768px]:hidden fixed z-[12] bottom-5 left-0 w-full h-auto flex justify-center items-center'>
            <div className='w-[90%] h-auto p-3 bg-slate-200/60 backdrop-blur-sm rounded-lg'>
                <div className='w-full h-auto flex flex-row justify-evenly items-center'>
                {navMenuText.map((textMenu, index) => (
                    <button key={index} className={`max-[425px]:text-sm ${pageNavState.pathname == textMenu.path ? 'text-sky-400 translate-x-0' : ''}`} onClick={ () => hrefTo(textMenu.path) }>&nbsp; {textMenu.name}</button>
                ))}
                </div>
            </div>
        </div>
        </>
    );
}

export default SideNavbar;