// Procedural Footsteps
export const playFootstep = (context, volume = 0.5) => {
  if (context.state === 'suspended') return;

  const t = context.currentTime;

  // 1. Noise Burst (The Impact)
  const bufferSize = context.sampleRate * 0.1; // 100ms
  const buffer = context.createBuffer(1, bufferSize, context.sampleRate);
  const data = buffer.getChannelData(0);

  // Fill with noise
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1);
  }

  const noise = context.createBufferSource();
  noise.buffer = buffer;

  // Random pitch variation
  noise.playbackRate.value = 0.8 + Math.random() * 0.4;

  // Filter (Stone/Grit texture)
  const filter = context.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = 800 + Math.random() * 400; // 800-1200Hz
  filter.Q.value = 1.0;

  // Envelope
  const envelope = context.createGain();
  envelope.gain.setValueAtTime(0, t);
  envelope.gain.linearRampToValueAtTime(volume, t + 0.01); // Fast attack
  envelope.gain.exponentialRampToValueAtTime(0.01, t + 0.15); // Fast decay

  // Echo (The Alley)
  const delay = context.createDelay();
  delay.delayTime.value = 0.15; // 150ms slapback

  const feedback = context.createGain();
  feedback.gain.value = 0.2; // Low feedback

  const delayGain = context.createGain();
  delayGain.gain.value = 0.3; // Wet mix

  // Connections
  // Dry path
  noise.connect(filter);
  filter.connect(envelope);
  envelope.connect(context.destination);

  // Wet path (Echo)
  envelope.connect(delay);
  delay.connect(feedback);
  feedback.connect(delay);
  delay.connect(delayGain);
  delayGain.connect(context.destination);

  noise.start(t);

  // Cleanup after echo tail (1s is plenty)
  setTimeout(() => {
    noise.disconnect();
    filter.disconnect();
    envelope.disconnect();
    delay.disconnect();
    feedback.disconnect();
    delayGain.disconnect();
  }, 1000);
};
