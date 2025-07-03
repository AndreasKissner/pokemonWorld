function renderSection(id) {
  const element = document.getElementById(id);
  element.innerHTML = getTemplate(id);
}

function renderMiniCard(start = 0) {
  const miniCardContent = document.getElementById("mini-card-content");
  for (let i = start; i < allPokemons.length; i++) {
    const miniCard = getMiniCardTemplate(allPokemons[i]);
    miniCardContent.insertAdjacentHTML("beforeend", miniCard);//Method that allows you to insert HTML code as a string directly into the DOM – without creating a new DOM element with createElement
  }
  colorMiniCards();
}
// NEW 03.07.2025
async function renderBigCard(pokemon) {
  const overlay = document.getElementById("big-card-overlay");
  const weaknessText = pokemon.weaknesses || await loadWeakness(pokemon);
  const evoList = pokemon.evolutions || await loadEvolution(pokemon);// NEU CHECK if here or he must new laoding

  overlay.innerHTML = getBigCardTemplate(pokemon, weaknessText, evoList);
  overlay.classList.remove("d-none");
  document.body.style.overflow = "hidden";
  colorBigCard(pokemon);
}


// Search render function for input search
function renderFilteredCards(filteredPokemons) {
  const container = document.getElementById("mini-card-content");
  container.innerHTML = "";
  for (let i = 0; i < filteredPokemons.length; i++) {
    const miniCard = getMiniCardTemplate(filteredPokemons[i], i);
    container.insertAdjacentHTML("beforeend", miniCard);
  }
}


window.addEventListener("load", async () => {
  renderSection("header");
  renderSection("footer");
  await loadAllPokemonList();           // <-- NEW
  await loadInitPokemonsWithSpinner();  // loading first 20 PKM
  /*  renderMiniCard(); */
  initSearch();
});