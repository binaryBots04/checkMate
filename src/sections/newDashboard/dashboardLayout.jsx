import { Outlet } from 'react-router-dom';
import DashboardNavbar from './navigation/navigationBar';

function DashboardLayout() {
    return (
        <div className="flex">
            <div className="fixed left-0 w-[450px]">
                <DashboardNavbar />
            </div>

            <div className="ml-[450px] z-10">
                <Outlet />
            </div>
        </div>
    );
}

export default DashboardLayout;