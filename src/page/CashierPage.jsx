import { useState, useEffect } from "react";

function CashierPage({ setIsCashier }) {
    const [isLogin, setIsLogin] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [namaKasir, setNamaKasir] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const kasirDataApi = 'http://127.0.0.1/tes/api-mieayam/kasir.php?';

    useEffect(() => {
        setIsCashier(true);
        document.title = "Kasir";

        const savedUsername = localStorage.getItem('kasirUsername');
        const savedPassword = localStorage.getItem('kasirPassword');

        if (savedUsername && savedPassword) {
            autoLogin(savedUsername, savedPassword);
        }
    }, [setIsCashier]);

    const autoLogin = async (savedUsername, savedPassword) => {
        try {
            const response = await fetch(`${kasirDataApi}username=${encodeURIComponent(savedUsername)}&password=${encodeURIComponent(savedPassword)}`);
            const data = await response.json();

            if (data.status === 'berhasil') {
                setIsLogin(true);
                setNamaKasir(data.nama);
                setUsername(savedUsername);
                setPassword(savedPassword);
                setErrorMsg('');
            } else {
                setIsLogin(false);
                localStorage.removeItem('kasirUsername');
                localStorage.removeItem('kasirPassword');
            }
        } catch (error) {
            setErrorMsg('Gagal menghubungi server.');
        }
    };

    const handleLogin = async () => {
        if (!username || !password) {
            setErrorMsg('Username dan password wajib diisi!');
            return;
        }

        try {
            const response = await fetch(`${kasirDataApi}username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`);
            const data = await response.json();

            if (data.status === 'berhasil') {
                setIsLogin(true);
                setNamaKasir(data.nama);
                setErrorMsg('');

                // Simpan ke localStorage
                localStorage.setItem('kasirUsername', username);
                localStorage.setItem('kasirPassword', password);
            } else {
                setErrorMsg(data.pesan || 'Login gagal.');
            }
        } catch (error) {
            setErrorMsg('Gagal menghubungi server.');
        }
    };

    const handleLogout = () => {
        setIsLogin(false);
        setUsername('');
        setPassword('');
        setNamaKasir('');
        localStorage.removeItem('kasirUsername');
        localStorage.removeItem('kasirPassword');
    };

    return (
        <div className="w-full h-auto min-h-screen">
            {isLogin ? (
                <div className="flex flex-col items-center justify-center h-screen gap-3">
                    <p className="text-2xl font-semibold">Selamat datang, {namaKasir}!</p>
                    <button
                        onClick={handleLogout}
                        className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                    >
                        Logout
                    </button>
                </div>
            ) : (
                <div className="w-full h-auto min-h-screen flex justify-center items-center">
                    <div className="w-auto h-auto p-5 flex flex-col justify-center items-center gap-10">
                        <div className="w-full h-auto">
                            <p className="text-3xl text-center">Masuk Kasir</p>
                        </div>
                        <div className="w-auto h-auto flex flex-col gap-3">
                            <input
                                type="text"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full h-10 rounded-md px-3"
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full h-10 rounded-md px-3"
                            />
                            {errorMsg && (
                                <p className="text-red-500 text-sm text-center">{errorMsg}</p>
                            )}
                            <button
                                className="w-full h-10 rounded-md bg-sky-400 text-white hover:bg-sky-500 transition"
                                onClick={handleLogin}
                            >
                                Masuk
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CashierPage;
