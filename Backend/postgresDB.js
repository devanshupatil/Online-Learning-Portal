const { Connector } = require('@google-cloud/cloud-sql-connector');
const pg = require('pg');
const { Pool } = pg;
require('dotenv').config();
const { GoogleAuth } = require('google-auth-library');

let poolPromise = null;

async function getPool() {
  if (!poolPromise) {
    poolPromise = (async () => {


      // Validate auth credentials
      const auth = new GoogleAuth();
      const projectId = await auth.getProjectId();

      // console.log('Project ID from auth:', projectId);

      const credentials = await auth.getCredentials();

      if (credentials.client_email) {
        console.log('Using service account:', credentials.client_email);
      }

      try {
        const connector = new Connector();
        // Get secure connection options (replace values as needed)
        const clientOpts = await connector.getOptions({
          instanceConnectionName: process.env.INSTANCE_CONNECTION_NAME, // ex: 'my-project:region:instance'
          authType: 'IAM'
        });

        // Create pool with db user and name from environment or secrets
        // console.log('DB_PASSWORD loaded:', !!process.env.DB_PASSWORD);
        const pool = new Pool({
          ...clientOpts,  // Applies secure host/port/socket, SSL, etc.
          user: process.env.DB_USER,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_NAME,
          max: 10,
          idleTimeoutMillis: 10_000
        });



        // Use the pool for queries in your routes

        async function test() {
          const { rows } = await pool.query('SELECT 1 AS ok');
          console.log('DB OK:', rows[0]);
        }
        test().catch(console.error);

        console.log('Pool created successfully');
        return pool;
      } catch (error) {
        console.error('Error initializing Cloud SQL Connector:', error);
        throw error; // Re-throw to handle in caller
      }
    })();
  }
  return poolPromise;
}

module.exports = getPool;