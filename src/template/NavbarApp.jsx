import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { Expand } from "@theme-toggles/react";
import "@theme-toggles/react/css/Expand.css";

import './../style/animation.css';

function NavbarApp() {
    if (!localStorage.getItem('theme')) {
        localStorage.setItem('theme', 'light');
        var themeTest = localStorage.getItem('theme') == 'light' ? false : true;
    } else {
        var themeTest = localStorage.getItem('theme') == 'light' ? false : true;
    }
    const [isThemeBtn, setThemeBtn] = useState(themeTest);
    useEffect(()=>{
        if (isThemeBtn) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isThemeBtn])
    
    const navigate = useNavigate();
    const hrefTo = (path) => { navigate(path) };

    const pageNavState = useLocation();

    return (
        <>
        <nav className="w-full h-auto flex justify-center">
            <div className='w-11/12 flex flex-row justify-between items-center px-2 py-3'>
            
                <div className={`cursor-pointer`} onClick={() => hrefTo('/')}>
                    <p className="text-lg min-[1024px]:text-xl dark:text-white">React Template</p>
                    <p className='text-xs min-[1024px]:text-sm tracking-wide dark:text-white'>with <span className='text-blue-500'>TailwindCSS</span></p>
                </div>

                <div className="flex flex-row gap-4 min-[1024px]:gap-7">

                    <div className="flex flex-row gap-4 min-[1024px]:gap-6 max-[524px]:hidden">
                        
                    </div>

                    <Expand className={`text-3xl text-yellow-500 dark:text-gray-400`} duration={500} toggled={isThemeBtn} toggle={setThemeBtn} />
                
                </div>

            </div>
        </nav>
        </>
    );
}

export default NavbarApp;