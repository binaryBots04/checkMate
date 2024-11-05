import { NavLink } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";

function DashboardNavbar() {
    const { user, logout } = useAuth0();

    return (
        <>
            <main className='bg-[#0F0D13ff] w-screen h-screen'>
                <nav className="w-[450px] h-screen flex flex-col justify-between bg-[#0F0D13ff] pb-7">
                    <div className='flex flex-col justify-center items-center p-16'>
                        <NavLink to="/dashboard/profile">
                            <div className="w-40 h-40 rounded-full bg-white shadow-inner flex items-center justify-center mb-4">
                                <img src={user.picture} alt="User Profile Picture" className='w-[150px] h-[150px] rounded-full hover:cursor-pointer'/>
                            </div>
                        </NavLink>
                        <h1 className='font-albulaBold text-white text-3xl mt-10'>{user.given_name} {user.family_name}</h1>
                        <h1 className='font-albulaRegular text-slate-300 text-base mt-2'>{user.email}</h1>
                    </div>

                    <ul className="flex flex-col items-start space-y-10 text-white px-7 -mt-24">
                        <li className="w-full">
                            <NavLink to="/dashboard/analysis" className={({ isActive }) => `flex items-center space-x-4 w-full transition ease-in-out ${isActive ? "text-[#9676ff]" : "hover:text-[#9676ff]"}`}>
                                <span className="font-albulaHeavy px-12 text-2xl">Dashboard</span>
                            </NavLink>
                        </li>
                        <li className="w-full">
                            <NavLink to="/dashboard/wallet" className={({ isActive }) => `flex items-center space-x-4 w-full transition ease-in-out ${isActive ? "text-[#9676ff]" : "hover:text-[#9676ff]"}`}>
                                <span className="font-albulaHeavy px-12 text-2xl">Wallet</span>
                            </NavLink>
                        </li>
                        <li className="w-full">
                            <NavLink to="/dashboard/profile" className={({ isActive }) => `flex items-center space-x-4 w-full transition ease-in-out ${isActive ? "text-[#9676ff]" : "hover:text-[#9676ff]"}`}>
                                <span className="font-albulaHeavy px-12 text-2xl">Profile</span>
                            </NavLink>
                        </li>

                        <li className="w-full">
                            <NavLink className="flex items-center space-x-4 w-full text-orange-400 hover:text-orange-600 transition ease-in-out duration-200t" onClick={() => logout({ returnTo: window.location.origin })}>
                                <span className="font-albulaHeavy px-12 text-2xl">Log Out</span>
                            </NavLink>
                        </li>
                    </ul>

                    <h1 className='text-slate-400 text-center font-albulaLight text-sm'>Made with love by Team Binary Bots ❤️</h1>
                </nav>
            </main>
        </>
    );
}

export default DashboardNavbar;