import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("follows", (table) => {
    table.increments("id").primary();

    table.integer("follower_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");

    table.integer("following_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");

    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.unique(["follower_id", "following_id"]);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("follows");
}
