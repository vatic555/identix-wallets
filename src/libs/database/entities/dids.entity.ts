import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  UpdateDateColumn, ManyToOne
} from "typeorm";
import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Web3AccountsEntity } from "@/libs/database/entities/web3-accounts.entity";

@Entity("dids")
@ObjectType()
export class DidsEntity {
  @PrimaryGeneratedColumn()
  @Field(type => Int)
  id: number;

  @Column({
    name: "did",
    type: "varchar",
    length: 1024,
    nullable: false
  })
  @Field({ nullable: false })
  public did: string;

  @ManyToOne(
    () => Web3AccountsEntity,
    w3acc => w3acc.dids,
  )
  @Field(type => Web3AccountsEntity)
  public web3Account: Web3AccountsEntity;

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
