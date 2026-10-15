// Configuration de la carte.
const lat = 45.75;
const lon = 4.85;

let carte;
let clusterParc, clusterCovoit, clusterVelov;

// Fonction de création des icones.
function creerIcone(couleur, emoji) {
    return L.divIcon({
        className: "",
        html: `
        <div style="
            background:${couleur};
            width:30px;
            height:30px;
            border-radius:50%;
            display:flex;
            align-items:center;
            justify-content:center;
            color:white;
            font-size:18px;
            border:2px solid white;
            box-shadow: 0 0 6px rgba(0, 0, 0, 0.4);
        ">
            ${emoji}
        </div>`
    });
}

// Fonction de création de la carte.
function initMap() {

    carte = L.map('map').setView([lat, lon], 12);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; CartoDB',
        maxZoom: 17,
    }).addTo(carte);

    clusterParc = L.markerClusterGroup();
    clusterCovoit = L.markerClusterGroup();
    clusterVelov = L.markerClusterGroup();

    const iconParc = creerIcone("#2E86DE", "🅿️");
    const iconCovoit = creerIcone("#E67E22", "🚗");
    const iconVelov = creerIcone("#2ECC71", "🚴");

    const categories = [
        {
            data: parc_relais_tcl,
            cluster: clusterParc,
            icon: iconParc,
            popup: (key, point) =>`<div style="width:300px; padding:10px;">
                                   <h2>${key}</h2>
                                   <a style="font-size:14px; position:center;" href="https://www.google.com/maps/dir/?api=1&destination=${point.lat},${point.lon}"target="_blank">📍 Itinéraire</a>
                                   <img src="images/parc_relais.jpeg" style="width:100%; border-radius:8px;">
                                   </div>`        
        },
        {
            data: lieux_covoiturage,
            cluster: clusterCovoit,
            icon: iconCovoit,
            popup: (key, point) =>`<div style="width:300px; padding:10px;">
                                   <h2>${key}</h2>
                                   <a href="https://www.google.com/maps/dir/?api=1&destination=${point.lat},${point.lon}"target="_blank">📍 Itinéraire</a>
                                   <img src="images/aire_covoit.jpg" style="width:100%; border-radius:8px;">
                                   </div>`
        },
        {
            data: stations_velov,
            cluster: clusterVelov,
            icon: iconVelov,
            popup: (key, point) =>`<div style="width:350px; padding:10px;">
                                   <h2>Station ${key}</h2>
                                   <a href="https://www.google.com/maps/dir/?api=1&destination=${point.lat},${point.lon}"target="_blank">📍 Itinéraire</a>
                                   <img src="images/station_velov.jpg" style="width:100%; border-radius:8px;">
                                   </div>`
        }
    ];

    // Création des markers.
    categories.forEach(categorie => {
        for (let key in categorie.data) {
            const point = categorie.data[key];

            L.marker([point.lat, point.lon], { icon: categorie.icon })
                .bindPopup(categorie.popup(key, point), {maxWidth:400})
                .addTo(categorie.cluster);
        }
    });

    carte.addLayer(clusterParc);
    carte.addLayer(clusterCovoit);
    carte.addLayer(clusterVelov);

    initFilters();
}

// Fonction de filtrage via les checkboxes.
function initFilters() {

    const tout = document.getElementById("tout");
    const cbParc = document.getElementById("parc_relais");
    const cbCovoit = document.getElementById("covoiturage");
    const cbVelov = document.getElementById("velov");

    const filters = [
        { checkbox: cbParc, cluster: clusterParc },
        { checkbox: cbCovoit, cluster: clusterCovoit },
        { checkbox: cbVelov, cluster: clusterVelov }
    ];

    function synchroCheckbox() {
        filters.forEach(f => {
            if (f.checkbox.checked) carte.addLayer(f.cluster);
            else carte.removeLayer(f.cluster);
        });
    }

    tout.addEventListener("change", function () {
        filters.forEach(f => f.checkbox.checked = this.checked);
        synchroCheckbox();
    });

    filters.forEach(f => {
        f.checkbox.addEventListener("change", () => {
            synchroCheckbox();
            tout.checked = filters.every(f => f.checkbox.checked);
        });
    });
}

// Initialisation de la carte.
window.onload = initMap;