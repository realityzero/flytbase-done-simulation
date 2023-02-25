import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import AirplaneMarker from './AirplaneMarker';
import droneCoordinates from './input';

let cursor = 0;

function App() {
  const dataPoints = droneCoordinates().sort((obj1, obj2) => obj1.timestamp - obj2.timestamp);
  const [currentTrack, setCurrentTrack] = useState({});
  const [latLngList, setLatLngList] = useState([])
  const [latLngString, setLatLngString] = useState('')
  const [fileInputKey, setFileInputKey] = useState(Date.now())
  const [startTracking, setStartTracking] = useState(false);

  function handleButtonClick() {
    setStartTracking(true);
  }

  useEffect(() => {
    setCurrentTrack(dataPoints[cursor]);

    const interval = setInterval(() => {
      if (cursor === dataPoints.length - 1) {
        cursor = 0;
        setCurrentTrack(dataPoints[cursor]);
        return;
      }

      cursor += 1;
      setCurrentTrack(dataPoints[cursor]);
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  function handleLatLngSubmit(e) {
    e.preventDefault()
    const [lat, lng] = latLngString.split(',')
    setLatLngList([...latLngList, [Number(lat), Number(lng)]])
    setLatLngString('')
  }

  function handleFileUpload(e) {
    const file = e.target.files[0]
    const reader = new FileReader()
    reader.readAsText(file)
    reader.onload = () => {
      const lines = reader.result.split('\n')
      const newLatLngList = lines.map(line => line.split(',').map(parseFloat))
      setLatLngList([...latLngList, ...newLatLngList])
    }
    setFileInputKey(Date.now())
  }

  return (
    <div>
      <h1>Drone Simulation</h1>
      {/* <form onSubmit={handleLatLngSubmit}>
        <input type="text" placeholder="Latitude, Longitude" value={latLngString} onChange={e => setLatLngString(e.target.value)} />
        <button type="submit">Add</button>
      </form> */}
      {/* <label htmlFor="file-upload">Upload file:</label> */}
      {/* <input id="file-upload" type="file" onChange={handleFileUpload} key={fileInputKey} /> */}
      <button onClick={handleButtonClick}>Simulate</button>

      <MapContainer center={[19.130204994332228, 72.78135632451375]} zoom={10} style={{ width: "100%", height: "100vh" }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        maxZoom={18}
      />
      {startTracking && <AirplaneMarker data={currentTrack ?? {}} />}
    </MapContainer>
    </div>
  );
}

export default App;
