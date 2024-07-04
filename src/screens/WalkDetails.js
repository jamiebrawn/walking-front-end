import { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import MapView, { Polyline } from "react-native-maps";
import { useRoute } from "@react-navigation/native";
import { getWalkLocationPoints } from "../utils/api";

export default function WalkDetails() {
  const route = useRoute();
  const { walk } = route.params;
  const [locationPoints, setLocationPoints] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getLocationPoints = async () => {
      try {
        const points = await getWalkLocationPoints(walk.id);
        setLocationPoints(points);
      } catch (error) {
        console.error("Error retreiving location points:", error);
      }
      setIsLoading(false);
    };

    getLocationPoints();
  }, [walk.id]);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView style={styles.map}>
        {coordinates.length > 0 && (
          <Polyline
            coordinates={locationPoints.map((point) => ({
              latitude: point.latitude,
              longitude: point.longitude,
            }))}
            strokeColor="#FF0000"
            strokeWidth={2}
          />
        )}
      </MapView>
      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{walk.title}</Text>
        <Text>{walk.description}</Text>
        <Text>Distance: {walk.distance_km} km</Text>
        <Text>Ascent: {walk.ascent} m</Text>
        <Text>Rating: {walk.rating}</Text>
        <Text>Difficulty: {walk.difficulty}</Text>
        <Text>Start Latitude: {walk.start_latitude}</Text>
        <Text>Start Longitude: {walk.start_longitude}</Text>
        <Text>Start Altitude: {walk.start_altitude} m</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  map: {
    flex: 1,
  },
  detailsContainer: {
    flex: 1,
  },
});
