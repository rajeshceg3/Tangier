// Pink noise generator for wind
export const createWindNode = (context) => {
  const bufferSize = 2 * context.sampleRate;
  const buffer = context.createBuffer(1, bufferSize, context.sampleRate);
  const data = buffer.getChannelData(0);

  // Generate pink noise
  let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
  for (let i = 0; i < bufferSize; i++) {
    const white = Math.random() * 2 - 1;
    b0 = 0.99886 * b0 + white * 0.0555179;
    b1 = 0.99332 * b1 + white * 0.0750759;
    b2 = 0.96900 * b2 + white * 0.1538520;
    b3 = 0.86650 * b3 + white * 0.3104856;
    b4 = 0.55000 * b4 + white * 0.5329522;
    b5 = -0.7616 * b5 - white * 0.0168980;
    data[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
    data[i] *= 0.11; // (roughly) compensate for gain
    b6 = white * 0.115926;
  }

  const noise = context.createBufferSource();
  noise.buffer = buffer;
  noise.loop = true;

  const filter = context.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 400; // Initial cutoff
  filter.Q.value = 0.5; // Low Q for broad wind sound

  const gain = context.createGain();
  gain.gain.value = 0; // Start silent

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(context.destination);

  noise.start();

  // Modulate filter for "gusts"
  const modulateWind = () => {
    const time = context.currentTime;
    // Simple LFO simulation using ramping
    filter.frequency.exponentialRampToValueAtTime(
      200 + Math.random() * 600,
      time + 2 + Math.random() * 3
    );
    setTimeout(modulateWind, (2 + Math.random() * 3) * 1000);
  };

  modulateWind();

  return { node: gain, filter };
};
