// Sea/Ocean noise generator
export const createSeaNode = (context) => {
  const bufferSize = 2 * context.sampleRate;
  const buffer = context.createBuffer(1, bufferSize, context.sampleRate);
  const data = buffer.getChannelData(0);

  // Generate white noise
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  const noise = context.createBufferSource();
  noise.buffer = buffer;
  noise.loop = true;

  const filter = context.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 100; // Deep rumble
  filter.Q.value = 0.5;

  const gain = context.createGain();
  gain.gain.value = 0; // Start silent

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(context.destination);

  noise.start();

  // Wave simulation: Modulate cutoff frequency
  const waveCycle = 10000; // 10 seconds per wave

  const modulateSea = () => {
    const time = context.currentTime;
    // Rise
    filter.frequency.exponentialRampToValueAtTime(800, time + 4);
    // Fall
    filter.frequency.exponentialRampToValueAtTime(100, time + 10);

    setTimeout(modulateSea, waveCycle);
  };

  modulateSea();

  return { node: gain, filter };
};
