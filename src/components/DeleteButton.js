import { useState } from "react";
import { Text, Button, IconButton, Modal, Portal } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { deleteWalk } from "../utils/api";
import { View, StyleSheet } from "react-native";

export default DeleteButton = ({ walkId }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(false);
  const navigation = useNavigation();

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteWalk(walkId);
      navigation.goBack();
    } catch (error) {
      console.error("Error deleting walk:", error);
      throw error;
    } finally {
      setIsDeleting(false);
    }
  };

  const confirmDelete = () => {
    setIsModalVisible(false);
    handleDelete();
  };

  return (
    <View>
      <IconButton icon="delete" onPress={() => setIsModalVisible(true)} />
      <Portal>
        <Modal
          visible={isModalVisible}
          onDismiss={() => setIsModalVisible(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <Text style={styles.modalText}>
            Are you sure you want to delete this walk?
          </Text>
          <View style={styles.buttonRow}>
            <Button
              mode="outlined"
              onPress={confirmDelete}
              loading={isDeleting}
              disabled={isDeleting}
              style={styles.button}
            >
              Delete
            </Button>
            <Button
              mode="contained"
              onPress={() => setIsModalVisible(false)}
              style={styles.button}
            >
              Cancel
            </Button>
          </View>
          {deleteError && (
            <Text style={styles.errorText}>
              Error deleting walk. Please try again.
            </Text>
          )}
        </Modal>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    margin: 20,
    borderRadius: 10,
  },
  modalText: {
    fontSize: 18,
    // textAlign: "center",
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  button: {
    marginHorizontal: 10,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 10,
  },
});
