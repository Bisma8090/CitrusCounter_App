import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <Image source={require('../../assets/splash_logo.png')} style={styles.logo} />
      <Text style={styles.title}>Citrus Counter</Text>
      <Text style={styles.subtitle}>Count and Track Citrus Easily</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2a7e19', 
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 230,
    height: 200,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    textTransform: 'uppercase', 
    letterSpacing: 2, 
    textShadowColor: 'rgba(11, 11, 11, 0.3)', 
    textShadowOffset: { width: 2, height: 2 }, 
    textShadowRadius: 5, 
  },
  subtitle: {
    fontSize: 15,
    color: '#FFF',
    marginTop: 7,
  },
});

export default SplashScreen;
