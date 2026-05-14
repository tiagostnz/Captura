import dotenv from 'dotenv';
// importa a bibilioteca pra dentro do arquivo, sem ele o node n le arquivos .env
dotenv.config({path: '.env.local'});
// o dotenv por padrão procura o arquivo .env, mas como esse é local, tem que especificar o caminho 9
import type { Knex } from 'knex';

const config: { [key: string]: Knex.Config } = {
    development: {
        client: "pg",
        connection: process.env.DATABASE_URL,
        migrations: {
            directory: "./lib/db/migrations",
            extension: "ts",
        },

    }
};
export default config;