import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Switch,
  TouchableOpacity,
  Platform,
  Dimensions,
  Modal,
  Animated,
} from "react-native";
import { IconButton, ActivityIndicator } from "react-native-paper";
import MapView, { Marker, UrlTile } from "react-native-maps";
import { useNavigation } from "@react-navigation/native";
import * as Location from "expo-location";
import { getWalks } from "../utils/api";
import WalkCard from "../components/WalkCard";

export default Home = (refreshWalkList, setRefreshWalkList) => {
  const [walks, setWalks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mapReady, setMapReady] = useState(true);
  const [isMapView, setIsMapView] = useState(true);
  const [region, setRegion] = useState(null);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const navigation = useNavigation();
  const windowHeight = Dimensions.get("window").height;
  const [slideAnim] = useState(new Animated.Value(-windowHeight * 0.5));

  useEffect(() => {
    const fetchWalks = async () => {
      try {
        const walksData = await getWalks();
        const convertedWalksData = walksData.map((walk) => ({
          ...walk,
          distance_km: parseFloat(walk.distance_km),
          ascent: parseFloat(walk.ascent),
          start_latitude: parseFloat(walk.start_latitude),
          start_longitude: parseFloat(walk.start_longitude),
          start_altitude: parseFloat(walk.start_altitude),
        }));
        setWalks(convertedWalksData);
      } catch (error) {
        console.error("Error retrieving walks:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchWalks();
  }, [refreshWalkList]);

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
    navigation.navigate("WalkDetails", { walk, setRefreshWalkList });
  };

  const handleMarkerPress = (walk) => {
    navigation.navigate("WalkDetails", { walk, setRefreshWalkList });
  };

  const toggleOpenBottomSheet = () => {
    if (isBottomSheetOpen) {
      Animated.timing(slideAnim, {
        toValue: -windowHeight * 0.5,
        duration: 300,
        useNativeDriver: false,
      }).start(() => setIsBottomSheetOpen(false));
    } else {
      setIsBottomSheetOpen(true);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  };

  const tileUrl = "https://tile.openstreetmap.de/{z}/{x}/{y}.png";

  return (
    <View style={styles.container}>
      <View style={styles.optionsContainer}>
        <IconButton icon="tune-variant" onPress={toggleOpenBottomSheet} />
        <View style={styles.toggleContainer}>
          <Text>{isMapView ? "Map View" : "List View"}</Text>
          <Switch value={isMapView} onValueChange={toggleView} />
        </View>
      </View>
      <Modal
        animationType="none"
        transparent={true}
        visible={isBottomSheetOpen}
        onRequestClose={toggleOpenBottomSheet}
      >
        <Animated.View
          style={[
            styles.bottomSheet,
            { height: windowHeight * 0.5, top: slideAnim },
          ]}
        >
          <View style={styles.sliderIconContainer}>
            <IconButton icon="tune-variant" onPress={toggleOpenBottomSheet} />
          </View>
          <View style={styles.bottomSheetContent}>
            <Text>I hope you can see me</Text>
          </View>
        </Animated.View>
      </Modal>

      {isLoading && <ActivityIndicator style={styles.centre} size="large" />}
      {isMapView ? (
        region && (
          <MapView
            style={styles.map}
            initialRegion={region}
            showsUserLocation={true}
            showsMyLocationButton={true}
            mapType={Platform.OS == "android" ? "none" : "standard"}
            onLayout={() => setMapReady(false)}
          >
            <UrlTile
              urlTemplate={tileUrl}
              maximumZ={19}
              flipY={false}
              tileSize={256}
            />
            {walks &&
              walks.map((walk) => (
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
  optionsContainer: {
    marginTop: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  map: {
    flex: 15,
  },
  centre: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignSelf: "center",
  },
  bottomSheet: {
    position: "absolute",
    left: 0,
    right: 0,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "white",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    // paddingVertical: 23,
    paddingHorizontal: 10,
    // borderWidth: 1,
    // borderColor: "red",
  },
  sliderIconContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "start",
    alignItems: "center",
  },
  bottomSheetContent: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center"
  },
});
