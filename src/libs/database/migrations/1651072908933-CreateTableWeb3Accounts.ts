import { MigrationInterface, QueryRunner, TableColumn, Table, TableForeignKey } from "typeorm";

export class CreateTableWeb3Accounts1651072908933 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE "blockchains_list" AS ENUM(
          'polygon',
          'everscale'
        )
      `);

    await queryRunner.createTable(
      new Table({
        name: "web3-accounts",
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
            name: 'blockchain',
            type: 'blockchains_list',
            isNullable: true,
            default: 'NULL',
          }),
          new TableColumn({
            name: "publicKey",
            type: "varchar",
            length: "1024",
            isNullable: false
          }),
          new TableColumn({
            name: "privateKey",
            type: "varchar",
            length: "1024",
            isNullable: false
          }),
          new TableColumn({
            name: "address",
            type: "varchar",
            length: "1024",
            isNullable: true,
            default: 'NULL',
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
    await queryRunner.dropTable("web3-accounts");
  }
}

