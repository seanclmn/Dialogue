import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey, TableIndex } from 'typeorm';

const FK_NAME = 'FK_message_parentMessageId';
const INDEX_NAME = 'IDX_message_parentMessageId';

export class AddMessageParentMessageId1784585433526 implements MigrationInterface {
  name = 'AddMessageParentMessageId1784585433526';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('message');
    if (!table) return;

    if (!table.columns.some((column) => column.name === 'parentMessageId')) {
      await queryRunner.addColumn(
        'message',
        new TableColumn({
          name: 'parentMessageId',
          type: 'varchar',
          length: '36',
          isNullable: true,
        }),
      );
    }

    const refreshedTable = await queryRunner.getTable('message');
    if (!refreshedTable?.indices.some((index) => index.name === INDEX_NAME)) {
      await queryRunner.createIndex(
        'message',
        new TableIndex({ name: INDEX_NAME, columnNames: ['parentMessageId'] }),
      );
    }

    const afterIndexTable = await queryRunner.getTable('message');
    if (!afterIndexTable?.foreignKeys.some((fk) => fk.name === FK_NAME)) {
      await queryRunner.createForeignKey(
        'message',
        new TableForeignKey({
          name: FK_NAME,
          columnNames: ['parentMessageId'],
          referencedTableName: 'message',
          referencedColumnNames: ['id'],
          onDelete: 'SET NULL',
        }),
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('message');
    if (!table) return;

    if (table.foreignKeys.some((fk) => fk.name === FK_NAME)) {
      await queryRunner.dropForeignKey('message', FK_NAME);
    }

    const refreshedTable = await queryRunner.getTable('message');
    if (refreshedTable?.indices.some((index) => index.name === INDEX_NAME)) {
      await queryRunner.dropIndex('message', INDEX_NAME);
    }

    const afterIndexTable = await queryRunner.getTable('message');
    if (afterIndexTable?.columns.some((column) => column.name === 'parentMessageId')) {
      await queryRunner.dropColumn('message', 'parentMessageId');
    }
  }
}
