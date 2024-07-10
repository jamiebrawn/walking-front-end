import React, { useState, useEffect, useRef } from "react";
import MapView, {
  PROVIDER_DEFAULT,
  UrlTile,
  Polyline,
} from "react-native-maps";
import * as Location from "expo-location";
import { StyleSheet, View, Platform } from "react-native";
import { Text, Button, Icon } from "react-native-paper";
import haversine from "haversine-distance";
import UploadModal from "../components/UploadModal";
import Constants from 'expo-constants';

const RecordScreen = ({ setRefreshWalkList }) => {
  const [region, setRegion] = useState(null);
  const [userLocationHistory, setUserLocationHistory] = useState([]);
  const [totalDistance, setTotalDistance] = useState(0);
  const [totalAscent, setTotalAscent] = useState(0);
  const [isTracking, setIsTracking] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentRegion, setCurrentRegion] = useState(null);
  const userHasInteractedRef = useRef(false); 
  const locationSubscription = useRef(null);
  const mapRef = useRef(null);

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
        altitude: location.coords.altitude.toFixed(2),
      };
      setUserLocationHistory([initialLocation]);
      console.log("Initial location:", initialLocation);

      mapRef.current.animateToRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });

      // Watch for location updates
      locationSubscription.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          distanceInterval: 10,
          timeInterval: 10000,
        },
        (location) => {
          console.log("new location, has user interacted status:", userHasInteractedRef.current);
          const newLocation = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            altitude: location.coords.altitude.toFixed(2),
          };

          if (!userHasInteractedRef.current) {
            console.log("animate to region, has user interacted status:", userHasInteractedRef.current);
            mapRef.current.animateToRegion({
              ...newLocation,
              latitudeDelta: currentRegion ? currentRegion.latitudeDelta : 0.01,
              longitudeDelta: currentRegion ? currentRegion.longitudeDelta : 0.01,
            });
          }

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
                (previousDistance) => previousDistance + distanceMoved / 1000
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
    userHasInteractedRef.current = false; 
  };

  const handleStop = () => {
    setIsModalVisible(true);
    setIsTracking(false);
  };

  const handleUserInteraction = (gesture) => {
    if (gesture && gesture.isGesture) {
      userHasInteractedRef.current = true; 
      console.log("handleUserInteraction thrown. has user interacted status:", userHasInteractedRef.current);
    }
  };

  const handleCurrentPositionButtonPress = async () => {
    console.log("handleCurrentPositionButtonPress thrown");
    const location = await Location.getCurrentPositionAsync({});
    const userRegion = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: currentRegion ? currentRegion.latitudeDelta : 0.01,
      longitudeDelta: currentRegion ? currentRegion.longitudeDelta : 0.01,
    };
    mapRef.current.animateToRegion(userRegion);
    userHasInteractedRef.current = false; 
  };

  const tileUrl = "https://tile.openstreetmap.de/{z}/{x}/{y}.png";

  return (
    <>
      <UploadModal
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        userLocationHistory={userLocationHistory}
        totalDistance={totalDistance}
        totalAscent={totalAscent}
        setUserLocationHistory={setUserLocationHistory}
        setTotalDistance={setTotalDistance}
        setTotalAscent={setTotalAscent}
        setRefreshWalkList={setRefreshWalkList}
      />
      <View style={styles.container}>
        <View style={styles.mapContainer}>
          {region && (
            <MapView
              ref={mapRef}
              onRegionChangeComplete={(region, gesture) => {
                setCurrentRegion(region);
                handleUserInteraction(gesture);
              }}
              style={styles.map}
              initialRegion={region}
              provider={PROVIDER_DEFAULT}
              showsUserLocation={true}
              showsMyLocationButton={false}
              mapType={Platform.OS == "android" ? "none" : "standard"}
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
          <Button
            icon="crosshairs-gps"
            mode={!userHasInteractedRef.current ? "contained" : "contained-tonal"}
            style={styles.currentPositionButton}
            onPress={handleCurrentPositionButtonPress}
          >
            Current Position
          </Button>
        </View>
        <View style={styles.info}>
          <View style={styles.metric}>
            <Icon source="walk" size={30} />
            <Text variant="displaySmall">{totalDistance.toFixed(2)}km</Text>
          </View>
          <View style={styles.metric}>
            <Icon source="slope-uphill" size={30} />
            <Text variant="displaySmall">{totalAscent.toFixed(2)}m</Text>
          </View>
        </View>
        <Button
          mode={"contained"}
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
    marginTop: Constants.statusBarHeight,
  },
  mapContainer: {
    flex: 19,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  currentPositionButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    zIndex: 10,
  },
  info: {
    backgroundColor: "white",
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  metric: {
    flexDirection: "row",
    alignItems: "center",
  },
});

export default RecordScreen;
