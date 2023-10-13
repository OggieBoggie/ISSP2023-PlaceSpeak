"use client";
import "leaflet/dist/leaflet.css";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { MapContainer, Polygon, Marker, useMap } from "react-leaflet";

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

function TileLayer() {
  const map = useMap();

  useEffect(() => {
    new L.TileLayer(
      `https://api.mapbox.com/styles/v1/mapbox/streets-v12/tiles/{z}/{x}/{y}@2x?access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`,
      {
        tileSize: 512,
        zoomOffset: -1,
      }
    ).addTo(map);
  }, []);

  return null;
}

const MapWithLocation: React.FC = () => {
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [neighborhood, setNeighborhood] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { data: session } = useSession();

  const getLocation = () => {
    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(async (pos) => {
      // const { latitude, longitude } = pos.coords;
      // setPosition([latitude, longitude]);
      setPosition([49.2482, -123.1378]);

      // Call API to get the neighborhood boundary
      try {
        const response = await fetch(
          // `http://127.0.0.1:8000/myapp/api/van_nbhd/?latitude=${latitude}&longitude=${longitude}`
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
      setIsLoading(false);
    });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md flex flex-col w-full">
      <div className="flex justify-between items-center mb-4">
        <label className="text-xl font-bold">Location</label>
        <button
          onClick={getLocation}
          className="bg-blue-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition duration-200 ease-in-out"
        >
          Get My Location
        </button>
      </div>

      {isLoading && !position ? (
        <div className="flex justify-center items-center mt-4">
          <p className="text-lg font-bold text-center text-blue-500">
            Loading...
          </p>
        </div>
      ) : position ? (
        <MapContainer
          center={position}
          zoom={13}
          zoomSnap={1}
          style={{ height: "400px", width: "100%" }}
        >
          <TileLayer />
          {neighborhood && (
            <Polygon positions={neighborhood} color="blue" fillOpacity={0.2} />
          )}
          <Marker position={position} />
        </MapContainer>
      ) : null}
    </div>
  );
};

export default MapWithLocation;
