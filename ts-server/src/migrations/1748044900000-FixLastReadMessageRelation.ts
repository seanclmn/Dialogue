import { MigrationInterface, QueryRunner } from 'typeorm';

const FK_NAME = 'FK_249a02f55fc3a0331668edf7317';
const NON_UNIQUE_INDEX = 'IDX_chat_participant_lastReadMessageId';

export class FixLastReadMessageRelation1748044900000 implements MigrationInterface {
  name = 'FixLastReadMessageRelation1748044900000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('chat_participant');
    if (!table) return;

    if (table.foreignKeys.some((fk) => fk.name === FK_NAME)) {
      await queryRunner.query(
        `ALTER TABLE \`chat_participant\` DROP FOREIGN KEY \`${FK_NAME}\``,
      );
    }

    const refreshedTable = await queryRunner.getTable('chat_participant');
    const uniqueIndex = refreshedTable?.indices.find(
      (index) =>
        index.columnNames.length === 1 &&
        index.columnNames[0] === 'lastReadMessageId' &&
        index.isUnique,
    );
    if (uniqueIndex?.name) {
      await queryRunner.query(
        `ALTER TABLE \`chat_participant\` DROP INDEX \`${uniqueIndex.name}\``,
      );
    }

    const afterDropTable = await queryRunner.getTable('chat_participant');
    if (!afterDropTable?.indices.some((index) => index.name === NON_UNIQUE_INDEX)) {
      await queryRunner.query(
        `CREATE INDEX \`${NON_UNIQUE_INDEX}\` ON \`chat_participant\` (\`lastReadMessageId\`)`,
      );
    }

    const finalTable = await queryRunner.getTable('chat_participant');
    if (!finalTable?.foreignKeys.some((fk) => fk.name === FK_NAME)) {
      await queryRunner.query(
        `ALTER TABLE \`chat_participant\` ADD CONSTRAINT \`${FK_NAME}\` FOREIGN KEY (\`lastReadMessageId\`) REFERENCES \`message\`(\`id\`) ON DELETE SET NULL`,
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('chat_participant');
    if (!table) return;

    if (table.foreignKeys.some((fk) => fk.name === FK_NAME)) {
      await queryRunner.query(
        `ALTER TABLE \`chat_participant\` DROP FOREIGN KEY \`${FK_NAME}\``,
      );
    }

    const refreshedTable = await queryRunner.getTable('chat_participant');
    if (refreshedTable?.indices.some((index) => index.name === NON_UNIQUE_INDEX)) {
      await queryRunner.query(
        `ALTER TABLE \`chat_participant\` DROP INDEX \`${NON_UNIQUE_INDEX}\``,
      );
    }

    const afterDropTable = await queryRunner.getTable('chat_participant');
    if (
      !afterDropTable?.indices.some(
        (index) =>
          index.columnNames.length === 1 &&
          index.columnNames[0] === 'lastReadMessageId' &&
          index.isUnique,
      )
    ) {
      await queryRunner.query(
        `CREATE UNIQUE INDEX \`REL_249a02f55fc3a0331668edf731\` ON \`chat_participant\` (\`lastReadMessageId\`)`,
      );
    }

    const finalTable = await queryRunner.getTable('chat_participant');
    if (!finalTable?.foreignKeys.some((fk) => fk.name === FK_NAME)) {
      await queryRunner.query(
        `ALTER TABLE \`chat_participant\` ADD CONSTRAINT \`${FK_NAME}\` FOREIGN KEY (\`lastReadMessageId\`) REFERENCES \`message\`(\`id\`) ON DELETE SET NULL`,
      );
    }
  }
}
