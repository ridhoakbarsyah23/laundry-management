import { config } from 'dotenv'
config({ path: '.env.local' })
import postgres from 'postgres'
import fs from 'fs'

async function main() {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    throw new Error('DATABASE_URL is not set')
  }

  const sql = postgres(connectionString, { max: 1 })

  console.log('Running specific migration...')
  
  const query = fs.readFileSync('src/db/migrations/0001_perpetual_spyke.sql', 'utf8')
  
  // Split by statement-breakpoint
  const statements = query.split('--> statement-breakpoint').map(s => s.trim()).filter(Boolean)
  
  for (const statement of statements) {
    console.log('Executing:', statement.substring(0, 50) + '...')
    await sql.unsafe(statement)
  }
  
  console.log('Migrations completed!')
  
  await sql.end()
  process.exit(0)
}

main().catch((err) => {
  console.error('Migration failed!')
  console.error(err)
  process.exit(1)
})
