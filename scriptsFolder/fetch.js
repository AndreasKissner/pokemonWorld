async function loadPokemonList(maxLimit, startIndex) {
  try {
    const url = `https://pokeapi.co/api/v2/pokemon?limit=${maxLimit}&offset=${startIndex}`;
    const response = await fetch(url);
    const data = await response.json();
    return data.results;// NAME AND URL FOR EVERY  PKM
  } catch (error) {
    console.error('Fehler beim Laden der Pokémon-Liste:', error);
    return [];
  }
}

async function loadPokemonDetails(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;// name, id, sprites, type ec
  } catch (error) {
    console.error('Fehler beim Laden der Pokémon-Daten:', error);
    return null;
  }
}


// Weaknees 

async function loadWeakness(pokemon) {
  try {
    const typeUrl = pokemon.types[0].type.url; // URL zum Haupt-Typ holen
    const response = await fetch(typeUrl); // API-Aufruf zum Typ
    const data = await response.json(); // JSON-Daten laden
    const weaknesses = data.damage_relations.double_damage_from; // Schwächen holen
    let result = [];
    for (let i = 0; i < weaknesses.length; i++) {
      result.push(weaknesses[i].name);
    }
    return result.join(", "); // z.B. "fire, flying"
  } catch (error) {
    console.error("Fehler beim Laden der Schwächen:", error);
    return "unknown";
  }
}


// Evo
async function loadEvolution(pokemon) {
  try {
    const speciesResponse = await fetch(pokemon.species.url);
    const speciesData = await speciesResponse.json();
    const evoUrl = speciesData.evolution_chain.url;
    const evoResponse = await fetch(evoUrl);
    const evoData = await evoResponse.json();
    let chain = evoData.chain;
    let result = [];
    // 1. Stufe
    result.push(chain.species.name);
    // 2. Stufe
    if (chain.evolves_to.length > 0) {
      result.push(chain.evolves_to[0].species.name);
      // 3. Stufe (optional)
      if (chain.evolves_to[0].evolves_to.length > 0) {
        result.push(chain.evolves_to[0].evolves_to[0].species.name);
      }
    }
    let evoWithImg = [];
    for (let i = 0; i < result.length; i++) {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${result[i]}`);
      const data = await response.json();
      evoWithImg.push({
        name: data.name,
        img: data.sprites.other['official-artwork'].front_default
      });
    }
    
    return evoWithImg;
  } catch (error) {
    console.error("Fehler bei Evolution:", error);
    return [];
  }
}
