import L from "leaflet";
import { useEffect } from "react";
import "leaflet-geosearch/dist/geosearch.css";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import { obterCor } from "../../utils";

export default function Mapa({ locais, aoClicar }) {
  useEffect(() => { //TODO Refatorar retirando funções de dentro do useEffect
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
        color: obterCor(i),
        fillColor: obterCor(i),
        fillOpacity: 0.5,
        radius: 100,
      }).addTo(mapa);
      circulo.bindPopup(c.nome);
    });

    const indexColor = locais?.length;
    const circle = L.circle([0, 0], {
      color: obterCor(indexColor),
      fillColor: obterCor(indexColor),
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
