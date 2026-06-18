import type { Knex } from "knex";

// aplicar mudanças no banco de dados, criar tabela, adicionar coluna, etc
// tipo(increments, string, etc) coluna_ id, name, email, etc) modificadores(notNullable, unique, etc)
export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("users", (table) => {
        table.increments("id").primary();
        table.string("username", 50).notNullable().unique();
        table.string("email", 255).notNullable().unique();
        table.string("password_hash").notNullable();
        table.string("name", 100).notNullable();
        table.string("avatar_url", 255);
        table.text("bio");
        table.timestamps(true, true);
    });
}

// desfazer as mudanças feitas no up, deletar tabela, remover coluna, etc
export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable("users");

}
// pra cada coisa que vc cria no up, tem q desfazer no down
