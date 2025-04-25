import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import HomeScreen from './components/HomeScreen';

function App(){
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar />

      <HomeScreen />
    </SafeAreaView>
  );
}

export default App;
