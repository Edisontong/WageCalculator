import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";

export default function HistoryScreen() {
  const timePunches = [
    { date: "2023-09-01", clockInTime: "09:00 AM", clockOutTime: "05:00 PM" },
    { date: "2023-09-02", clockInTime: "09:15 AM", clockOutTime: "04:45 PM" },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.header}>History</Text>
      <FlatList
        data={timePunches}
        renderItem={({ item }) => (
          <View style={styles.timePunch}>
            <Text>Date: {item.date}</Text>
            <Text>Start Time: {item.clockInTime}</Text>
            <Text>End Time: {item.clockOutTime}</Text>
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
});
