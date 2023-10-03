import "leaflet/dist/leaflet.css";
import { useRef, useEffect, useState } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import axios from "axios";

interface MapProps {
  nbhd: string;
  gid: number;
}

const GeoJSONLayer: React.FC<MapProps> = ({ nbhd, gid }) => {
  const map = useMap();
  const layerRef = useRef<L.Layer | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        `http://127.0.0.1:8000/myapp/api/${nbhd}/${gid}`
      );
      const data = response.data.geom;

      // Remove the previous layer
      if (layerRef.current) {
        map.removeLayer(layerRef.current);
      }

      // Add the new GeoJSON layer
      const newLayer = L.geoJSON(data).addTo(map);
      layerRef.current = newLayer;
    };

    fetchData();

    // Cleanup function
    return () => {
      if (layerRef.current) {
        map.removeLayer(layerRef.current);
      }
    };
  }, [nbhd, gid, map]); // Only depend on nbhd, gid and map

  return null;
};

const Map: React.FC<MapProps> = ({ nbhd, gid }) => {
  return (
    <MapContainer
      center={
        nbhd === "van_nbhd" ? [49.2827, -123.1207] : [32.724433, -117.178874]
      }
      zoom={nbhd === "van_nbhd" ? 11 : 9}
      scrollWheelZoom={false}
      style={{ height: 400, width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <GeoJSONLayer nbhd={nbhd} gid={gid} />
    </MapContainer>
  );
};

export default Map;
