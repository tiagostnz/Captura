import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("posts", (table) => {
    table.increments("id").primary();

    table.integer("user_id")
      .unsigned()
      .notNullable()// todo post tem que ter um usuario, n pode ser nulo
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
      // o cascade foi usado pra se um usuario for deletado, os posts dele tbm sejam deletados, pra n ficar post sem dono

    table.string("image_url", 500).notNullable();
    table.text("caption");
    table.timestamps(true, true);
  });
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable("posts");
}

