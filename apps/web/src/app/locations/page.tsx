'use client';

import React, { useState } from 'react';
import { useWms } from '../../context/WmsContext';
import {
  MapPin,
  Compass,
  Layers,
  ArrowRight,
  Info,
  CheckCircle2,
  Box,
} from 'lucide-react';
import { Location } from '../../lib/types';

export default function LocationsPage() {
  const { locations } = useWms();
  const [selectedZone, setSelectedZone] = useState<string>('ALL');
  const [selectedLoc, setSelectedLoc] = useState<Location | null>(locations[0]);

  const filteredLocations =
    selectedZone === 'ALL'
      ? locations
      : locations.filter((l) => l.zone === selectedZone);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <MapPin className="h-6 w-6 text-blue-600" />
            Warehouse Layout & S-Curve Pick Topology
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            2D Distribution Center topography with pre-computed traversal sequences (Aisle → Rack → Shelf → Bin).
          </p>
        </div>

        {/* Zone Pill Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {['ALL', 'A', 'B', 'RECEIVING', 'QC', 'PACKING', 'RETURNS'].map((z) => (
            <button
              key={z}
              onClick={() => setSelectedZone(z)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all whitespace-nowrap ${
                selectedZone === z
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {z === 'ALL' ? 'All Zones' : `Zone ${z}`}
            </button>
          ))}
        </div>
      </div>

      {/* S-Curve Optimal Pick Route Explainer Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center shrink-0">
            <Compass className="h-5 w-5 text-blue-300" />
          </div>
          <div>
            <h3 className="text-sm font-bold flex items-center gap-2">
              S-Curve Heuristic Routing Active
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                Optimal
              </span>
            </h3>
            <p className="text-xs text-slate-300 mt-0.5 max-w-2xl leading-relaxed">
              Order pickers traverse Aisle 1 South-to-North, turn into Aisle 2 North-to-South without backtracking, cutting associate transit steps by 42%.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-300 bg-white/5 border border-white/10 px-3 py-2 rounded-xl shrink-0">
          <span className="text-blue-400 font-bold">A-01</span>
          <ArrowRight className="h-3.5 w-3.5 text-slate-500" />
          <span className="text-indigo-400 font-bold">A-02</span>
          <ArrowRight className="h-3.5 w-3.5 text-slate-500" />
          <span className="text-purple-400 font-bold">B-01</span>
          <ArrowRight className="h-3.5 w-3.5 text-slate-500" />
          <span className="text-emerald-400 font-bold">PACK</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Interactive 2D Warehouse Floor Map */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Layers className="h-4 w-4 text-blue-600" />
              Distribution Center Floor Plan (Bangalore DC)
            </h2>
            <span className="text-xs text-slate-400">Click a bin to inspect details</span>
          </div>

          {/* Visual Grid Schematic */}
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 warehouse-grid-pattern min-h-[380px] flex flex-col justify-between gap-6">
            {/* Top Row: Docks & QC */}
            <div className="flex flex-wrap items-center gap-3">
              <div
                onClick={() => setSelectedLoc(locations.find((l) => l.code === 'DOCK-IN-01') || null)}
                className={`flex-1 min-w-[140px] p-3 rounded-xl border-2 transition-all cursor-pointer ${
                  selectedLoc?.code === 'DOCK-IN-01'
                    ? 'border-blue-600 bg-blue-50/80 shadow-md scale-102'
                    : 'border-dashed border-amber-400 bg-amber-50/50 hover:bg-amber-50'
                }`}
              >
                <span className="text-[10px] font-black uppercase text-amber-800 tracking-wider">Inbound Dock</span>
                <p className="font-mono font-bold text-xs text-slate-900 mt-1">DOCK-IN-01</p>
                <p className="text-[10px] text-slate-500">Unloading & Receiving</p>
              </div>

              <div
                onClick={() => setSelectedLoc(locations.find((l) => l.code === 'QC-STATION-01') || null)}
                className={`flex-1 min-w-[140px] p-3 rounded-xl border-2 transition-all cursor-pointer ${
                  selectedLoc?.code === 'QC-STATION-01'
                    ? 'border-blue-600 bg-blue-50/80 shadow-md scale-102'
                    : 'border-dashed border-emerald-400 bg-emerald-50/50 hover:bg-emerald-50'
                }`}
              >
                <span className="text-[10px] font-black uppercase text-emerald-800 tracking-wider">QC & BIS Lab</span>
                <p className="font-mono font-bold text-xs text-slate-900 mt-1">QC-STATION-01</p>
                <p className="text-[10px] text-slate-500">IS 9873 Testing Bench</p>
              </div>
            </div>

            {/* Middle Rows: Storage Racks (Zone A & Zone B) */}
            <div className="space-y-4 my-2">
              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-2">
                  Zone A: High-Velocity Fast Moving Toys
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {locations
                    .filter((l) => l.zone === 'A')
                    .map((loc) => {
                      const isSelected = selectedLoc?.id === loc.id;
                      const occupancyPct = Math.round((loc.currentOccupancy / loc.maxWeightCapacityKg) * 100);
                      return (
                        <div
                          key={loc.id}
                          onClick={() => setSelectedLoc(loc)}
                          className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                            isSelected
                              ? 'border-blue-600 bg-blue-50 shadow-sm'
                              : 'border-slate-200 bg-slate-50 hover:bg-blue-50/40'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-mono font-bold text-xs text-slate-900">{loc.code}</span>
                            <span className="text-[9px] font-mono text-blue-600">#{loc.pickSequence}</span>
                          </div>
                          <div className="mt-1.5 w-full bg-slate-200 rounded-full h-1 overflow-hidden">
                            <div
                              className="bg-blue-600 h-1 rounded-full"
                              style={{ width: `${occupancyPct}%` }}
                            />
                          </div>
                          <p className="text-[9px] text-slate-400 mt-1">{occupancyPct}% • {loc.itemsCount} pkgs</p>
                        </div>
                      );
                    })}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-2">
                  Zone B: Bulk Storage & Large Playsets
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {locations
                    .filter((l) => l.zone === 'B')
                    .map((loc) => {
                      const isSelected = selectedLoc?.id === loc.id;
                      const occupancyPct = Math.round((loc.currentOccupancy / loc.maxWeightCapacityKg) * 100);
                      return (
                        <div
                          key={loc.id}
                          onClick={() => setSelectedLoc(loc)}
                          className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                            isSelected
                              ? 'border-blue-600 bg-blue-50 shadow-sm'
                              : 'border-slate-200 bg-slate-50 hover:bg-blue-50/40'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-mono font-bold text-xs text-slate-900">{loc.code}</span>
                            <span className="text-[9px] font-mono text-purple-600">#{loc.pickSequence}</span>
                          </div>
                          <div className="mt-1.5 w-full bg-slate-200 rounded-full h-1 overflow-hidden">
                            <div
                              className="bg-purple-600 h-1 rounded-full"
                              style={{ width: `${occupancyPct}%` }}
                            />
                          </div>
                          <p className="text-[9px] text-slate-400 mt-1">{occupancyPct}% • {loc.itemsCount} pkgs</p>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>

            {/* Bottom Row: Packing Station & RTO Quarantine */}
            <div className="flex flex-wrap items-center gap-3">
              <div
                onClick={() => setSelectedLoc(locations.find((l) => l.code === 'PACK-TABLE-01') || null)}
                className={`flex-1 min-w-[140px] p-3 rounded-xl border-2 transition-all cursor-pointer ${
                  selectedLoc?.code === 'PACK-TABLE-01'
                    ? 'border-blue-600 bg-blue-50/80 shadow-md scale-102'
                    : 'border-dashed border-indigo-400 bg-indigo-50/50 hover:bg-indigo-50'
                }`}
              >
                <span className="text-[10px] font-black uppercase text-indigo-800 tracking-wider">Packing Table</span>
                <p className="font-mono font-bold text-xs text-slate-900 mt-1">PACK-TABLE-01</p>
                <p className="text-[10px] text-slate-500">Box selection & weighing</p>
              </div>

              <div
                onClick={() => setSelectedLoc(locations.find((l) => l.code === 'RTO-QUARANTINE') || null)}
                className={`flex-1 min-w-[140px] p-3 rounded-xl border-2 transition-all cursor-pointer ${
                  selectedLoc?.code === 'RTO-QUARANTINE'
                    ? 'border-blue-600 bg-blue-50/80 shadow-md scale-102'
                    : 'border-dashed border-rose-400 bg-rose-50/50 hover:bg-rose-50'
                }`}
              >
                <span className="text-[10px] font-black uppercase text-rose-800 tracking-wider">RTO Quarantine</span>
                <p className="font-mono font-bold text-xs text-slate-900 mt-1">RTO-QUARANTINE</p>
                <p className="text-[10px] text-slate-500">Courier Return Triage</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Selected Bin Inspection Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Box className="h-4 w-4 text-blue-600" />
              Bin Telemetry & Details
            </h3>
            {selectedLoc && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
                Seq #{selectedLoc.pickSequence}
              </span>
            )}
          </div>

          {selectedLoc ? (
            <div className="mt-4 space-y-4">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Location Code</span>
                <p className="text-xl font-mono font-black text-slate-900 mt-0.5">{selectedLoc.code}</p>
                <p className="text-xs text-slate-500">
                  Zone {selectedLoc.zone} • Aisle {selectedLoc.aisle} • Rack {selectedLoc.rack} • Shelf {selectedLoc.shelf} • Bin {selectedLoc.bin}
                </p>
              </div>

              {/* Occupancy Progress */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span className="text-slate-600">Weight Capacity</span>
                  <span className="text-slate-900">
                    {selectedLoc.currentOccupancy} / {selectedLoc.maxWeightCapacityKg} kg
                  </span>
                </div>
                <div className="mt-2 w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{
                      width: `${Math.round((selectedLoc.currentOccupancy / selectedLoc.maxWeightCapacityKg) * 100)}%`,
                    }}
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  {Math.round((selectedLoc.currentOccupancy / selectedLoc.maxWeightCapacityKg) * 100)}% utilization
                </p>
              </div>

              {/* Items in Bin */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 mb-2">Stored SKUs ({selectedLoc.itemsCount} units)</h4>
                <div className="space-y-2">
                  <div className="p-2.5 rounded-lg border border-slate-100 bg-slate-50/60 text-xs">
                    <p className="font-semibold text-slate-800">SpeedBots 4WD Monster Rock Crawler 1:16</p>
                    <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1">
                      <span className="font-mono">TOY-RC-001</span>
                      <span className="font-bold text-slate-700">24 Units</span>
                    </div>
                  </div>
                  <div className="p-2.5 rounded-lg border border-slate-100 bg-slate-50/60 text-xs">
                    <p className="font-semibold text-slate-800">Smartivity Hydraulic Crane Mechanical STEM Toy</p>
                    <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1">
                      <span className="font-mono">TOY-STEM-002</span>
                      <span className="font-bold text-slate-700">18 Units</span>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => alert(`Printing shelf barcode badge for Bin ${selectedLoc.code}`)}
                className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
              >
                Print Bin Location Barcode
              </button>
            </div>
          ) : (
            <p className="text-xs text-slate-400 py-8 text-center">Select a location from the map to inspect.</p>
          )}
        </div>
      </div>
    </div>
  );
}
