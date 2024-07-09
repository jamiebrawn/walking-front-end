import { useState, useEffect } from "react";
import { useRoute } from "@react-navigation/native";
import { View, Text, StyleSheet, Platform } from "react-native";
import MapView, { Polyline, UrlTile, Marker } from "react-native-maps";
import { ActivityIndicator } from "react-native-paper";
import { getLocationPoints } from "../utils/helpers";

export default FollowRoute = () => {
    const route = useRoute();
    const { walk } = route.params;
    const [isLoading, setIsLoading] = useState(true);
    const [locationPoints, setLocationPoints] = useState([]);
    const [mapReady, setMapReady] = useState(false);
    const [region, setRegion] = useState(null);

    useEffect(() => {
        getLocationPoints(walk.id, setLocationPoints, setIsLoading);
        setRegion({
            latitude: walk.start_latitude,
            longitude: walk.start_longitude,
            latitudeDelta: 0.002,
            longitudeDelta: 0.002,
        });
    }, [walk.id]);

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
                        <Marker
                            coordinate={{
                                latitude: walk.start_latitude,
                                longitude: walk.start_longitude,
                            }}
                            title="Start here"
                        />
                    </MapView>
                    {!mapReady && (
                        <ActivityIndicator style={styles.centre} size="large" />
                    )}
                </>
            )}
        </View>
    );
};

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
    centred: {
        flexDirection: "row",
        alignItems: "center",
    },
});
