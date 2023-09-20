import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet, FlatList } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import TimePunch from "./TimePunch";
import EarningsModal from "./EarningsModal";

export default function WageCalculatorScreen() {
  const [hourlyRate, setHourlyRate] = useState("");
  const [totalEarnings, setTotalEarnings] = useState("");
  const [isEditingRate, setIsEditingRate] = useState(false);
  const [timePunches, setTimePunches] = useState([]);
  const [selectedTimePunches, setSelectedTimePunches] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalStep, setModalStep] = useState(0);
  const [totalElapsedTime, setTotalElapsedTime] = useState(0);

  useEffect(() => {
    // Load the hourly rate from AsyncStorage when the component mounts
    loadHourlyRate();

    // Load time punches from AsyncStorage
    loadTimePunches();

    calculateTotalEarnings();
  }, [totalElapsedTime, hourlyRate]);

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

  // Function to calculate the date range
  const calculateDateRange = () => {
    if (selectedTimePunches.length === 0) {
      return "No dates selected";
    }

    // Find the minimum and maximum dates among the selected time punches
    const dates = selectedTimePunches.map((timePunch) => new Date(timePunch.date));
    const minDate = new Date(Math.min(...dates));
    const maxDate = new Date(Math.max(...dates));

    // Format the dates as strings
    const startDate = minDate.toLocaleDateString();
    const endDate = maxDate.toLocaleDateString();

    return `Selected Date Range: ${startDate} to ${endDate}`;
  };

  // Function to calculate the total elapsed time
  const calculateTotalElapsedTime = () => {
    let totalElapsedTime = 0;

    // Loop through the selected time punches
    selectedTimePunches.forEach((timePunch) => {
      if (timePunch.clockInTime && timePunch.clockOutTime) {
        const startTime = new Date(timePunch.clockInTime).getTime();
        const endTime = new Date(timePunch.clockOutTime).getTime();
        const elapsedTime = endTime - startTime;
        totalElapsedTime += elapsedTime;
      }
    });

    return totalElapsedTime;
  };

  // Function to calculate total earnings
  const calculateTotalEarnings = () => {
    if (!hourlyRate) {
      setTotalEarnings("Hourly rate not set");
    } else {
      const totalHoursWorked = totalElapsedTime / (60 * 60 * 1000); // Convert milliseconds to hours
      const earnings = totalHoursWorked * parseFloat(hourlyRate);
      setTotalEarnings(`Total Earnings: $${earnings.toFixed(2)}`);
    }
  };

  const markTimePunchesAsPaid = async () => {
    try {
      const updatedTimePunches = [...timePunches]; // Create a copy of time punches
      selectedTimePunches.forEach((selectedItem) => {
        const index = updatedTimePunches.findIndex((item) => item.date === selectedItem.date);
        if (index !== -1) {
          // Update the tags to "paid"
          updatedTimePunches[index].tags = ["paid"];
        }
      });
      // Update the state with the new time punches
      setTimePunches(updatedTimePunches);
      // Save the updated time punches to AsyncStorage
      await AsyncStorage.setItem("timePunches", JSON.stringify(updatedTimePunches));
      // Clear the selected time punches
      setSelectedTimePunches([]);
      alert("Time punches marked as paid successfully.");
    } catch (error) {
      console.error("Error marking time punches as paid:", error);
    }
  };

  const openModal = () => {
    // Calculate the date range
    const dateRange = calculateDateRange();
    const totalElapsedTime = calculateTotalElapsedTime();

    // Perform other calculations as needed
    // For now, we'll only calculate the date range
    calculateTotalEarnings();

    setTotalElapsedTime(totalElapsedTime);
    setIsModalVisible(true);
    setModalStep(1);
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
            isWageCalculatorScreen={true} // Pass this prop
          />
        )}
        keyExtractor={(item, index) => index.toString()}
      />

      <Button title="Calculate Earnings" onPress={openModal} />
      <EarningsModal
        isVisible={isModalVisible}
        dateRange={calculateDateRange()}
        totalElapsedTime={totalElapsedTime} // Pass the total elapsed time to the modal
        totalEarnings={totalEarnings} // Pass the total earnings to the modal
        closeModal={() => setIsModalVisible(false)}
        markTimePunchesAsPaid={markTimePunchesAsPaid}
      />
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
