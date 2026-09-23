import React, { useState } from 'react';
import type { PricePoint } from '../types/collectible';
import { ArrowUpRight } from 'lucide-react';


interface ValuationChartProps {
  data: PricePoint[];
  height?: number;
  showLabels?: boolean;
  strokeColor?: string;
  fillGradientId?: string;
}

export const ValuationChart: React.FC<ValuationChartProps> = ({
  data,
  height = 140,
  showLabels = true,
  strokeColor = '#10b981',
  fillGradientId = 'valGrad'
}) => {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  if (!data || data.length === 0) return null;

  const values = data.map((d) => d.value);
  const minVal = Math.min(...values) * 0.95;
  const maxVal = Math.max(...values) * 1.05;
  const range = maxVal - minVal || 1;

  const width = 500;
  const paddingX = 24;
  const paddingY = 20;
  const chartWidth = width - paddingX * 2;
  const chartHeight = height - paddingY * 2;

  // Generate SVG path points
  const points = data.map((d, i) => {
    const x = paddingX + (i / (data.length - 1)) * chartWidth;
    const y = paddingY + chartHeight - ((d.value - minVal) / range) * chartHeight;
    return { x, y, value: d.value, month: d.month };
  });

  const pathD = points.reduce((acc, p, i) => {
    if (i === 0) return `M ${p.x},${p.y}`;
    const prev = points[i - 1];
    const cx1 = prev.x + (p.x - prev.x) / 2;
    const cy1 = prev.y;
    const cx2 = prev.x + (p.x - prev.x) / 2;
    const cy2 = p.y;
    return `${acc} C ${cx1},${cy1} ${cx2},${cy2} ${p.x},${p.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x},${height - paddingY} L ${points[0].x},${height - paddingY} Z`;

  const activePoint = hoverIndex !== null ? points[hoverIndex] : points[points.length - 1];
  const percentChange = (((data[data.length - 1].value - data[0].value) / data[0].value) * 100).toFixed(1);

  return (
    <div className="w-full bg-slate-900/60 rounded-xl p-4 border border-slate-800/80 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase font-semibold tracking-wider text-slate-400">
            6-Month Market Trend
          </span>
          <span className="inline-flex items-center text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
            <ArrowUpRight className="w-3 h-3 mr-0.5" />
            +{percentChange}%
          </span>
        </div>
        <div className="text-right">
          <span className="text-xs text-slate-400 mr-2">{activePoint.month}:</span>
          <span className="text-sm font-bold text-slate-100 font-mono">
            ${activePoint.value.toLocaleString()}
          </span>
        </div>
      </div>

      <div className="relative w-full">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full overflow-visible"
          preserveAspectRatio="none"
          style={{ height: `${height}px` }}
        >
          <defs>
            <linearGradient id={fillGradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={strokeColor} stopOpacity="0.35" />
              <stop offset="80%" stopColor={strokeColor} stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Background Grid Lines */}
          <line
            x1={paddingX}
            y1={paddingY}
            x2={width - paddingX}
            y2={paddingY}
            stroke="rgba(255,255,255,0.05)"
            strokeDasharray="4 4"
          />
          <line
            x1={paddingX}
            y1={paddingY + chartHeight / 2}
            x2={width - paddingX}
            y2={paddingY + chartHeight / 2}
            stroke="rgba(255,255,255,0.05)"
            strokeDasharray="4 4"
          />
          <line
            x1={paddingX}
            y1={height - paddingY}
            x2={width - paddingX}
            y2={height - paddingY}
            stroke="rgba(255,255,255,0.08)"
          />

          {/* Area Fill */}
          <path d={areaD} fill={`url(#${fillGradientId})`} />

          {/* Stroke Line */}
          <path
            d={pathD}
            fill="none"
            stroke={strokeColor}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Interactive Data Points */}
          {points.map((p, idx) => (
            <g key={idx} className="cursor-pointer" onMouseEnter={() => setHoverIndex(idx)}>
              <circle
                cx={p.x}
                cy={p.y}
                r={hoverIndex === idx ? 6 : 3.5}
                className="transition-all duration-150"
                fill={hoverIndex === idx ? '#fff' : strokeColor}
                stroke="#0f172a"
                strokeWidth="2"
              />
            </g>
          ))}
        </svg>

        {showLabels && (
          <div className="flex justify-between text-[11px] text-slate-500 font-mono mt-1 px-1">
            {data.map((d, i) => (
              <span
                key={i}
                className={`transition-colors ${hoverIndex === i ? 'text-amber-400 font-bold' : ''}`}
              >
                {d.month}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
