'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MAJORS } from '@/lib/filler';
import AppShell from '@/components/layout/AppShell';

// Short display labels that fit inside thin segments (max ~18 chars)
const SHORT_LABEL: Record<string, string> = {
  'American Ethnic Studies': 'Ethnic Studies',
  'American Indian Studies': 'Am Indian Studies',
  'Anthropology': 'Anthropology',
  'Applied and Computational Mathematical Sciences': 'Appl Math Sci',
  'Applied Mathematics': 'Applied Math',
  'Art, Art History, and Design': 'Art & Design',
  'Asian Languages and Literature': 'Asian Lit',
  'Astrobiology': 'Astrobiology',
  'Astronomy': 'Astronomy',
  'Biology': 'Biology',
  'Chemistry': 'Chemistry',
  'Cinema and Media Studies': 'Cinema & Media',
  'Classics': 'Classics',
  'Communication': 'Communication',
  'Comparative History of Ideas': 'Comp History',
  'Dance': 'Dance',
  'Digital Arts and Experimental Media': 'Digital Arts',
  'Disability Studies': 'Disability Studies',
  'Drama': 'Drama',
  'Economics': 'Economics',
  'English': 'English',
  'French and Italian Studies': 'French & Italian',
  'Gender, Women, and Sexuality Studies': 'Gender Studies',
  'General Studies': 'General Studies',
  'Geography': 'Geography',
  'German Studies': 'German Studies',
  'History': 'History',
  'Integrated Social Sciences': 'Social Sciences',
  'Law, Societies, and Justice': 'Law & Justice',
  'Linguistics': 'Linguistics',
  'Marine Biology': 'Marine Biology',
  'Mathematics': 'Mathematics',
  'Microbiology': 'Microbiology',
  'Middle Eastern Languages and Cultures': 'Middle Eastern',
  'Music': 'Music',
  'Neuroscience': 'Neuroscience',
  'Philosophy': 'Philosophy',
  'Physics': 'Physics',
  'Political Science': 'Political Sci',
  'Psychology': 'Psychology',
  'Scandinavian Studies': 'Scandinavian',
  'Slavic Languages and Literatures': 'Slavic Studies',
  'Sociology': 'Sociology',
  'Spanish and Portuguese Studies': 'Spanish & Port',
  'Speech and Hearing Sciences': 'Speech & Hearing',
  'Statistics': 'Statistics',
  'Architecture': 'Architecture',
  'Built Environments': 'Built Environ',
  'Construction Management': 'Construction Mgmt',
  'Landscape Architecture': 'Landscape Arch',
  'Real Estate': 'Real Estate',
  'Urban Design and Planning': 'Urban Design',
  'Education, Learning, and Society': 'Education',
  'Aeronautics and Astronautics': 'Aerospace',
  'Chemical Engineering': 'Chemical Eng',
  'Civil and Environmental Engineering': 'Civil & Env Eng',
  'Computer Science and Engineering': 'CS & Engineering',
  'Electrical and Computer Engineering': 'Elec & Comp Eng',
  'Engineering': 'Engineering',
  'Human Centered Design and Engineering': 'HCDE',
  'Industrial and Systems Engineering': 'Industrial Eng',
  'Materials Science and Engineering': 'Materials Sci',
  'Mechanical Engineering': 'Mech Engineering',
  'Atmospheric and Climate Science': 'Atmospheric Sci',
  'Earth and Space Sciences': 'Earth & Space Sci',
  'School of Aquatic and Fishery Sciences': 'Aquatic Sciences',
  'School of Environmental and Forest Sciences': 'Forest Sciences',
  'School of Marine and Environmental Affairs': 'Marine Affairs',
  'School of Oceanography': 'Oceanography',
  'Business': 'Business',
  'Informatics': 'Informatics',
  'International Studies': 'Intl Studies',
  'Nursing': 'Nursing',
  'Food Systems, Nutrition, and Health': 'Food & Nutrition',
  'Health Management and Informatics': 'Health & Informatics',
  'Honors': 'Honors',
};

// All UW majors (sorted alphabetically from filler.ts)
const WHEEL_MAJORS = MAJORS.map(m => ({ full: m, label: SHORT_LABEL[m] ?? m }));

const SEGMENT_COLORS = [
  '#4B2E83',
  '#6366F1',
  '#8B5CF6',
  '#7C3AED',
  '#5B21B6',
  '#818CF8',
  '#4338CA',
  '#A78BFA',
];

const CX = 200;
const CY = 200;
const R = 185;
const R_TEXT = 85; // start at mid-slice so text reads through the center

export default function SpinPage() {
  const router = useRouter();
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);

  const count = WHEEL_MAJORS.length;
  const segAngle = 360 / count;

  function buildPath(index: number): string {
    const s = (index * segAngle - 90) * (Math.PI / 180);
    const e = ((index + 1) * segAngle - 90) * (Math.PI / 180);
    const lf = segAngle > 180 ? 1 : 0;
    return `M${CX},${CY} L${CX + R * Math.cos(s)},${CY + R * Math.sin(s)} A${R},${R} 0 ${lf},1 ${CX + R * Math.cos(e)},${CY + R * Math.sin(e)} Z`;
  }

  function getLabelTransform(index: number): string {
    const mid = (index + 0.5) * segAngle - 90;
    const rad = mid * (Math.PI / 180);
    return `translate(${CX + R_TEXT * Math.cos(rad)},${CY + R_TEXT * Math.sin(rad)}) rotate(${mid})`;
  }

  function spin() {
    if (spinning) return;
    setSpinning(true);
    setResult(null);
    const winnerIndex = Math.floor(Math.random() * count);
    setRotation(prev => prev + 360 * 5 + (360 - (winnerIndex + 0.5) * segAngle));
    setTimeout(() => {
      setSpinning(false);
      setResult(WHEEL_MAJORS[winnerIndex].full);
    }, 3200);
  }

  return (
    <AppShell title="Spin Convo">
      <div className="flex flex-col items-center px-2 pt-2 pb-6 gap-3">

        <div className="text-center">
          <h2 className="text-[16px] font-bold text-[#1a1a1a] dark:text-[#F5F5F5]">Spin the wheel</h2>
          <p className="text-[12px] text-[#737373] dark:text-[#ABABAB] mt-0.5">
            Start a conversation with a random Husky major.
          </p>
        </div>

        {/* Wheel */}
        <div className="relative w-full aspect-square">
          {/* Pointer */}
          <div className="absolute top-[-13px] left-1/2 -translate-x-1/2 z-10">
            <svg width="26" height="18" viewBox="0 0 26 18">
              <polygon points="13,18 0,0 26,0" fill="#4B2E83" />
            </svg>
          </div>

          <svg
            viewBox="0 0 400 400"
            className="w-full h-full drop-shadow-lg"
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: spinning ? 'transform 3.2s cubic-bezier(0.17, 0.67, 0.12, 1.0)' : 'none',
            }}
          >
            {WHEEL_MAJORS.map(({ label }, i) => (
              <g key={i}>
                <path
                  d={buildPath(i)}
                  fill={SEGMENT_COLORS[i % SEGMENT_COLORS.length]}
                  stroke="white"
                  strokeWidth="0.7"
                />
                <text
                  transform={getLabelTransform(i)}
                  textAnchor="start"
                  dominantBaseline="middle"
                  fill="white"
                  fontSize="5"
                  fontWeight="600"
                  fontFamily="system-ui, sans-serif"
                >
                  {label}
                </text>
              </g>
            ))}
            {/* UW hub */}
            <circle cx={CX} cy={CY} r="28" fill="white" />
            <circle cx={CX} cy={CY} r="20" fill="#4B2E83" />
            <text
              x={CX}
              y={CY}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#B7A57A"
              fontSize="16"
              fontWeight="900"
              fontFamily="system-ui, sans-serif"
            >
              W
            </text>
          </svg>
        </div>

        <button
          onClick={spin}
          disabled={spinning}
          className="w-full max-w-[220px] py-3 rounded-2xl bg-[#4B2E83] text-white font-bold text-[15px] shadow-md hover:bg-[#3a2266] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {spinning ? 'Spinning…' : result ? 'Spin again' : 'Spin!'}
        </button>

        {result && !spinning && (
          <div className="w-full bg-white dark:bg-[#1C1C1E] border border-[#DBDBDB] dark:border-[#38383A] rounded-2xl p-4 flex flex-col items-center gap-2.5 shadow-sm">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-[#737373] dark:text-[#ABABAB]">You got</p>
            <p className="text-[20px] font-bold text-[#4B2E83] dark:text-[#B39DDB] text-center">{result}</p>
            <p className="text-[12px] text-[#737373] dark:text-[#ABABAB] text-center">
              Ask a question or start a discussion for {result} Huskies.
            </p>
            <button
              onClick={() => router.push(`/compose?major=${encodeURIComponent(result)}&type=prompt`)}
              className="w-full py-2.5 rounded-xl bg-[#4B2E83] text-white font-semibold text-[14px] hover:bg-[#3a2266] active:scale-95 transition-all"
            >
              Start a Convo →
            </button>
          </div>
        )}

        {!result && !spinning && (
          <p className="text-[11px] text-[#A8A8A8] dark:text-[#636366] text-center max-w-[260px]">
            Spin as many times as you like before starting your convo.
          </p>
        )}

      </div>
    </AppShell>
  );
}
