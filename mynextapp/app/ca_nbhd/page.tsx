// "use client";
// import React, { useState } from "react";
// import NeighborhoodMap from "../components/nbhdmap"; // Adjust the import path accordingly

// const NeighborhoodSelector: React.FC = () => {
//   const [selectedGID, setSelectedGID] = useState<number | null>(null);

//   const handleGIDChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
//     setSelectedGID(Number(event.target.value));
//   };

//   return (
//     <div>
//       <label>Select Neighborhood: </label>
//       <select onChange={handleGIDChange}>
//         <option value="1">Neighborhood 1</option>
//         <option value="2">Neighborhood 2</option>
//         {/* Add more options as needed */}
//       </select>

//       {selectedGID && <NeighborhoodMap gid={selectedGID} />}
//     </div>
//   );
// };

// export default NeighborhoodSelector;
"use client";
import React, { useState, useMemo } from "react";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("../components/nbhdmap"), {
  loading: () => <p>A map is loading</p>,
  ssr: false,
});

const NeighborhoodSelector: React.FC = () => {
  const [selectedGID, setSelectedGID] = useState<number | null>(null);

  const handleGIDChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedGID(Number(event.target.value));
  };

  return (
    <div>
      <label>Select Neighborhood: </label>
      <select onChange={handleGIDChange}>
        <option value="">--Select a Neighborhood--</option>
        <option value="440">San Diego</option>
        <option value="439">Chula Vista</option>
        {/* Add more options as needed */}
      </select>

      {selectedGID && <Map nbhd="ca_nbhd" gid={selectedGID} />}
    </div>
  );
};

export default NeighborhoodSelector;
