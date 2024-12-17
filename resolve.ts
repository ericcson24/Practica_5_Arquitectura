// Función auxiliar para obtener datos de la PokeAPI
async function fetchPokemonData(identifier: string | number) {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${identifier}`);
  if (!response.ok) {
    throw new Error("Pokémon no encontrado");
  }
  return await response.json();
}

// Función auxiliar para obtener detalles de la habilidad desde su URL
async function fetchAbilityDetails(url: string) {
  const response = await fetch(url);
  const data = await response.json();

  // Buscar el efecto en español o en inglés
  const effectEntry =
    data.effect_entries.find((entry: any) => entry.language.name === "es") ||
    data.effect_entries.find((entry: any) => entry.language.name === "en");

  return effectEntry ? effectEntry.effect : "Efecto no disponible";
}

//-----------------------------------------------------------------------------------------------------------------------------\\

// Resolvers para el esquema GraphQL
export const resolvers = {
  Query: {
    pokemon: async (_: unknown, args: { name?: string; id?: number }) => {
      const identifier = args.name || args.id;
      if (!identifier) throw new Error("Se debe proporcionar un nombre o un ID");

      // Obtener los datos básicos del Pokémon desde la PokeAPI
      const data = await fetchPokemonData(identifier);

      return {
        id: data.id,
        name: data.name,
        abilities: data.abilities,
        moves: data.moves,
      };
    },
  },

  Pokemon: {
    abilities: async (parent: any) => {
      // Resolver las habilidades y obtener el efecto de cada una
      return await Promise.all(
        parent.abilities.map(async (abilityEntry: any) => {
          const name = abilityEntry.ability.name;
          const effect = await fetchAbilityDetails(abilityEntry.ability.url);
          return { name, effect };
        })
      );
    },

    moves: (parent: any) => {
      // Resolver los movimientos del Pokémon
      return parent.moves.map((moveEntry: any) => ({
        name: moveEntry.move.name,
      }));
    },
  },
};
