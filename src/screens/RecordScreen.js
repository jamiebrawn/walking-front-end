import { useState, useEffect, useRef } from "react";
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

export default RecordScreen = ({setRefreshWalkList}) => {
  const [region, setRegion] = useState(null);
  const [userLocationHistory, setUserLocationHistory] = useState([]);
  const [totalDistance, setTotalDistance] = useState(0);
  const [totalAscent, setTotalAscent] = useState(0);
  const [isTracking, setIsTracking] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentRegion, setCurrentRegion] = useState(null);
  const locationSubscription = useRef(null);
  const mapRef = useRef(null)

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
            altitude: location.coords.altitude.toFixed(2),
          };

          if(currentRegion){
          mapRef.current.animateToRegion({
            ...newLocation,
            latitudeDelta: currentRegion.latitudeDelta,
            longitudeDelta: currentRegion.longitudeDelta,
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
  };

  const handleStop = () => {
    setIsModalVisible(true);
    setIsTracking(false);
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
              onRegionChangeComplete={(region)=> setCurrentRegion(region)}
              style={styles.map}
              initialRegion={region}
              provider={PROVIDER_DEFAULT}
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
              <Polyline
                coordinates={userLocationHistory.map((point) => ({
                  latitude: point.latitude,
                  longitude: point.longitude,
                }))}
                strokeColor="#6750A4"
                strokeWidth={3}
              />
            </MapView>
          )}
        </View>
        <View style={styles.info}>
          <View style={styles.metric}>
            <Icon source="walk" size={30} />
            <Text variant="displaySmall">{totalDistance.toFixed(2)}km</Text>
          </View>
          <View style={styles.metric}>
            <Icon source="slope-uphill" size={30} />
            <Text variant="displaySmall"> {totalAscent.toFixed(2)}m</Text>
          </View>
        </View>
        <Button style={{margin: 10}}
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
  info: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: 10
  },
  metric: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 40, 
  },
});
