function MenuLoader({MenuPage}) {

    return (
        <div className="w-[80%] max-[767px]:w-full h-screen fixed -top-full left-auto z-[100] bg-slate-200 MenuLoader">
            <div className="w-full h-full flex justify-center items-center">    
                <div className="w-auto h-auto flex justify-center items-center">
                    <div className="w-auto hauto flex flex-col justify-center items-center gap-4 max-[425px]:gap-0">
                        <p className="text-5xl max-[425px]:text-2xl font-medium">{MenuPage}</p>
                        <p className="text-2xl max-[425px]:text-xl font-medium">Mie Ayam<span className="text-sky-400">.ku</span></p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MenuLoader;