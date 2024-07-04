import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Switch,
  TouchableOpacity,
  Platform,
} from "react-native";
import MapView, { Marker, PROVIDER_DEFAULT, UrlTile } from "react-native-maps";
import { useNavigation } from "@react-navigation/native";
import * as Location from "expo-location";
import { getWalks } from "../utils/api";
import WalkCard from "../components/WalkCard";

export default Home = () => {
  const [walks, setWalks] = useState([]);
  const [isMapView, setIsMapView] = useState(true);
  const [region, setRegion] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchWalks = async () => {
      try {
        const walksData = await getWalks();
        setWalks(walksData);
      } catch (error) {
        console.error("Error retrieving walks:", error);
      }
    };
    fetchWalks();
  }, []);

  useEffect(() => {
    const setMap = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== "granted") {
          console.error("Permission to access location was denied");

          if (walks.length > 0) {
            const latitudes = walks.map((walk) => walk.start_latitude);
            const longitudes = walks.map((walk) => walk.start_longitude);
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
      } catch (error) {
        console.error("Error setting map region:", error);
      }
    };

    setMap();
  }, [walks]);

  const toggleView = () => setIsMapView(!isMapView);

  const handleCardPress = (walk) => {
    navigation.navigate("WalkDetails", { walk });
  };

  const handleMarkerPress = (walk) => {
    navigation.navigate("WalkDetails", { walk });
  };

  const tileUrl = "https://tile.openstreetmap.de/{z}/{x}/{y}.png";

  return (
    <View style={styles.container}>
      <View style={styles.toggleContainer}>
        <Text>{isMapView ? "Map View" : "List View"}</Text>
        <Switch value={isMapView} onValueChange={toggleView} />
      </View>
      {isMapView ? (
        region && (
          <MapView
            style={styles.map}
            initialRegion={region}
            // provider={PROVIDER_DEFAULT}
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
            {walks.map((walk) => (
              <Marker
                key={walk.id}
                coordinate={{
                  latitude: walk.start_latitude,
                  longitude: walk.start_longitude,
                }}
                title={walk.title}
                description={walk.description}
                onPress={() => handleMarkerPress(walk)}
              />
            ))}
          </MapView>
        )
      ) : (
        <FlatList
          data={walks}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleCardPress(item)}>
              <WalkCard walk={item} />
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  map: {
    flex: 1,
  },
});
