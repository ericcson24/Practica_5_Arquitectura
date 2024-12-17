export const typeDefs = `#graphql
  type Ability {
    name: String!
    effect: String
  }

  type Move {
    name: String!
    power: Int
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
