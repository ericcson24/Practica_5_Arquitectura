import { Flight, FlightModel } from "./types.ts";

export const cabiovuelo = (flight: FlightModel): Flight => {
  return {
    id: flight._id!.toString(), // Convierte el `_id` de MongoDB en `id` de tipo string
    origen: flight.origen,
    destino: flight.destino,
    fechaHora: flight.fechaHora,
  };
};
