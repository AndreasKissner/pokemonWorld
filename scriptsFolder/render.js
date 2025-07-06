function renderSection(id) {
  const element = document.getElementById(id);
  element.innerHTML = getTemplate(id);
}

function renderMiniCard(start = 0) {
  const miniCardContent = document.getElementById("mini-card-content");
  for (let i = start; i < allPokemons.length; i++) {
    const miniCard = getMiniCardTemplate(allPokemons[i]);
    miniCardContent.insertAdjacentHTML("beforeend", miniCard);
  }
  colorMiniCards();
}

async function renderBigCard(pokemon) {
  const overlay = document.getElementById("big-card-overlay");
  const weaknessText = pokemon.weaknesses || await loadWeakness(pokemon);
  const evoList = pokemon.evolutions || await loadEvolution(pokemon);

  overlay.innerHTML = getBigCardTemplate(pokemon, weaknessText, evoList);
  overlay.classList.remove("d-none");
  document.body.style.overflow = "hidden";
  colorBigCard(pokemon);
}

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
  await loadAllPokemonList();
  await loadInitPokemonsWithSpinner();
  initSearch();
});