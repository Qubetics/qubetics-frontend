import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
const Globe = dynamic(() => import("react-globe.gl"), { ssr: false });

const GlobeView = ({ nodesData }) => {
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    const extractedLocations = nodesData?.map((node) => node?.location);
    setPlaces(extractedLocations);
  }, [nodesData]);

  return (
    <div className="globeSec">
      <Globe
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
        labelsData={places}
        labelLat={(d) => d?.lat} // Assuming latitude is available in the location object
        labelLng={(d) => d?.lon} // Assuming longitude is available in the location object
        labelText={(d) => d?.regionName} // Assuming country is available in the location object
        labelSize={1.4} // Adjust the size as needed
        labelDotRadius={0.5} // Adjust the dot radius as needed
        labelColor={() => "rgba(255, 165, 0, 0.75)"}
        labelResolution={2}
      />
    </div>
  );
};

export default GlobeView;
