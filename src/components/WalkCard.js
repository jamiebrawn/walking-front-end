import { View, StyleSheet } from "react-native";
import { Text, Icon, Card } from "react-native-paper";

const WalkCard = ({ walk }) => {
  return (
    <Card variant="elevated" style={styles.card}>
      <Text variant="headlineMedium" style={{textAlign: "center"}} >{walk.title}</Text>
      <Text variant="bodyLarge" style={{textAlign: "center"}} >{walk.description}</Text>
      <View style={styles.centredMetrics}>
                    <View style={styles.centredRow}>
                        <Icon source="walk" size={24} />
                        <Text variant="bodyMedium">
                            Distance: {walk.distance_km}km
                        </Text>
                    </View>
                    <View style={styles.centredRow}>
                        <Icon source="slope-uphill" size={24} />
                        <Text variant="bodyMedium"> Ascent: {walk.ascent > 0 ? walk.ascent.toFixed(2) : walk.ascent}m</Text>
                    </View>
                </View>
      {walk.rating && <Text>Rating: {walk.rating}</Text>}
      {walk.difficulty && (
        <View style={styles.centredRow}>
          <Icon source="speedometer-slow" size={24} />
          <Text> Difficulty: {walk.difficulty}/10</Text>
        </View>
        )}
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    margin: 8,
    backgroundColor: "white",
    borderRadius: 8,
  },
  centredRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
},
centredMetrics: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingVertical: 5
},
});

export default WalkCard;
