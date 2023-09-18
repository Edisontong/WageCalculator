import React, { useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function HomeScreen({ navigation }) {
  const [clockedIn, setClockedIn] = useState(false);

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
        };
        timePunches.push(newTimePunch);
      }

      // Save updated time punches to AsyncStorage
      await AsyncStorage.setItem("timePunches", JSON.stringify(timePunches));

      // Update the clockedIn state
      setClockedIn(!clockedIn);
    } catch (error) {
      console.error("Error saving time punch:", error);
    }
  };

  return (
    <View style={styles.container}>
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
