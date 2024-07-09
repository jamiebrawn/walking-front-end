import { getWalkLocationPoints } from "../utils/api";

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