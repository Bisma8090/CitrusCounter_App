import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Modal, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';

const CitrusCounterScreen = () => {
  const [images, setImages] = useState([null, null, null, null]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const navigation = useNavigation();

  const pickImage = async (source) => {
    let result;
    if (source === 'camera') {
      result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
    } else {
      result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
    }

    if (!result.canceled) {
      const updatedImages = [...images];
      updatedImages[selectedIndex] = result.assets[0].uri;
      setImages(updatedImages);
    }
    setModalVisible(false);
  };

  const handleProceed = () => {
  if (images.includes(null)) {
    Alert.alert('Incomplete', 'Please select all 4 images before proceeding.');
    return;
  }

  // Replace these with actual values or inputs if you have them
  const totalTrees = 50;               // or get from user input/state

  navigation.navigate('SummaryScreen', {
    images: images,
    totalTrees: totalTrees,
  });
};


  return (
    <View style={styles.container}>
      <Image source={require('../../assets/bgphoto.png')} style={styles.backgroundImage} />
      
      <View style={styles.header}>
        <Text style={styles.title}>Welcome to</Text>
        <Text style={styles.appName}>CitrusCounter</Text>
      </View>

      <View style={styles.imageContainer}>
        {images.map((img, index) => (
          <TouchableOpacity 
            key={index} 
            style={styles.imageBox} 
            onPress={() => {
              setSelectedIndex(index);
              setModalVisible(true);
            }}>
            {img ? (
              <Image source={{ uri: img }} style={styles.image} />
            ) : (
              <>
                <Image source={require('../../assets/iconn.png')} style={styles.icon} />
                <Text style={styles.imageText}>Add Image</Text>
              </>
            )}
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity 
        style={[styles.button, images.includes(null) && styles.disabledButton]} 
        disabled={images.includes(null)} 
        onPress={handleProceed}>
        <Text style={styles.buttonText}>PROCEED</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.modalButton} onPress={() => pickImage('camera')}>
            <Text style={styles.modalButtonText}>Capture Image</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.modalButton} onPress={() => pickImage('gallery')}>
            <Text style={styles.modalButtonText}>Select from Gallery</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.modalCancel} onPress={() => setModalVisible(false)}>
            <Text style={styles.modalCancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1,  alignItems: 'center' },
  backgroundImage: { position: 'absolute', width: '100%', height: '100%', resizeMode: 'cover' },
  header: { alignSelf: 'flex-start', marginLeft: 19, marginBottom: 30, marginTop: 100 },
  title: { fontSize: 32, color: '#fff', fontWeight: 'bold', textShadowColor: 'rgba(37, 125, 50, 0.3)', textShadowOffset: { width: 2, height: 2 }, textShadowRadius: 5 },
  appName: { fontSize: 36, color: '#2a7e19', fontWeight: 'bold', textShadowColor: 'rgba(11, 11, 11, 0.3)', textShadowOffset: { width: 2, height: 2 }, textShadowRadius: 5 },
  imageContainer: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'center', 
    width: '94%',
    marginTop: 10
  },
  imageBox: { 
    width: '45%',
    height: 140,   // Fixed height so image add hone ke baad bhi same rahe
    backgroundColor: 'rgba(255,255,255,0.5)', 
    margin: 5, 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderRadius: 10,
    overflow: 'hidden' ,
  },
  image: { width: '100%', height: '100%', borderRadius: 10 },
  icon: { width: 30, height: 30 },
  imageText: { color: '#000', fontSize: 14,  textShadowColor: 'rgba(33, 113, 49, 0.3)', textShadowOffset: { width: 2, height: 2 }, textShadowRadius: 5 },
  button: { 
    position: 'absolute',
    bottom: 80,
    backgroundColor: '#2a7e19', 
    padding: 15, 
    borderRadius: 10 
  },
  disabledButton: { backgroundColor: '#2a7e19' },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  modalContainer: { position: 'absolute', bottom: 0, width: '100%', backgroundColor: '#fff', padding: 20, borderTopLeftRadius: 15, borderTopRightRadius: 15, alignItems: 'center' },
  modalButton: { padding: 15, width: '100%', alignItems: 'center', borderBottomWidth: 1, borderColor: '#ccc' },
  modalButtonText: { fontSize: 18, fontWeight: 'bold' },
  modalCancel: { marginTop: 10 },
  modalCancelText: { fontSize: 16, color: 'red' }
});

export default CitrusCounterScreen;
