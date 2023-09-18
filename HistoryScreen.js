import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function HistoryScreen() {
  const [timePunches, setTimePunches] = useState([]);

  useEffect(() => {
    // Load the saved time punches from AsyncStorage when the component mounts
    loadTimePunches();
  }, []);

  // Function to load saved time punches from AsyncStorage
  const loadTimePunches = async () => {
    try {
      const savedTimePunches = await AsyncStorage.getItem("timePunches");
      if (savedTimePunches) {
        setTimePunches(JSON.parse(savedTimePunches));
      }
    } catch (error) {
      console.error("Error loading time punches:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>History</Text>
      <FlatList
        data={timePunches}
        renderItem={({ item }) => (
          <View style={styles.timePunch}>
            <Text style={styles.date}>{getFormattedDate(item.date)}</Text>
            <Text>Start Time: {getFormattedTime(item.clockInTime)}</Text>
            {item.clockOutTime && <Text>End Time: {getFormattedTime(item.clockOutTime)}</Text>}
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
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
  timePunch: {
    marginBottom: 16,
    padding: 8,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
  },
  date: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

const getFormattedDate = (dateString) => {
  const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, options);
};

const getFormattedTime = (timeString) => {
  const date = new Date(timeString);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};
