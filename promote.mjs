import postgres from 'postgres';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const sql = postgres(process.env.DATABASE_URL);

async function promoteUsers() {
  try {
    const result = await sql`UPDATE users SET role = 'owner' RETURNING *`;
    console.log(`Successfully promoted ${result.length} user(s) to owner!`);
  } catch (error) {
    console.error('Error promoting users:', error);
  } finally {
    await sql.end();
  }
}

promoteUsers();
