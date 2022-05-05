import { MigrationInterface, QueryRunner, TableColumn, Table, TableForeignKey } from "typeorm";

export class CreateTableVcStorage1651032810801 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE "vc_statuses" AS ENUM(
          'PENDING_VERIFY_REQUEST',
          'PENDING_VERIFY',
          'ACCEPTED',
          'REJECTED'
        )
      `);

    await queryRunner.createTable(
      new Table({
        name: "vc-storage",
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
            name: "vcData",
            type: "varchar",
            length: "1024",
            isNullable: false
          }),
          new TableColumn({
            name: 'issuerId',
            type: 'int',
            isNullable: true,
          }),
          new TableColumn({
            name: 'holderId',
            type: 'int',
            isNullable: true,
          }),
          new TableColumn({
            name: 'verifierId',
            type: 'int',
            isNullable: true,
          }),
          new TableColumn({
            name: 'status',
            type: 'vc_statuses',
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
            columnNames: ['issuerId'],
          }),
          new TableForeignKey({
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            columnNames: ['holderId'],
          }),
          new TableForeignKey({
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            columnNames: ['verifierId'],
          }),
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("vc-storage");
  }
}
