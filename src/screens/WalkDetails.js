import { useState, useEffect } from "react";
import { View, StyleSheet, Platform } from "react-native";
import MapView, { Polyline, UrlTile } from "react-native-maps";
import { useRoute, useNavigation } from "@react-navigation/native";
import DeleteButton from "../components/DeleteButton";
import { useAuth } from "../contexts/AuthContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Foundation } from '@expo/vector-icons';
import { Button, Text, Icon } from "react-native-paper";
import { getLocationPoints, getAddressFromCoords } from "../utils/helpers";

export default function WalkDetails() {
    const route = useRoute();
    const navigation = useNavigation();
    const { walk, setRefreshWalkList } = route.params;
    const { user } = useAuth();

    const [locationPoints, setLocationPoints] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [region, setRegion] = useState(null);
    const [startAddress, setStartAddress] = useState(null);

    useEffect(() => {
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

    useEffect(() => {
        const fetchStartAddress = async () => {
            try {
                const address = await getAddressFromCoords(
                    walk.start_latitude,
                    walk.start_longitude
                );
                setStartAddress(address);
            } catch (error) {
                console.error("Error fetching start address:", error);
                setStartAddress(null);
            }
        };

        fetchStartAddress();
    }, [walk]);

    const handleFollowPress = () => {
        navigation.navigate("FollowRoute", { walk });
    };

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
                <Text variant="headlineLarge" style={{ textAlign: "center" }}>
                    {walk.title}
                </Text>
                <Text variant="bodyLarge" style={styles.descriptionBody}>
                    {walk.description}
                </Text>
                <View style={styles.centredMetrics}>
                    <View style={styles.centredRow}>
                        <Icon source="walk" size={24} />
                        <Text variant="bodyMedium">
                            Distance: {walk.distance_km}km
                        </Text>
                    </View>
                    <View style={styles.centredRow}>
                        <Icon source="slope-uphill" size={24} />
                        <Text variant="bodyMedium"> Ascent: {parseFloat(walk.ascent).toFixed(2)}m</Text>
                    </View>
                </View>
                <View style={styles.centredMetrics}>
                    {walk.difficulty && (
                        <View style={styles.centredRow}>
                            <Icon source="speedometer-slow" size={24} />
                            <Text> Difficulty: {walk.difficulty}/10</Text>
                        </View>
                    )}
                    {walk.start_altitude !== 0 && (
                        <View style={styles.centredRow}>
                            <Foundation name="mountains" size={24} color="black" />
                            <Text> Start Altitude: {walk.start_altitude}m</Text>
                        </View>
                    )}
                </View>
                {walk.rating && <Text>Rating: {walk.rating}</Text>}
                {walk.difficulty && <Text>Difficulty: {walk.difficulty}</Text>}
                {walk.start_altitude !== 0 && <Text>Start Altitude: {walk.start_altitude} m</Text>}
                {walk.username && <Text>Creator: {walk.username}</Text>}
                <View style={styles.centredRow}>
                    <Ionicons name="location-sharp" size={24} />
                    <Text>Start at: {startAddress}</Text>
                </View>
                <Button
                    style={styles.button}
                    mode="contained"
                    onPress={handleFollowPress}
                >
                    <View style={styles.centred}>
                        <Ionicons
                            name="footsteps-outline"
                            size={16}
                            style={{ color: "white" }}
                        />
                        <Text style={{ color: "white" }}> Follow Route</Text>
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
    centred: {
        flexDirection: "row",
        alignItems: "center",
    },
    button: {
        maxWidth: 150,
        alignSelf: "center",
        marginTop: 15,
    },
    centredRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    centredMetrics: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
        paddingVertical: 5,
    },
    descriptionBody: {
        paddingVertical: 5,
        textAlign: "center",
    },
});
