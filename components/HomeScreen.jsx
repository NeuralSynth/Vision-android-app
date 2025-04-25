import React, { useState } from 'react';
import {
  Image,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ImageBackground,
  Linking
} from 'react-native';
import Tts from 'react-native-tts';
import call from 'react-native-phone-call';

export default function HomeScreen() {
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);

  const toggleSpeaker = () => {
    setIsSpeakerOn(!isSpeakerOn);
    if (!isSpeakerOn) {
      Tts.speak('Speaker is turned on');
    } else {
      Tts.stop();
    }
  };

  const handleEmergencyCall = () => {
    Linking.openURL('tel:9089783209');
  };

  return (
    <ImageBackground
      source={require('../images/IMAGE.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        {/* Top Buttons */}
        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.button, styles.button1]}
            onPress={() => {
                Tts.speak('Giving more Description'),
                Alert.alert('More Description')}
            }
          >
            <Image
              source={require('../images/info.png')}
              style={{ width: 30, height: 30, marginBottom: 5 }}
            />
            <Text style={styles.text}>More Description</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.button2]}
            onPress={toggleSpeaker}
          >
            <Image
              source={
                isSpeakerOn
                  ? require('../images/volume-on.png')
                  : require('../images/volume-off.png')
              }
              style={{ width: 30, height: 30, marginBottom: 5 }}
            />
            <Text style={styles.text}>
              {isSpeakerOn ? 'Speaker Off' : 'Speaker On'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Bottom Buttons */}
        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.button, styles.button3]}
            onPress={() =>{
                Tts.speak('Reading the text'),
                Alert.alert('Read Full Text')}}
          >
            <Image
              source={require('../images/book.png')}
              style={{ width: 30, height: 30, marginBottom: 5 }}
            />
            <Text style={styles.text}>Read Text</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.button4]}
            onPress={handleEmergencyCall}
          >
            <Image
              source={require('../images/call.png')}
              style={{ width: 30, height: 30, marginBottom: 5 }}
            />
            <Text style={styles.text}>Emergency</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(10, 61, 98, 0.7)',
    justifyContent: 'center',
    padding: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  button: {
    flex: 0.45,
    paddingVertical: 100,
    paddingHorizontal: 30,
    borderRadius: 20,
    alignItems: 'center',
    elevation: 5,
  },
  button1: {
    backgroundColor: '#1E3799',
  },
  button2: {
    backgroundColor: '#60A3BC',
  },
  button3: {
    backgroundColor: '#3B3B98',
  },
  button4: {
    backgroundColor: '#FC427B',
  },
  text: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
  },
});
