import { ObjectId } from "mongodb";

export interface Vehicle {
  id: string; // ID del vehículo como cadena
  name: string; // Nombre del vehículo
  manufacturer: string; // Fabricante del vehículo
  year: number; // Año de fabricación
  parts?: Part[]; // Lista de partes asociadas
  joke?: string; // Broma aleatoria para mostrar
}

export interface Part {
  id: string; // ID del repuesto como cadena
  name: string; // Nombre del repuesto
  price: number; // Precio del repuesto
  vehicleId: string; // ID del vehículo asociado
}

export interface VehicleModel {
  _id: ObjectId; // ID del vehículo en MongoDB
  name: string; // Nombre del vehículo
  manufacturer: string; // Fabricante del vehículo
  year: number; // Año de fabricación
}

export interface PartModel {
  _id: ObjectId; // ID del repuesto en MongoDB
  name: string; // Nombre del repuesto
  price: number; // Precio del repuesto
  vehicleId: ObjectId; // ID del vehículo asociado en MongoDB
}
