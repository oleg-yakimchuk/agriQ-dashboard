import {Link, useLocation} from "react-router-dom";
import {mockPiles} from "../data/mockData.ts";

const Layout = ({ children }: { children: React.ReactNode }) => {
    const location = useLocation();

    // Calculate the total number of alerts dynamically
    const alertCount = mockPiles.flatMap(p => p.problemSensors).length;

    return (
        <div className="flex h-screen bg-slate-50 font-sans">
            <aside className="w-64 bg-white border-r border-slate-200 p-6 flex flex-col gap-8 shadow-sm z-10">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold shadow-sm">Q</div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">AgriQ</h1>
                </div>

                <nav className="flex flex-col gap-2 text-sm font-medium">
                    <Link
                        to="/sites"
                        className={`p-3 rounded-xl transition-colors ${
                            location.pathname.includes('/sites')
                                ? 'bg-blue-50 text-blue-700 font-bold'
                                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                    >
                        Sites Overview
                    </Link>

                    <Link
                        to="/alerts"
                        className={`p-3 rounded-xl transition-colors flex justify-between items-center ${
                            location.pathname.includes('/alerts')
                                ? 'bg-red-50 text-red-700 font-bold'
                                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                    >
                        <span>Active Alerts</span>
                        {/* Dynamic notification badge */}
                        {alertCount > 0 && (
                            <span className={`px-2 py-0.5 text-[10px] font-black rounded-full ${
                                location.pathname.includes('/alerts') ? 'bg-red-200 text-red-800' : 'bg-red-100 text-red-600'
                            }`}>
                {alertCount}
              </span>
                        )}
                    </Link>
                </nav>
            </aside>

            <main className="flex-1 overflow-auto p-10">{children}</main>
        </div>
    );
};

export default Layout;