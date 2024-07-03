import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, Switch } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { getWalks } from "../utils/api";
import WalkCard from "../components/WalkCard";

export default function Home() {
  const [walks, setWalks] = useState([]);
  const [isMapView, setIsMapView] = useState(true);


  // useEffect(() => {
  //   (async () => {
  //     try {
  //       const walksData = await getWalks();
  //       setWalks(walksData);
  //     } catch (error) {
  //       console.error("Error retrieving walks:", error);
  //     }
  //   })();
  // }, []);

  const toggleView = () => setIsMapView(!isMapView);

  return (
    <View style={styles.container}>
      <View style={styles.toggleContainer}>
        <Text>{isMapView ? "Map View" : "List View"}</Text>
        <Switch value={isMapView} onValueChange={toggleView} />
      </View>
      {isMapView ? (
        <MapView style={styles.map}>
          {walks.map((walk) => (
            <Marker
              key={walk.id}
              coordinate={{
                latitude: walk.start_latitude,
                longitude: walk.start_longitude,
              }}
              title={walk.title}
              description={walk.description}
            />
          ))}
        </MapView>
      ) : (
        <FlatList
          data={walks}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <WalkCard walk={item} />}
        />
      )}
    </View>
  );
}

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
