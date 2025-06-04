import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { FontAwesome5, MaterialIcons, AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [phoneVisible, setPhoneVisible] = useState(false);
  const [userData, setUserData] = useState({ name: 'User Name', phone: '03XXXXXXXXX' });

  useEffect(() => {
  const fetchUserData = async () => {
    try {
      const storedData = await AsyncStorage.getItem('userData');
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        console.log('📦 Retrieved userData:', parsedData); // 👈 Add this line
        setUserData(parsedData);
      }
    } catch (error) {
      console.log('Failed to load user data:', error);
    }
  };
  fetchUserData();
}, []);


  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          onPress: async () => {
            await AsyncStorage.removeItem('userData');
            navigation.replace('Login');
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.sidebar}>
        <View>
          <FontAwesome5 name="user-circle" size={70} color="#2a7e19" style={styles.profileIcon} />
          <Text style={styles.profileTitle}>My Profile</Text>
          <Text style={styles.userName}>{userData.name}</Text>

          <TouchableOpacity style={styles.option} onPress={() => setPhoneVisible(!phoneVisible)}>
            <MaterialIcons name="phone" size={20} color="rgb(128, 128, 128)" />
            <Text style={styles.optionText}>My Contact Info</Text>
          </TouchableOpacity>
          {phoneVisible && <Text style={styles.phoneNumber}>{userData.phone}</Text>}

          <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('EditProfileScreen')}>
            <AntDesign name="edit" size={20} color="rgb(128, 128, 128)" />
            <Text style={styles.optionText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <FontAwesome5 name="power-off" size={18} color="white" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E6FAF0',
    flexDirection: 'row',
  },
  sidebar: {
    width: '62%',
    backgroundColor: 'white',
    height: '100%',
    paddingVertical: 40,
    paddingHorizontal: 20,
    borderTopRightRadius: 40,
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  profileIcon: {
    marginTop: 20,
    marginBottom: 15,
  },
  profileTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'left',
    marginBottom: 2,
  },
  userName: {
    fontSize: 16,
    color: 'rgb(128, 128, 128)',
    textAlign: 'left',
    marginBottom: 20,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    width: '100%',
  },
  optionText: {
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 10,
    color: '#333',
  },
  phoneNumber: {
    fontSize: 16,
    color: '#2a7e19',
    marginLeft: 35,
    marginTop: -5,
    marginBottom: 15,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2a7e19',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginBottom: 30,
  },
  logoutText: {
    fontSize: 16,
    color: 'white',
    marginLeft: 10,
  },
});

export default ProfileScreen;
