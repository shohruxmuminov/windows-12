class SoundManager {
  private static instance: SoundManager;
  private sounds: Record<string, HTMLAudioElement> = {};

  private constructor() {
    this.sounds = {
      startup: new Audio('https://win11.blueedge.me/desktop/media/startup.mp3'),
      click: new Audio('https://win11.blueedge.me/desktop/media/click.mp3'),
      error: new Audio('https://win11.blueedge.me/desktop/media/error.mp3'),
      minimize: new Audio('https://win11.blueedge.me/desktop/media/minimize.mp3'),
    };
  }

  public static getInstance(): SoundManager {
    if (!SoundManager.instance) {
      SoundManager.instance = new SoundManager();
    }
    return SoundManager.instance;
  }

  public play(soundName: 'startup' | 'click' | 'error' | 'minimize', volume: number = 0.5) {
    const sound = this.sounds[soundName];
    if (sound) {
      sound.volume = volume;
      sound.currentTime = 0;
      sound.play().catch(e => console.warn('Audio playback failed:', e));
    }
  }
}

export const soundManager = SoundManager.getInstance();
