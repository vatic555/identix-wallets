import { MigrationInterface, QueryRunner, TableColumn, Table, TableForeignKey } from "typeorm";

export class CreateTableWeb2Accounts1651072905406 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE "web2_auth_methods" AS ENUM(
          'clientId',
          'magicLink',
          'google',
          'facebook',
          'twitter',
          'telegram'
        )
      `);

    await queryRunner.createTable(
      new Table({
        name: "web2-accounts",
        columns: [
          new TableColumn({
            name: "id",
            type: "int",
            isGenerated: true,
            isPrimary: true,
            unsigned: true,
            generationStrategy: "increment"
          }),
          new TableColumn({
            name: 'userId',
            type: 'int',
            isNullable: false,
          }),
          new TableColumn({
            name: 'authMethod',
            type: 'web2_auth_methods',
            isNullable: false,
          }),
          new TableColumn({
            name: "authIdentifier",
            type: "varchar",
            length: "1024",
            isNullable: false,
          }),
          new TableColumn({
            name: "createdAt",
            type: "timestamp",
            isNullable: true,
            default: "CURRENT_TIMESTAMP"
          }),
          new TableColumn({
            name: "updatedAt",
            type: "timestamp",
            isNullable: true,
            default: "CURRENT_TIMESTAMP"
          })
        ],
        foreignKeys: [
          new TableForeignKey({
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            columnNames: ['userId'],
          }),
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("web2-accounts");
  }
}
