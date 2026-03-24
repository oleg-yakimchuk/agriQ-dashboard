import {mockPiles} from "../data/mockData.ts";

const AlertsPage = () => {
    // We flatten the mock data to get a single list of all problem sensors
    const activeAlerts = mockPiles.flatMap(pile =>
        pile.problemSensors.map(sensor => ({
            pileName: pile.name,
            ...sensor
        }))
    );

    return (
        <div>
            <div className="mb-10">
                <h2 className="text-3xl font-bold text-slate-900">Active Alerts</h2>
                <p className="text-slate-500 mt-2">Sensors requiring immediate operator inspection.</p>
            </div>

            {activeAlerts.length === 0 ? (
                <div className="bg-green-50 text-green-700 p-6 rounded-xl border border-green-100 font-medium">
                    All sensors are operating within normal parameters.
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                        <tr>
                            <th className="p-4 font-semibold">Site / Pile</th>
                            <th className="p-4 font-semibold">Sensor ID</th>
                            <th className="p-4 font-semibold">Layer</th>
                            <th className="p-4 font-semibold">Temperature</th>
                            <th className="p-4 font-semibold">Moisture</th>
                            <th className="p-4 font-semibold">Action</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                        {activeAlerts.map((alert, idx) => (
                            <tr key={`${alert.pileName}-${alert.id}-${idx}`} className="hover:bg-slate-50 transition-colors">
                                <td className="p-4 font-medium text-slate-900">{alert.pileName}</td>
                                <td className="p-4 font-bold text-slate-700">{alert.id}</td>
                                <td className="p-4 capitalize text-slate-600">{alert.layer}</td>
                                <td className="p-4">
                    <span className={`font-semibold ${alert.temperature === 'erratic' ? 'text-red-600' : alert.temperature > 40 ? 'text-amber-600' : 'text-slate-700'}`}>
                      {alert.temperature === 'erratic' ? 'ERRATIC' : `${alert.temperature}°C`}
                    </span>
                                </td>
                                <td className="p-4">
                    <span className={`font-semibold ${alert.moisture === 'erratic' ? 'text-red-600' : alert.moisture > 15 ? 'text-amber-600' : 'text-slate-700'}`}>
                      {alert.moisture === 'erratic' ? 'ERRATIC' : `${alert.moisture}%`}
                    </span>
                                </td>
                                <td className="p-4">
                                    <button className="text-blue-600 hover:text-blue-800 font-semibold text-xs transition-colors">
                                        Inspect
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AlertsPage;