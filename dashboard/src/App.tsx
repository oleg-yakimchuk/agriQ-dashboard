import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import { mockPiles } from "./data/mockData";

// This is our main wrapper with the Sidebar
const Layout = ({ children }: { children: React.ReactNode }) => (
    <div className="flex h-screen bg-slate-50 font-sans">
        <aside className="w-64 bg-white border-r border-slate-200 p-6 flex flex-col gap-8 shadow-sm">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">Q</div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">AgriQ</h1>
            </div>
            <nav className="flex flex-col gap-2 text-sm font-medium">
                <Link to="/sites" className="p-3 bg-blue-50 text-blue-700 rounded-xl">Sites Overview</Link>
                <Link to="/alerts" className="p-3 text-slate-500 hover:bg-slate-50 hover:text-slate-900 rounded-xl transition-colors">Active Alerts</Link>
            </nav>
        </aside>
        <main className="flex-1 overflow-auto p-10">{children}</main>
    </div>
);

const SitesPage = () => (
    <div>
        <div className="mb-10">
            <h2 className="text-3xl font-bold text-slate-900">Storage Sites</h2>
            <p className="text-slate-500 mt-2">Real-time telemetry for grain storage piles.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mockPiles.map(pile => (
                <div key={pile.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer group">
                    <div className="flex justify-between items-start mb-6">
                        <h3 className="text-lg font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{pile.name}</h3>
                        <span className={`px-2.5 py-1 text-[10px] uppercase tracking-wider font-black rounded-full border ${
                            pile.status === 'OK' ? 'bg-green-50 text-green-700 border-green-100' :
                                pile.status === 'Warning' ? 'bg-amber-50 text-amber-700 border-amber-100' : 'bg-red-50 text-red-700 border-red-100'
                        }`}>{pile.status}</span>
                    </div>
                    <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-400">Avg Temp</span>
                            <span className="text-slate-900 font-semibold">{pile.avgTemp}°C</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-400">Avg Moisture</span>
                            <span className="text-slate-900 font-semibold">{pile.avgMoisture}%</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

export default function App() {
    return (
        <BrowserRouter>
            <Layout>
                <Routes>
                    <Route path="/" element={<Navigate to="/sites" />} />
                    <Route path="/sites" element={<SitesPage />} />
                    <Route path="/alerts" element={<div className="text-2xl font-bold text-red-600">Alerts Coming Soon</div>} />
                </Routes>
            </Layout>
        </BrowserRouter>
    );
}