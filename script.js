
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
    const loadMoreBtn = document.getElementById("load-more-btn");
    if (query.length >= 3) {
        if (loadMoreBtn) loadMoreBtn.classList.add("d-none");
        await searchPokemons(query);
    } else {
        if (loadMoreBtn) loadMoreBtn.classList.remove("d-none");
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
  document.getElementById("input-search").value = "";
  allPokemons = [];
  document.getElementById("mini-card-content").innerHTML = "";
  await loadInitPokemons();
  renderMiniCard();
}

async function loadAllPokemonList() {
    const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0");
    const data = await response.json();
    allPokemonList = data.results; 
}

async function renderBigCardDirect(pokemonId) {
  let index = allPokemons.findIndex(p => p.id === pokemonId);
  if (index === -1) {
    try {
      const url = `https://pokeapi.co/api/v2/pokemon/${pokemonId}`;
      const found = await loadPokemonDetails(url);
      found.weaknesses = await loadWeakness(found);
      found.evolutions = await loadEvolution(found);
      allPokemons.push(found);
      index = allPokemons.length - 1;
    } catch (err) {
      console.warn("Error by loading:", err);
      return;
    }
  }
  renderBigCardByIndex(index);
}  


async function fetchAndStorePokemonById(pokemonId) {
    const url = `https://pokeapi.co/api/v2/pokemon/${pokemonId}`;
    const pokemon = await loadPokemonDetails(url);
    if (!pokemon) throw new Error("Pokemon not found");
    pokemon.weaknesses = await loadWeakness(pokemon);
    pokemon.evolutions = await loadEvolution(pokemon);
    allPokemons.push(pokemon);
    return allPokemons.length - 1;
}

async function renderBigCardDirect(pokemonId) {
    let index = allPokemons.findIndex(p => p.id === pokemonId);
    if (index === -1) {
        try {
            index = await fetchAndStorePokemonById(pokemonId);
        } catch (err) {
            console.warn("Error by loading:", err);
            return;
        }
    }
    renderBigCardByIndex(index);
}



function showPreviousPokemon(currentId) {
  const index = allPokemons.findIndex(p => p.id === currentId);
  if (index !== -1) {
    const prevIndex = (index - 1 + allPokemons.length) % allPokemons.length;
    renderBigCardByIndex(prevIndex);
  }
}

function showNextPokemon(currentId) {
  const index = allPokemons.findIndex(p => p.id === currentId);
  if (index !== -1) {
    const nextIndex = (index + 1) % allPokemons.length;
    renderBigCardByIndex(nextIndex);
  }
}

function resetALLPokemon() {
  isSearching = false;
  document.getElementById("input-search").value = ""; // Suchfeld leeren
  document.getElementById("mini-card-content").innerHTML = "";
  document.getElementById("load-more-btn").classList.remove("d-none");

  renderMiniCard();
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

function colorMiniCards(pokemonList = allPokemons) {
    const cards = document.querySelectorAll(".card");
    for (let i = 0; i < cards.length; i++) {
        const card = cards[i];
        const pokemon = pokemonList[i];
        if (!pokemon) continue;
        const type = pokemon.types[0].type.name;
        card.classList.add(`type-${type}`);
    }
}


function colorBigCard(pokemon) {
    const type = pokemon.types[0].type.name;
    const bigCard = document.querySelector(".big-card");
    if (bigCard) {
        bigCard.classList.add(`type-${type}`);
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
    navigator.serviceWorker.register('./scriptsFolder/service-worker.js');
  });
}
