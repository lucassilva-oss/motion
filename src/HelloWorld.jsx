import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';

export const HelloWorld = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' });

  const scale = spring({
    fps,
    frame,
    config: { damping: 200 },
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#0f172a',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          opacity,
          transform: `scale(${scale})`,
          fontSize: 80,
          fontWeight: 'bold',
          color: '#f8fafc',
          fontFamily: 'sans-serif',
          textAlign: 'center',
        }}
      >
        Hello, Motion!
      </div>
    </AbsoluteFill>
  );
};
