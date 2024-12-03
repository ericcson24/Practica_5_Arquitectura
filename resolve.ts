import { Vehicle, VehicleModel, Part, PartModel } from "./types.ts";

/**
 * Transforma un vehículo del modelo de MongoDB al formato de GraphQL.
 * @param vehicle El modelo del vehículo desde MongoDB.
 * @param parts Las partes asociadas al vehículo.
 * @returns El vehículo en formato GraphQL.
 */
export const transformVehicle = (vehicle: VehicleModel, parts: Part[] = []): Vehicle => ({
  id: vehicle._id.toString(),
  name: vehicle.name,
  manufacturer: vehicle.manufacturer,
  year: vehicle.year,
  parts,
});

/**
 * Transforma un repuesto del modelo de MongoDB al formato de GraphQL.
 * @param part El modelo del repuesto desde MongoDB.
 * @returns El repuesto en formato GraphQL.
 */
export const transformPart = (part: PartModel): Part => ({
  id: part._id.toString(),
  name: part.name,
  price: part.price,
  vehicleId: part.vehicleId.toString(),
});
