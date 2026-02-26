const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function setupDatabase() {
    console.log('🔧 Setting up database...\n');
    
    // First, connect to postgres database to create our database
    const adminPool = new Pool({
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        database: 'postgres', // Connect to default postgres database
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || '',
    });

    try {
        // Check if database exists
        const dbCheckResult = await adminPool.query(
            "SELECT 1 FROM pg_database WHERE datname = $1",
            [process.env.DB_NAME || 'gadget_store']
        );

        if (dbCheckResult.rows.length === 0) {
            // Create database
            console.log('📦 Creating database...');
            await adminPool.query(`CREATE DATABASE ${process.env.DB_NAME || 'gadget_store'}`);
            console.log('✅ Database created successfully!\n');
        } else {
            console.log('ℹ️  Database already exists\n');
        }
    } catch (error) {
        console.error('❌ Error creating database:', error.message);
        console.log('\n⚠️  Make sure PostgreSQL is installed and running!');
        process.exit(1);
    } finally {
        await adminPool.end();
    }

    // Now connect to our database and run the schema
    const pool = new Pool({
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        database: process.env.DB_NAME || 'gadget_store',
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || '',
    });

    try {
        console.log('📋 Running database schema...');
        
        // Read and execute schema file
        const schemaPath = path.join(__dirname, 'database', 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');
        
        await pool.query(schema);
        
        console.log('✅ Database schema created successfully!');
        console.log('✅ Sample data inserted!\n');
        
        // Verify data
        const result = await pool.query('SELECT COUNT(*) FROM products');
        console.log(`📊 Total products in database: ${result.rows[0].count}\n`);
        
        console.log('🎉 Database setup complete!');
        console.log('You can now run: npm start\n');
        
    } catch (error) {
        console.error('❌ Error setting up database:', error.message);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

setupDatabase();

// Made with Bob
