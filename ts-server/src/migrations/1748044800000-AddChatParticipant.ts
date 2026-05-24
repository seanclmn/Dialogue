import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class AddChatParticipant1748044800000 implements MigrationInterface {
  name = 'AddChatParticipant1748044800000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const existingTable = await queryRunner.getTable('chat_participant');
    if (!existingTable) {
      await queryRunner.createTable(
        new Table({
          name: 'chat_participant',
          columns: [
            {
              name: 'id',
              type: 'varchar',
              length: '36',
              isPrimary: true,
              isNullable: false,
            },
            {
              name: 'createdAt',
              type: 'datetime',
              precision: 6,
              isNullable: false,
              default: 'CURRENT_TIMESTAMP(6)',
              onUpdate: 'CURRENT_TIMESTAMP(6)',
            },
            {
              name: 'chatId',
              type: 'varchar',
              length: '36',
              isNullable: true,
            },
            {
              name: 'userId',
              type: 'varchar',
              length: '36',
              isNullable: true,
            },
            {
              name: 'lastReadMessageId',
              type: 'varchar',
              length: '36',
              isNullable: true,
              isUnique: true,
            },
          ],
        }),
        true,
      );

      await queryRunner.createForeignKey(
        'chat_participant',
        new TableForeignKey({
          name: 'FK_ee1a88c3951e64c4067cb49c5c9',
          columnNames: ['chatId'],
          referencedTableName: 'chat',
          referencedColumnNames: ['id'],
          onDelete: 'CASCADE',
        }),
      );

      await queryRunner.createForeignKey(
        'chat_participant',
        new TableForeignKey({
          name: 'FK_b222da2539ff0a06a8f5493f868',
          columnNames: ['userId'],
          referencedTableName: 'user',
          referencedColumnNames: ['id'],
          onDelete: 'CASCADE',
        }),
      );

      await queryRunner.createForeignKey(
        'chat_participant',
        new TableForeignKey({
          name: 'FK_249a02f55fc3a0331668edf7317',
          columnNames: ['lastReadMessageId'],
          referencedTableName: 'message',
          referencedColumnNames: ['id'],
          onDelete: 'SET NULL',
        }),
      );
    }

    const joinTable = await queryRunner.getTable('user_chats_chat');
    if (joinTable) {
      await queryRunner.dropTable('user_chats_chat');
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const joinTable = await queryRunner.getTable('user_chats_chat');
    if (!joinTable) {
      await queryRunner.createTable(
        new Table({
          name: 'user_chats_chat',
          columns: [
            {
              name: 'userId',
              type: 'varchar',
              length: '36',
              isNullable: false,
            },
            {
              name: 'chatId',
              type: 'varchar',
              length: '36',
              isNullable: false,
            },
          ],
          indices: [
            new TableIndex({ name: 'IDX_cd5ddfeacb967a4e33d639ee49', columnNames: ['userId'] }),
            new TableIndex({ name: 'IDX_e190c52d44e72db13647dfb745', columnNames: ['chatId'] }),
          ],
        }),
        true,
      );

      await queryRunner.createForeignKey(
        'user_chats_chat',
        new TableForeignKey({
          name: 'FK_cd5ddfeacb967a4e33d639ee499',
          columnNames: ['userId'],
          referencedTableName: 'user',
          referencedColumnNames: ['id'],
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
        }),
      );

      await queryRunner.createForeignKey(
        'user_chats_chat',
        new TableForeignKey({
          name: 'FK_e190c52d44e72db13647dfb745b',
          columnNames: ['chatId'],
          referencedTableName: 'chat',
          referencedColumnNames: ['id'],
        }),
      );
    }

    const participantTable = await queryRunner.getTable('chat_participant');
    if (participantTable) {
      await queryRunner.dropTable('chat_participant');
    }
  }
}
