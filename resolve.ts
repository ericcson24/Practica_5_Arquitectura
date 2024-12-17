async function fetchPokemonData(identifier: string | number) {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${identifier}`);
  if (!response.ok) throw new Error("Pokémon no encontrado");
  return await response.json();
}

async function fetchAbilityDetails(url: string) {
  const response = await fetch(url);
  const data = await response.json();

  const effectEntry =
    data.effect_entries.find((entry: any) => entry.language.name === "es") ||
    data.effect_entries.find((entry: any) => entry.language.name === "en");

  return effectEntry ? effectEntry.effect : "Efecto no disponible";
}

async function fetchMoveDetails(url: string) {
  const response = await fetch(url);
  const data = await response.json();
  return data.power || null; // Devuelve el poder si existe
}

export const resolvers = {
  Query: {
    pokemon: async (_: unknown, args: { name?: string; id?: number }) => {
      const identifier = args.name || args.id;
      if (!identifier) throw new Error("Se debe proporcionar un nombre o un ID");

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
      // Resolver habilidades solo si son solicitadas
      return await Promise.all(
        parent.abilities.map(async (abilityEntry: any) => {
          const effect = await fetchAbilityDetails(abilityEntry.ability.url);
          return {
            name: abilityEntry.ability.name,
            effect,
          };
        })
      );
    },

    moves: async (parent: any) => {
      // Resolver movimientos solo si son solicitados
      return await Promise.all(
        parent.moves.map(async (moveEntry: any) => {
          const power = await fetchMoveDetails(moveEntry.move.url);
          return {
            name: moveEntry.move.name,
            power,
          };
        })
      );
    },
  },
};
