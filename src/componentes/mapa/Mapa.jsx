import L from "leaflet";
import { useEffect } from "react";
import "leaflet-geosearch/dist/geosearch.css";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";

export default function Mapa({ locais, aoClicar }) {
  useEffect(() => { //TODO Refatorar retirando funções de dentro do useEffect
    const cores = [
      "#FF0000",
      "#00FF00",
      "#0000FF",
      "#FFFF00",
      "#FF00FF",
      "#00FFFF",
      "#FFA500",
      "#800080",
      "#008000",
      "#000080",
      "#FFC0CB",
      "#800000",
      "#FFD700",
      "#FF1493",
      "#8B0000",
      "#00FF7F",
      "#FF4500",
      "#008080",
      "#FF6347",
      "#800080",
    ];

    const divMapa =
      '<div id="map" style="height: 500px; border-radius: 0.2rem"></div>';
    const ararangua = [-28.943054, -49.489547];
    document.getElementById("meu-mapa").innerHTML = divMapa;
    const mapa = L.map("map").setView(ararangua, 13);
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(mapa);

    const search = new GeoSearchControl({
      provider: new OpenStreetMapProvider(),
      style: "bar",
      searchLabel: "Digite um endereço",
      notFoundMessage: "Localidade não encontrada",
      animateZoom: true,
      retainZoomLevel: true,
    });

    mapa.addControl(search);

    locais?.forEach((c, i) => {
      var circulo = L.circle(c.coordenadas, {
        color: cores[i % cores.length],
        fillColor: cores[i % cores.length],
        fillOpacity: 0.5,
        radius: 100,
      }).addTo(mapa);
      circulo.bindPopup(c.nome);
    });

    const indexColor = locais?.length % cores.length;
    const circle = L.circle([0, 0], {
      color: cores[indexColor],
      fillColor: cores[indexColor],
      fillOpacity: 0.5,
      radius: 100,
    }).addTo(mapa);

    mapa.on("click", (e) => {
      circle.setLatLng(e.latlng);
      aoClicar(e.latlng);
    });
  }, [locais, aoClicar]);

  return <div id="meu-mapa"></div>;
}
