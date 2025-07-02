const typeColors = {
  normal: "#A8A77A",
  fire: "#EE8130",
  water: "#6390F0",
  electric: "#F7D02C",
  grass: "#7AC74C",
  ice: "#96D9D6",
  fighting: "#C22E28",
  poison: "#A33EA1",
  ground: "#E2BF65",
  flying: "#A98FF3",
  psychic: "#F95587",
  bug: "#A6B91A",
  rock: "#B6A136",
  ghost: "#735797",
  dragon: "#6F35FC",
  dark: "#705746",
  steel: "#B7B7CE",
  fairy: "#D685AD"
};
let currentBigCardIndex = 0;// Change next PKM
let startIndex = 20;
let isLoading = false;
let allPokemons = [];
let allPokemonList = []; // Nur name + url


async function loadInitPokemons() {
  const list = await loadPokemonList(20, 0); // GET 20 PKM NAME AND URL
  for (let i = 0; i < list.length; i++) {
    const url = list[i].url;
    const pokemon = await loadPokemonDetails(url);
    allPokemons.push(pokemon);
  }
}


function closeBigCard() {
  const overlay = document.getElementById("big-card-overlay");
  overlay.classList.add("d-none");     //  hide again
  document.body.style.overflow = "auto"; // Reactivate scroll 
}
document.getElementById("big-card-overlay").addEventListener("click", function (event) { // LEArning
  if (event.target.id === "big-card-overlay") {
    closeBigCard();
  }
});


// Image CHanger
function renderBigCardByIndex(index) {
  currentBigCardIndex = index; // For nows which image is current
  const pokemon = allPokemons[index];
  renderBigCard(pokemon);
}

function changeBigCard(direction) {
  const newImgIndex = currentBigCardIndex + direction;
  if (newImgIndex >= 0 && newImgIndex < allPokemons.length) {
    renderBigCardByIndex(newImgIndex);
  }
}


// Spinner
async function loadInitPokemonsWithSpinner() {
  showSpinner();  // Spinner sichtbar
  await loadInitPokemons(); // Pokemon-Daten laden
  renderMiniCard(); // Karten anzeigen
  hideSpinner(); // Spinner ausblenden
}


function showSpinner() {
  document.getElementById("big-overlay").classList.remove("d-none");
  document.getElementById("mini-card-content").classList.add("loading");
}

function hideSpinner() {
  setTimeout(() => {
    document.getElementById("big-overlay").classList.add("d-none");
    document.getElementById("mini-card-content").classList.remove("loading");
  }, 2000); // Spinner bleibt 2 Sekunden sichtbar
}




// Scroll Logik
window.addEventListener("scroll", () => {
  const scrollBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight;
  if (scrollBottom && !isLoading) {
    loadMorePokemons(); // kommt gleich
  }
});



async function loadMorePokemons() {
  const lastScrollY = window.scrollY; // 1. Scroll-Position merken
  showSpinner();                      // 2. Spinner anzeigen
  const newList = await loadPokemonList(20, allPokemons.length); // 3. Neue laden
  for (let i = 0; i < newList.length; i++) {
    const url = newList[i].url;
    const pokemon = await loadPokemonDetails(url);
    allPokemons.push(pokemon);
  }


  renderMiniCard(allPokemons.length - newList.length);  // 4. Karten rendern
  hideSpinner();  // 5. Spinner ausblende
  setTimeout(() => {
    window.scrollTo({ top: lastScrollY, behavior: "auto" });
  }, 100); // 100 ms Verzögerung für Stabilität
}


//search function
function initSearch() {
  const input = document.getElementById("input-search");
  if (!input) return;
  input.addEventListener("input", async () => {
    const queryInput = input.value.toLowerCase();
    if (queryInput.length >= 3) {
      const matches = allPokemonList.filter(p => p.name.includes(queryInput)).slice(0, 10); // z. B. nur 10 anzeigen
      const filteredPokemons = [];
      for (let i = 0; i < matches.length; i++) {
        const pokemon = await loadPokemonDetails(matches[i].url);
        filteredPokemons.push(pokemon);
      }
      renderFilteredCards(filteredPokemons);
    } else {
      renderMiniCard(); // zurück zur Liste
    }
  });
}

async function loadAllPokemonList() {
  const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0");
  const data = await response.json();
  allPokemonList = data.results; // [{name, url}, ...]
}

// script.js

async function renderBigCardDirect(pokemonId) {
  let found = allPokemons.find(p => p.id === pokemonId);
  if (!found) {
    try {
      const url = `https://pokeapi.co/api/v2/pokemon/${pokemonId}`;
      found = await loadPokemonDetails(url);
      allPokemons.push(found); // nachträglich hinzufügen
    } catch (err) {
      console.warn("Fehler beim Nachladen:", err);
      return;
    }
  }
  renderBigCard(found);
}

async function showNextPokemon(currentId) {
  const nextId = currentId + 1;
  await renderBigCardDirect(nextId);
}

async function showPreviousPokemon(currentId) {
  const prevId = currentId - 1;
  if (prevId < 1) return;
  await renderBigCardDirect(prevId);
}

function resetALLPokemon() {
  location.reload(); // Lädt die komplette Seite neu
}

async function loadMorePokemons() {
  const lastScrollY = window.scrollY;
  showSpinner();
  const newList = await loadPokemonList(20, allPokemons.length); // Weiter ab aktuellem Index
  for (let i = 0; i < newList.length; i++) {
    const url = newList[i].url;
    const pokemon = await loadPokemonDetails(url);
    allPokemons.push(pokemon);
  }
  hideSpinner();
  renderMiniCard(allPokemons.length - newList.length); // Nur die neuen rendern
  window.scrollTo({ top: lastScrollY, behavior: "auto" }); // Scrollposition behalten
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

window.addEventListener("scroll", () => {
  const btn = document.getElementById("scroll-top-btn");
  if (window.scrollY > 300) {
    btn.classList.remove("d-none");
  } else {
    btn.classList.add("d-none");
  }
});

function colorMiniCards() {
  const cards = document.querySelectorAll(".card");
  cards.forEach((card, index) => {
    const pokemon = allPokemons[index];
    if (!pokemon) return;
    const type = pokemon.types[0].type.name;
    const bgColor = typeColors[type] || "#ccc";
    card.style.backgroundColor = bgColor;
  });
}

function colorBigCard(pokemon) {
  const type = pokemon.types[0].type.name;
  const bgColor = typeColors[type] || "#ccc";
  const bigCard = document.querySelector(".big-card");
  if (bigCard) {
    bigCard.style.backgroundColor = bgColor;
  }
}

function closeBigCard() {
  document.getElementById("big-card-overlay").classList.add("d-none");
  document.body.style.overflow = "auto";
}
