import { MigrationInterface, QueryRunner } from 'typeorm';

export class MakeChatNameNullable1747816052000 implements MigrationInterface {
  name = 'MakeChatNameNullable1747816052000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`chat\` MODIFY COLUMN \`name\` varchar(255) NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`chat\` MODIFY COLUMN \`name\` varchar(255) NOT NULL`,
    );
  }
}
