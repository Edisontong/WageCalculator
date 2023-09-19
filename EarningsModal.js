import React from "react";
import { View, Text, Modal, Button } from "react-native";

const EarningsModal = ({ isVisible, closeModal }) => {
  return (
    <Modal visible={isVisible} animationType="slide">
      <View>
        {/* Content of the modal */}
        <Text>Modal Content</Text>
        <Button title="Close Modal" onPress={closeModal} />
      </View>
    </Modal>
  );
};

export default EarningsModal;
