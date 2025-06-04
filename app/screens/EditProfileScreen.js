import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, StatusBar, SafeAreaView, Alert } from "react-native";

const EditProfileScreen = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const validatePhoneNumber = (input) => {
    return /^03\d{9}$/.test(input);
  };

  const handlePhoneChange = (input) => {
    let formattedInput = input.replace(/\D/g, "");

    if (formattedInput.length === 1 && formattedInput !== "0") {
      setTimeout(() => Alert.alert("Invalid Number", "Pakistani number must start with 03"), 100);
      return;
    }

    if (formattedInput.length >= 2 && !formattedInput.startsWith("03")) {
      setTimeout(() => Alert.alert("Invalid Number", "Pakistani number must start with 03"), 100);
      return;
    }

    if (formattedInput.length > 11) {
      setTimeout(() => Alert.alert("Invalid Number", "Pakistani number must be exactly 11 digits."), 100);
      return;
    }

    setPhone(formattedInput);
  };

  const validatePassword = (input) => /^[A-Za-z0-9]{6}$/.test(input);

  const handlePasswordChange = (input) => {
    let formattedInput = input.replace(/[^A-Za-z0-9]/g, "");

    if (input.length > 6) {
      setTimeout(() => Alert.alert("Invalid Password", "Password must be exactly 6 characters (letters & numbers only)."), 100);
    }

    if (input !== formattedInput) {
      setTimeout(() => Alert.alert("Invalid Character", "Only letters & numbers are allowed in password."), 100);
    }

    setPassword(formattedInput.slice(0, 6));
  };

  const handleSave = async () => {
    if (!validatePhoneNumber(phone)) {
      Alert.alert("Invalid Phone", "Please enter a valid Pakistani number (03XXXXXXXXX).");
      return;
    }
    if (!validatePassword(password)) {
      Alert.alert("Invalid Password", "Password must be exactly 6 characters (letters & numbers only).");
      return;
    }

    try {
      const response = await fetch("https://citruscounter-production.up.railway.app/auth/edit-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullname:name,
          phonenumber:phone,
          password:password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Success", "Profile updated successfully!");
      } else {
        Alert.alert("Error", data.message || "Something went wrong.");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to connect to the server.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar hidden={true} />
      <View style={styles.topDesign} />
      <View style={[styles.topDesign, styles.orangeCircle]} />

      <View style={styles.profileSection}>
        <Image source={require("../../assets/bgphoto.png")} style={styles.profileImage} />
        <Text style={styles.username}>Profile User</Text>
        <Text style={styles.editProfileText}>Edit Profile</Text>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput style={styles.input} placeholder="Your name" value={name} onChangeText={setName} />

        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={styles.input}
          placeholder="03XXXXXXXXX"
          keyboardType="numeric"
          value={phone}
          onChangeText={handlePhoneChange}
          maxLength={11}
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="******"
          secureTextEntry
          value={password}
          onChangeText={handlePasswordChange}
        />

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  topDesign: {
    position: "absolute",
    width: 120,
    height: 120,
    backgroundColor: "green",
    borderRadius: 60,
    top: -30,
    left: -30,
  },
  orangeCircle: {
    backgroundColor: "orange",
    right: -40,
    left: "auto",
  },
  profileSection: {
    alignItems: "center",
    marginTop: 80,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  username: { fontSize: 20, fontWeight: "bold", color: "#2a7e19", marginTop: 10 },
  editProfileText: { color: "gray", fontSize: 14, marginBottom: 20 },
  formContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  label: {
    fontSize: 14,
    color: "black",
    marginBottom: 18,
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    padding: 12,
    borderWidth: 0.3,
    borderColor: "#34A853",
    borderRadius: 11,
    marginBottom: 28,
    backgroundColor: "#fff",
  },
  saveButton: {
    backgroundColor: "#34A853",
    padding: 15,
    borderRadius: 25,
    width: "100%",
    alignItems: "center",
    marginTop: 35,
  },
  saveText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});

export default EditProfileScreen;
