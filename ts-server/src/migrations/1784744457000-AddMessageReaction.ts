import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

const UNIQUE_INDEX_NAME = 'IDX_message_reaction_message_user_emoji';
const MESSAGE_FK_NAME = 'FK_message_reaction_messageId';
const USER_FK_NAME = 'FK_message_reaction_userId';

export class AddMessageReaction1784744457000 implements MigrationInterface {
  name = 'AddMessageReaction1784744457000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const existingTable = await queryRunner.getTable('message_reaction');
    if (!existingTable) {
      await queryRunner.createTable(
        new Table({
          name: 'message_reaction',
          columns: [
            {
              name: 'id',
              type: 'varchar',
              length: '36',
              isPrimary: true,
              isNullable: false,
            },
            {
              name: 'emoji',
              type: 'varchar',
              length: '16',
              isNullable: false,
            },
            {
              name: 'messageId',
              type: 'varchar',
              length: '36',
              isNullable: false,
            },
            {
              name: 'userId',
              type: 'varchar',
              length: '36',
              isNullable: false,
            },
            {
              name: 'createdAt',
              type: 'datetime',
              precision: 6,
              isNullable: false,
              default: 'CURRENT_TIMESTAMP(6)',
            },
          ],
        }),
        true,
      );
    }

    const refreshedTable = await queryRunner.getTable('message_reaction');
    if (!refreshedTable?.indices.some((index) => index.name === UNIQUE_INDEX_NAME)) {
      await queryRunner.createIndex(
        'message_reaction',
        new TableIndex({
          name: UNIQUE_INDEX_NAME,
          columnNames: ['messageId', 'userId', 'emoji'],
          isUnique: true,
        }),
      );
    }

    const afterIndexTable = await queryRunner.getTable('message_reaction');
    if (!afterIndexTable?.foreignKeys.some((fk) => fk.name === MESSAGE_FK_NAME)) {
      await queryRunner.createForeignKey(
        'message_reaction',
        new TableForeignKey({
          name: MESSAGE_FK_NAME,
          columnNames: ['messageId'],
          referencedTableName: 'message',
          referencedColumnNames: ['id'],
          onDelete: 'CASCADE',
        }),
      );
    }

    const afterMessageFkTable = await queryRunner.getTable('message_reaction');
    if (!afterMessageFkTable?.foreignKeys.some((fk) => fk.name === USER_FK_NAME)) {
      await queryRunner.createForeignKey(
        'message_reaction',
        new TableForeignKey({
          name: USER_FK_NAME,
          columnNames: ['userId'],
          referencedTableName: 'user',
          referencedColumnNames: ['id'],
          onDelete: 'CASCADE',
        }),
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('message_reaction');
    if (!table) return;

    await queryRunner.dropTable('message_reaction');
  }
}
