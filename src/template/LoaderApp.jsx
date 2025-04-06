import { useEffect, useState } from 'react';
import loadingIcon from './../img/loading-icon.png';

function LoaderFirst({display}) {
    const mieAyamText = ["M", "i", "e", "A", "y", "a", "m"];

    return (
        <div id='loaderFirst' className={`${display} fixed z-[500] top-0 left-0 w-full h-screen bg-slate-50`}>
            <div className='w-full h-full'>
                <div className='w-full h-full flex justify-center items-center'>
                    <div className='w-auto h-auto flex flex-col gap-4 justify-center items-center relative'>
                        <div className='w-[90%] max-w-[110px] max-[425px]:max-w-[90px] h-auto animate__animated animate__bounceInDown mydelay_10'>
                            <img src={loadingIcon} />
                        </div>
                        <div className='flex flex-row w-full gap-[1px] items-center relative z-[10]'>
                            {mieAyamText.map((text, index) => (
                                <p key={index} className={`text-6xl max-[425px]:text-3xl font-medium animate__animated animate__fadeInDown ${index == 2 ? 'mr-4 max-[425px]:mr-2' : ''} mydelay_${index + 2}00`}>{text}</p>
                            ))}
                            <p className='text-6xl max-[425px]:text-3xl font-medium text-sky-400 animate__animated animate__bounceInRight mydelay_15'>.ku</p>
                        </div>
                        <div className='svgLineLoader mydelay_20 w-[calc(100%+20px)]  h-auto -mt-[7.4rem] max-[425px]:-mt-[4.5rem] z-[9] relative -rotate-[0.2deg]'>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 250">
                                <path
                                fill="none"
                                stroke='url("#SvgjsLinearGradient1003")'
                                strokeLinecap="round"
                                strokeWidth="14"
                                d="M21.076 212.556c27.653-2.84 110.464-16.741 165.92-17.04 55.455-.3 112.556 15.246 166.816 15.246s110.314-17.339 158.744-15.246S600 220.478 644.395 223.318s112.107-8.968 134.529-10.762"
                                ></path>
                                <defs>
                                    <linearGradient id="SvgjsLinearGradient1003">
                                        <stop offset="0" stopColor="hsl(0, 0%, 0%)"></stop>
                                        <stop offset="1" stopColor="hsl(198 93.2% 59.6%)"></stop>
                                    </linearGradient>
                                </defs>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function LoaderSecond() {
    return (
        <div id='loaderSecond' className='fixed z-[501] top-0 left-0 w-full h-screen flex flex-col justify-start'>
            <div className='secondLoadTop absolute w-full h-1/2 -left-full top-0 bg-slate-300'></div>
            <div className='secondLoadBot absolute w-full h-1/2 -right-full top-1/2 bg-gray-200'></div>
        </div>
    )
}


function LoaderApp() {
    const [secondLoader, isSecondLoader] = useState(false);
    const [firstDisplay, setFirstDisplay] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            isSecondLoader(true)
        }, 7000);
        setTimeout(() => {
            setFirstDisplay(false);
        }, 7800);
        setTimeout(() => {
            isSecondLoader(false);
        }, 10000);
    }, [])

    return (
        <>
            { firstDisplay ? <LoaderFirst /> : ' ' }
            { secondLoader ? <LoaderSecond /> : ' ' }
        </>
    );
}

export default LoaderApp;