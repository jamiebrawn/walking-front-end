import { List } from "react-native-paper"
import { View, StyleSheet } from "react-native"

export default Disclaimer = () => {
    return (
        <View style={styles.container} >
            <List.Section>
                <List.Item
                    title="Appropriate Equipment"
                    description="Ensure you have suitable gear for the terrain and conditions."
                    left={() => <List.Icon icon="check" />}
                />
                <List.Item
                    title="Weather Check"
                    description="Verify current weather forecasts and conditions before setting out."
                    left={() => <List.Icon icon="check" />}
                />
                <List.Item
                    title="Dogs on Short Lead"
                    description="Keep dogs on a short lead near livestock to prevent distress."
                    left={() => <List.Icon icon="check" />}
                />
                <List.Item
                    title="Countryside Code"
                    description="Adhere to the countryside code and respect local wildlife and surroundings."
                    left={() => <List.Icon icon="check" />}
                />
                <List.Item
                    title="Routes Subject to Change"
                    description="Routes may be altered due to unforeseen circumstances or conditions."
                    left={() => <List.Icon icon="check" />}
                />
                <List.Item
                    title="Livestock Presence"
                    description="Livestock may affect routing; this information may not be available on the route app."
                    left={() => <List.Icon icon="check" />}
                />
                <List.Item
                    title="Personal Risk"
                    description="Follow routes and advice at your own risk. Assess your safety based on current visible conditions."
                    left={() => <List.Icon icon="check" />}
                    descriptionNumberOfLines={3}
                />
            </List.Section>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        padding: 20
    },
})