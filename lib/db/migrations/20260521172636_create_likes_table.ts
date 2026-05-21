import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("likes", (table) => {
        table.increments("id").primary();

        table.integer("user_id")
            .unsigned()
            .notNullable()
            .references("id")
            .inTable("users")
            .onDelete("CASCADE");

        table.integer("post_id")
            .unsigned()
            .notNullable()
            .references("id")
            .inTable("posts")
            .onDelete("CASCADE");

        table.timestamp("created_at").defaultTo(knex.fn.now());
        table.unique(["user_id", "post_id"]); // pra garantir que um usuário só possa curtir um post uma vez
    });
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable("likes");
}

