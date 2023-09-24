import { useState, useEffect } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

function MyIP() {
  const [ips, setIps] = useState([]);
  const [isp, setIsp] = useState("");
  const [countryInfo, setCountryInfo] = useState({});
  const [location, setLocation] = useState({});
  const APIKey = import.meta.env.VITE_API_KEY;

  useEffect(() => {
    axios
      .get(`https://geo.ipify.org/api/v2/country,city,vpn?apiKey=${APIKey}`)
      .then((res) => {
        setIps(res.data.ip);
        setIsp(res.data.isp);
        setLocation({
          city: res.data.location.city,
          country: res.data.location.country,
          lat: res.data.location.lat,
          lng: res.data.location.lng,
        });
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    if (location.country) {
      axios
        .get(`https://restcountries.com/v3.1/alpha/${location.country}`)
        .then((res) => {
          console.log(res.data);
          const data = res.data[0];
          setCountryInfo({
            name: data.name.common,
            flag: data.flags.png,
            capital: data.capital,
            population: data.population,
          });
        });
    }
  }, [location.country]);

  return (
    <div>
      <div className="content-container">
        <h1>Display my IP</h1>
        <p>Your IP: {ips}</p>
        <p>City: {location.city}</p>
        <p>
          Country: {countryInfo.name}{" "}
          <img src={countryInfo.flag} alt={countryInfo.name} width="70px" />
        </p>
      </div>
      <div className="map-container">
        {!location.lat || !location.lng ? (
          <p>Loading...</p>
        ) : (
          <MapContainer
            center={[location.lat, location.lng]}
            zoom={12}
            style={{
              minHeight: "400px",
              minWidth: "800px",
              borderRadius: "15px",
              border: "2px solid black",
            }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={[location.lat, location.lng]}>
              <Popup>Provider: {isp}</Popup>
            </Marker>
          </MapContainer>
        )}
      </div>
    </div>
  );
}

export default MyIP;
