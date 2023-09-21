import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
      <Button title="Go to Settings" onPress={() => navigation.navigate("Settings")} />
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
});
``;
