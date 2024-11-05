import { Outlet } from 'react-router-dom';
import DashboardNavbar from './navigation/dashboardNavbar';

function DashboardLayout() {
    return (
        <div className="flex">
            <div className="fixed left-0 w-[350px] h-screen z-10">
                <DashboardNavbar />
            </div>

            <div className="ml-[350px] w-full">
                <Outlet />
            </div>
        </div>
    );
}

export default DashboardLayout;
