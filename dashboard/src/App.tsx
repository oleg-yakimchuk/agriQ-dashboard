import { BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import Layout from "./components/Layout.tsx";
import SitesPage from "./pages/SitesPage.tsx";
import AlertsPage from "./pages/AlertsPage.tsx";

export default function App() {
    return (
        <BrowserRouter>
            <Layout>
                <Routes>
                    <Route path="/" element={<Navigate to="/sites" />} />
                    <Route path="/sites" element={<SitesPage />} />
                    <Route path="/alerts" element={<AlertsPage />} />
                </Routes>
            </Layout>
        </BrowserRouter>
    );
}