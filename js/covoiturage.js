// Utilisateur simulé (à remplacer par un vrai système d'auth)
const CURRENT_USER_ID = "user_valentin";
const CURRENT_USER_NAME = "Valentin L.P.";

// Données de test : trajets fictifs dans la métropole lyonnaise
const covoituragesInitiaux = [
  {
    id: "cv_001",
    userId: "user_alice",
    conducteur: "Alice M.",
    avatar: "https://i.pravatar.cc/80?img=1",
    note: 4.8,
    nbAvis: 32,
    depart: "Lyon Part-Dieu",
    arrivee: "Villeurbanne Centre",
    date: "2026-04-23",
    heure: "08:00",
    places: 3,
    prix: 4,
    vehicule: "Électrique",
    profil: "salarie",
    description: "Trajet quotidien, musique douce, non-fumeur 🚭"
  },
  {
    id: "cv_002",
    userId: "user_theo",
    conducteur: "Théo B.",
    avatar: "https://i.pravatar.cc/80?img=3",
    note: 4.5,
    nbAvis: 18,
    depart: "Bron",
    arrivee: "Lyon Perrache",
    date: "2026-04-19",
    heure: "07:30",
    places: 2,
    prix: 3.5,
    vehicule: "Hybride",
    profil: "etudiant",
    description: "Étudiant en fac, départ ponctuel ✔️"
  },
  {
    id: "cv_003",
    userId: "user_marie",
    conducteur: "Marie L.",
    avatar: "https://i.pravatar.cc/80?img=5",
    note: 5.0,
    nbAvis: 47,
    depart: "Vénissieux",
    arrivee: "Lyon Confluence",
    date: "2026-05-02",
    heure: "09:15",
    places: 4,
    prix: 5,
    vehicule: "Voiture",
    profil: "salarie",
    description: "Climatisation, place pour les bagages 💼"
  },
  {
    id: "cv_004",
    userId: "user_paul",
    conducteur: "Paul D.",
    avatar: "https://i.pravatar.cc/80?img=7",
    note: 4.2,
    nbAvis: 11,
    depart: "Caluire-et-Cuire",
    arrivee: "Lyon Presqu'île",
    date: "2026-04-30",
    heure: "08:45",
    places: 1,
    prix: 2.5,
    vehicule: "Voiture",
    profil: "retraite",
    description: "Trajet tranquille, pas de musique forte 🙂"
  },
  {
    id: "cv_005",
    userId: "user_sophie",
    conducteur: "Sophie R.",
    avatar: "https://i.pravatar.cc/80?img=9",
    note: 4.9,
    nbAvis: 63,
    depart: "Décines-Charpieu",
    arrivee: "Lyon 3e",
    date: "2026-04-19",
    heure: "07:00",
    places: 3,
    prix: 6,
    vehicule: "Électrique",
    profil: "salarie",
    description: "Conductrice expérimentée, trajet rapide 🌿"
  },
  {
    id: "cv_006",
    userId: "user_valentin",
    conducteur: "Valentin L.P.",
    avatar: "https://i.pravatar.cc/80?img=11",
    note: 4.6,
    nbAvis: 7,
    depart: "Villeurbanne Gratte-Ciel",
    arrivee: "Meyzieu ZI",
    date: "2026-04-22",
    heure: "08:30",
    places: 2,
    prix: 4.5,
    vehicule: "Hybride",
    profil: "etudiant",
    description: "Musique au choix, départ à l'heure 🎵"
  },
  {
    id: "cv_007",
    userId: "user_lena",
    conducteur: "Léna C.",
    avatar: "https://i.pravatar.cc/80?img=13",
    note: 4.7,
    nbAvis: 25,
    depart: "Saint-Priest",
    arrivee: "Lyon Part-Dieu",
    date: "2026-05-01",
    heure: "07:50",
    places: 3,
    prix: 5.5,
    vehicule: "Voiture",
    profil: "salarie",
    description: "Animaux acceptés 🐾, voiture spacieuse"
  },
  {
    id: "cv_008",
    userId: "user_marc",
    conducteur: "Marc V.",
    avatar: "https://i.pravatar.cc/80?img=15",
    note: 3.9,
    nbAvis: 5,
    depart: "Oullins",
    arrivee: "Gerland Stadium",
    date: "2026-05-08",
    heure: "10:00",
    places: 4,
    prix: 3,
    vehicule: "Voiture",
    profil: "etudiant",
    description: "Direction le match ! 🏟️"
  }
];

// État global : tous les trajets + résultats filtrés
let tousLesCovoiturages = chargerDonnees();
let resultatsFiltres    = [...tousLesCovoiturages];

function chargerDonnees() {
  const sauvegarde = localStorage.getItem("covoiturages_ecocal");
  if (sauvegarde) {
    return JSON.parse(sauvegarde);
  }
  sauvegarderDonnees(covoituragesInitiaux);
  return [...covoituragesInitiaux];
}

function sauvegarderDonnees(data) {
  localStorage.setItem("covoiturages_ecocal", JSON.stringify(data));
}

// Initialisation au chargement de la page
window.onload = function () {
  document.getElementById("affichageUser").textContent = CURRENT_USER_NAME;

  // Date par défaut = aujourd'hui
  const today = new Date().toISOString().split("T")[0];
  document.getElementById("inputDate").value = "";
  document.getElementById("inputDate").min = today;
  document.getElementById("fDate").min = today;

  afficherResultats(tousLesCovoiturages);
  afficherMesTrajets();
  initRecherche();
  initFiltresAvances();
  initSwap();
};

// Convertit une note numérique en étoiles affichables
function renduEtoiles(note) {
  const plein = Math.floor(note);
  const demi  = note % 1 >= 0.5 ? 1 : 0;
  const vide  = 5 - plein - demi;
  return "★".repeat(plein) + (demi ? "½" : "") + "☆".repeat(vide);
}

// Affiche un badge vert si le véhicule est électrique ou hybride
function badgeEco(vehicule) {
  if (vehicule === "Électrique" || vehicule === "Hybride") {
    return `<span class="badge">🌿 ${vehicule}</span>`;
  }
  return "";
}

// Génère le HTML d'une carte de trajet
function creerCarteHTML(cv, index) {
  const estMien = cv.userId === CURRENT_USER_ID;

  return `
    <article class="carte-trajet ${estMien ? "carte-trajet--mienne" : ""}" style="animation-delay:${index * 0.05}s">
      <img class="avatar" src="${cv.avatar}" alt="Photo de ${cv.conducteur}" onerror="this.src='https://i.pravatar.cc/80?img=${index+1}'">
      
      <div class="carte-infos">
        <div class="carte-entete">
          <span class="nom-conducteur">${cv.conducteur}</span>
          <span class="etoiles">${renduEtoiles(cv.note)}</span>
          <span class="note-avis">${cv.note} (${cv.nbAvis} avis)</span>
          ${estMien ? '<span class="badge">✏️ Mon trajet</span>' : ""}
        </div>
        
        <div class="trajet-ligne">
          <span>${cv.depart}</span>
          <span class="fleche-trajet">→</span>
          <span>${cv.arrivee}</span>
        </div>
        
        <div class="meta-infos">
          <span>📅 ${formaterDate(cv.date)}</span>
          <span>🕐 ${cv.heure}</span>
          <span>👤 ${cv.places} place${cv.places > 1 ? "s" : ""}</span>
          <span>🚗 ${cv.vehicule}</span>
        </div>
        
        ${badgeEco(cv.vehicule)}
        
        ${cv.description ? `<p style="font-size:0.82rem; color:var(--discret); margin-top:8px; margin-left:0;">${cv.description}</p>` : ""}
      </div>
      
      <div class="prix-actions">
        <div class="prix">${cv.prix} €</div>
        <div class="places-dispo">par personne</div>
        ${estMien
          ? `<div class="actions-carte">
               <button class="btn btn--modifier" onclick="ouvrirModification('${cv.id}')">✏️ Modifier</button>
               <button class="btn btn--supprimer" onclick="supprimerTrajet('${cv.id}')">🗑️</button>
             </div>`
          : `<button class="btn btn--principal btn--petit">Réserver</button>`
        }
      </div>
    </article>`;
}

// Met à jour la liste des trajets affichés
function afficherResultats(liste) {
  const conteneur = document.getElementById("listeCovoiturages");
  const msgVide   = document.getElementById("msgAucunResultat");
  const compteur  = document.getElementById("compteurResultats");

  if (liste.length === 0) {
    conteneur.innerHTML = "";
    msgVide.style.display = "block";
    compteur.textContent = "0 trajet";
    return;
  }

  msgVide.style.display = "none";
  compteur.textContent  = `${liste.length} trajet${liste.length > 1 ? "s" : ""}`;
  conteneur.innerHTML   = liste.map((cv, i) => creerCarteHTML(cv, i)).join("");
}

// Met à jour la sidebar avec les trajets de l'utilisateur
function afficherMesTrajets() {
  const mesTrajets = tousLesCovoiturages.filter(cv => cv.userId === CURRENT_USER_ID);
  const conteneur  = document.getElementById("mesTrajets");

  if (mesTrajets.length === 0) {
    conteneur.innerHTML = `<p class="sidebar-vide">Vous n'avez pas encore proposé de trajet.</p>`;
    return;
  }

  conteneur.innerHTML = mesTrajets.map(cv => `
    <div class="mini-trajet">
      <div class="mini-trajet-titre">${cv.depart} → ${cv.arrivee}</div>
      <div class="mini-trajet-info">${formaterDate(cv.date)} à ${cv.heure} • ${cv.prix} € • ${cv.places} place${cv.places > 1 ? "s" : ""}</div>
      <div class="mini-trajet-actions">
        <button class="btn btn--modifier" onclick="ouvrirModification('${cv.id}')">✏️ Modifier</button>
        <button class="btn btn--supprimer" onclick="supprimerTrajet('${cv.id}')">🗑️ Supprimer</button>
      </div>
    </div>
  `).join("");
}

// Branche tous les écouteurs du formulaire de recherche
function initRecherche() {
  const form = document.getElementById("formRecherche");

  // Filtrage en temps réel sur les champs texte
  ["inputDepart", "inputArrivee"].forEach(id => {
    document.getElementById(id).addEventListener("input", appliquerFiltres);
  });

  // Filtrage au changement de date/places/filtres avancés
  ["inputDate", "inputPlaces", "filtrePrix", "filtreHeure", "filtreConducteur", "filtreEco"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("change", appliquerFiltres);
  });

  form.addEventListener("submit", e => {
    e.preventDefault();
    appliquerFiltres();
  });
}

function appliquerFiltres() {
  const depart     = document.getElementById("inputDepart").value.toLowerCase().trim();
  const arrivee    = document.getElementById("inputArrivee").value.toLowerCase().trim();
  const date       = document.getElementById("inputDate").value;
  const places     = parseInt(document.getElementById("inputPlaces").value) || 1;
  const prixMax    = parseInt(document.getElementById("filtrePrix").value);
  const heure      = document.getElementById("filtreHeure").value;
  const conducteur = document.getElementById("filtreConducteur").value;
  const ecoOnly    = document.getElementById("filtreEco").checked;

  resultatsFiltres = tousLesCovoiturages.filter(cv => {
    if (depart && !cv.depart.toLowerCase().includes(depart)) return false;
    if (arrivee && !cv.arrivee.toLowerCase().includes(arrivee)) return false;
    if (date && cv.date !== date) return false;
    if (cv.places < places) return false;
    if (cv.prix > prixMax) return false;
    if (heure && cv.heure < heure) return false;
    if (conducteur && cv.profil !== conducteur) return false;
    if (ecoOnly && cv.vehicule !== "Électrique" && cv.vehicule !== "Hybride") return false;
    return true;
  });

  const titre = (depart || arrivee)
    ? `Résultats : ${depart || "..."} → ${arrivee || "..."}`
    : "Trajets disponibles";

  document.getElementById("titreResultats").textContent = titre;
  afficherResultats(resultatsFiltres);
}

// Gère le slider de prix et l'ouverture des filtres avancés
function initFiltresAvances() {
  const slider  = document.getElementById("filtrePrix");
  const valeur  = document.getElementById("valPrix");
  const btn     = document.getElementById("btnFiltres");
  const panel   = document.getElementById("panelFiltres");

  slider.addEventListener("input", () => {
    valeur.textContent = slider.value + " €";
    appliquerFiltres();
  });

  btn.addEventListener("click", () => {
    const ouvert = panel.classList.toggle("visible");
    btn.classList.toggle("ouvert", ouvert);
  });
}

// Intervertit les valeurs des champs départ et arrivée
function initSwap() {
  document.getElementById("btnSwap").addEventListener("click", () => {
    const dep = document.getElementById("inputDepart");
    const arr = document.getElementById("inputArrivee");
    [dep.value, arr.value] = [arr.value, dep.value];
    appliquerFiltres();
  });
}

// Ouvre, ferme et pré-remplit la modale
function ouvrirModal() {
  document.getElementById("formProposer").reset();
  document.getElementById("editIndex").value = "";
  document.getElementById("modalTitre").textContent = "Proposer un trajet";
  document.getElementById("btnSubmitForm").textContent = "Publier le trajet";
  effacerErreurs();
  document.getElementById("modalOverlay").classList.add("active");
}

function fermerModal(e) {
  // Ferme seulement si clic sur l'overlay (pas sur la modale elle-même)
  if (e && e.target !== document.getElementById("modalOverlay")) return;
  document.getElementById("modalOverlay").classList.remove("active");
}

function ouvrirModification(id) {
  const cv = tousLesCovoiturages.find(c => c.id === id);
  if (!cv || cv.userId !== CURRENT_USER_ID) return;

  document.getElementById("editIndex").value      = id;
  document.getElementById("fDepart").value        = cv.depart;
  document.getElementById("fArrivee").value       = cv.arrivee;
  document.getElementById("fDate").value          = cv.date;
  document.getElementById("fHeure").value         = cv.heure;
  document.getElementById("fPlaces").value        = cv.places;
  document.getElementById("fPrix").value          = cv.prix;
  document.getElementById("fVehicule").value      = cv.vehicule;
  document.getElementById("fConducteur").value    = cv.profil;
  document.getElementById("fDescription").value  = cv.description;

  document.getElementById("modalTitre").textContent    = "Modifier mon trajet";
  document.getElementById("btnSubmitForm").textContent = "Enregistrer les modifications";

  effacerErreurs();
  document.getElementById("modalOverlay").classList.add("active");
}

// Vérifie que les champs obligatoires sont remplis
function validerFormulaire() {
  let valide = true;
  effacerErreurs();

  const champs = [
    { id: "fDepart",   errId: "errDepart",  msg: "Le départ est requis." },
    { id: "fArrivee",  errId: "errArrivee", msg: "L'arrivée est requise." },
    { id: "fDate",     errId: "errDate",    msg: "La date est requise." },
    { id: "fPlaces",   errId: "errPlaces",  msg: "Indiquez le nombre de places (1–6)." },
    { id: "fPrix",     errId: "errPrix",    msg: "Indiquez un prix valide." },
  ];

  champs.forEach(({ id, errId, msg }) => {
    const el = document.getElementById(id);
    if (!el.value || el.value.trim() === "") {
      document.getElementById(errId).textContent = msg;
      el.classList.add("invalide");
      valide = false;
    }
  });

  const places = parseInt(document.getElementById("fPlaces").value);
  if (places < 1 || places > 6) {
    document.getElementById("errPlaces").textContent = "Entre 1 et 6 places.";
    document.getElementById("fPlaces").classList.add("invalid");
    valide = false;
  }

  return valide;
}

function effacerErreurs() {
  ["errDepart", "errArrivee", "errDate", "errPlaces", "errPrix"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = "";
  });
  ["fDepart", "fArrivee", "fDate", "fPlaces", "fPrix"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.remove("invalide");
  });
}

// Crée ou modifie un trajet à la soumission du formulaire
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("formProposer").addEventListener("submit", e => {
    e.preventDefault();
    if (!validerFormulaire()) return;

    const id        = document.getElementById("editIndex").value;
    const estModif  = id !== "";

    const nouveauCV = {
      id:          estModif ? id : "cv_" + Date.now(),
      userId:      CURRENT_USER_ID,
      conducteur:  CURRENT_USER_NAME,
      avatar:      "https://i.pravatar.cc/80?img=11",
      note:        4.6,
      nbAvis:      estModif ? tousLesCovoiturages.find(c => c.id === id)?.nbAvis || 0 : 0,
      depart:      document.getElementById("fDepart").value.trim(),
      arrivee:     document.getElementById("fArrivee").value.trim(),
      date:        document.getElementById("fDate").value,
      heure:       document.getElementById("fHeure").value || "00:00",
      places:      parseInt(document.getElementById("fPlaces").value),
      prix:        parseFloat(document.getElementById("fPrix").value),
      vehicule:    document.getElementById("fVehicule").value,
      profil:      document.getElementById("fConducteur").value,
      description: document.getElementById("fDescription").value.trim()
    };

    if (estModif) {
      const idx = tousLesCovoiturages.findIndex(c => c.id === id);
      if (idx !== -1) tousLesCovoiturages[idx] = nouveauCV;
      afficherToast("✅ Trajet modifié avec succès !");
    } else {
      tousLesCovoiturages.unshift(nouveauCV);
      afficherToast("🎉 Trajet publié avec succès !");
    }

    sauvegarderDonnees(tousLesCovoiturages);
    appliquerFiltres();
    afficherMesTrajets();
    document.getElementById("modalOverlay").classList.remove("active");
  });
});

// Supprime un trajet après confirmation
function supprimerTrajet(id) {
  const cv = tousLesCovoiturages.find(c => c.id === id);
  if (!cv || cv.userId !== CURRENT_USER_ID) return;

  if (!confirm(`Supprimer le trajet ${cv.depart} → ${cv.arrivee} ?`)) return;

  tousLesCovoiturages = tousLesCovoiturages.filter(c => c.id !== id);
  sauvegarderDonnees(tousLesCovoiturages);
  appliquerFiltres();
  afficherMesTrajets();
  afficherToast("🗑️ Trajet supprimé.");
}

// Affiche un message de confirmation temporaire
function afficherToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("visible");
  setTimeout(() => toast.classList.remove("visible"), 3000);
}

// Formate une date ISO en texte lisible en français
function formaterDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
}