import { Portal, Modal, Text, TextInput, Button } from "react-native-paper";
import { StyleSheet, View } from "react-native";
import { useState, useEffect } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import Dropdown from "./form-components/DropDown";
import { addWalk } from "../utils/api";
import { validateTextInputContent, validateTextInputLength } from "../utils/formValidations";
import { useAuth } from "../contexts/AuthContext";

export default UploadModal = ({
    isModalVisible,
    setIsModalVisible,
    userLocationHistory,
    totalDistance,
    totalAscent,
    setUserLocationHistory,
    setTotalDistance,
    setTotalAscent,
    setRefreshWalkList,
}) => {
    const [formData, setFormData] = useState({
        walkTitle: "",
        walkDescription: "",
        selectedDifficulty: null,
    });
    const [confirmDiscard, setConfirmDiscard] = useState(false);
    const [uploadedWalk, setUploadedWalk] = useState(null);
    const [formErrors, setFormErrors] = useState({});
    const [uploadError, setUploadError] = useState(null);
    const [isUploading, setIsUploading] = useState(false)
    const { user } = useAuth();


    useEffect(() => {
        if (!isModalVisible) {
            setConfirmDiscard(false);
        }
    }, [isModalVisible]);

    const difficulties = [
        { label: "Easy", value: "easy" },
        { label: "Moderate", value: "moderate" },
        { label: "Challenging", value: "challenging" },
    ];

    const handleSave = () => {
        setIsUploading(true)

        let errors = {};

        if (!validateTextInputContent(formData.walkTitle)) {
            errors.walkTitle = "Walk title must contain letters.";
            setIsUploading(false)
        } else if (!validateTextInputLength(formData.walkTitle, 3, 30)) {
            errors.walkTitle = "Walk title must be between 3 and 30 characters.";
            setIsUploading(false)
        }

        if (!validateTextInputLength(formData.walkDescription, 5, 255)) {
            errors.walkDescription = "Walk description must be between 5 and 255 characters.";
            setIsUploading(false)
        }

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        const difficultyToNumber = (input) => {
            if (input === 'easy') return 2
            if (input === 'moderate') return 5
            if (input === 'challenging') return 8
        }

        const difficultyAsNum = difficultyToNumber(formData.selectedDifficulty) || null;

        const walkObject = {
            walk: {
                creator_id: user.id, //Hardcoded for now but ultimately will need to use logged in users id
                title: formData.walkTitle,
                description: formData.walkDescription,
                distance_km: totalDistance,
                ascent: totalAscent,
                difficulty: difficultyAsNum,
                start_latitude: userLocationHistory[0].latitude,
                start_longitude: userLocationHistory[0].longitude,
                start_altitude: userLocationHistory[0].altitude,
            },
            locations: userLocationHistory,
            // ^^Above is the correct code - below is hardcoded walk object for testing to avoid leaking our personal location data.
        //     walk: {
        //         creator_id: 1, 
        //         title: formData.walkTitle,
        //         description: formData.walkDescription,
        //     distance_km: 18,
        //         ascent: 900,
        //         difficulty: difficultyAsNum,
        //         start_latitude: 53.52989,
        //         start_longitude: -2.02364,
        //         start_altitude: 242,
        //     },
        //     locations: [
        //         {"latitude": 53.52989, "longitude": -2.02364, "altitude": 123 },
        //         {"latitude": 53.52986, "longitude": -2.02364, "altitude": 123 },
        //         {"latitude": 53.52962, "longitude": -2.02399, "altitude": 123 },
        //         {"latitude": 53.52949, "longitude": -2.02431, "altitude": 123 },
        //         {"latitude": 53.52931, "longitude": -2.02443, "altitude": 123 },
        //         {"latitude": 53.52926, "longitude": -2.02453, "altitude": 123 },
        //         {"latitude": 53.52923, "longitude": -2.02462, "altitude": 123 },
        //         {"latitude": 53.5285, "longitude": -2.02483, "altitude": 123 },
        //         {"latitude": 53.52849, "longitude": -2.02479, "altitude": 123 },
        //         {"latitude": 53.52838, "longitude": -2.02433, "altitude": 123 },
        //         {"latitude": 53.5284, "longitude": -2.02422, "altitude": 123 },
        //         {"latitude": 53.52848, "longitude": -2.02398, "altitude": 123 },
        //         {"latitude": 53.5284, "longitude": -2.02334, "altitude": 123 }
        //     ],
        };
        addWalk(walkObject).then((addedWalk) => {
            const { walk } = addedWalk;
            setUploadedWalk(walk);
            setIsUploading(false)
            setUploadError(null);
            setUserLocationHistory([]);
            setTotalDistance(0);
            setTotalAscent(0);
            
        })
        .catch((error) => {
            console.log('Error uploading walk: ', error)
            setUploadError("Unable to upload walk, please try again");
        })
        .finally(() => {
            if (uploadedWalk){
                setRefreshWalkList((prev) => !prev);
            }
        });
    };

    const handleDiscard = () => {
        setConfirmDiscard(true);
    };

    const handleCancelDiscard = () => {
        setConfirmDiscard(false);
    };

    const handleConfirmDiscard = () => {
        setTotalDistance(0);
        setTotalAscent(0);
        setUserLocationHistory([]);
        setFormData({
            walkTitle: "",
            walkDescription: "",
            selectedDifficulty: null,
        });
        setIsModalVisible(false);
        setUploadError(null)
    };

    const handleClose = () => {
        setIsModalVisible(false);
        setUserLocationHistory([]);
        setFormData({
            walkTitle: "",
            walkDescription: "",
            selectedDifficulty: null,
        });
    };

    const handleInputChange = (field, value) => {
        setIsUploading(false)
        setFormData({
            ...formData,
            [field]: value,
        });

        if (formErrors[field]) {
            setFormErrors({
                ...formErrors,
                [field]: "",
            });
        }
    };

    return (
        <Portal>
            <Modal
                visible={isModalVisible}
                onDismiss={() => setIsModalVisible(false)}
                contentContainerStyle={styles.modal}
            >
                {uploadedWalk ? (
                    <View style={styles.successContainer}>
                        <Text variant="headlineLarge">Success!</Text>
                        <Text style={styles.centeredText}>
                            Your walk "{uploadedWalk.title}" has been uploaded.
                        </Text>
                        <Button
                        onPress={handleClose}
                        mode="contained"
                        style={styles.button}
                        accessibilityLabel="Close"
                        >Close</Button>
                    </View>
                ) : (
                    <>
                        <View style={styles.title}>
                            <Text variant="headlineLarge">
                                Upload your walk
                            </Text>
                            <Ionicons
                                name="footsteps-outline"
                                size={36}
                                style={{ marginVertical: 5 }}
                            />
                            <Text
                                variant="titleMedium"
                                style={styles.centeredText}
                            >
                                Let others follow in your footsteps...upload
                                your walk to share it with the world!
                            </Text>
                        </View>
                        <TextInput
                            label="Walk title"
                            value={formData.walkTitle}
                            onChangeText={(text) => handleInputChange("walkTitle", text)}
                            style={styles.formInput}
                            accessibilityLabel="Walk title"
                        />
                        {formErrors.walkTitle && (
                            <Text style={styles.errorText}>
                                {formErrors.walkTitle}
                            </Text>
                        )}
                        <TextInput
                            label="Walk description"
                            multiline={true}
                            value={formData.walkDescription}
                            onChangeText={(text) => handleInputChange("walkDescription", text)}
                            style={styles.formInput}
                            accessibilityLabel="Walk description"
                        />
                        {formErrors.walkDescription && (
                            <Text style={styles.errorText}>
                                {formErrors.walkDescription}
                            </Text>
                        )}
                        <Dropdown
                            items={difficulties}
                            selectedValue={formData.selectedDifficulty}
                            onValueChange={(itemValue) =>
                                setFormData({
                                    ...formData,
                                    selectedDifficulty: itemValue,
                                })
                            }
                            style={styles.formInput}
                            accessibilityLabel="Select walk difficulty"
                        />
                        {!confirmDiscard ? (
                            <View>
                                {uploadError && (
                                    <Text style={styles.warningText}>{uploadError}</Text>
                                )}                            
                                <View style={styles.buttonContainer}>
                                    <Button
                                        onPress={handleSave}
                                        mode="contained"
                                        style={styles.button}
                                        accessibilityLabel="Upload walk"
                                        disabled={isUploading ? true : false}
                                    >
                                        {isUploading ? "Uploading..." : "Upload"}
                                    </Button>
                                    <Button
                                        onPress={handleDiscard}
                                        mode="contained-tonal"
                                        style={styles.button}
                                        accessibilityLabel="Discard walk"
                                    >
                                        Discard
                                    </Button>
                                </View>
                            </View>
                        ) : (
                            <>
                                <Text style={styles.warningText}>
                                    Are you sure you want to discard your route?
                                </Text>
                                <View style={styles.buttonContainer}>
                                    <Button
                                        onPress={handleConfirmDiscard}
                                        mode="contained-tonal"
                                        style={styles.button}
                                        accessibilityLabel="Confirm discard"
                                    >
                                        Confirm Discard
                                    </Button>
                                    <Button
                                        onPress={handleCancelDiscard}
                                        mode="contained"
                                        style={styles.button}
                                        accessibilityLabel="Cancel discard"
                                    >
                                        Cancel Discard
                                    </Button>
                                </View>
                            </>
                        )}
                    </>
                )}
            </Modal>
        </Portal>
    );
};

const styles = StyleSheet.create({
    modal: {
        backgroundColor: "white",
        padding: 20,
    },
    formInput: {
        marginBottom: 5,
    },
    centeredText: {
        textAlign: "center",
        marginVertical: 5,
    },
    title: {
        alignItems: "center",
        justifyContent: "center",
    },
    errorText: {
        color: "red",
        marginBottom: 5,
    },
    warningText: {
        textAlign: "center",
        marginVertical: 5,
        color: "red",
    },
    button: {
        marginHorizontal: 5,
        minWidth: 100,
    },
    buttonContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 5,
    },
    successContainer: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 20,
    },
    linkText: {
        color: "blue",
        textDecorationLine: "underline",
        marginTop: 10,
    },
});
