import { StyleSheet } from "react-native";
import { Picker} from "@react-native-picker/picker";

const Dropdown = ({ items, selectedValue, onValueChange }) => {
    return (
            <Picker
                selectedValue={selectedValue}
                onValueChange={onValueChange}
                style={styles.picker}
            >
                <Picker.Item label="Select walk difficulty" />
                {items.map((item, index) => (
                    <Picker.Item
                        label={item.label}
                        value={item.value}
                        key={index}
                        color="black"
                    />
                ))}
            </Picker>
    );
};

export default Dropdown;

const styles = StyleSheet.create({
    picker: {
        height: 40,
        width: "100%",
        paddingHorizontal: 10,
        backgroundColor: "rgb(233, 223, 235)",
        color: "rgb(74, 69, 78)",
    },
});
