 import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions } from '@react-navigation/native';

const LoginScreen = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [loading, setLoading] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const [isPasswordValid, setIsPasswordValid] = useState(true);

  const phoneRef = useRef(null);
  const passwordRef = useRef(null);

  const validatePassword = (input) => /^[A-Za-z0-9]{6}$/.test(input);

  
const getPhoneMaxLength = (input) => {
  // Always check what's *actually* being typed
  if (input.slice(0, 3) === '+92') return 13;
  if (input.slice(0, 2) === '03') return 11;
  return 13;
};
const validatePhoneNumber = (input) => {
  // Remove spaces for safety
  const cleaned = input.replace(/\s/g, '');

  // Local format: starts with 03 + 9 digits = 11 digits
  const localFormat = /^03\d{9}$/;

  // International format: +923 + 9 digits = 13 characters
  const intlFormat = /^\+923\d{9}$/;

  return localFormat.test(cleaned) || intlFormat.test(cleaned);
};

// Update handlePhoneNumberChange to allow digits and + at start only
const handlePhoneNumberChange = (input) => {
  let formattedInput = input.replace(/(?!^\+)[^\d]/g, '');

  // Ensure '+' is only at the start if it exists
  if (formattedInput.startsWith('+') && !formattedInput.startsWith('+92')) {
    formattedInput = '+92' + formattedInput.slice(1).replace(/^\d*/, '');
  }

  // Now apply maxLength logic AFTER sanitizing
  const maxLength = formattedInput.startsWith('+92') ? 13 : 11;
  if (formattedInput.length > maxLength) {
    formattedInput = formattedInput.slice(0, maxLength);
  }

  setPhoneNumber(formattedInput);
  setPhoneError('');

  // Validate if length matches
  if (formattedInput.length === maxLength && !validatePhoneNumber(formattedInput)) {
    setPhoneError('Please enter a valid Pakistani phone number');
  }
};

const handlePasswordChange = (input) => {
    const trimmed = input.slice(0, 6);
    setPassword(trimmed);

    if (trimmed.length === 6) {
      setIsPasswordValid(validatePassword(trimmed));
    } else {
      setIsPasswordValid(true);
    }
  };

  const handleLogin = async () => {
    if (!phoneNumber || !password) {
      Alert.alert('Error', 'Phone number and password are required!');
      return;
    }
    if (!validatePhoneNumber(phoneNumber)) {
      Alert.alert('Error', 'Invalid Pakistani phone number!');
      return;
    }
    if (!validatePassword(password)) {
      Alert.alert('Error', 'Password must be exactly 6 alphanumeric characters.');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('https://citruscounter-production.up.railway.app/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phonenumber: phoneNumber, password }),
      });

      const data = await response.json();

      console.log('Login response:', data);

      if (response.ok) {
     if (data.user) {
  const userDataToStore = {
    name: data.user.fullname || data.user.name,
    phone: data.user.phonenumber || data.user.phone,
  };
  await AsyncStorage.setItem('userData', JSON.stringify(userDataToStore));
  console.log('User data saved to AsyncStorage:', userDataToStore);
}


        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'HomeScreen' }],
          })
        );
      } else {
        Alert.alert('Error', data?.message || 'Invalid credentials, please try again.');
      }
    } catch (error) {
      console.error('Login Error:', error);
Alert.alert('Error', 'Network or Server Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/bgphoto.png')} style={styles.backgroundImage} />
      <View style={styles.overlay}>
        <Text style={styles.title}>Welcome</Text>
        <Text style={styles.subtitle}>Login to your account</Text>
<Text style={styles.label}>Phone Number</Text>

        <TextInput
          ref={phoneRef}
          style={styles.input}
          placeholder="Your number"
          placeholderTextColor="rgb(216, 213, 213)"
          keyboardType="phone-pad"
          value={phoneNumber}
          onChangeText={handlePhoneNumberChange}
        
          onBlur={() => {
            if (!validatePhoneNumber(phoneNumber)) {
              setPhoneError('Please enter a valid phone number');
            }
          }}
        />
{phoneError ? <Text style={styles.errorText}>{phoneError}</Text> : null}

        <Text style={styles.label}>Password</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            ref={passwordRef}
            style={styles.passwordInput}
            placeholder="Password"
            placeholderTextColor="rgb(216, 213, 213)"
            secureTextEntry={secureTextEntry}
            value={password}
            onChangeText={handlePasswordChange}
            returnKeyType="done"
          />
          <TouchableOpacity onPress={() => setSecureTextEntry(!secureTextEntry)}>
            <Icon name={secureTextEntry ? 'eye-slash' : 'eye'} size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        <Text style={[styles.passwordNote, { color: isPasswordValid ? 'white' : '#FF6B6B' }]}>
          Must be 6 characters (letters & numbers only)
        </Text>

        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
          <Text style={styles.forgotPassword}>Forgot password?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.loginButton, loading && { opacity: 0.6 }]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.loginButtonText}>LOGIN</Text>}
        </TouchableOpacity>

        <Text style={styles.signupText}>
          Don’t have an account?{' '}
          <Text style={styles.signupLink} onPress={() => navigation.navigate('SignUp')}>
            Sign Up
          </Text>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  backgroundImage: { position: 'absolute', width: '100%', height: '100%', resizeMode: 'cover' },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  title: {
    fontSize: 38,
    fontWeight: 'bold',
    color: '#fff',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    textShadowColor: 'rgba(11, 11, 11, 0.3)',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 5,
  },
  subtitle: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 50,
    textShadowColor: 'rgba(11, 11, 11, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  label: {
    alignSelf: 'flex-start',
    fontSize: 16,
    color: 'rgb(255, 255, 255)',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  errorText: {
  color: '#FF6B6B',
  alignSelf: 'flex-start',
  marginTop: -15,
  marginBottom: 10,
  marginLeft: 17,
},

  input: {
    width: '100%',
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#fff',
    paddingHorizontal: 15,
    color: '#fff',
    marginBottom: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#fff',
    paddingHorizontal: 15,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginBottom: 5,
  },
  passwordNote: {
    fontSize: 13,
    color: 'white',
    marginBottom: 2,
    marginLeft: 18,
    alignSelf: 'flex-start',
  },
  passwordInput: {
    flex: 1,
    color: '#fff',
  },
  forgotPassword: { color: '#fff', alignSelf: 'flex-end', marginBottom: 17,marginTop:14,fontWeight: 'bold' },
  loginButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#2a7e19',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    marginBottom: 20,
  },
  loginButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  signupText: { color: '#fff' },
  signupLink: { color: '#ffd700', fontWeight: 'bold' },
});

export default LoginScreen; 