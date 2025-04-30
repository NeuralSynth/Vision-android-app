import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Linking,
  Platform,
} from 'react-native';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import ViewShot from 'react-native-view-shot';
import Tts from 'react-native-tts';
import axios from 'axios';

export default function HomeScreen() {
  const devices = useCameraDevices();
  const backCam = devices.back;
  const cameraRef = useRef(null);
  const viewShotRef = useRef(null);

  const [isDetecting, setIsDetecting] = useState(false);
  const [intervalId, setIntervalId] = useState(null);

  // Request permission on mount
  useEffect(() => {
    checkAndRequestCameraPermission();
  }, []);

  const checkAndRequestCameraPermission = async () => {
    const currentStatus = await Camera.getCameraPermissionStatus();

    if (currentStatus === 'authorized') {
      return;
    }

    if (currentStatus === 'not-determined' || currentStatus === 'denied') {
      const newStatus = await Camera.requestCameraPermission();

      if (newStatus !== 'authorized') {
        Alert.alert(
          'Camera Required',
          'This app needs camera access to detect objects.',
          [
            {
              text: 'Try Again',
              onPress: () => checkAndRequestCameraPermission(),
              style: 'default',
            },
          ],
          { cancelable: false }
        );
      }
    } else if (currentStatus === 'blocked') {
      Alert.alert(
        'Permission Blocked',
        'Camera permission is blocked. Please enable it from settings.',
        [
          {
            text: 'Open Settings',
            onPress: () => Linking.openSettings(),
          },
          {
            text: 'Cancel',
            style: 'cancel',
          },
        ],
        { cancelable: true }
      );
    }
  };

  useEffect(() => {
    if (isDetecting) {
      const id = setInterval(captureAndDetect, 5000); 
      setIntervalId(id);
    } else {
      clearInterval(intervalId);
    }
    return () => clearInterval(intervalId);
  }, [isDetecting]);

  const captureAndDetect = async () => {
    if (!viewShotRef.current) return;

    try {
      const base64 = await viewShotRef.current.capture({
        format: 'jpg',
        quality: 0.5,
        result: 'base64',
      });

      const resp = await axios.post('http://192.168.1.44:5000/detect', {
        image: base64,
      });

      const detected = resp.data.objects;
      if (detected.length) {
        Tts.speak(`I see: ${detected.join(', ')}`);
      } else {
        Tts.speak('No objects detected');
      }
    } catch (e) {
      console.warn('detect error', e);
    }
  };

  const toggleLiveDetect = () => {
    setIsDetecting((on) => {
      if (on) Tts.speak('Stopping live detection');
      else Tts.speak('Starting live detection');
      return !on;
    });
  };

  const handleEmergency = () => Linking.openURL('tel:9089783209');

  if (!backCam) return <Text>Loading camera…</Text>;

  return (
    <View style={styles.full}>
      <ViewShot style={styles.full} ref={viewShotRef} options={{ result: 'base64' }}>
        <Camera
          style={styles.full}
          device={backCam}
          isActive={true}
          ref={cameraRef}
        />
      </ViewShot>

      <View style={styles.overlay}>
        <TouchableOpacity style={styles.button} onPress={toggleLiveDetect}>
          <Text style={styles.btnText}>
            {isDetecting ? 'Stop Live Detect' : 'Start Live Detect'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleEmergency}>
          <Text style={styles.btnText}>Emergency Call</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  full: { flex: 1 },
  overlay: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    backgroundColor: '#26de81',
    padding: 12,
    borderRadius: 8,
    elevation: 3,
  },
  btnText: { color: '#fff', fontSize: 16 },
});
