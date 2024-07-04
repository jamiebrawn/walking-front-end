import { View, Text, StyleSheet } from 'react-native';

const WalkCard = ({ walk }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{walk.title}</Text>
      <Text>{walk.description}</Text>
      <Text>Distance: {walk.distance_km} km</Text>
      <Text>Ascent: {walk.ascent} m</Text>
      <Text>Rating: {walk.rating}</Text>
      <Text>Difficulty: {walk.difficulty}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    marginVertical: 8,
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default WalkCard;
