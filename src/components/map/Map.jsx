import L from "leaflet";
import { useEffect } from "react";
import "leaflet-geosearch/dist/geosearch.css";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";

export default function Map({ places, onSelectMap }) {
  useEffect(() => {
    const colors = [
      "purple",
      "blue",
      "red",
      "orange",
      "green",
      "yellow",
      "black",
      "violet",
    ];
    const divMap = '<div id="map" style="height: 500px;"></div>';
    const center = [-28.943054, -49.489547];
    document.getElementById("futureMap").innerHTML = divMap;
    const map = L.map("map").setView(center, 13);
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    const search = new GeoSearchControl({
      provider: new OpenStreetMapProvider(),
      style: "bar",
      searchLabel: "Digite um endereço",
      notFoundMessage: "Localidade não encontrada",
      animateZoom: true,
      retainZoomLevel: true,
    });

    map.addControl(search);

    places?.forEach((c, i) => {
      var circle = L.circle(c.coordenadas, {
        color: colors[i % colors.length],
        fillColor: colors[i % colors.length],
        fillOpacity: 0.5,
        radius: 100,
      }).addTo(map);
      circle.bindPopup(c.nome);
    });

    const indexColor = places?.length % colors.length;
    const circle = L.circle([0, 0], {
      color: colors[indexColor],
      fillColor: colors[indexColor],
      fillOpacity: 0.5,
      radius: 100,
    }).addTo(map);

    map.on("click", (e) => {
      circle.setLatLng(e.latlng);
      onSelectMap(e.latlng);
    });
  }, [places, onSelectMap]);

  return <div id="futureMap"></div>;
}
