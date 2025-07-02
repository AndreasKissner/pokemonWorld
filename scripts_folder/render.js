function renderHeader(pokemon){
    let headerContent = document.getElementById("header");
    headerContent.innerHTML = getHeaderTemplate();
}

function renderFooter(){
    let footerContent = document.getElementById("footer");
    footerContent.innerHTML = getFooterTemplate();
}

function renderMiniCard(start = 0) {
  const miniCardContent = document.getElementById("mini-card-content");

  for (let i = start; i < allPokemons.length; i++) {
    const miniCard = getMiniCardTemplate(allPokemons[i]);
    miniCardContent.insertAdjacentHTML("beforeend", miniCard);//Method that allows you to insert HTML code as a string directly into the DOM – without creating a new DOM element with createElement
  }
  colorMiniCards();
}



async function renderBigCard(pokemon) {
  const overlay = document.getElementById("big-card-overlay");
  const weaknessText = await loadWeakness(pokemon);
  const evoList = await loadEvolution(pokemon);

  const evo1 = evoList[0] || { name: "?", img: "./assets/image/placeholder.png" }; // EVO IMAGE
  const evo2 = evoList[1] || { name: "?", img: "./assets/image/placeholder.png" };
  const evo3 = evoList[2] || { name: "?", img: "./assets/image/placeholder.png" };

  overlay.innerHTML = getBigCardTemplate(pokemon, weaknessText, evo1, evo2, evo3);
  overlay.classList.remove("d-none");
  document.body.style.overflow = "hidden";
  colorBigCard(pokemon);
}

