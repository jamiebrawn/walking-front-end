import { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import MapView, { Polyline, UrlTile } from "react-native-maps";
import { useRoute } from "@react-navigation/native";
import { getWalkLocationPoints } from "../utils/api";

export default function WalkDetails() {
  const route = useRoute();
  const { walk } = route.params;
  const [locationPoints, setLocationPoints] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [region, setRegion] = useState(null);

  useEffect(() => {
    const getLocationPoints = async () => {
      try {
        const points = await getWalkLocationPoints(walk.id);
        const convertedPointsData = points.map((point) => ({
          ...point,
          latitude: parseFloat(point.latitude),
          longitude: parseFloat(point.longitude),
          altitude: parseFloat(point.altitude),
        }));
        setLocationPoints(convertedPointsData);
      } catch (error) {
        console.error("Error retrieving location points:", error);
      }
      setIsLoading(false);
    };

    getLocationPoints();
  }, [walk.id]);

  useEffect(() => {
    if (locationPoints.length > 0) {
      const latitudes = locationPoints.map((point) => point.latitude);
      const longitudes = locationPoints.map((point) => point.longitude);
      const minLat = Math.min(...latitudes);
      const maxLat = Math.max(...latitudes);
      const minLong = Math.min(...longitudes);
      const maxLong = Math.max(...longitudes);

      setRegion({
        latitude: (minLat + maxLat) / 2,
        longitude: (minLong + maxLong) / 2,
        latitudeDelta: (maxLat - minLat) * 1.2,
        longitudeDelta: (maxLong - minLong) * 1.2,
      });
    }
  }, [locationPoints]);

  const tileUrl = "https://tile.openstreetmap.de/{z}/{x}/{y}.png";

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {region && (
        <MapView
          style={styles.map}
          initialRegion={region}
          showsUserLocation={true}
          showsMyLocationButton={true}
          mapType={Platform.OS == "android" ? "none" : "standard"}
        >
          <UrlTile
            urlTemplate={tileUrl}
            maximumZ={19}
            flipY={false}
            tileSize={256}
          />
          {locationPoints.length > 0 && (
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
      )}
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
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
});
