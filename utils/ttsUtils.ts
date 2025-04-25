import Tts from 'react-native-tts';

export const speak = (text: string) => {
  Tts.speak(text);
};

export const stopSpeaking = () => {
  Tts.stop();
};
