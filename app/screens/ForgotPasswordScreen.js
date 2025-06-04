import React from "react";
import { View, Text, TouchableOpacity, Linking, StyleSheet } from "react-native";

const ForgotPasswordScreen = ({ route }) => {
  const userFullName = route?.params?.fullName || "Your Name"; // Fetch from navigation params or storage
  const userPhone = route?.params?.phoneNumber || "Your Phone"; // Fetch from navigation params or storage

  const sendWhatsAppMessage = () => {
    const message = `Forgot Password Request:\nFull Name: ${userFullName}\nRegistered Phone Number: ${userPhone}`;
    const whatsappNumber = "03229259925"; // Replace with admin's number
    const url = `whatsapp://send?phone=${whatsappNumber}&text=${encodeURIComponent(message)}`;

    Linking.openURL(url).catch(() => {
      alert("Make sure WhatsApp is installed on your device.");
    });
  };

  return (
    <View style={styles.container}>
  {/* Top Design Elements */}
  <View style={styles.topWrapper}>
    <View style={styles.topDesign} />
    <View style={[styles.topDesign, styles.orangeCircle]} />
  </View>

  <Text style={styles.heading}>Change Password</Text>

      
      <Text style={styles.infoText}>
        If you forgot your password, click the button below to contact admin via WhatsApp.
      </Text>

      <TouchableOpacity style={styles.button} onPress={sendWhatsAppMessage}>
        <Text style={styles.buttonText}>Contact Admin on WhatsApp</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: "flex-start", 
    alignItems: "center", 
    backgroundColor: "#fff", 
    paddingHorizontal: 20,
    paddingTop: 180,  
  },
  heading: {
    fontSize: 30, fontWeight: 'bold', color: '#2a7e19',
    textTransform: 'uppercase', 
    letterSpacing: 0.4, 
    textShadowColor: 'rgba(11, 11, 11, 0.3)', 
    textShadowOffset: { width: 1, height: 2 }, 
    textShadowRadius: 5,
    marginBottom: 50,
  },
  infoText: { 
    fontSize: 16, 
    color: "#333", 
    textAlign: "center", 
    marginTop: 50,  
    paddingHorizontal: 20,  
    lineHeight: 24,   
  },
  button: { 
    backgroundColor: "#2a7e19", 
    paddingVertical: 16,  
    paddingHorizontal: 17,  
    borderRadius: 25,
    marginTop: 30,
  },
  buttonText: { 
    color: "#fff", 
    fontSize: 16, 
    fontWeight: "bold" 
  },
  // 👇 These must be inside the StyleSheet object
  topWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  topDesign: { 
    width: 100, 
    height: 100, 
    backgroundColor: 'green', 
    borderRadius: 50, 
    position: 'absolute', 
    top: -20, 
    left: -20 
  },
  orangeCircle: { 
    backgroundColor: 'orange', 
    right: -30, 
    left: 'auto' 
  },
});


export default ForgotPasswordScreen;
