import { drizzle } from "drizzle-orm/planetscale-serverless";
import * as schema from "../db/schema";
import { connect } from "@planetscale/database";
const connection = connect({
  host: process.env["DATABASE_HOST"],
  username: process.env["DATABASE_USERNAME"],
  password: process.env["DATABASE_PASSWORD"],
});
export const db = drizzle(connection, { schema });
