import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
  Img,
  staticFile,
  random,
} from 'remotion';

const easeInOut = Easing.bezier(0.45, 0, 0.55, 1);
const easeOut   = Easing.bezier(0.0,  0, 0.2,  1);

// Seeds are static strings — deterministic per-particle
const PARTICLE_SEEDS = Array.from({ length: 45 }, (_, i) => `particle-${i}`);

const Particle = ({ seed, totalFrames }) => {
  const frame = useCurrentFrame();

  const x       = random(`${seed}-x`)       * 100;
  const size    = 1.5 + random(`${seed}-sz`) * 2.5;
  const delay   = random(`${seed}-delay`)   * totalFrames;
  const opacity = 0.15 + random(`${seed}-op`) * 0.25;

  const adjustedFrame = (frame + Math.floor(delay)) % totalFrames;
  const progress = adjustedFrame / totalFrames;

  // deterministic sine via frame — Math.sin is fine (it's not randomness)
  const y      = 110 - progress * 130;
  const wobble = Math.sin(progress * Math.PI * 6 + random(`${seed}-phase`) * 20) * 1.5;

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
          rgba(255,140,0,0)      0deg,
          rgba(255,140,0,0.05)  20deg,
          rgba(255,200,100,0.35) 40deg,
          rgba(255,255,255,0.5)  50deg,
          rgba(255,200,100,0.35) 60deg,
          rgba(255,140,0,0.05)  80deg,
          rgba(255,140,0,0)    100deg,
          transparent          100deg
        )`,
        pointerEvents: 'none',
      }}
    />
  );
};

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
        boxShadow: `
          0 0 ${20 + glowOpacity * 20}px 6px rgba(255,140,0,${glowOpacity * 0.4}),
          0 0 ${40 + glowOpacity * 30}px 12px rgba(0,32,96,${glowOpacity * 0.25}),
          inset 0 0 20px rgba(255,255,255,0.04)
        `,
        pointerEvents: 'none',
      }}
    />
  );
};

const HeartPulse = ({ infographicSize }) => {
  const frame = useCurrentFrame();

  // Pulse cycle every 45 frames (1.5 s at 30 fps)
  const cycleFrame = frame % 45;
  const pulseScale = interpolate(
    cycleFrame,
    [0, 4, 10, 45],
    [1, 1.08, 1, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easeOut }
  );
  const pulseGlow = interpolate(
    cycleFrame,
    [0, 4, 15, 45],
    [0, 1, 0.3, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

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

export const InteligenMotion = () => {
  const frame = useCurrentFrame();
  const { height, durationInFrames: total } = useVideoConfig();

  const progress = frame / total;

  const scale = interpolate(frame, [0, total], [1.0, 1.10], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: easeOut,
  });

  const orbitX = interpolate(
    Math.sin(progress * Math.PI * 2),
    [-1, 1],
    [-10, 10]
  );

  const floatY = Math.sin(progress * Math.PI * 3) * 8;

  const rotation = interpolate(frame, [0, total], [0, 4], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: easeInOut,
  });

  const ambientBrightness = interpolate(
    Math.sin(progress * Math.PI * 2),
    [-1, 1],
    [0.97, 1.03]
  );

  const infographicSize = height * 0.82;

  const fadeIn = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: easeOut,
  });

  return (
    <AbsoluteFill style={{ backgroundColor: '#ffffff', overflow: 'hidden' }}>

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

      <AbsoluteFill style={{ opacity: fadeIn * 0.6 }}>
        {PARTICLE_SEEDS.map((seed) => (
          <Particle key={seed} seed={seed} totalFrames={total} />
        ))}
      </AbsoluteFill>

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
            transform: `translate(${orbitX}px, ${floatY}px) scale(${scale}) rotate(${rotation}deg)`,
            filter: `brightness(${ambientBrightness})`,
          }}
        >
          {/* Drop shadow */}
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

          <div style={{ position: 'absolute', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <GlowRing size={infographicSize} totalFrames={total} />
          </div>

          <div style={{ position: 'absolute', display: 'flex', justifyContent: 'center', alignItems: 'center', opacity: 0.55 }}>
            <RingHighlight size={infographicSize * 0.97} totalFrames={total} />
          </div>

          {/* Infographic — untouched */}
          <Img
            src={staticFile('infographic.png')}
            style={{
              width: infographicSize,
              height: infographicSize,
              objectFit: 'contain',
              display: 'block',
            }}
          />

          {/* Light sweep */}
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

          {/* Heart pulse */}
          <div
            style={{
              position: 'absolute',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              transform: 'translateY(-2%)',
            }}
          >
            <HeartPulse infographicSize={infographicSize} />
          </div>
        </div>
      </AbsoluteFill>

      {/* Depth-of-field vignette */}
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

      {/* Ambient top-left light */}
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
