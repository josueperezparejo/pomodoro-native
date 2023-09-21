import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { SafeAreaView, Platform, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Header, Timer } from './src/components';
import { Audio } from 'expo-av';

const colors = ['#F7DC6F', '#A2D9CE', '#D7BDE2']

export default function App() {
  const [isWorking, setIsWorking] = useState(false)
  const [time, setTime] = useState(25 * 60)
  const [currentTime, setCurrentTime] = useState('POMO' | 'SHORT' | 'BREAK')
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    let interval = null

    if (isActive) {
      interval = setInterval(() => {
        setTime(time - 1)
      }, 1000);

    } else {
      clearInterval(interval)
    }

    if(time === 0) {
      setIsActive(false)
      setIsWorking((prev) => !prev)
      setTime(isWorking ? 300 : 1500)
    }

    return () => {
      clearInterval(interval)
    }
  }, [isActive, time])

  const playSound = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require('./assets/click.wav')
    );
    await sound.playAsync()
  }

  const handleStartStop = () => {
    playSound()
    setIsActive(!isActive)
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors[currentTime] }]}>
      <View
        style={{
          flex: 1,
          paddingHorizontal: 15,
          paddingTop: Platform.OS === 'android' && 40
        }}>
        <Text style={styles.title}>Pomodoro</Text>
        <Header currentTime={currentTime} setCurrentTime={setCurrentTime} setTime={setTime} />
        <Timer time={time} />
        <TouchableOpacity style={styles.button} onPress={handleStartStop}>
          <Text style={{ color: 'white', fontWeight: 'bold' }}>{isActive ? 'STOP' : 'START'}</Text>
        </TouchableOpacity>
        <Text style={{fontSize: 20, fontWeight: 'bold', textAlign: 'center'}}>I love You 👑</Text>
        <StatusBar style="auto" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold'
  },
  button: {
    backgroundColor: '#333',
    padding: 15,
    marginTop: 15,
    alignItems: 'center',
    borderRadius: 15
  }
});
