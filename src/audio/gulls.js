// Procedural Seagull Cry
export const playGullCry = (context, volume = 0.3) => {
  if (context.state === 'suspended') return;

  const t = context.currentTime;

  // Oscillator 1: The main cry
  const osc = context.createOscillator();
  osc.type = 'sawtooth';

  // Frequency Envelope: Downward glide (Keew-w-w)
  // Start high, drop over time
  osc.frequency.setValueAtTime(1200 + Math.random() * 400, t);
  osc.frequency.exponentialRampToValueAtTime(800 + Math.random() * 200, t + 0.6);

  // Filter: Highpass to simulate distance (thin sound)
  const filter = context.createBiquadFilter();
  filter.type = 'highpass';
  filter.frequency.value = 1500; // Cut low frequencies
  filter.Q.value = 1.0;

  // Gain Envelope
  const gain = context.createGain();
  gain.gain.setValueAtTime(0, t);
  gain.gain.linearRampToValueAtTime(volume, t + 0.1); // Attack
  gain.gain.exponentialRampToValueAtTime(0.01, t + 0.8); // Decay

  // Panner for spatial positioning (distant, somewhere in the sky)
  const panner = context.createStereoPanner();
  panner.pan.value = (Math.random() * 2 - 1) * 0.8; // Random horizontal position

  // Reverb/Delay for atmosphere
  const delay = context.createDelay();
  delay.delayTime.value = 0.3 + Math.random() * 0.2; // 300-500ms

  const delayGain = context.createGain();
  delayGain.gain.value = 0.2; // Wet level

  const feedback = context.createGain();
  feedback.gain.value = 0.3;

  // Connections
  osc.connect(filter);
  filter.connect(gain);
  gain.connect(panner);
  panner.connect(context.destination);

  // Echo path
  gain.connect(delay);
  delay.connect(feedback);
  feedback.connect(delay);
  delay.connect(delayGain);
  delayGain.connect(panner); // Through same panner or destination? Panner makes sense.

  osc.start(t);
  osc.stop(t + 2.0);

  // Cleanup
  setTimeout(() => {
    osc.disconnect();
    filter.disconnect();
    gain.disconnect();
    panner.disconnect();
    delay.disconnect();
    feedback.disconnect();
    delayGain.disconnect();
  }, 2500);
};
