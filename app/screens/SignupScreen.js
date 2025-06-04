 import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';



const SignupScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [secureConfirmEntry, setSecureConfirmEntry] = useState(true);
  const [phoneError, setPhoneError] = useState('');
  const [isPasswordValid, setIsPasswordValid] = useState(true);



  const phoneRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  const API_URL = "https://citruscounter-production.up.railway.app/auth/signup";

const getPhoneMaxLength = (input) => {
  // Always check what's *actually* being typed
  if (input.slice(0, 3) === '+92') return 13;
  if (input.slice(0, 2) === '03') return 11;
  return 13;
};
  // Update validatePhoneNumber to allow both formats:
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



const validatePassword = (input) => /^[A-Za-z0-9]{6}$/.test(input);

 const handlePasswordChange = (input) => {
  // Just limit length to 6 (optional)
  const trimmed = input.slice(0, 6);
  setPassword(trimmed);

  // Validate only when length is exactly 6
  if (trimmed.length === 6) {
    setIsPasswordValid(validatePassword(trimmed));
  } else {
    setIsPasswordValid(true); // neutral color while typing
  }
};



  const handleConfirmPasswordChange = (input) => {
    let formattedInput = input.replace(/[^A-Za-z0-9]/g, '');

    if (input.length > 6) {
      setTimeout(() => Alert.alert('Invalid Password', 'Password must be exactly 6 characters (letters & numbers only).'), 100);
    }

    if (input !== formattedInput) {
      setTimeout(() => Alert.alert('Invalid Character', 'Only letters & numbers are allowed in password.'), 100);
    }

    setConfirmPassword(formattedInput.slice(0, 6));
  };

  const handleSignup = async () => {
  if (!name || !phoneNumber || !password || !confirmPassword) {
    Alert.alert('Error', 'All fields are required!');
    return;
  }
  if (!validatePhoneNumber(phoneNumber)) {
  setPhoneError('Please enter a valid phone number');
  return;
}

  if (!validatePassword(password)) {
    Alert.alert('Error', 'Password must be exactly 6 characters (letters & numbers only).');
    return;
  }
  if (password !== confirmPassword) {
    Alert.alert('Error', 'Passwords do not match!');
    return;
  }

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullname: name,
        phonenumber: phoneNumber,
        password: password,
        confirmpassword: confirmPassword,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      // ✅ Save user data to AsyncStorage
      await AsyncStorage.setItem('userData', JSON.stringify({
        name,
        phone: phoneNumber,
      }));

      Alert.alert('Success', 'Signup successful!', [
        { text: 'OK', onPress: () => navigation.navigate('Login') },
      ]);
    } else {
      Alert.alert('Error', data.message || 'Signup failed. Please try again.');
    }
  } catch (error) {
    Alert.alert('Error', 'Could not connect to the server. Check your network.');
  }
};


  return (
    <View style={styles.container}>
      <Image source={require('../../assets/bgphoto.png')} style={styles.backgroundImage} />
      <View style={styles.overlay}>
        <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : null}>
            <Text style={styles.title}>Sign Up</Text>

            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              placeholderTextColor="rgb(216, 213, 213)"
              value={name}
              onChangeText={setName}
              returnKeyType="next"
              onSubmitEditing={() => phoneRef.current.focus()}
            />
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
                returnKeyType="next"
                onSubmitEditing={() => confirmPasswordRef.current.focus()}
              />
              <TouchableOpacity onPress={() => setSecureTextEntry(!secureTextEntry)}>
                <Icon name={secureTextEntry ? 'eye-slash' : 'eye'} size={20} color="#fff" />
              </TouchableOpacity>
            </View>

           <Text style={[
  styles.passwordNote,
  { color: isPasswordValid ? 'white' : '#FF6B6B' }
]}>
  Must be 6 characters (letters & numbers only)
</Text>


            <Text style={styles.label}>Confirm Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                ref={confirmPasswordRef}
                style={styles.passwordInput}
                placeholder="Confirm Password"
                placeholderTextColor="rgb(216, 213, 213)"
                secureTextEntry={secureConfirmEntry}
                value={confirmPassword}
                onChangeText={handleConfirmPasswordChange}
              />
              <TouchableOpacity onPress={() => setSecureConfirmEntry(!secureConfirmEntry)}>
                <Icon name={secureConfirmEntry ? 'eye-slash' : 'eye'} size={20} color="#fff" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
              <Text style={styles.signupButtonText}>SIGN UP</Text>
            </TouchableOpacity>

            <Text style={styles.loginText}>
              Already have an account?{' '}
              <Text style={styles.loginLink} onPress={() => navigation.navigate('Login')}>
                Login
              </Text>
            </Text>
          </KeyboardAvoidingView>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 80,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  title: {
    fontSize: 38,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 30,
    alignSelf: 'center',
  },
  label: {
    alignSelf: 'flex-start',
    fontSize: 16,
    color: 'rgb(255, 255, 255)',
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 6,
  },
  input: {
    width: '100%',
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#fff',
    paddingHorizontal: 15,
    color: '#fff',
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
    fontSize: 14,
    color: 'white',
    marginBottom: 2,
    marginLeft: 10,
    alignSelf: 'flex-start',
  },
  passwordInput: {
    flex: 1,
    color: '#fff',
  },
  signupButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#2a7e19',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    marginTop: 20,
    marginBottom: 20,
  },
  signupButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginText: {
    color: '#fff',
    alignSelf: 'center',
    marginBottom: 20,
  },
  errorText: {
  color: '#FF6B6B',
  alignSelf: 'flex-start',
  marginTop: 5,
  marginBottom: 2,
  marginLeft: 30,
},

  loginLink: {
    color: '#ffd700',
    fontWeight: 'bold',
  },
});

export default SignupScreen;  