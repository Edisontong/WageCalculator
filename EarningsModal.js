import React from "react";
import { View, Text, Modal, Button, StyleSheet } from "react-native";

const EarningsModal = ({ isVisible, closeModal }) => {
  return (
    <Modal transparent={true} visible={isVisible} animationType="slide">
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <View style={styles.closeButtonContainer}>
            <Button title="Close" onPress={closeModal} style={styles.closeButton} />
          </View>
          <View style={styles.modalContent}>
            <Text>Modal Content</Text>
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
