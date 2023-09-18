import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function WageCalculatorScreen() {
  const [hourlyRate, setHourlyRate] = useState(""); // State to store hourly rate
  const [selectedDays, setSelectedDays] = useState([]); // State to store selected days
  const [totalEarnings, setTotalEarnings] = useState(""); // State to store total earnings

  useEffect(() => {
    // Load the hourly rate from AsyncStorage when the component mounts
    loadHourlyRate();
  }, []);

  // Function to load hourly rate from AsyncStorage
  const loadHourlyRate = async () => {
    try {
      const savedHourlyRate = await AsyncStorage.getItem("hourlyRate");
      if (savedHourlyRate) {
        setHourlyRate(savedHourlyRate);
      }
    } catch (error) {
      console.error("Error loading hourly rate:", error);
    }
  };

  // Function to save the hourly rate
  const saveHourlyRate = async () => {
    try {
      await AsyncStorage.setItem("hourlyRate", hourlyRate);
      alert("Hourly rate saved successfully.");
    } catch (error) {
      console.error("Error saving hourly rate:", error);
    }
  };

  // Function to calculate total earnings
  const calculateTotalEarnings = () => {
    // Implement the logic to calculate earnings here
    // You can use hourlyRate and selectedDays state to perform calculations
    // Update the total earnings in state
    // For now, let's simply set a placeholder value
    setTotalEarnings("Calculating..."); // Replace this with your calculation logic
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Wage Calculator</Text>
      <Text>Hourly Rate:</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => setHourlyRate(text)}
        value={hourlyRate}
        keyboardType="numeric"
      />
      <Button title="Save Hourly Rate" onPress={saveHourlyRate} />
      {/* Add UI elements to select days */}
      <Button title="Calculate Earnings" onPress={calculateTotalEarnings} />
      <Text>Total Earnings: {totalEarnings}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    marginBottom: 16,
  },
});
