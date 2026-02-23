// Ferry horn sound
export const playFerryHorn = (context) => {
  const osc1 = context.createOscillator();
  const osc2 = context.createOscillator();

  osc1.type = 'sawtooth';
  osc2.type = 'triangle';

  osc1.frequency.value = 70; // Low frequency
  osc2.frequency.value = 72; // Detuned slightly

  const gain = context.createGain();
  const filter = context.createBiquadFilter();

  filter.type = 'lowpass';
  filter.frequency.value = 400; // Muffled/Distant

  osc1.connect(filter);
  osc2.connect(filter);
  filter.connect(gain);
  gain.connect(context.destination);

  const time = context.currentTime;

  // Envelope
  gain.gain.setValueAtTime(0, time);
  gain.gain.linearRampToValueAtTime(0.3, time + 2); // Slow attack
  gain.gain.exponentialRampToValueAtTime(0.01, time + 8); // Long decay

  osc1.start(time);
  osc2.start(time);

  osc1.stop(time + 10);
  osc2.stop(time + 10);
};
