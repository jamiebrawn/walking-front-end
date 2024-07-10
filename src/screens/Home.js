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
  Animated,
  Button
} from "react-native";
import { IconButton, ActivityIndicator, Button as PaperButton } from "react-native-paper";
import MapView, { Marker, UrlTile, Callout } from "react-native-maps";
import { useNavigation } from "@react-navigation/native";
import * as Location from "expo-location";
import Constants from 'expo-constants';
import { getWalks } from "../utils/api";
import WalkCard from "../components/WalkCard";

export default Home = (refreshWalkList, setRefreshWalkList) => {
  const [walks, setWalks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mapReady, setMapReady] = useState(false);
  const [isMapView, setIsMapView] = useState(true);
  const [region, setRegion] = useState(null);
  const [isSliderVisible, setIsSliderVisible] = useState(false);
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

  const toggleSlider = () => {
    if (isSliderVisible) {
      Animated.timing(slideAnim, {
        toValue: -windowHeight * 0.5,
        duration: 300,
        useNativeDriver: false,
      }).start(() => setIsSliderVisible(false));
    } else {
      setIsSliderVisible(true);
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
      <View style={styles.header}>
        <IconButton icon="tune-variant" onPress={toggleSlider} />
        <View style={styles.toggleContainer}>
          <Text>{isMapView ? "Map View" : "List View"}</Text>
          <Switch value={isMapView} onValueChange={toggleView} />
        </View>
      </View>
      <View style={styles.contentContainer}>
      <Animated.View style={[styles.sliderView, { transform: [{ translateY: slideAnim }] }]}>
        <View style={styles.sliderContent}>
          {/* filters */}
          <Button title="Slide Content Button" onPress={() => {}} />
        </View>
      </Animated.View>

      {isLoading && !mapReady && <ActivityIndicator style={styles.centre} size="large" />}
      {isMapView ? (
        region && (
          <>
            <MapView
              style={styles.map}
              initialRegion={region}
              showsUserLocation={true}
              showsMyLocationButton={true}
              mapType={Platform.OS == "android" ? "none" : "standard"}
              onLayout={() => setMapReady(true)}
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
                  >
                    <Callout onPress={() => handleMarkerPress(walk)}>
                      <View style={styles.calloutContainer}>
                        <Text style={styles.calloutTitle}>{walk.title}</Text>
                        <Text style={styles.calloutDescription}>{walk.description}</Text>              
                          <PaperButton >Tap to view details</PaperButton>  
                      </View>   
                    </Callout>
                  </Marker>
                ))}
            </MapView>
          </>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    
    flex: 1,
  },
  header: {
    zIndex: 2,
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingBottom: 10,
    marginTop: Constants.statusBarHeight,
  },
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  contentContainer: {
    zIndex:1,
    flex: 20,
  },
  map: {
    flex: 1,
  },
  centre: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignSelf: "center",
  },
  sliderView: {
    position: "absolute",
    left: 0,
    right: 0,
    height: '50%',
    zIndex: 1,
    backgroundColor: "white",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    paddingVertical: 23,
    paddingHorizontal: 10,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  sliderContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  calloutContainer: {
    width: 200,
    padding: 10,
    backgroundColor: 'white',
  },
  calloutTitle: {
    fontSize: 16,
    marginBottom: 5,
    textAlign: "center"
  },
  calloutDescription: {
    fontSize: 14,
    marginBottom: 5,
    color: '#888',
    textAlign: "center"
  },
});

