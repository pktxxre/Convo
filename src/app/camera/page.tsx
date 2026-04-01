'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/context/SessionContext';

type Step = 'choose' | 'viewfinder' | 'countdown' | 'capturing2' | 'preview' | 'posting';
type Facing = 'user' | 'environment';

function captureSquare(video: HTMLVideoElement, facing: Facing): string {
  const w = video.videoWidth || 640;
  const h = video.videoHeight || 480;
  const size = Math.min(w, h);
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  if (facing === 'user') {
    ctx.translate(size, 0);
    ctx.scale(-1, 1);
  }
  ctx.drawImage(video, (w - size) / 2, (h - size) / 2, size, size, 0, 0, size, size);
  return canvas.toDataURL('image/jpeg', 0.9);
}

export default function CameraPage() {
  const { user, mounted } = useSession();
  const router = useRouter();

  const [step, setStep] = useState<Step>('choose');
  const [firstFacing, setFirstFacing] = useState<Facing>('user');
  const [photo1, setPhoto1] = useState<string | null>(null);
  const [photo2, setPhoto2] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(3);
  const [camError, setCamError] = useState('');
  const [caption, setCaption] = useState('');

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Auth redirect
  useEffect(() => {
    if (!mounted) return;
    if (!user) router.replace('/auth');
    else if (!user.onboardingComplete) router.replace('/onboarding');
  }, [user, mounted, router]);

  // Stop all tracks on unmount
  useEffect(() => {
    return () => { streamRef.current?.getTracks().forEach(t => t.stop()); };
  }, []);

  // First camera — starts when entering viewfinder
  useEffect(() => {
    if (step !== 'viewfinder') return;
    let cancelled = false;

    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: firstFacing }, audio: false })
      .then(stream => {
        if (cancelled) { stream.getTracks().forEach(t => t.stop()); return; }
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
      })
      .catch(() => setCamError('Camera access denied. Please allow camera permissions and try again.'));

    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    };
  }, [step, firstFacing]);

  // Countdown 3 → 2 → 1 → capturing2
  useEffect(() => {
    if (step !== 'countdown') return;
    setCountdown(3);
    let n = 3;
    const id = setInterval(() => {
      n--;
      if (n <= 0) { clearInterval(id); setStep('capturing2'); }
      else setCountdown(n);
    }, 1000);
    return () => clearInterval(id);
  }, [step]);

  // Second camera — auto-captures after 600ms warm-up
  useEffect(() => {
    if (step !== 'capturing2') return;
    const secondFacing: Facing = firstFacing === 'user' ? 'environment' : 'user';
    let cancelled = false;

    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: secondFacing }, audio: false })
      .then(async stream => {
        if (cancelled) { stream.getTracks().forEach(t => t.stop()); return; }
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
        await new Promise(r => setTimeout(r, 600));
        if (cancelled || !videoRef.current) return;
        const p2 = captureSquare(videoRef.current, secondFacing);
        stream.getTracks().forEach(t => t.stop());
        streamRef.current = null;
        setPhoto2(p2);
        setStep('preview');
      })
      .catch(() => {
        if (!cancelled) { setCamError('Could not access second camera.'); setStep('choose'); }
      });

    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    };
  }, [step, firstFacing]);

  if (!mounted || !user) return <div className="min-h-screen bg-black" />;

  function handleShutter() {
    if (!videoRef.current) return;
    const p1 = captureSquare(videoRef.current, firstFacing);
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
    setPhoto1(p1);
    setStep('countdown');
  }

  async function handleShare() {
    setStep('posting');
    await new Promise(r => setTimeout(r, 1200));
    router.replace('/feed');
  }

  function handleRetake() {
    setPhoto1(null);
    setPhoto2(null);
    setCaption('');
    setCamError('');
    setStep('choose');
  }

  return (
    <div className="min-h-screen bg-black flex flex-col max-w-lg mx-auto overflow-hidden">

      {/* Top bar */}
      <div className="flex items-center gap-2 px-4 h-[52px] flex-shrink-0 z-10">
        <button
          onClick={() => router.back()}
          className="p-1.5 -ml-1.5 text-white/70 hover:text-white transition-colors"
          aria-label="Back"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span className="text-white font-semibold text-[16px] tracking-tight">Convo Camera</span>
      </div>

      {/* Camera area */}
      <div className="flex-1 relative overflow-hidden min-h-0">

        {/* Video element — always in DOM so stream can be assigned */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`absolute inset-0 w-full h-full object-cover ${step === 'viewfinder' ? '' : 'hidden'}`}
          style={step === 'viewfinder' && firstFacing === 'user' ? { transform: 'scaleX(-1)' } : undefined}
        />

        {/* ── choose ── */}
        {step === 'choose' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center px-6 gap-8">
            {camError && (
              <p className="text-red-400 text-sm text-center bg-red-900/30 px-4 py-3 rounded-xl w-full max-w-[280px]">
                {camError}
              </p>
            )}
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-1">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <p className="text-white font-semibold text-[18px]">Which camera first?</p>
              <p className="text-white/50 text-sm">The other fires automatically after 3 seconds.</p>
            </div>
            <div className="flex flex-col gap-3 w-full max-w-[280px]">
              <button
                onClick={() => { setCamError(''); setFirstFacing('user'); setStep('viewfinder'); }}
                className="flex items-center gap-3 px-5 py-4 rounded-2xl bg-white text-black font-semibold text-[15px] active:scale-95 transition-all"
              >
                <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Front camera first
              </button>
              <button
                onClick={() => { setCamError(''); setFirstFacing('environment'); setStep('viewfinder'); }}
                className="flex items-center gap-3 px-5 py-4 rounded-2xl bg-[#4B2E83] text-white font-semibold text-[15px] active:scale-95 transition-all"
              >
                <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Back camera first
              </button>
            </div>
          </div>
        )}

        {/* ── viewfinder controls ── */}
        {step === 'viewfinder' && (
          <div className="absolute inset-0 flex flex-col justify-end pb-10">
            {camError ? (
              <div className="flex items-center justify-center px-8 py-6">
                <p className="text-white text-sm text-center bg-black/60 px-4 py-3 rounded-xl">{camError}</p>
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <button
                  onClick={handleShutter}
                  aria-label="Take photo"
                  className="w-[76px] h-[76px] rounded-full border-[5px] border-white bg-white/20 active:scale-90 transition-transform shadow-xl"
                />
              </div>
            )}
          </div>
        )}

        {/* ── countdown ── */}
        {step === 'countdown' && photo1 && (
          <div className="absolute inset-0">
            <img src={photo1} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/45 flex flex-col items-center justify-center gap-3">
              <p className="text-white/70 text-[13px] font-semibold uppercase tracking-widest">
                {firstFacing === 'user' ? 'Back' : 'Front'} camera in
              </p>
              <span
                className="text-white font-black leading-none tabular-nums"
                style={{ fontSize: '7rem' }}
              >
                {countdown}
              </span>
            </div>
          </div>
        )}

        {/* ── capturing second photo ── */}
        {step === 'capturing2' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin" />
              <p className="text-white/60 text-sm">Taking photo…</p>
            </div>
          </div>
        )}

        {/* ── preview ── */}
        {step === 'preview' && photo1 && photo2 && (
          <div className="absolute inset-0 flex flex-col">
            {/* Dual photo */}
            <div className="relative flex-1 overflow-hidden">
              <img src={photo1} alt="" className="absolute inset-0 w-full h-full object-cover" />
              {/* Small overlay — top-left, ~28% width, BeReal style */}
              <div className="absolute top-3 left-3 w-[28%] aspect-square rounded-[18px] overflow-hidden border-[3px] border-white shadow-2xl">
                <img src={photo2} alt="" className="w-full h-full object-cover" />
              </div>
            </div>
            {/* Caption + actions */}
            <div className="flex-shrink-0 bg-black px-4 pt-3 pb-8 space-y-3">
              <input
                type="text"
                value={caption}
                onChange={e => setCaption(e.target.value)}
                placeholder="Add a caption…"
                className="w-full bg-transparent text-white placeholder:text-white/40 text-[15px] border-b border-white/20 pb-2 focus:outline-none"
              />
              <div className="flex gap-3">
                <button
                  onClick={handleRetake}
                  className="flex-1 py-3 rounded-xl border border-white/30 text-white font-semibold text-[14px] active:scale-95 transition-all"
                >
                  Retake
                </button>
                <button
                  onClick={handleShare}
                  className="flex-1 py-3 rounded-xl bg-white text-black font-semibold text-[14px] active:scale-95 transition-all"
                >
                  Share →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── posting ── */}
        {step === 'posting' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin" />
              <p className="text-white text-sm">Sharing to your feed…</p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
