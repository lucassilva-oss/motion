import { Composition } from 'remotion';
import { HelloWorld } from './HelloWorld';
import { InteligenMotion } from './InteligenMotion';

export const RemotionRoot = () => {
  return (
    <>
      <Composition
        id="HelloWorld"
        component={HelloWorld}
        durationInFrames={90}
        fps={30}
        width={1280}
        height={720}
      />

      <Composition
        id="InteligenMotion"
        component={InteligenMotion}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
