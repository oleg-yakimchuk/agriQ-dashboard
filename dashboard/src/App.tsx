import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import SitesPage from "./pages/SitesPage";
import AlertsPage from "./pages/AlertsPage";
import type { Pile } from "./types";

export default function App() {
    const [piles, setPiles] = useState<Pile[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("http://localhost:5001/api/piles")
            .then((res) => res.json())
            .then((data) => {
                setPiles(data);

                // 2. Wrapped the loading state in a 1-second timeout to imitate loading
                setTimeout(() => {
                    setLoading(false);
                }, 1000);
            })
            .catch((err) => {
                console.error("Failed to fetch telemetry:", err);
                setLoading(false); // Stop loading even if there's an error
            });
    }, []);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-50 text-slate-500 font-medium">
                <div className="animate-pulse flex flex-col items-center gap-4">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold shadow-sm animate-bounce">Q</div>
                    Connecting to Harish 7 Gateway...
                </div>
            </div>
        );
    }

    return (
        <BrowserRouter>
            <Layout piles={piles}>
                <Routes>
                    <Route path="/" element={<Navigate to="/sites" />} />
                    <Route path="/sites" element={<SitesPage piles={piles} />} />
                    <Route path="/alerts" element={<AlertsPage piles={piles} />} />
                </Routes>
            </Layout>
        </BrowserRouter>
    );
}