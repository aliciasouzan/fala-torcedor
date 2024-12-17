import pkg from 'pg';

export async function connect() {
    if (global.connection)
        return global.connection.connect();
    const { Pool } = pkg;
    const pool = new Pool({
        connectionString: process.env.CONNECTION_STRING
    });

    try {
        console.log("Sucesso ao estabelecer conexão pool com banco de dados");
        global.connection = pool;
        return pool.connect();
    } catch (error) {
        console.log("Erro ao estabelecer conexão com banco de dados");
        global.connection = null;
        return null;
    }
}

export async function query(text, params) {
    const client = await global.connection.connect();
    try {
        const res = await client.query(text, params);
        return res;
    } finally {
        client.release();
    }
}