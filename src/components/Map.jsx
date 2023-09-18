import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import { Icon } from "leaflet";

export default function Map() {
  const [location, setLocation] = useState({});
  const [countryInfo, setCountryInfo] = useState({});
  const [isp, setIsp] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");

  const APIKey = import.meta.env.VITE_API_KEY;

  useEffect(() => {
    axios
      .get(`https://geo.ipify.org/api/v2/country,city,vpn?apiKey=${APIKey}`)
      .then((res) => {
        setIsp(res.data.isp);
        setLocation({
          lat: res.data.location.lat,
          lng: res.data.location.lng,
          city: res.data.location.city,
          country: res.data.location.country,
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
      <section className="map-component">
        <div className="map">
          <MapContainer
            center={[lat, lng]}
            zoom={13}
            scrollWheelZoom={false}
            style={{
              height: "400px",
              width: "400px",
            }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={[lat, lng]}>
              <Popup>Provider: {isp}</Popup>
            </Marker>
          </MapContainer>
        </div>
      </section>
    </div>
  );
}
