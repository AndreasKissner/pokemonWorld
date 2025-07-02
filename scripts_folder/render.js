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
    miniCardContent.insertAdjacentHTML("beforeend", miniCard);
  }
  colorMiniCards();
}