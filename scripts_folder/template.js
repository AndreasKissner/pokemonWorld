function getHeaderTemplate(){
    return`
    <header class="flex-standard mt-5 mb-5">
        <h1>Pokémon World</h1>
        <label for="input_search" class="form-label"></label>
        <input type="text" class="form-control" id="input-search" placeholder="SEARCH POKEMON....">
        <button onclick="loadMorePokemons()" type="button" id="load_more_btn" class="btn btn-outline-secondary">LOAD MORE POKEMONS</button>
        <button onclick="resetALLPokemon()" type="button" id="reset-btn" class="btn btn-outline-danger">RESET ALL</button>
    </header>
    `;
}



function getFooterTemplate(){
    return`
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