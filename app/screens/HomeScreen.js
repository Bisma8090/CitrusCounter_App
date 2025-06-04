import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = () => {
  const navigation = useNavigation();
  const [landSize, setLandSize] = useState('');
  const [totalTrees, setTotalTrees] = useState('');

  useEffect(() => {
    // You can load saved values here if needed
  }, []);

  const generateReport = () => {
    console.log('HomeScreen generateReport called');
    console.log('Current totalTrees:', totalTrees, typeof totalTrees);
    console.log('Current landSize:', landSize);

    if (!landSize || !totalTrees) {
      Alert.alert('Missing Information', 'Please enter both land size and number of trees.');
      return;
    }

    navigation.navigate('ReportScreen', {
      landSize,
      totalTrees: parseInt(totalTrees), // ✅ ensures numeric value is sent
      location,
      date: new Date().toLocaleDateString(),
      farmerName: 'Sample Farmer',
      citrusCountPerTree: '10',
    });
  };

  return (
    <View style={styles.container}>
      {/* Top Design Elements */}
      <View style={styles.topDesign} />
      <View style={[styles.topDesign, styles.orangeCircle]} />

      {/* Heading */}
      <Text style={styles.title}>CitrusCounter</Text>
      <Text style={styles.subtitle}>Make citrus farming easier with quick and accurate counts</Text>

      {/* Inputs */}
      <View style={styles.row}>
        <View style={styles.inputBox}>
          <Text style={styles.label}>Land Size (acres)</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Size"
            keyboardType="numeric"
            value={landSize}
            onChangeText={(text) => setLandSize(text.replace(/[^0-9]/g, ''))}
          />
          <TouchableOpacity
            style={styles.saveButton}
            onPress={async () => {
              if (!landSize) {
                Alert.alert('Missing Input', 'Please enter number of acres before saving.');
                return;
              }
              try {
                await AsyncStorage.setItem('savedlandsize', landSize);
                Alert.alert('Success', 'Number of acres saved successfully.');
              } catch (e) {
                Alert.alert('Error', 'Failed to save the number of acres.');
              }
            }}
          >
            <Text style={styles.saveButtonText}>Enter</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputBox}>
          <Text style={styles.label}>Number of Trees</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Count"
            keyboardType="numeric"
            value={totalTrees}
            onChangeText={(text) => {
              console.log('User input totalTrees:', text);
              setTotalTrees(text.replace(/[^0-9]/g, ''));
            }}
          />
          <TouchableOpacity
            style={styles.saveButton}
            onPress={async () => {
              if (!totalTrees) {
                Alert.alert('Missing Input', 'Please enter number of trees before saving.');
                return;
              }
              try {
                await AsyncStorage.setItem('savedTotalTrees', totalTrees);
                Alert.alert('Success', 'Number of trees saved successfully.');
              } catch (e) {
                Alert.alert('Error', 'Failed to save the number of trees.');
              }
            }}
          >
            <Text style={styles.saveButtonText}>Enter</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Add Images */}
      <TouchableOpacity
        style={[
          styles.imageUploadBox,
          (!landSize || !totalTrees) && { opacity: 0.7 },
        ]}
        onPress={() => {
          if (!landSize || !totalTrees) {
            Alert.alert('Missing Information', 'Add land Size and Number of trees');
            return;
          }
          navigation.navigate('CitrusCounter');
        }}
      >
        <Text style={styles.label}>Add images for count</Text>
        <FontAwesome5 name="camera" size={40} color="#2a7e19" />
      </TouchableOpacity>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navButton}>
          <FontAwesome5 name="home" size={24} color="#2a7e19" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate('ProfileScreen')}
        >
          <FontAwesome5 name="user" size={24} color="#2a7e19" />
          <Text style={styles.navText}>My Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#2a7e19',
    marginTop: 70,
    letterSpacing: 1,
    textShadowColor: 'rgba(11, 11, 11, 0.3)',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 5,
  },
  subtitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 10,
    marginBottom: 20,
    color: '#2a7e19',
    marginLeft: 6,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  inputBox: {
    flex: 1,
    borderWidth: 0.7,
    borderColor: '#2a7e19',
    borderRadius: 10,
    padding: 10,
    marginHorizontal: 5,
  },
  label: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  input: { fontSize: 16, marginTop: 5, borderRadius: 9, borderColor: 'grey', borderWidth: 0.3 },
  placeholder: { fontSize: 12, color: '#999', marginLeft: 6 },

  imageUploadBox: {
    borderWidth: 1,
    borderColor: '#2a7e19',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 35,
    height: 200,
  },

  saveButton: {
    marginTop: 8,
    backgroundColor: '#2a7e19',
    paddingVertical: 6,
    borderRadius: 6,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },

  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 15,
    borderTopWidth: 0.7,
    alignSelf: 'center',
    borderColor: 'grey',
    position: 'absolute',
    bottom: 15,
    width: '100%',
    backgroundColor: '#fff',
  },
  navButton: { alignItems: 'center' },
  navText: { fontSize: 12, color: '#2a7e19', marginTop: 2 },

  button: {
    backgroundColor: '#2a7e19',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },

  topDesign: {
    position: 'absolute',
    width: 100,
    height: 100,
    backgroundColor: 'green',
    borderRadius: 50,
    top: -20,
    left: -20,
  },
  orangeCircle: { backgroundColor: 'orange', right: -30, left: 'auto' },
});

export default HomeScreen;
