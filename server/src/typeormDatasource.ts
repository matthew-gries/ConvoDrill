import { DataSource } from "typeorm";
import { Convo } from "./entities/Convo";
import { ConvoEntry } from "./entities/ConvoEntry";
import { ConvoEntryResponse } from "./entities/ConvoEntryResponse";
import { User } from "./entities/User";
import path from "path";
import "dotenv-safe/config";


export const typeormDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  logging: true,
  // synchronize: true,
  migrations: [path.join(__dirname, "./migrations/*")],
  entities: [User, Convo, ConvoEntry, ConvoEntryResponse]
});