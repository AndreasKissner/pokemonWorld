function getTemplate(section) {
  if (section === "header") {
    return `
        <header class="flex-standard mt-5 mb-5">
            <h1>Pokémon World</h1>
            <label for="input_search" class="form-label"></label>
            <input type="text" class="form-control" id="input-search" placeholder="SEARCH POKEMON....">
            <button onclick="loadMorePokemons()" type="button" id="load_more_btn" class="btn btn-outline-secondary">LOAD MORE POKEMONS</button>
            <button onclick="resetALLPokemon()" type="button" id="reset-btn" class="btn btn-outline-danger">RESET ALL</button>
        </header>
        `;
  }

  if (section === "footer") {
    return `
        <footer class="bg-dark text-light py-4 ">
            <div class="footer-container text-center">
                <p class="mb-1">Thanks for exploring the world of Pokémon!</p>
                <p class="mb-2">Created with the FORCE by Andreas – for all trainers out there.</p>
                <a href="https://www.pokemon.com/us/" target="_blank" class="text-warning text-decoration-none">
                    Visit the official Pokémon website
                </a>
                <div class="mt-3">
                    <img src="./assets/image/spinner.svg" alt="Pokéball" width="40" height="40">
                </div>
            </div>
        </footer>
        `;
  }
  return ""; // Fallback for security 
}

function getMiniCardTemplate(pokemon) {
  return `
    <div class="card card-3d mt-5 mb-5" onclick="renderBigCardDirect(${pokemon.id})">
      <div class="card-body-img flex-standard">
        <img class="card-img-top" src="${pokemon.sprites.other['official-artwork'].front_default}">
      </div>
      <div class="card-body">
        <h5 class="card-title flex-standard">
          <p class="name-of-pokemon">${pokemon.name.toUpperCase()}</p>
          <div id="index-of-pokemon">(# ${pokemon.id})</div>
        </h5>
      </div>
      <div class="card-body flex-standard">
        <p class="card-link">TYP: <span>${pokemon.types[0].type.name}</span></p>
      </div>
    </div>
  `;
}


function getBigCardTemplate(pokemon, weaknessText, evo1, evo2, evo3) {
  return `
    <div class="flex-standard big-card">
   <div class="close-btn" onclick="closeBigCard()">×</div>
      <div class="img-name-id-big">
        <div class="card-body-img">
          <img src="${pokemon.sprites.other['official-artwork'].front_default}" class="card-img-top" alt="${pokemon.name}">
        </div>
           
        <div class="card-body">
          <h5 class="card-title">
            <p class="name-of-pokemon">${pokemon.name.toUpperCase()}</p>
            <div id="index-of-pokemon">(# ${pokemon.id})</div>
          </h5>
        </div>
      </div>

      <ul class="list-group list-group-flush">
        <li class="list-group-item">
          <img class="svg-mini-card" src="./assets/image/heart.svg" alt="heart">
          <p id="health"> HP: ${pokemon.stats[0].base_stat}</p>
        </li>
        <li class="list-group-item">
          <img class="svg-mini-card" src="./assets/image/sword.svg" alt="sword">
          <p id="force"> ATK: ${pokemon.stats[1].base_stat}</p>
        </li>
        <li class="list-group-item">
          <img class="svg-mini-card" src="./assets/image/shield.svg" alt="shield">
          <p id="protection"> DEF: ${pokemon.stats[2].base_stat}</p>
        </li>
      </ul>

     <div class="big-right-skills">
      <p class="weak">Weekness:</p>
        <p class="weak">${weaknessText}</p>
        <div class="evo">
             
          <div class="evo-entry">
          <div class="evo-title">
            <p class="evo-title-text">&nbsp;&nbsp;EVOLUTION:</p>
            </div>
            <img src="${evo1.img}" class="evo-img" alt="${evo1.name}">
            <p class="evo-name">${evo1.name.toUpperCase()}</p>
         
          <div class="evo-entry">
            <img src="${evo2.img}" class="evo-img" alt="${evo2.name}">
            <p class="evo-name">${evo2.name.toUpperCase()}</p>
          </div>
          <div class="evo-entry">
            <img src="${evo3.img}" class="evo-img" alt="${evo3.name}">
            <p class="evo-name">${evo3.name.toUpperCase()}</p>
          </div>
        </div>
      </div>

 <div class="btn-change-overlay-img">
  <button class="btn btn-outline-primary" onclick="showPreviousPokemon(${pokemon.id})">LAST</button>
  <button class="btn btn-outline-light" onclick="showNextPokemon(${pokemon.id})">NEXT</button>
</div>

  </div>
  `;
}
