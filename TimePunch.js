import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const TimePunch = ({ item, onSelect, isSelected, isWageCalculatorScreen }) => {
  const [isChecked, setIsChecked] = useState(isSelected);

  const toggleCheckbox = () => {
    setIsChecked(!isChecked);
    onSelect(item, !isChecked); // Pass the selected item and the new checked state to the parent
  };

  return (
    <TouchableOpacity onPress={isWageCalculatorScreen ? toggleCheckbox : null}>
      <View style={styles.timePunch}>
        <View style={styles.timePunchDetails}>
          <Text style={styles.date}>{getFormattedDate(item.date)}</Text>
          <Text>Start Time: {getFormattedTime(item.clockInTime)}</Text>
          {item.clockOutTime && <Text>End Time: {getFormattedTime(item.clockOutTime)}</Text>}
        </View>
        {isWageCalculatorScreen && ( // Conditionally render the checkboxes
          <View style={styles.checkboxContainer}>
            {isChecked && <MaterialIcons name="check-box" size={24} color="#007bff" />}
            {!isChecked && <MaterialIcons name="check-box-outline-blank" size={24} color="#007bff" />}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  timePunch: {
    flexDirection: "row", // Align the checkbox and details horizontally
    alignItems: "center", // Center vertically
    marginBottom: 16,
    padding: 8,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
  },
  checkboxContainer: {
    marginRight: 10, // Add some spacing between the checkbox and details
  },
  timePunchDetails: {
    flex: 1, // Take remaining horizontal space
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
