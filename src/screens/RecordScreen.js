import { useState, useEffect, useRef } from "react";
import MapView, {
  PROVIDER_DEFAULT,
  UrlTile,
  Polyline,
} from "react-native-maps";
import * as Location from "expo-location";
import { StyleSheet, View } from "react-native";
import { Portal, Modal, Text, Button, Icon } from "react-native-paper";
import haversine from "haversine-distance";

export default RecordScreen = () => {
  const [region, setRegion] = useState(null);
  const [userLocationHistory, setUserLocationHistory] = useState([]);
  const [totalDistance, setTotalDistance] = useState(0);
  const [totalAscent, setTotalAscent] = useState(0);
  const [isTracking, setIsTracking] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const locationSubscription = useRef(null);
  const containerStyle = { backgroundColor: "white", padding: 20 };

  useEffect(() => {
    setIsLoading(true);

    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.error("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});

      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
        altitude: location.coords.altitude || 0,
      });

      setIsLoading(false);
    })();
  }, []);

  const startLocationTracking = async () => {
    try {
      // Get initial location
      let location = await Location.getCurrentPositionAsync({});
      const initialLocation = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        altitude: location.coords.altitude,
      };
      setUserLocationHistory([initialLocation]);
      console.log("Initial location:", initialLocation);

      // Watch for location updates
      locationSubscription.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          distanceInterval: 10,
          timeInterval: 10000,
        },
        (location) => {
          const newLocation = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            altitude: location.coords.altitude,
          };

          // Check for significant changes in location before updating
          setUserLocationHistory((prev) => {
            const lastLocation = prev[prev.length - 1];
            const distanceMoved = haversine(lastLocation, newLocation);
            let ascent = 0;

            if (newLocation.altitude > lastLocation.altitude) {
              ascent = newLocation.altitude - lastLocation.altitude;
            }

            // Only update if the user has moved significantly
            if (distanceMoved > 0.0001) {
              const updatedHistory = [...prev, newLocation];
              console.log("Updated user location history:", updatedHistory);
              setTotalDistance(
                (previousDistance) => previousDistance + distanceMoved
              );
              setTotalAscent((previousAscent) => previousAscent + ascent);
              return updatedHistory;
            } else {
              return prev;
            }
          });
        }
      );
    } catch (error) {
      console.error("Error in location tracking:", error);
    }
  };

  const handleStart = () => {
    startLocationTracking();
    setIsTracking(true);
  };

  const handleStop = () => {
    setIsModalVisible(true);
    setIsTracking(false);
  };

  const tileUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

  return (
    <>
      <Portal>
        <Modal
          visible={isModalVisible}
          onDismiss={() => setIsModalVisible(false)}
          contentContainerStyle={containerStyle}
        >
          <Text>Example Modal. Click outside this area to dismiss.</Text>
        </Modal>
      </Portal>
      <View style={styles.container}>
        <View style={styles.mapContainer}>
          {region && (
            <MapView
              style={styles.map}
              initialRegion={region}
              provider={PROVIDER_DEFAULT}
              showsUserLocation={true}
              showsMyLocationButton={true}
            >
              <UrlTile
                urlTemplate={tileUrl}
                maximumZ={19}
                flipY={false}
                tileSize={256}
              />
              <Polyline
                coordinates={userLocationHistory.map((point) => ({
                  latitude: point.latitude,
                  longitude: point.longitude,
                }))}
                strokeColor="#FF0000"
                strokeWidth={2}
              />
            </MapView>
          )}
        </View>
        <View style={styles.info}>
          <View style={styles.metric}>
            <Icon source="walk" size={30} />
            <Text variant="displaySmall">
              {(totalDistance / 1000).toFixed(2)}km
              {/* {totalDistance.toFixed(2)}m */}
            </Text>
          </View>
          <View style={styles.metric}>
            <Icon source="slope-uphill" size={30} />
            <Text variant="displaySmall">{totalAscent.toFixed(2)}m</Text>
          </View>
        </View>
        <Button
          mode="contained"
          onPress={!isTracking ? handleStart : handleStop}
        >
          {!isTracking ? "Start Tracking" : "Stop Tracking"}
        </Button>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapContainer: {
    flex: 19,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  info: {
    backgroundColor: "white",
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-evenly",
    // alignItems: "center",
  },
  metric: {
    flexDirection: "row",
    alignItems: "center",
  },
});
