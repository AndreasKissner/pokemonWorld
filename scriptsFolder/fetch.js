async function loadPokemonList(maxLimit, startIndex) {
  try {
    const url = `https://pokeapi.co/api/v2/pokemon?limit=${maxLimit}&offset=${startIndex}`;
    const response = await fetch(url);
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error("Error loading PKM list:", error.message);
    return [];
  }
}

async function loadPokemonDetails(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error loading PKM details:", error.message);
    return null;
  }
}

async function loadWeakness(pokemon) {
  try {
    const typeUrl = pokemon.types[0].type.url;
    const response = await fetch(typeUrl);
    const data = await response.json();
    return data.damage_relations.double_damage_from
      .map(w => w.name)
      .join(", ");
  } catch (error) {
    console.error("Error loading weaknesses:", error.message);
    return "unknown";
  }
}

async function fetchEvolutionChainUrl(pokemon) {
  const speciesResponse = await fetch(pokemon.species.url);
  const speciesData = await speciesResponse.json();
  return speciesData.evolution_chain.url;
}

async function extractEvolutionNames(evoUrl) {
  const evoResponse = await fetch(evoUrl);
  const evoData = await response.json();
  const chain = evoData.chain;
  const result = [chain.species.name];

  if (chain.evolves_to.length > 0) {
    result.push(chain.evolves_to[0].species.name);
    if (chain.evolves_to[0].evolves_to.length > 0) {
      result.push(chain.evolves_to[0].evolves_to[0].species.name);
    }
  }
  return result;
}

async function fetchEvolutionImages(names) {
  const evoWithImg = [];
  for (const name of names) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
    const data = await response.json();
    evoWithImg.push({
      name: data.name,
      img: data.sprites.other['official-artwork'].front_default
    });
  }
  return evoWithImg;
}

async function loadEvolution(pokemon) {
  try {
    const evoUrl = await fetchEvolutionChainUrl(pokemon);
    const names = await extractEvolutionNames(evoUrl);
    return await fetchEvolutionImages(names);
  } catch (error) {
    console.error("Error with Evolution:", error.message);
    return [];
  }
}

async function loadPokemonDetails(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;// name, id, sprites, type ec
  } catch (error) {
    console.error('Error loading PKM details:', error);
    return null;
  }
}

async function loadWeakness(pokemon) {
  try {
    const typeUrl = pokemon.types[0].type.url; // URL zum Haupt-Typ holen Important 
    const response = await fetch(typeUrl); // API-for typ  Wichtig 
    const data = await response.json(); // JSON-Daten Loading
    const weaknesses = data.damage_relations.double_damage_from; // weakness get
    let result = [];
    for (let i = 0; i < weaknesses.length; i++) {
      result.push(weaknesses[i].name);
    }
    return result.join(", "); // "fire, flying"
  } catch (error) {
    console.error("Error loading weaknesses:", error);
    return "unknown";
  }
}

async function fetchEvolutionChainUrl(pokemon) {
  const speciesResponse = await fetch(pokemon.species.url);
  const speciesData = await speciesResponse.json();
  return speciesData.evolution_chain.url;
}

async function extractEvolutionNames(evoUrl) {
  const evoResponse = await fetch(evoUrl);
  const evoData = await evoResponse.json();
  const chain = evoData.chain;

  let result = [chain.species.name];
  if (chain.evolves_to.length > 0) {
    result.push(chain.evolves_to[0].species.name);
    if (chain.evolves_to[0].evolves_to.length > 0) {
      result.push(chain.evolves_to[0].evolves_to[0].species.name);
    }
  }
  return result;
}

async function fetchEvolutionImages(names) {
  const evoWithImg = [];
  for (const name of names) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
    const data = await response.json();
    evoWithImg.push({
      name: data.name,
      img: data.sprites.other['official-artwork'].front_default
    });
  }
  return evoWithImg;
}

async function loadEvolution(pokemon) {
  try {
    const evoUrl = await fetchEvolutionChainUrl(pokemon);
    const names = await extractEvolutionNames(evoUrl);
    return await fetchEvolutionImages(names);
  } catch (error) {
    console.error("Error with Evolution:", error);
    return [];
  }
}
