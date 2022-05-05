import { MigrationInterface, QueryRunner, TableColumn, Table, TableForeignKey } from "typeorm";

export class CreateTableDids1651072920444 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "dids",
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
            name: "did",
            type: "varchar",
            length: "1024",
            isNullable: false
          }),
          new TableColumn({
            name: 'web3AccountId',
            type: 'int',
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
            referencedTableName: 'web3-accounts',
            referencedColumnNames: ['id'],
            columnNames: ['web3AccountId'],
          }),
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("web3-accounts");
  }
}

