import { MongoClient, ObjectId } from "mongodb";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { Flight, FlightModel } from "./types.ts";
import { cabiovuelo } from "./resolve.ts"; // Importa la función

//-----------------------------------------------------------------------------------------------------------------------------\\

//conexiones 

const MongoUrl = Deno.env.get("MONGO_URL");



const client = new MongoClient(MongoUrl);

await client.connect();
console.log("Conectado correctamente a la base de datos");

//-----------------------------------------------------------------------------------------------------------------------------\\

//base de datos

const db = client.db("flightDB");
const flightCollection = db.collection<FlightModel>("flights");

console.log("base de datos activa");

//-----------------------------------------------------------------------------------------------------------------------------\\

//esquema

const typeDefs = `#graphql
  type Flight {
    id: String!
    origen: String!
    destino: String!
    fechaHora: String!
  }

  type MutationResponse {
    message: String!
  }

  type Query {
    getFlights(origen: String, destino: String): [Flight!]!
    getFlight(id: String!): Flight
  }

  type Mutation {
    addFlight(origen: String!, destino: String!, fechaHora: String!): Flight!
    deleteFlight(id: String!): MutationResponse!
  }
`;

//-----------------------------------------------------------------------------------------------------------------------------\\

//resolvers

const resolvers = {

  Query: {
    getFlights: async (_: unknown, args: { origen?: string; destino?: string }): Promise<Flight[]> => {
      
      const query: Partial<FlightModel> = {};
      if (args.origen) query.origen = args.origen;
      if (args.destino) query.destino = args.destino;

      const result = await flightCollection.find(query).toArray();
      return result.map(cabiovuelo); // Utiliza la función de transformación
    },

    //----------------------------------------------------------\\

    getFlight: async (_: unknown, args: { id: string }): Promise<Flight | undefined> => {

      const flight = await flightCollection.findOne({ _id: new ObjectId(args.id) });
      if (!flight) return undefined;

      return cabiovuelo(flight); // Utiliza la función de transformación
    },
    },

    //------------------------------------------------------------------------------------------------------------------------\\

    Mutation: {
      
      addFlight: async (_: unknown, args: { origen: string; destino: string; fechaHora: string }): Promise<Flight> => {
        
        const { insertedId } = await flightCollection.insertOne({
          origen: args.origen,
          destino: args.destino,
          fechaHora: args.fechaHora,
        });

        return {
          id: insertedId.toString(),
          origen: args.origen,
          destino: args.destino,
          fechaHora: args.fechaHora,
        };
      },

    },


};

//-----------------------------------------------------------------------------------------------------------------------------\\

//arranque de server

  const server = new ApolloServer({
    typeDefs,
    resolvers,
  }
  );

const { url } = await startStandaloneServer(server, { listen: { port: 4000 } });

console.log(`🚀  Server ready at: ${url}`);
