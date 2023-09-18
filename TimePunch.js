import React from "react";
import { View, Text, StyleSheet } from "react-native";

const TimePunch = ({ item }) => (
  <View style={styles.timePunch}>
    <Text style={styles.date}>{getFormattedDate(item.date)}</Text>
    <Text>Start Time: {getFormattedTime(item.clockInTime)}</Text>
    {item.clockOutTime && <Text>End Time: {getFormattedTime(item.clockOutTime)}</Text>}
  </View>
);

const styles = StyleSheet.create({
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

export default TimePunch;
