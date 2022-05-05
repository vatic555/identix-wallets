import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  UpdateDateColumn, ManyToOne
} from "typeorm";
import { Field, Int, ObjectType } from "@nestjs/graphql";
import { UsersEntity } from "@/libs/database/entities/users.entity";
import { Blockchains } from "@/libs/database/types/web3.types";
import { DidsEntity } from "@/libs/database/entities/dids.entity";

@Entity("web3-accounts")
@ObjectType()
export class Web3AccountsEntity {
  @PrimaryGeneratedColumn()
  @Field(type => Int)
  id: number;

  @ManyToOne(
    () => UsersEntity,
    user => user.web3Accounts,
  )
  @Field(type => UsersEntity)
  public user: UsersEntity;

  @Column({
    name: "publicKey",
    type: "varchar",
    length: 1024,
    nullable: false
  })
  @Field({ nullable: false })
  public publicKey: string;

  @Column({
    name: "privateKey",
    type: "varchar",
    length: 1024,
    nullable: false
  })
  @Field({ nullable: false })
  public privateKey: string;

  @OneToMany(
    () => DidsEntity,
    did => did.web3Account,
  )
  public dids: DidsEntity[]

  @Column({
    name: "address",
    type: "varchar",
    length: 1024,
    nullable: true
  })
  @Field({ nullable: true })
  public address?: string;

  @Column({
    name: "blockchain",
    type: "enum",
    enum: Blockchains,
    nullable: true
  })
  @Field({ nullable: true })
  public blockchain?: Blockchains;

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
