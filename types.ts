import { ObjectId } from "mongodb";

export const typeDefs = `#graphql
  # Define el tipo de habilidad con nombre y efecto
  type Ability {
    name: String!
    effect: String
  }

  # Define el tipo de movimiento con nombre
  type Move {
    name: String!
  }

  # Define el tipo Pokémon con sus propiedades básicas
  type Pokemon {
    id: Int!
    name: String!
    abilities: [Ability!]!
    moves: [Move!]!
  }

  # Define las consultas disponibles
  type Query {
    # Consulta un Pokémon por nombre o ID
    pokemon(name: String, id: Int): Pokemon
  }
`;
