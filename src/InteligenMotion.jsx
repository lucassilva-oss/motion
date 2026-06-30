import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
  Img,
  staticFile,
} from 'remotion';
import { useMemo } from 'react';

// ─── Easing helpers ──────────────────────────────────────────────────────────
const easeInOut = Easing.bezier(0.45, 0, 0.55, 1);
const easeOut   = Easing.bezier(0.0,  0, 0.2,  1);

// ─── Particle component ───────────────────────────────────────────────────────
const Particle = ({ seed, totalFrames }) => {
  const frame = useCurrentFrame();

  const x  = ((seed * 137.508) % 1) * 100; // percent
  const size = 1.5 + ((seed * 73.1) % 1) * 2.5;
  const speed = 0.04 + ((seed * 11.3) % 1) * 0.06;
  const delay = ((seed * 53.7) % 1) * totalFrames;
  const opacity = 0.15 + ((seed * 31.9) % 1) * 0.25;

  const adjustedFrame = (frame + delay) % totalFrames;
  const progress = adjustedFrame / totalFrames;

  const y = 110 - progress * 130; // bottom to top
  const wobble = Math.sin(progress * Math.PI * 6 + seed * 10) * 1.5;

  const particleOpacity = interpolate(
    progress,
    [0, 0.05, 0.85, 1],
    [0, opacity, opacity, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <div
      style={{
        position: 'absolute',
        left: `${x + wobble}%`,
        top: `${y}%`,
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: 'rgba(255,255,255,0.9)',
        opacity: particleOpacity,
        boxShadow: `0 0 ${size * 2}px rgba(255,255,255,0.6)`,
        pointerEvents: 'none',
      }}
    />
  );
};

// ─── Light sweep ──────────────────────────────────────────────────────────────
const LightSweep = ({ totalFrames }) => {
  const frame = useCurrentFrame();

  const sweepX = interpolate(frame, [0, totalFrames], [-30, 130], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: easeInOut,
  });

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: `linear-gradient(
          105deg,
          transparent ${sweepX - 20}%,
          rgba(255,255,255,0.12) ${sweepX}%,
          rgba(255,255,255,0.22) ${sweepX + 4}%,
          rgba(255,255,255,0.12) ${sweepX + 8}%,
          transparent ${sweepX + 28}%
        )`,
        pointerEvents: 'none',
        mixBlendMode: 'overlay',
      }}
    />
  );
};

// ─── Rotating ring highlight ──────────────────────────────────────────────────
const RingHighlight = ({ size, totalFrames }) => {
  const frame = useCurrentFrame();

  const angle = interpolate(frame, [0, totalFrames], [0, 360], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.linear,
  });

  return (
    <div
      style={{
        position: 'absolute',
        width: size,
        height: size,
        borderRadius: '50%',
        background: `conic-gradient(
          from ${angle}deg,
          rgba(255, 140, 0, 0)   0deg,
          rgba(255, 140, 0, 0.05) 20deg,
          rgba(255, 200, 100, 0.35) 40deg,
          rgba(255, 255, 255, 0.5)  50deg,
          rgba(255, 200, 100, 0.35) 60deg,
          rgba(255, 140, 0, 0.05) 80deg,
          rgba(255, 140, 0, 0)   100deg,
          transparent 100deg
        )`,
        pointerEvents: 'none',
      }}
    />
  );
};

// ─── Glow ring overlay ────────────────────────────────────────────────────────
const GlowRing = ({ size, totalFrames }) => {
  const frame = useCurrentFrame();

  const glowOpacity = interpolate(
    Math.sin((frame / totalFrames) * Math.PI * 4),
    [-1, 1],
    [0.3, 0.7]
  );

  return (
    <div
      style={{
        position: 'absolute',
        width: size + 24,
        height: size + 24,
        borderRadius: '50%',
        border: '3px solid rgba(255, 140, 0, 0)',
        boxShadow: `
          0 0 ${20 + glowOpacity * 20}px ${6}px rgba(255,140,0,${glowOpacity * 0.4}),
          0 0 ${40 + glowOpacity * 30}px ${12}px rgba(0,32,96,${glowOpacity * 0.25}),
          inset 0 0 ${20}px rgba(255,255,255,0.04)
        `,
        pointerEvents: 'none',
      }}
    />
  );
};

// ─── Heart pulse overlay (positioned over center) ─────────────────────────────
const HeartPulse = ({ infographicSize, totalFrames }) => {
  const frame = useCurrentFrame();

  // Pulse every ~60 frames (1 second at 60fps)
  const cycleFrame = frame % 90;
  const pulseScale = interpolate(
    cycleFrame,
    [0, 8, 20, 90],
    [1, 1.08, 1, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easeOut }
  );
  const pulseGlow = interpolate(
    cycleFrame,
    [0, 8, 30, 90],
    [0, 1, 0.3, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Heart is roughly at the center, ~7% of the infographic diameter
  const heartSize = infographicSize * 0.07;

  return (
    <div
      style={{
        position: 'absolute',
        width: heartSize * pulseScale,
        height: heartSize * pulseScale,
        borderRadius: '50%',
        background: `radial-gradient(circle, rgba(255,100,0,${pulseGlow * 0.4}), transparent 70%)`,
        boxShadow: `0 0 ${pulseGlow * 30}px ${pulseGlow * 15}px rgba(255,100,0,${pulseGlow * 0.3})`,
        pointerEvents: 'none',
      }}
    />
  );
};

// ─── Main composition ─────────────────────────────────────────────────────────
export const InteligenMotion = () => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames: total } = useVideoConfig();

  const progress = frame / total;

  // ── Camera zoom: 1.0 → 1.10
  const scale = interpolate(frame, [0, total], [1.0, 1.10], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: easeOut,
  });

  // ── Very subtle orbit: horizontal drift ±12px over full duration
  const orbitX = interpolate(
    Math.sin(progress * Math.PI * 2),
    [-1, 1],
    [-10, 10]
  );

  // ── Gentle float: vertical sine ±8px
  const floatY = Math.sin((frame / total) * Math.PI * 3) * 8;

  // ── Max 4° clockwise rotation over full duration
  const rotation = interpolate(frame, [0, total], [0, 4], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: easeInOut,
  });

  // ── Ambient dimming pulse (very subtle) — simulates "breathing" light
  const ambientBrightness = interpolate(
    Math.sin(progress * Math.PI * 2),
    [-1, 1],
    [0.97, 1.03]
  );

  // ── Depth of field: slight blur at edges via vignette

  // Infographic size: 78% of height, keep aspect ratio square
  const infographicSize = height * 0.82;

  // Particles
  const particles = useMemo(
    () => Array.from({ length: 45 }, (_, i) => i + 1),
    []
  );

  // ── Fade-in from white
  const fadeIn = interpolate(frame, [0, 30], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: easeOut,
  });

  return (
    <AbsoluteFill style={{ backgroundColor: '#ffffff', overflow: 'hidden' }}>

      {/* ── Ambient gradient background (very subtle warm center) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse 70% 70% at 50% 50%,
            rgba(240,245,255,1) 0%,
            rgba(255,255,255,1) 60%,
            rgba(245,248,255,1) 100%)`,
          opacity: fadeIn,
        }}
      />

      {/* ── Particles (behind infographic) */}
      <AbsoluteFill style={{ opacity: fadeIn * 0.6 }}>
        {particles.map((seed) => (
          <Particle key={seed} seed={seed} totalFrames={total} />
        ))}
      </AbsoluteFill>

      {/* ── Infographic + all overlays */}
      <AbsoluteFill
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          opacity: fadeIn,
        }}
      >
        <div
          style={{
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            transform: `
              translate(${orbitX}px, ${floatY}px)
              scale(${scale})
              rotate(${rotation}deg)
            `,
            filter: `brightness(${ambientBrightness})`,
            willChange: 'transform',
          }}
        >
          {/* ── Soft drop shadow beneath the infographic */}
          <div
            style={{
              position: 'absolute',
              width: infographicSize * 0.85,
              height: infographicSize * 0.15,
              bottom: -infographicSize * 0.06,
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'radial-gradient(ellipse, rgba(0,20,80,0.18) 0%, transparent 70%)',
              filter: 'blur(20px)',
              borderRadius: '50%',
            }}
          />

          {/* ── Outer glow ring */}
          <div
            style={{
              position: 'absolute',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <GlowRing size={infographicSize} totalFrames={total} />
          </div>

          {/* ── Rotating highlight on ring */}
          <div
            style={{
              position: 'absolute',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              opacity: 0.55,
            }}
          >
            <RingHighlight size={infographicSize * 0.97} totalFrames={total} />
          </div>

          {/* ── The actual infographic image — untouched */}
          <Img
            src={staticFile('infographic.png')}
            style={{
              width: infographicSize,
              height: infographicSize,
              objectFit: 'contain',
              display: 'block',
            }}
          />

          {/* ── Light sweep overlay (on top of image) */}
          <div
            style={{
              position: 'absolute',
              width: infographicSize,
              height: infographicSize,
              borderRadius: '50%',
              overflow: 'hidden',
              pointerEvents: 'none',
            }}
          >
            <LightSweep totalFrames={total} />
          </div>

          {/* ── Heart pulse (centered, ~center of the circular infographic) */}
          <div
            style={{
              position: 'absolute',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              // Adjust Y slightly upward — heart is ~5% above true center
              transform: 'translateY(-2%)',
            }}
          >
            <HeartPulse infographicSize={infographicSize} totalFrames={total} />
          </div>
        </div>
      </AbsoluteFill>

      {/* ── Vignette depth-of-field overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse 80% 80% at 50% 50%,
            transparent 40%,
            rgba(255,255,255,0.25) 75%,
            rgba(255,255,255,0.55) 100%)`,
          pointerEvents: 'none',
          opacity: fadeIn,
        }}
      />

      {/* ── Subtle top-left ambient light source */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse 55% 45% at -5% -5%,
            rgba(255,250,240,0.18) 0%,
            transparent 60%)`,
          pointerEvents: 'none',
          opacity: fadeIn * ambientBrightness,
        }}
      />

    </AbsoluteFill>
  );
};
