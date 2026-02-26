// Procedural "Call to Prayer" (Abstract/Impressionistic)
export const playCallToPrayer = (context, volume = 0.15) => {
  if (context.state === 'suspended') return;

  const t = context.currentTime;
  const duration = 8.0; // Short phrase

  // Master Gain for this sound
  const masterGain = context.createGain();
  masterGain.gain.value = volume;

  // Filter for distance (Lowpass)
  const distanceFilter = context.createBiquadFilter();
  distanceFilter.type = 'lowpass';
  distanceFilter.frequency.value = 600; // Muffled, distant
  distanceFilter.Q.value = 0.5;

  // Reverb/Echo (The City)
  const delay = context.createDelay();
  delay.delayTime.value = 0.4; // 400ms echo
  const feedback = context.createGain();
  feedback.gain.value = 0.4;

  // Connect Master Chain
  masterGain.connect(distanceFilter);
  distanceFilter.connect(context.destination);

  // Send to delay
  distanceFilter.connect(delay);
  delay.connect(feedback);
  feedback.connect(delay);
  delay.connect(context.destination);

  // Voice Synthesis (Formants)
  // We use 2 oscillators to simulate a "throat" and "chest" resonance
  const osc1 = context.createOscillator();
  osc1.type = 'sawtooth';
  const osc2 = context.createOscillator();
  osc2.type = 'triangle';

  // Fundamental Frequency (Base pitch)
  // Around A2/C3 (110-130Hz) for a deep voice
  const baseFreq = 110 + Math.random() * 20;

  osc1.frequency.setValueAtTime(baseFreq, t);
  osc2.frequency.setValueAtTime(baseFreq * 2.01, t); // Octave up, slightly detuned

  // Melodic contour (microtonal slide)
  // Start, go up a bit, come back down
  osc1.frequency.linearRampToValueAtTime(baseFreq * 1.15, t + duration * 0.3);
  osc1.frequency.exponentialRampToValueAtTime(baseFreq, t + duration);

  osc2.frequency.linearRampToValueAtTime(baseFreq * 2.01 * 1.15, t + duration * 0.3);
  osc2.frequency.exponentialRampToValueAtTime(baseFreq * 2.01, t + duration);

  // Vowel Formant Filter (e.g., "Ah" sound)
  const formantFilter = context.createBiquadFilter();
  formantFilter.type = 'peaking';
  formantFilter.frequency.value = 800; // First formant approx
  formantFilter.Q.value = 3.0;
  formantFilter.gain.value = 10; // Boost

  // Voice Envelope
  const voiceGain = context.createGain();
  voiceGain.gain.setValueAtTime(0, t);
  voiceGain.gain.linearRampToValueAtTime(1, t + 1.0); // Slow breath in
  voiceGain.gain.exponentialRampToValueAtTime(0.01, t + duration); // Fade out

  // Vibrato
  const vibrato = context.createOscillator();
  vibrato.frequency.value = 5; // 5Hz wobble
  const vibratoGain = context.createGain();
  vibratoGain.gain.value = 2.0; // Pitch depth

  vibrato.connect(vibratoGain);
  vibratoGain.connect(osc1.frequency);
  vibratoGain.connect(osc2.frequency);
  vibrato.start(t);
  vibrato.stop(t + duration + 2); // Stop with some buffer

  // Connections
  osc1.connect(formantFilter);
  osc2.connect(formantFilter);
  formantFilter.connect(voiceGain);
  voiceGain.connect(masterGain);

  osc1.start(t);
  osc2.start(t);

  osc1.stop(t + duration);
  osc2.stop(t + duration);

  // Cleanup
  setTimeout(() => {
    osc1.disconnect();
    osc2.disconnect();
    formantFilter.disconnect();
    voiceGain.disconnect();
    masterGain.disconnect();
    distanceFilter.disconnect();
    delay.disconnect();
    feedback.disconnect();
    vibrato.disconnect();
    vibratoGain.disconnect();
  }, (duration + 2) * 1000);
};
