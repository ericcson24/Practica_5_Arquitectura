import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

//-----------------------------------------------------------------------------------------------------------------------------\\

// Definición del esquema de GraphQL
const typeDefs = `#graphql
  type Ability {
    name: String!
    effect: String
  }

  type Move {
    name: String!
  }

  type Pokemon {
    id: Int!
    name: String!
    abilities: [Ability!]!
    moves: [Move!]!
  }

  type Query {
    pokemon(name: String, id: Int): Pokemon
  }
`;

//-----------------------------------------------------------------------------------------------------------------------------\\

// Funciones auxiliares para realizar peticiones a la PokeAPI
async function fetchPokemonData(identifier: string | number) {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${identifier}`);
  if (!response.ok) {
    throw new Error("Pokémon no encontrado");
  }
  return await response.json();
}

async function fetchAbilityDetails(url: string) {
  const response = await fetch(url);
  const data = await response.json();
  // Extraemos el efecto en español si existe, de lo contrario, en inglés
  const effectEntry =
    data.effect_entries.find((entry: any) => entry.language.name === "es") ||
    data.effect_entries.find((entry: any) => entry.language.name === "en");
  return effectEntry ? effectEntry.effect : "Efecto no disponible";
}

//-----------------------------------------------------------------------------------------------------------------------------\\

// Resolvers
const resolvers = {
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
      return await Promise.all(
        parent.abilities.map(async (abilityEntry: any) => {
          const name = abilityEntry.ability.name;
          const effect = await fetchAbilityDetails(abilityEntry.ability.url);
          return { name, effect };
        })
      );
    },

    moves: (parent: any) => {
      return parent.moves.map((moveEntry: any) => ({
        name: moveEntry.move.name,
      }));
    },
  },
};

//-----------------------------------------------------------------------------------------------------------------------------\\

// Configuración y arranque del servidor
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, { listen: { port: 4000 } });

console.log(`🚀 Servidor GraphQL corriendo en: ${url}`);
