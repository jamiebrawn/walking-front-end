import { useState, useEffect, useRef } from "react";
import MapView, { PROVIDER_DEFAULT, UrlTile } from "react-native-maps";
import * as Location from "expo-location";
import { StyleSheet, View, Dimensions } from "react-native";
import { Text, Button } from "react-native-paper";

export default RecordScreen = () => {
  const [onRouteUpdate, setOnRouteUpdate] = useState();
  const [region, setRegion] = useState(null);
  const [userLocationHistory, setUserLocationHistory] = useState([]);
  const [isTracking, setIsTracking] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const locationSubscription = useRef(null);
  const isMounted = useRef(true);

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
        // let { status } = await Location.requestForegroundPermissionsAsync();
        // if (status !== "granted") {
        //   throw new Error("Permission to access location was denied");
        // }

        // Get initial location
        let location = await Location.getCurrentPositionAsync({});
        const initialLocation = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
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
            };

            // Check for significant changes in location before updating
            setUserLocationHistory((prev) => {
              const lastLocation = prev[prev.length - 1];
              const distanceMoved = Math.sqrt(
                Math.pow(newLocation.latitude - lastLocation.latitude, 2) +
                  Math.pow(newLocation.longitude - lastLocation.longitude, 2)
              );

              // Only update if the user has moved significantly
              if (distanceMoved > 0.0001) {
                const updatedHistory = [...prev, newLocation];
                console.log("Updated user location history:", updatedHistory);
                if (isMounted.current && typeof onRouteUpdate === "function") {
                  onRouteUpdate(updatedHistory);
                }
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

    const handlePress = () => {
      startLocationTracking();
    }

    // if (!locationSubscription.current) {
    //   startLocationTracking();
    // }



    // return () => {
    //   isMounted.current = false;
    //   if (locationSubscription.current) {
    //     locationSubscription.current.remove();
    //     locationSubscription.current = null;
    //   }
    // };

  const tileUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

  return (
    <>
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
            </MapView>
          )}
        </View>
        <View style={styles.info}>
          <Text variant="displaySmall">0.2km</Text>
          <Text variant="displaySmall">{!isLoading && region.altitude}</Text>
        </View>
        <Button mode="contained" onPress={handlePress}>
          Press me
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
    // alignItems: "center",
  },
});
