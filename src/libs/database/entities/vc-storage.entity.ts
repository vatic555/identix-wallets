import {Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import {Field, Int, ObjectType} from "@nestjs/graphql";
import {VcVerificationCasesEntity} from "@/libs/database/entities/vc-verifier-cases.entity";
import {Did} from "@/libs/common/types/ssi.types";

@Entity("vc-storage")
@ObjectType()
export class VcStorageEntity {
  @PrimaryGeneratedColumn()
  @Field(type => Int)
  id: number;

  @Column({
    name: "vcDid",
    type: "varchar",
    length: 1024,
    nullable: false,
    unique: true
  })
  @Field({ nullable: false })
  public vcDid: string;

  @Column({
    name: "vcData",
    type: "varchar",
    length: 1024,
    nullable: false
  })
  @Field({ nullable: false })
  public vcData: string;

  @Column({
    name: "issuerDid",
    type: "varchar",
    length: 1024,
    nullable: false
  })
  @Field(type => String)
  public issuerDid: Did;

  @Column({
    name: "holderDid",
    type: "varchar",
    length: 1024,
    nullable: true
  })
  @Field(type => String)
  public holderDid: Did;

  @OneToMany(
    () => VcVerificationCasesEntity,
    verificationCase => verificationCase.vc,
  )
  @Field(type => [VcVerificationCasesEntity])
  public verificationCases: VcVerificationCasesEntity[]

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

export class VCsListResult {
  @Field(type => [VcStorageEntity])
  public vcs: VcStorageEntity[];

  @Field(type => Int)
  public total: number;
}
