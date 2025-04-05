function MenuLoader({MenuPage}) {

    return (
        <div className="w-[80%] h-screen fixed -top-full left-auto z-[100] bg-slate-200 MenuLoader">
            <div className="w-full h-full flex justify-center items-center">    
                <div className="w-auto h-auto flex justify-center items-center">
                    <div className="w-auto hauto flex flex-col justify-center items-center gap-4">
                        <p className="text-5xl font-medium">{MenuPage}</p>
                        <p className="text-2xl font-medium">Mie Ayam<span className="text-sky-400">.ku</span></p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MenuLoader;