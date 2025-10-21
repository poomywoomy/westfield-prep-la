// Sound effects for barcode scanning feedback
// Uses Web Audio API for consistent cross-browser audio

let audioContext: AudioContext | null = null;

const getAudioContext = (): AudioContext => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioContext;
};

/**
 * Play a success beep (high pitched, short)
 * Frequency: 800Hz, Duration: 100ms
 */
export const playSuccessSound = () => {
  try {
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.frequency.value = 800; // Hz
    oscillator.type = 'sine';
    gainNode.gain.value = 0.3; // Volume
    
    const now = ctx.currentTime;
    gainNode.gain.setValueAtTime(0.3, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
    
    oscillator.start(now);
    oscillator.stop(now + 0.1);
  } catch (error) {
    console.warn('Could not play success sound:', error);
  }
};

/**
 * Play an error buzz (low pitched, longer)
 * Frequency: 200Hz, Duration: 200ms
 */
export const playErrorSound = () => {
  try {
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.frequency.value = 200; // Hz
    oscillator.type = 'sawtooth';
    gainNode.gain.value = 0.2; // Volume (lower for buzz)
    
    const now = ctx.currentTime;
    gainNode.gain.setValueAtTime(0.2, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
    
    oscillator.start(now);
    oscillator.stop(now + 0.2);
  } catch (error) {
    console.warn('Could not play error sound:', error);
  }
};

/**
 * Play a completion melody (3 ascending tones)
 * Used for completing receiving workflow
 */
export const playCompleteSound = () => {
  try {
    const ctx = getAudioContext();
    const frequencies = [523, 659, 784]; // C, E, G notes
    
    frequencies.forEach((freq, index) => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.frequency.value = freq;
      oscillator.type = 'sine';
      gainNode.gain.value = 0.2;
      
      const startTime = ctx.currentTime + (index * 0.15);
      const endTime = startTime + 0.15;
      
      gainNode.gain.setValueAtTime(0.2, startTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, endTime);
      
      oscillator.start(startTime);
      oscillator.stop(endTime);
    });
  } catch (error) {
    console.warn('Could not play complete sound:', error);
  }
};

/**
 * Play notification beep (medium pitched)
 * Used for general notifications
 */
export const playNotificationSound = () => {
  try {
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.frequency.value = 600; // Hz
    oscillator.type = 'sine';
    gainNode.gain.value = 0.25;
    
    const now = ctx.currentTime;
    gainNode.gain.setValueAtTime(0.25, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
    
    oscillator.start(now);
    oscillator.stop(now + 0.15);
  } catch (error) {
    console.warn('Could not play notification sound:', error);
  }
};
