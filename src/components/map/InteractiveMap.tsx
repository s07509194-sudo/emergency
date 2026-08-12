import {
  MapContainer,
  TileLayer,
  Marker,
  Popup
} from "react-leaflet";

import "leaflet/dist/leaflet.css";


const InteractiveMap = () => {

  const position:[number, number] = [
    24.4686,
    39.6142
  ];


  return (

    <MapContainer
      center={position}
      zoom={12}
      style={{
        height:"600px",
        width:"100%"
      }}
    >

      <TileLayer
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      />


      <Marker position={position}>

        <Popup>
          مركز المدينة المنورة
        </Popup>

      </Marker>


    </MapContainer>

  );
};


export default InteractiveMap;