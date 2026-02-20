const sql = require('mssql');

// SQL Server Connection Configuration
const config = {
    server: 'DESKTOP-7DBTE03\\BRYCE',
    database: 'ONCOLOGY',
    authentication: {
        type: 'default',
        options: {
            userName: 'sa',
            password: 'medsys123'
        }
    },
    options: {
        encrypt: true,
        trustServerCertificate: true,
        enableKeepAlive: true,
        connectionTimeout: 30000,
        requestTimeout: 30000,
        port: 1433
    }
};

// Create connection pool
const pool = new sql.ConnectionPool(config);

// Handle pool events
pool.on('error', err => {
    console.error('Database connection pool error:', err);
});

// Connect to database
pool.connect().then(() => {
    console.log('Successfully connected to SQL Server');
    console.log('Database: ONCOLOGY');
}).catch(err => {
    console.error('Failed to connect to SQL Server:', err);
});

// Export pool for use in other files
module.exports = pool;
