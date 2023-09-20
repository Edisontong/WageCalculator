import React from "react";
import { View, Text, Modal, Button, StyleSheet } from "react-native";

const formatElapsedTime = (milliseconds) => {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  return `${hours} hours, ${minutes % 60} minutes`;
};

const EarningsModal = ({ isVisible, closeModal, dateRange, totalElapsedTime, totalEarnings }) => {
  return (
    <Modal transparent={true} visible={isVisible} animationType="slide">
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <View style={styles.closeButtonContainer}>
            <Button title="Close" onPress={closeModal} style={styles.closeButton} />
          </View>
          <View style={styles.modalContent}>
            <Text>Modal Content</Text>
            <Text>{dateRange}</Text>
            <Text>Total Elapsed Time: {formatElapsedTime(totalElapsedTime)}</Text>
            <Text>{totalEarnings}</Text>
            {/* Add your modal content here */}
          </View>
          <Button title="Mark as paid" />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#fff", // Background color of the modal
    padding: 20,
    borderRadius: 10,
    width: "80%", // Adjust the width as needed
  },
  closeButtonContainer: {
    alignSelf: "flex-end", // Align the button to the right
  },
  closeButton: {
    // Add any styles needed for the button
  },
  modalContent: {
    alignItems: "center", // Center the content vertically
  },
});

export default EarningsModal;
