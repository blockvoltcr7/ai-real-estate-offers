// Import necessary modules
import { config } from "dotenv"; // Loads environment variables from a .env file into process.env
import { defineConfig } from "drizzle-kit"; // Function to define configuration for Drizzle ORM

// Load environment variables from the specified .env.local file
config({ path: ".env.local" });

// Export the configuration for Drizzle ORM
export default defineConfig({
  // Path to the database schema file
  schema: "./server/db/schema.ts",

  // Output directory for generated migration files
  out: "./migrations",

  // Specify the database dialect being used
  dialect: "postgresql",

  // Database credentials, using the URL from environment variables
  dbCredentials: {
    url: process.env.POSTGRES_URL!, // The URL to connect to the PostgreSQL database
  },
});

// This configuration is essential for setting up Drizzle ORM with PostgreSQL.
// It allows the application to connect to the database using the credentials defined in the environment variables,
// ensuring that sensitive information is not hardcoded in the source code.
// The schema file defines the structure of the database, and the output directory is where migration files will be stored.
