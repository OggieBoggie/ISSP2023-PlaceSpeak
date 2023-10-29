"use client";
import "leaflet/dist/leaflet.css";
import React, { useState, useEffect } from "react";
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

interface PointProps {
  latitude: number;
  longitude: number;
}

interface MapWithLocationProps {
  getNbhdAction: (arg0: PointProps) => Promise<any>;
  updateUsrLocAction: (arg0: PointProps) => Promise<void>;
}

const MapWithLocation: React.FC<MapWithLocationProps> = ({
  getNbhdAction,
  updateUsrLocAction,
}: MapWithLocationProps) => {
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [neighborhood, setNeighborhood] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getLocation = () => {
    setIsLoading(true);

    navigator.geolocation.getCurrentPosition(async (pos) => {
      // const { latitude, longitude } = pos.coords;
      // setPosition([latitude, longitude]);
      setPosition([49.283398, -123.115126]);

      // Call API to get the neighborhood boundary
      setNeighborhood(
        await getNbhdAction({ latitude: 49.283398, longitude: -123.115126 })
      );

      // Call API to save the user location
      await updateUsrLocAction({ latitude: 49.283398, longitude: -123.115126 });

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
