import { useState } from "react";
import type {Pile} from "../types";

const SitesPage = ({ piles }: { piles: Pile[] }) => {
    const [selectedPile, setSelectedPile] = useState<Pile | null>(null);

    // Helper to render 10 sensors for a specific layer
    const renderLayer = (layerName: string, startId: number) => (
        <div className="mb-6">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">{layerName} Layer</h4>
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                {Array.from({ length: 10 }).map((_, i) => {
                    const id = `S${(startId + i).toString().padStart(2, '0')}`;
                    const problem = selectedPile?.problemSensors.find(s => s.id === id);

                    return (
                        <div
                            key={id}
                            className={`h-12 flex flex-col items-center justify-center rounded-lg border text-[10px] font-bold transition-all ${
                                problem
                                    ? 'bg-red-50 border-red-200 text-red-600 shadow-sm animate-pulse'
                                    : 'bg-slate-50 border-slate-100 text-slate-400'
                            }`}
                            title={problem ? `Alert: ${problem.temperature}°C / ${problem.moisture}%` : 'Status: OK'}
                        >
                            <span>{id}</span>
                            {problem && <span className="text-[8px]">!</span>}
                        </div>
                    );
                })}
            </div>
        </div>
    );

    return (
        <div>
            <div className="mb-10">
                <h2 className="text-3xl font-bold text-slate-900">Storage Sites</h2>
                <p className="text-slate-500 mt-2">Click a pile to inspect internal sensor balls.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {piles.map(pile => (
                    <div
                        key={pile.id}
                        onClick={() => setSelectedPile(pile)}
                        className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group"
                    >
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

            {/* Sensor Drill-down Modal */}
            {selectedPile && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                        <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                            <div>
                                <h3 className="text-2xl font-bold text-slate-900">{selectedPile.name}</h3>
                                <p className="text-slate-500 text-sm">Internal Sensor Map (30 Nodes)</p>
                            </div>
                            <button
                                onClick={() => setSelectedPile(null)}
                                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 transition-colors"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="p-8 overflow-y-auto">
                            {renderLayer('Top', 21)}
                            {renderLayer('Middle', 11)}
                            {renderLayer('Bottom', 1)}

                            <div className="mt-8 p-4 bg-slate-50 rounded-xl border border-slate-100">
                                <h5 className="text-sm font-bold mb-2">Legend</h5>
                                <div className="flex gap-4 text-xs text-slate-500">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 bg-slate-200 rounded-sm"></div> Normal
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 bg-red-400 rounded-sm"></div> Problem Detected
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SitesPage;