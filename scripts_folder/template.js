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
