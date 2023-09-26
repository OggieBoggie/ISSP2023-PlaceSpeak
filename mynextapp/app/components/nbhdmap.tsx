import "leaflet/dist/leaflet.css";
import { useRef, useEffect, useState } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import axios from "axios";

interface MapProps {
  gid: number;
}

const GeoJSONLayer: React.FC<{ gid: number }> = ({ gid }) => {
  const map = useMap();
  const layerRef = useRef<L.Layer | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        `http://127.0.0.1:8000/myapp/api/van_nbhd/${gid}`
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
  }, [gid, map]); // Only depend on gid and map

  return null;
};

const Map: React.FC<MapProps> = ({ gid }) => {
  return (
    <MapContainer
      center={[49.2827, -123.1207]}
      zoom={11}
      scrollWheelZoom={false}
      style={{ height: 400, width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <GeoJSONLayer gid={gid} />
    </MapContainer>
  );
};

export default Map;
