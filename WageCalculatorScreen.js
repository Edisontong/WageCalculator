import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";

export default function WageCalculatorScreen() {
  const [hourlyRate, setHourlyRate] = useState(""); // State to store hourly rate
  const [selectedDays, setSelectedDays] = useState([]); // State to store selected days

  // Function to calculate total earnings
  const calculateTotalEarnings = () => {
    // Implement the logic to calculate earnings here
    // You can use hourlyRate and selectedDays state to perform calculations
    // Update the total earnings in state
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
      {/* Add UI elements to select days */}
      <Button title="Calculate Earnings" onPress={calculateTotalEarnings} />
      <Text>Total Earnings: {/* Display the calculated earnings here */}</Text>
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
