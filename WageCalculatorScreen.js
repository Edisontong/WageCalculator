import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet, FlatList } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import TimePunch from "./TimePunch";

export default function WageCalculatorScreen() {
  const [hourlyRate, setHourlyRate] = useState("");
  const [totalEarnings, setTotalEarnings] = useState("");
  const [isEditingRate, setIsEditingRate] = useState(false);
  const [timePunches, setTimePunches] = useState([]);
  const [selectedTimePunches, setSelectedTimePunches] = useState([]);

  useEffect(() => {
    // Load the hourly rate from AsyncStorage when the component mounts
    loadHourlyRate();

    // Load time punches from AsyncStorage
    loadTimePunches();
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

  // Function to load time punches from AsyncStorage
  const loadTimePunches = async () => {
    try {
      const savedTimePunches = await AsyncStorage.getItem("timePunches");
      if (savedTimePunches) {
        const parsedTimePunches = JSON.parse(savedTimePunches);
        setTimePunches(parsedTimePunches);
      }
    } catch (error) {
      console.error("Error loading time punches:", error);
    }
  };

  // Function to save the hourly rate
  const saveHourlyRate = async () => {
    try {
      await AsyncStorage.setItem("hourlyRate", hourlyRate);
      setIsEditingRate(false); // Exit rate editing mode
      alert("Hourly rate saved successfully.");
    } catch (error) {
      console.error("Error saving hourly rate:", error);
    }
  };

  // Function to handle rate input changes
  const handleRateInputChange = (text) => {
    setHourlyRate(text);
  };

  // Function to handle rate input submission (e.g., Enter key)
  const handleRateInputSubmit = () => {
    saveHourlyRate();
  };

  // Function to toggle selection of a TimePunch entry
  const toggleTimePunchSelection = (item) => {
    const selectedIndex = selectedTimePunches.findIndex((selectedItem) => selectedItem.date === item.date);
    if (selectedIndex === -1) {
      // If not selected, add to the selected list
      setSelectedTimePunches([...selectedTimePunches, item]);
    } else {
      // If already selected, remove from the selected list
      const updatedSelection = [...selectedTimePunches];
      updatedSelection.splice(selectedIndex, 1);
      setSelectedTimePunches(updatedSelection);
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
      {isEditingRate ? (
        <TextInput
          style={styles.input}
          onChangeText={handleRateInputChange}
          value={hourlyRate}
          keyboardType="numeric"
          returnKeyType="done"
          onSubmitEditing={handleRateInputSubmit}
        />
      ) : (
        <>
          <Text>Hourly Rate: ${hourlyRate}</Text>
          <Button title="Set Hourly Rate" onPress={() => setIsEditingRate(true)} />
        </>
      )}
      {/* Display individual time punches */}
      <FlatList
        data={timePunches.filter((item) => item.tags && item.tags.includes("unpaid"))}
        renderItem={({ item }) => (
          <TimePunch
            item={item}
            onSelect={toggleTimePunchSelection}
            isSelected={selectedTimePunches.some((selectedItem) => selectedItem.date === item.date)}
          />
        )}
        keyExtractor={(item, index) => index.toString()}
      />
      {/* Add UI elements to select days */}
      <Button title="Calculate Earnings" onPress={calculateTotalEarnings} />
      {/* Move the "Total Earnings" text above the "Calculate Earnings" button */}
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
  timePunch: {
    marginBottom: 16,
    padding: 8,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
  },
});
