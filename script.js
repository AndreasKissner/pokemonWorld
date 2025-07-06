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


let isSearching = false;
let currentBigCardIndex = 0;
let startIndex = 20;
let isLoading = false;
let allPokemons = [];
let allPokemonList = [];

function debounce(fn, wait = 300) {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn(...args), wait);
    };
}

async function fetchAndAddPokemon(url) {
    const pokemon = await loadPokemonDetails(url);
    if (!pokemon) return;
    pokemon.weaknesses = await loadWeakness(pokemon);
    pokemon.evolutions = await loadEvolution(pokemon);
    allPokemons.push(pokemon);
}

async function loadInitPokemons() {
    const list = await loadPokemonList(20, 0);
    for (let i = 0; i < list.length; i++) {
        await fetchAndAddPokemon(list[i].url);
    }
}

function renderBigCardByIndex(index) {
    currentBigCardIndex = index;
    const pokemon = allPokemons[index];
    renderBigCard(pokemon);
}

function changeBigCard(direction) {
    const newImgIndex = currentBigCardIndex + direction;
    if (newImgIndex >= 0 && newImgIndex < allPokemons.length) {
        renderBigCardByIndex(newImgIndex);
    }
}

async function loadInitPokemonsWithSpinner() {
    toggleSpinner(true);
    await loadInitPokemons();
    renderMiniCard();
    toggleSpinner(false);
}

function toggleSpinner(show) {
    const overlay = document.getElementById("big-overlay");
    const content = document.getElementById("mini-card-content");
    if (show) {
        overlay.classList.remove("d-none");
        content.classList.add("loading");
    } else {
        setTimeout(() => {
            overlay.classList.add("d-none");
            content.classList.remove("loading");
        }, 1000);
    }
}

function initSearch() {
    const input = document.getElementById("input-search");
    input.addEventListener("input", debounce(() => {
        handleSearch(input.value.toLowerCase());
    }));
}

async function handleSearch(query) {
    if (query.length >= 3) {
        await searchPokemons(query);
    } else {
        await resetSearch();
    }
}

async function searchPokemons(query) {
    isSearching = true;
    const matches = allPokemonList.filter(pkm => pkm.name.includes(query)).slice(0, 10);
    const results = [];
    for (let i = 0; i < matches.length; i++) {
        const pokemon = await loadPokemonDetails(matches[i].url);
        results.push(pokemon);
    }
    renderFilteredCards(results);
}

async function resetSearch() {
    isSearching = false;
    allPokemons = [];
    document.getElementById("mini-card-content").innerHTML = "";
    await loadInitPokemons();
    renderMiniCard();
}


async function loadAllPokemonList() {
    const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0");
    const data = await response.json();
    allPokemonList = data.results; // [{name, url}, ...]
}

async function renderBigCardDirect(pokemonId) {
    let found = allPokemons.find(p => p.id === pokemonId);
    if (!found) {
        try {
            const url = `https://pokeapi.co/api/v2/pokemon/${pokemonId}`;
            found = await loadPokemonDetails(url);
            allPokemons.push(found);
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
    location.reload();
}

async function loadMorePokemons() {
    isLoading = true;
    const lastScrollY = window.scrollY;
    toggleSpinner(true);;
    const newList = await loadPokemonList(20, allPokemons.length);
    for (let i = 0; i < newList.length; i++) {
        await fetchAndAddPokemon(newList[i].url);
    }
    toggleSpinner(false);;
    renderMiniCard(allPokemons.length - newList.length);
    window.scrollTo({ top: lastScrollY, behavior: "auto" });
    isLoading = false;
}

function colorMiniCards() {
    const cards = document.querySelectorAll(".card");
    for (let i = 0; i < cards.length; i++) {
        const card = cards[i];
        const pokemon = allPokemons[i];
        if (!pokemon) continue;
        const type = pokemon.types[0].type.name;
        const bgColor = typeColors[type] || "#ccc";
        card.style.backgroundColor = bgColor;
    }
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

    setTimeout(() => {
        window.dispatchEvent(new Event('scroll'));
    }, 100);
}

function createEvolutionHTML(evoList) {
    let evoHTML = "";
    for (let i = 0; i < evoList.length; i++) {
        const evo = evoList[i];
        evoHTML += `
      <div class="evo-entry">
        <img src="${evo.img}" class="evo-img" alt="${evo.name}">
        <p class="evo-name">${evo.name.toUpperCase()}</p>
      </div>
    `;
    }
    return evoHTML;
}

window.addEventListener("scroll", () => {
    const scrollBottom = (window.innerHeight + window.scrollY) / document.body.scrollHeight > 0.95;
    const btn = document.getElementById("scroll-top-btn");
    if (window.scrollY > 300) {
        btn.classList.remove("d-none");
    } else {
        btn.classList.add("d-none");
    }
    if (scrollBottom && !isLoading && !isSearching) {
        loadMorePokemons();
    }
});

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./scriptsFolder/service-worker.js')
      .then(reg => console.log('Service Worker registered', reg))
      .catch(err => console.error('Service Worker error', err));
  });
}
