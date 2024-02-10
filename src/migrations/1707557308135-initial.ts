import { MigrationInterface, QueryRunner } from 'typeorm';

export class Initial1707557308135 implements MigrationInterface {
  name = 'Initial1707557308135';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."role_status_enum" AS ENUM('active', 'in_active')`,
    );
    await queryRunner.query(
      `CREATE TABLE "role" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "deleted_at" TIMESTAMP WITH TIME ZONE, "created_at_ip" character varying, "updated_at_ip" character varying, "deleted_at_ip" character varying, "status" "public"."role_status_enum" NOT NULL DEFAULT 'active', "name" character varying NOT NULL, "description" character varying NOT NULL, "is_admin" boolean NOT NULL, "role_permission" uuid array NOT NULL, "section_permission" uuid array NOT NULL, CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."user_status_enum" AS ENUM('active', 'in_active')`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "deleted_at" TIMESTAMP WITH TIME ZONE, "created_at_ip" character varying, "updated_at_ip" character varying, "deleted_at_ip" character varying, "name" character varying(32) NOT NULL, "email" character varying NOT NULL, "status" "public"."user_status_enum" NOT NULL DEFAULT 'in_active', CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."otp_status_enum" AS ENUM('active', 'in_active')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."otp_type_enum" AS ENUM('forgot_password', 'login', 'signup')`,
    );
    await queryRunner.query(
      `CREATE TABLE "otp" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "deleted_at" TIMESTAMP WITH TIME ZONE, "created_at_ip" character varying, "updated_at_ip" character varying, "deleted_at_ip" character varying, "status" "public"."otp_status_enum" NOT NULL DEFAULT 'active', "otp" integer NOT NULL, "email" character varying(50) NOT NULL, "type" "public"."otp_type_enum" NOT NULL, "is_verified" boolean NOT NULL DEFAULT false, "expire_at" integer NOT NULL, "fk_user" uuid, "fk_admin" uuid, CONSTRAINT "PK_32556d9d7b22031d7d0e1fd6723" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."admin_status_enum" AS ENUM('active', 'in_active')`,
    );
    await queryRunner.query(
      `CREATE TABLE "admin" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "deleted_at" TIMESTAMP WITH TIME ZONE, "created_at_ip" character varying, "updated_at_ip" character varying, "deleted_at_ip" character varying, "status" "public"."admin_status_enum" NOT NULL DEFAULT 'active', "name" character varying(32) NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "country_code" character varying(5), "contact_number" character varying(15), "fk_role" uuid, CONSTRAINT "PK_e032310bcef831fb83101899b10" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."user_token_status_enum" AS ENUM('active', 'in_active')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."user_token_device_type_enum" AS ENUM('ios', 'android', 'web')`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_token" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "deleted_at" TIMESTAMP WITH TIME ZONE, "created_at_ip" character varying, "updated_at_ip" character varying, "deleted_at_ip" character varying, "status" "public"."user_token_status_enum" NOT NULL DEFAULT 'active', "token" text NOT NULL, "firebase_token" text, "device_id" character varying, "device_name" character varying, "device_type" "public"."user_token_device_type_enum", "login_time" TIMESTAMP WITH TIME ZONE, "logout_time" TIMESTAMP WITH TIME ZONE, "fk_user" uuid, "fk_admin" uuid, CONSTRAINT "PK_48cb6b5c20faa63157b3c1baf7f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."permission_status_enum" AS ENUM('active', 'in_active')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."permission_type_enum" AS ENUM('role', 'section')`,
    );
    await queryRunner.query(
      `CREATE TABLE "permission" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "deleted_at" TIMESTAMP WITH TIME ZONE, "created_at_ip" character varying, "updated_at_ip" character varying, "deleted_at_ip" character varying, "status" "public"."permission_status_enum" NOT NULL DEFAULT 'active', "name" character varying NOT NULL, "type" "public"."permission_type_enum" NOT NULL, CONSTRAINT "PK_3b8b97af9d9d8807e41e6f48362" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "otp" ADD CONSTRAINT "FK_7990ac6c3512abaf69a65741599" FOREIGN KEY ("fk_user") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "otp" ADD CONSTRAINT "FK_fd50b3c3b07f19e329726a4c3ea" FOREIGN KEY ("fk_admin") REFERENCES "admin"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "admin" ADD CONSTRAINT "FK_373b138dfea35e67ce200566dae" FOREIGN KEY ("fk_role") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_token" ADD CONSTRAINT "FK_142a69ff7ddb36fee20c3c30351" FOREIGN KEY ("fk_user") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_token" ADD CONSTRAINT "FK_36173555bf8d343e6ebc57750cd" FOREIGN KEY ("fk_admin") REFERENCES "admin"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_token" DROP CONSTRAINT "FK_36173555bf8d343e6ebc57750cd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_token" DROP CONSTRAINT "FK_142a69ff7ddb36fee20c3c30351"`,
    );
    await queryRunner.query(
      `ALTER TABLE "admin" DROP CONSTRAINT "FK_373b138dfea35e67ce200566dae"`,
    );
    await queryRunner.query(
      `ALTER TABLE "otp" DROP CONSTRAINT "FK_fd50b3c3b07f19e329726a4c3ea"`,
    );
    await queryRunner.query(
      `ALTER TABLE "otp" DROP CONSTRAINT "FK_7990ac6c3512abaf69a65741599"`,
    );
    await queryRunner.query(`DROP TABLE "permission"`);
    await queryRunner.query(`DROP TYPE "public"."permission_type_enum"`);
    await queryRunner.query(`DROP TYPE "public"."permission_status_enum"`);
    await queryRunner.query(`DROP TABLE "user_token"`);
    await queryRunner.query(`DROP TYPE "public"."user_token_device_type_enum"`);
    await queryRunner.query(`DROP TYPE "public"."user_token_status_enum"`);
    await queryRunner.query(`DROP TABLE "admin"`);
    await queryRunner.query(`DROP TYPE "public"."admin_status_enum"`);
    await queryRunner.query(`DROP TABLE "otp"`);
    await queryRunner.query(`DROP TYPE "public"."otp_type_enum"`);
    await queryRunner.query(`DROP TYPE "public"."otp_status_enum"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TYPE "public"."user_status_enum"`);
    await queryRunner.query(`DROP TABLE "role"`);
    await queryRunner.query(`DROP TYPE "public"."role_status_enum"`);
  }
}
