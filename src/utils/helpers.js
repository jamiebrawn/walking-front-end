import { getWalkLocationPoints } from "../utils/api";
import * as Location from "expo-location";

export const getLocationPoints = async (walkId, setLocationPoints, setIsLoading) => {
    try {
        const points = await getWalkLocationPoints(walkId);
        const convertedPointsData = points.map((point) => ({
            ...point,
            latitude: parseFloat(point.latitude),
            longitude: parseFloat(point.longitude),
            altitude: parseFloat(point.altitude),
        }));
        setLocationPoints(convertedPointsData);
    } catch (error) {
        console.error("Error retrieving location points:", error);
    } finally {
        setIsLoading(false);
    }
};

export const getAddressFromCoords = async (latitude, longitude) => {
    try {
        let addressResponse = await Location.reverseGeocodeAsync({
            latitude,
            longitude,
        });

        if (addressResponse.length > 0) {
            return addressResponse[0].formattedAddress;
        } else {
            throw new Error('Address not found');
        }
    } catch (error) {
        console.error('Error fetching address:', error);
        throw error;
    }
};