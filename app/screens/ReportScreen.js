import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import * as Print from 'expo-print';
import { shareAsync } from 'expo-sharing';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ReportScreen = ({ route }) => {
  const { date, citrusCountPerTree, farmerName: routeFarmerName, totalTrees: routeTotalTrees } = route.params;

  const [farmerName, setFarmerName] = useState(routeFarmerName || '');
  const [totalTrees, setTotalTrees] = useState(routeTotalTrees ?? null);
  const [loading, setLoading] = useState(false); // no need for loading here unless you want it

  useEffect(() => {
    const fetchData = async () => {
      try {
        const savedTrees = await AsyncStorage.getItem('savedTotalTrees');
        const savedName = await AsyncStorage.getItem('farmerName');

        if (savedTrees !== null) {
          setTotalTrees(parseInt(savedTrees));
        }

        if (savedName) {
          setFarmerName(savedName);
        }
      } catch (e) {
        Alert.alert('Error', 'Failed to fetch data from storage.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const citrusCountNum = parseFloat(citrusCountPerTree);
  const isValidCitrusCount = !isNaN(citrusCountNum);
  const isValidTotalTrees = !isNaN(totalTrees);
  const citrusCountPerAcre = (isValidCitrusCount && isValidTotalTrees)
    ? citrusCountNum * totalTrees
    : 'N/A';

  const generatePDF = async () => {
    try {
      const htmlContent = `
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              h1 { text-align: center; color: #2a7e19; margin-bottom: 40px; }
              p { font-size: 16px; margin: 10px 0; }
              strong { color: #333; }
            </style>
          </head>
          <body>
            <h1>Citrus Detection Report</h1>
            <p><strong>Date:</strong> ${date}</p>
            <p><strong>Farmer Name:</strong> ${farmerName}</p>
            <p><strong>Citrus Count Per Tree:</strong> ${isValidCitrusCount ? citrusCountNum : 'N/A'}</p>
            <p><strong>Citrus Count Per Acre:</strong> ${citrusCountPerAcre}</p>
          </body>
        </html>
      `;
      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      await shareAsync(uri);
    } catch (error) {
      Alert.alert('Error', `Failed to generate PDF: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2a7e19" />
        <Text style={{ marginTop: 10 }}>Loading report...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.topDesign} />
      <View style={[styles.topDesign, styles.orangeCircle]} />

      <Text style={styles.heading}>Citrus Report</Text>

      <Text style={styles.detail}>
        <Text style={styles.label}>Date: </Text>{date}
      </Text>
      <Text style={styles.detail}>
<Text>Farmer Name: {farmerName}</Text>
      </Text>
      <Text style={styles.detail}>
        <Text style={styles.label}>Citrus Count Per Tree: </Text>{isValidCitrusCount ? citrusCountNum : 'N/A'}
      </Text>
      <Text style={styles.detail}>
        <Text style={styles.label}>Citrus Count Per Acre: </Text>{citrusCountPerAcre}
      </Text>
<Text style={styles.detail}>
        <Text style={styles.label}>Accuracy :  75-85% </Text>
      </Text>
      <TouchableOpacity style={styles.button} onPress={generatePDF}>
        <Text style={styles.buttonText}>Generate PDF</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  heading: {
    fontSize: 27,
    fontWeight: 'bold',
    color: '#2a7e19',
    marginBottom: 30,
    marginTop: 200,
    textTransform: 'uppercase',
    letterSpacing: 1,
    textShadowColor: 'rgba(11, 11, 11, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  detail: {
    fontSize: 16,
        fontWeight: 'bold',

    marginVertical: 8,
  },
  label: {
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#2a7e19',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 40,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  topDesign: {
    position: 'absolute',
    width: 100,
    height: 100,
    backgroundColor: 'green',
    borderRadius: 50,
    top: -20,
    left: -20,
  },
  orangeCircle: {
    backgroundColor: 'orange',
    right: -30,
    left: 'auto',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ReportScreen;
