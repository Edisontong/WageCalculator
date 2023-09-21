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

    // Calculate the total elapsed time when timePunches change
    const newTotalElapsedTime = calculateTotalElapsedTime(timePunches);
    setTotalElapsedTime(newTotalElapsedTime);

    // Calculate total earnings
    const totalEarnings = calculateTotalEarnings(selectedTimePunches);
  }, [timePunches, hourlyRate, selectedTimePunches]);

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
    // Create a copy of the selected time punches array
    const updatedSelection = [...selectedTimePunches];

    const selectedIndex = updatedSelection.findIndex((selectedItem) => selectedItem.date === item.date);

    if (selectedIndex === -1) {
      // If not selected, add to the selected list
      updatedSelection.push(item);
    } else {
      // If already selected, remove from the selected list
      updatedSelection.splice(selectedIndex, 1);
    }

    // Update the selected time punches
    setSelectedTimePunches(updatedSelection);
  };

  // Function to calculate the date range based on selected time punches
  const calculateDateRange = () => {
    try {
      if (!selectedTimePunches || selectedTimePunches.length === 0) {
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
    } catch (error) {
      console.error("Error in calculateDateRange:", error);
      return "Error calculating date range";
    }
  };

  const calculateTotalElapsedTime = () => {
    let totalElapsedTime = 0;

    // Loop through all time punches, but only calculate for selected time punches with the "unpaid" tag
    timePunches.forEach((timePunch) => {
      if (
        selectedTimePunches.some((selectedItem) => selectedItem.date === timePunch.date) &&
        timePunch.tags.includes("unpaid") // Check if the time punch has the "unpaid" tag
      ) {
        const startTime = new Date(timePunch.clockInTime).getTime();
        const endTime = new Date(timePunch.clockOutTime).getTime();
        const elapsedTime = endTime - startTime;

        totalElapsedTime += elapsedTime;
      }
    });

    return totalElapsedTime;
  };

  // Function to calculate total earnings
  const calculateTotalEarnings = async (selectedTimePunches) => {
    return new Promise((resolve) => {
      if (!hourlyRate) {
        setTotalEarnings("Hourly rate not set");
        resolve("Hourly rate not set");
      } else {
        const totalHoursWorked = totalElapsedTime / (60 * 60 * 1000); // Convert milliseconds to hours
        const earnings = totalHoursWorked * parseFloat(hourlyRate);
        setTotalEarnings(`Total Earnings: $${earnings.toFixed(2)}`);
        resolve(`Total Earnings: $${earnings.toFixed(2)}`);
      }
    });
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

      // Clear the selected time punches
      setSelectedTimePunches([]);

      // Save the updated time punches to AsyncStorage
      await AsyncStorage.setItem("timePunches", JSON.stringify(updatedTimePunches));

      alert("Time punches marked as paid successfully.");
    } catch (error) {
      console.error("Error marking time punches as paid:", error);
    }
  };

  const openModal = async () => {
    // Calculate the date range
    const dateRange = calculateDateRange(selectedTimePunches);

    // Calculate totalElapsedTime based on the selected time punches
    const totalElapsedTime = calculateTotalElapsedTime(selectedTimePunches);

    // Calculate total earnings
    const totalEarnings = await calculateTotalEarnings(selectedTimePunches);

    // Set isModalVisible to true first
    setIsModalVisible(true);
    setModalStep(1);

    // Set totalElapsedTime and totalEarnings
    setTotalElapsedTime(totalElapsedTime);
    setTotalEarnings(totalEarnings);
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
            isWageCalculatorScreen={true}
          />
        )}
        keyExtractor={(item, index) => item.date}
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
});
