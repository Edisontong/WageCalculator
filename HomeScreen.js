import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AntDesign } from "@expo/vector-icons"; // Import icons from Expo

export default function HomeScreen({ navigation }) {
  const [clockedIn, setClockedIn] = useState(false);

  useEffect(() => {
    // Load the clockedIn state from AsyncStorage when the component mounts
    loadClockedInState();
  }, []);

  // Function to load clockedIn state from AsyncStorage
  const loadClockedInState = async () => {
    try {
      const storedClockedIn = await AsyncStorage.getItem("clockedIn");
      if (storedClockedIn !== null) {
        setClockedIn(storedClockedIn === "true");
      }
    } catch (error) {
      console.error("Error loading clockedIn state:", error);
    }
  };

  // Function to handle clock in/out
  const handleClockInOut = async () => {
    const currentTime = new Date();
    let timePunches = [];

    try {
      // Load existing time punches from AsyncStorage
      const existingTimePunches = await AsyncStorage.getItem("timePunches");

      if (existingTimePunches) {
        timePunches = JSON.parse(existingTimePunches);
      }

      if (clockedIn) {
        // Clocking out, update the last time punch with clockOutTime
        const lastTimePunch = timePunches.pop();
        lastTimePunch.clockOutTime = currentTime.toISOString();
        timePunches.push(lastTimePunch);
      } else {
        // Clocking in, add a new time punch
        const newTimePunch = {
          date: currentTime.toISOString(),
          clockInTime: currentTime.toISOString(),
          clockOutTime: "",
          tags: ["unpaid"], // Add the "unpaid" tag when clocking in
        };
        timePunches.push(newTimePunch);
      }

      console.log(timePunches);

      // Save updated time punches to AsyncStorage
      await AsyncStorage.setItem("timePunches", JSON.stringify(timePunches));

      // Toggle clockedIn state and save it to AsyncStorage
      const updatedClockedIn = !clockedIn;
      await AsyncStorage.setItem("clockedIn", updatedClockedIn.toString());
      setClockedIn(updatedClockedIn);
    } catch (error) {
      console.error("Error saving time punch or clockedIn state:", error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.settingsButton} onPress={() => navigation.navigate("Settings")}>
        <AntDesign name="setting" size={24} color="black" />
      </TouchableOpacity>
      <Text>{clockedIn ? "You are clocked in." : "You are clocked out."}</Text>
      <Button title={clockedIn ? "Clock Out" : "Clock In"} onPress={handleClockInOut} />
      <Button title="View History" onPress={() => navigation.navigate("History")} />
      <Button title="Wage Calculator" onPress={() => navigation.navigate("WageCalculator")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  settingsButton: {
    position: "absolute",
    top: 16, // Adjust this value to position the button vertically
    right: 16, // Adjust this value to position the button horizontally
    zIndex: 1, // Ensure the button appears above other content
    backgroundColor: "white", // Background color of the button
    borderRadius: 20, // Border radius for a circular button
    padding: 10, // Padding for the button
    elevation: 3, // Add elevation to create a shadow effect (Android)
    shadowColor: "#000", // Shadow color (iOS)
    shadowOffset: { width: 0, height: 2 }, // Shadow offset (iOS)
    shadowOpacity: 0.2, // Shadow opacity (iOS)
    shadowRadius: 2, // Shadow radius (iOS)
  },
});
