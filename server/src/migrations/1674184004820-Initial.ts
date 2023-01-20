import { MigrationInterface, QueryRunner } from "typeorm";

export class Initial1674184004820 implements MigrationInterface {
    name = 'Initial1674184004820'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "convo_entry_response" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "responseText" character varying NOT NULL, "label" character varying NOT NULL, "childConvoEntryId" uuid, "parentConvoEntryId" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_0588905b8e68991d5ae3c679699" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "convo_entry" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "label" character varying NOT NULL, "promptText" character varying NOT NULL, "answerSuggestion" character varying NOT NULL, "isRoot" boolean NOT NULL DEFAULT false, "convoId" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_9d195e500934bcc485adadcd2e8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "convo" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "targetLanguage" character varying NOT NULL, "nativeLanguage" character varying NOT NULL, "title" character varying NOT NULL, "userId" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_ed8d6b1a033a8ed60cfa63a9930" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "convo_entry_response" ADD CONSTRAINT "FK_53d6e661354855a9b1060a4de60" FOREIGN KEY ("childConvoEntryId") REFERENCES "convo_entry"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "convo_entry_response" ADD CONSTRAINT "FK_16aec8bf11123997c93fd1847a7" FOREIGN KEY ("parentConvoEntryId") REFERENCES "convo_entry"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "convo_entry" ADD CONSTRAINT "FK_6102c621dbcf0950ca4c4e5be4d" FOREIGN KEY ("convoId") REFERENCES "convo"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "convo" ADD CONSTRAINT "FK_329ad618156e7834a15a779ce24" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "convo" DROP CONSTRAINT "FK_329ad618156e7834a15a779ce24"`);
        await queryRunner.query(`ALTER TABLE "convo_entry" DROP CONSTRAINT "FK_6102c621dbcf0950ca4c4e5be4d"`);
        await queryRunner.query(`ALTER TABLE "convo_entry_response" DROP CONSTRAINT "FK_16aec8bf11123997c93fd1847a7"`);
        await queryRunner.query(`ALTER TABLE "convo_entry_response" DROP CONSTRAINT "FK_53d6e661354855a9b1060a4de60"`);
        await queryRunner.query(`DROP TABLE "convo"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "convo_entry"`);
        await queryRunner.query(`DROP TABLE "convo_entry_response"`);
    }

}
