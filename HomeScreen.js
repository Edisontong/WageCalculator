import React, { useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";

export default function HomeScreen({ navigation }) {
  const [clockedIn, setClockedIn] = useState(false);

  const handleClockInOut = () => {
    setClockedIn(!clockedIn);
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
