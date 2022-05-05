import {Column, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import {Field, Int, ObjectType} from "@nestjs/graphql";
import {UsersEntity} from "./users.entity";
import {VcVerificationStatusType} from "@/libs/database/types/vc-status.type";
import {VcStorageEntity} from "@/libs/database/entities/vc-storage.entity";
import {alias} from "yargs";

@Entity("vc-verifier-cases")
@ObjectType()
export class VcVerificationCasesEntity {
  @PrimaryGeneratedColumn()
  @Field(type => Int)
  id: number;

  @Column({
    name: "verifierDid",
    type: "varchar",
    length: 1024,
    nullable: false
  })
  @Field({ nullable: false })
  public verifierDid: string;

  @Column({
    name: "verificationStatus",
    type: "enum",
    enum: VcVerificationStatusType,
    nullable: false
  })
  @Field({ nullable: false })
  public verificationStatus: VcVerificationStatusType;

  @ManyToOne(
    () => VcStorageEntity,
    vc => vc.verificationCases,
  )
  @Field(type => VcStorageEntity)
  public vc: VcStorageEntity;

  @Column({
    name: "createdAt",
    type: "timestamp",
    nullable: true,
    default: "CURRENT_TIMESTAMP"
  })
  @Field({ nullable: false })
  public createdAt: Date;

  @UpdateDateColumn({
    name: "updatedAt",
    type: "timestamp",
    nullable: true,
    default: "CURRENT_TIMESTAMP"
  })
  @Field({ nullable: false })
  public updatedAt: Date;
}


export class VcVerificationCasesResult {
  @Field(type => [VcVerificationCasesEntity])
  public vcVerificationCases: VcVerificationCasesEntity[];

  @Field(type => Int)
  public total: number;
}
