import { useState, useEffect } from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import MapView, { Polyline, UrlTile } from "react-native-maps";
import { useRoute, useNavigation } from "@react-navigation/native";
import DeleteButton from "../components/DeleteButton";
import { useAuth } from "../contexts/AuthContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Button } from "react-native-paper";
import { getLocationPoints } from "../utils/helpers";


export default function WalkDetails() {
    const route = useRoute();
    const navigation = useNavigation();
    const { walk, setRefreshWalkList } = route.params;
    const [locationPoints, setLocationPoints] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [region, setRegion] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        // const getLocationPoints = async () => {
        //     try {
        //         const points = await getWalkLocationPoints(walk.id);
        //         const convertedPointsData = points.map((point) => ({
        //             ...point,
        //             latitude: parseFloat(point.latitude),
        //             longitude: parseFloat(point.longitude),
        //             altitude: parseFloat(point.altitude),
        //         }));
        //         setLocationPoints(convertedPointsData);
        //     } catch (error) {
        //         console.error("Error retrieving location points:", error);
        //     } finally {
        //         setIsLoading(false);
        //     }
        // };
        getLocationPoints(walk.id, setLocationPoints, setIsLoading);
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

    const handleFollowPress = () => {
    navigation.navigate("FollowRoute", { walk });
    }

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
                <Button mode="contained" onPress={handleFollowPress}>
                    <View style={styles.centred}>
                        
                        <Ionicons
                            name="footsteps-outline"
                            size={16}
                            style={{color: "white"}}
                        />
                        <Text style={{color: "white"}} > Follow Route</Text>
                    </View>
                </Button>
            </View>
            {walk.creator_id === user.id && (
                <DeleteButton
                    walkId={walk.id}
                    setRefreshWalkList={setRefreshWalkList}
                />
            )}
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
    centred: {
      flexDirection: "row",
      alignItems: "center"
    }
});
