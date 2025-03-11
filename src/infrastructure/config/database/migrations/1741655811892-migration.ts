import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1741655811892 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
          INSERT INTO \`url\` (id, short_url, long_url) VALUES
          ('1741318620004', 'XOHT6Bf2', 'https://docs.nestjs.com/controllers#request-payloads'),
          ('1741319673818', 'XOHTMRAj', 'https://en.wikipedia.org/wiki/Systems_design'),
          ('1741394763296', 'UnNqI6qe', 'https://sqids.org/javascript')
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`TRUNCATE TABLE \`url\``);
  }
}
