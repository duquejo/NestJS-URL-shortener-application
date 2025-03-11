import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1741655729350 implements MigrationInterface {
  name = 'Migration1741655729350';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`url\` (\`id\` varchar(255) NOT NULL, \`short_url\` varchar(255) NOT NULL, \`long_url\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`url\``);
  }
}
