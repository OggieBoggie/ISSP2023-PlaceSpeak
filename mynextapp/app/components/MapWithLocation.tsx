"use client";
import "leaflet/dist/leaflet.css";
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { MapContainer, TileLayer, Polygon, Marker } from "react-leaflet";

import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
let DefaultIcon = L.icon({
  iconUrl: icon.src, // convert StaticImageData to string
  shadowUrl: iconShadow.src, // convert StaticImageData to string
  iconSize: [25, 41], // size of the icon, default values
  iconAnchor: [12, 41], // point of the icon which will correspond to marker's location
  popupAnchor: [0, -41], // point from which the popup should open relative to the iconAnchor
});
L.Marker.prototype.options.icon = DefaultIcon;

const MapWithLocation: React.FC = () => {
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [neighborhood, setNeighborhood] = useState<any | null>(null);
  const { data: session } = useSession();

  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      // const { latitude, longitude } = pos.coords;
      //   setPosition([latitude, longitude]);
      setPosition([49.2482, -123.1378]);

      // Call API to get the neighborhood boundary
      try {
        const response = await fetch(
          //   `http://127.0.0.1:8000/myapp/api/van_nbhd/?latitude=${latitude}&longitude=${longitude}`
          `http://127.0.0.1:8000/myapp/api/van_nbhd/?latitude=${49.2482}&longitude=${-123.1378}`
        );
        const data = await response.json();

        if (data && data.geom && data.geom.coordinates) {
          const reversedCoords = data.geom.coordinates[0][0].map(
            (coord: any) => [coord[1], coord[0]]
          );
          setNeighborhood(reversedCoords);
        }
      } catch (error) {
        console.error("Error fetching neighborhood data:", error);
      }

      if (!session?.user?.email) {
        console.error("Error: Email is missing for the user");
        return; // Early return to stop the function execution
      }
      fetch(
        `http://127.0.0.1:8000/myapp/api/user_location/${session.user.email}/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          }),
        }
      )
        .then((response) => response.json())
        .then((data) => {
          console.log("Location saved:", data);
        })
        .catch((error) => {
          console.error("Error saving location:", error);
        });
    });
  };

  return (
    <div>
      <button onClick={getLocation}>Get My Location</button>
      {position && (
        <MapContainer
          center={position}
          zoom={13}
          zoomSnap={1}
          style={{ height: "500px", width: "50%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {neighborhood && (
            <Polygon positions={neighborhood} color="blue" fillOpacity={0.2} />
          )}
          <Marker position={position} />
        </MapContainer>
      )}
    </div>
  );
};

export default MapWithLocation;
