import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  UpdateDateColumn
} from "typeorm";
import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Web2AccountsEntity } from "@/libs/database/entities/web2-accounts.entity";
import { Web3AccountsEntity } from "@/libs/database/entities/web3-accounts.entity";

@Entity("users")
@ObjectType()
export class UsersEntity {
  @PrimaryGeneratedColumn()
  @Field(type => Int)
  id: number;

  @Column({
    name: "nickname",
    type: "varchar",
    length: 1024,
    nullable: true
  })
  @Field({ nullable: true })
  public nickname: string;

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

  @OneToMany(
    () => Web2AccountsEntity,
    w2acc => w2acc.user,
  )
  public web2Accounts: Web2AccountsEntity[]

  @OneToMany(
    () => Web3AccountsEntity,
    w3acc => w3acc.user,
  )
  public web3Accounts: Web3AccountsEntity[]
}

export class UsersListResult {
  @Field(type => [UsersEntity])
  public users: UsersEntity[];

  @Field(type => Int)
  public total: number;
}
