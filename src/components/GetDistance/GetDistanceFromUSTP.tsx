import { LocationType } from "../../interfaces/Interfaces";
import GetDistance from "./GetDistance";

export default function GetDistanceFromUSTP(location: LocationType) {
  const ustpCoords = {
    latitude: 8.4857,
    longitude: 124.6565,
    latitudeDelta: 0.000235,
    longitudeDelta: 0.000067,
  };

  let dist = GetDistance(
    location.latitude,
    location.longitude,
    ustpCoords.latitude,
    ustpCoords.longitude
  );
  dist = Math.round(dist * 100) / 100;
  return dist;
}
