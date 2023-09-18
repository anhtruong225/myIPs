import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Icon } from "leaflet";

function MyIP(props) {
  const [ips, setIps] = useState([]);
  const [isp, setIsp] = useState("");
  const [countryInfo, setCountryInfo] = useState({});
  const [location, setLocation] = useState({});
  const APIKey = import.meta.env.VITE_API_KEY;

  useEffect(() => {
    axios
      .get(
        `https://geo.ipify.org/api/v2/country,city,vpn?apiKey=${APIKey}&ipAddress=${ips}`
      )
      .then((res) => {
        console.log(res.data.location);
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
      <div>
        <p>Your IP: {ips}</p>
        <p>City: {location.city}</p>
        <p>
          Country: {countryInfo.name}{" "}
          <img src={countryInfo.flag} alt={countryInfo.name} width="70px" />
        </p>
      </div>
      <MapContainer
        center={[location.lat, location.lng]}
        zoom={12}
        style={{
          height: "400px",
          width: "400px",
          borderRadius: "15px",
          border: "2px solid #e74c3c",
        }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Popup>Provider: {isp}</Popup>
        <Marker position={[location.lat, location.lng]}></Marker>
      </MapContainer>
    </div>
  );
}

export default MyIP;
