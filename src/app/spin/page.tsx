'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AppShell from '@/components/layout/AppShell';
import { useSession } from '@/context/SessionContext';
import { TOPICS } from '@/lib/filler';

// Filler majors for the wheel segments (will be replaced by API call)
const WHEEL_MAJORS = [
  'Computer Science',
  'Psychology',
  'Business',
  'Biology',
  'Economics',
  'Mechanical Eng.',
  'English',
  'Data Science',
];

const SEGMENT_COLORS = [
  '#6366F1', // indigo
  '#8B5CF6', // violet
  '#A78BFA', // purple-light
  '#7C3AED', // purple
  '#818CF8', // indigo-light
  '#4F46E5', // indigo-dark
  '#C4B5FD', // lavender
  '#5B21B6', // deep purple
];

export default function SpinPage() {
  const { user } = useSession();
  const router = useRouter();
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);

  const count = WHEEL_MAJORS.length;
  const segAngle = 360 / count;

  function buildPath(index: number): string {
    const r = 110;
    const cx = 120;
    const cy = 120;
    const startAngle = (index * segAngle - 90) * (Math.PI / 180);
    const endAngle = ((index + 1) * segAngle - 90) * (Math.PI / 180);
    const x1 = cx + r * Math.cos(startAngle);
    const y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle);
    const y2 = cy + r * Math.sin(endAngle);
    return `M${cx},${cy} L${x1},${y1} A${r},${r} 0 0,1 ${x2},${y2} Z`;
  }

  function getLabelTransform(index: number): string {
    const mid = (index + 0.5) * segAngle - 90;
    const r = 70;
    const cx = 120;
    const cy = 120;
    const rad = mid * (Math.PI / 180);
    const x = cx + r * Math.cos(rad);
    const y = cy + r * Math.sin(rad);
    return `translate(${x}, ${y}) rotate(${mid + 90})`;
  }

  function spin() {
    if (spinning) return;
    setSpinning(true);
    setResult(null);

    // Pick a random winner
    const winnerIndex = Math.floor(Math.random() * count);
    const winnerMajor = WHEEL_MAJORS[winnerIndex];

    // Spin: 5 full rotations + land on the winning segment's centre
    // The wheel pointer is at the top (0°). Segment i starts at i*segAngle.
    // To land winner at top: rotate so winner's midpoint aligns with 0°.
    const targetAngle = 360 * 5 + (360 - (winnerIndex + 0.5) * segAngle);
    setRotation(prev => prev + targetAngle);

    setTimeout(() => {
      setSpinning(false);
      setResult(winnerMajor);
    }, 3200);
  }

  function handleStartConvo() {
    if (!result) return;
    router.push(`/compose?major=${encodeURIComponent(result)}&type=prompt`);
  }

  return (
    <AppShell title="Spin Convo">
      <div className="flex flex-col items-center px-4 pt-6 pb-8 gap-6">

        {/* Heading */}
        <div className="text-center">
          <h2 className="text-[18px] font-bold text-[#1a1a1a]">Spin the wheel</h2>
          <p className="text-[13px] text-[#737373] mt-1">
            Start a conversation with a random major on your campus.
          </p>
        </div>

        {/* Wheel + pointer */}
        <div className="relative w-[240px] h-[240px]">
          {/* Pointer triangle at top */}
          <div className="absolute top-[-10px] left-1/2 -translate-x-1/2 z-10">
            <svg width="20" height="14" viewBox="0 0 20 14">
              <polygon points="10,14 0,0 20,0" fill="#1a1a1a" />
            </svg>
          </div>

          {/* Spinning SVG wheel */}
          <svg
            viewBox="0 0 240 240"
            className="w-full h-full drop-shadow-lg"
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: spinning
                ? 'transform 3.2s cubic-bezier(0.17, 0.67, 0.12, 1.0)'
                : 'none',
            }}
          >
            {WHEEL_MAJORS.map((major, i) => (
              <g key={major}>
                <path
                  d={buildPath(i)}
                  fill={SEGMENT_COLORS[i % SEGMENT_COLORS.length]}
                  stroke="white"
                  strokeWidth="1.5"
                />
                <text
                  transform={getLabelTransform(i)}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="white"
                  fontSize="9"
                  fontWeight="600"
                  fontFamily="system-ui, sans-serif"
                >
                  {major.length > 10 ? major.slice(0, 9) + '…' : major}
                </text>
              </g>
            ))}
            {/* Centre hub */}
            <circle cx="120" cy="120" r="16" fill="white" />
            <circle cx="120" cy="120" r="10" fill="#6366F1" />
          </svg>
        </div>

        {/* Spin button */}
        <button
          onClick={spin}
          disabled={spinning}
          className="w-full max-w-[220px] py-3.5 rounded-2xl bg-indigo-600 text-white font-bold text-[15px] shadow-md hover:bg-indigo-700 active:scale-95 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-all"
        >
          {spinning ? 'Spinning…' : result ? 'Spin again' : 'Spin!'}
        </button>

        {/* Result card */}
        {result && !spinning && (
          <div className="w-full bg-white border border-[#DBDBDB] rounded-2xl p-5 flex flex-col items-center gap-3 shadow-sm">
            <p className="text-[12px] font-semibold uppercase tracking-widest text-[#737373]">
              You got
            </p>
            <p className="text-[22px] font-bold text-indigo-600">{result}</p>
            <p className="text-[13px] text-[#737373] text-center">
              Ask a question or start a discussion for {result} students on your campus.
            </p>
            <button
              onClick={handleStartConvo}
              className="w-full py-3 rounded-xl bg-indigo-600 text-white font-semibold text-[14px] hover:bg-indigo-700 active:scale-95 transition-all"
            >
              Start a Convo with {result} →
            </button>
          </div>
        )}

        {/* Info pill */}
        {!result && !spinning && (
          <p className="text-[12px] text-[#A8A8A8] text-center max-w-[260px]">
            The wheel picks a major at random. Spin as many times as you like before starting your convo.
          </p>
        )}

      </div>
    </AppShell>
  );
}
