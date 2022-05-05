import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  UpdateDateColumn, ManyToOne
} from "typeorm";
import { Field, Int, ObjectType } from "@nestjs/graphql";
import { UsersEntity } from "@/libs/database/entities/users.entity";
import { Web2AuthenticationMethods } from "@/libs/database/types/web2.types";

@Entity("web2-accounts")
@ObjectType()
export class Web2AccountsEntity {
  @PrimaryGeneratedColumn()
  @Field(type => Int)
  id: number;

  @ManyToOne(
    () => UsersEntity,
    user => user.web2Accounts,
  )
  @Field(type => UsersEntity)
  public user: UsersEntity;

  @Column({
    name: "authMethod",
    type: "enum",
    enum: Web2AuthenticationMethods,
    nullable: false
  })
  @Field({ nullable: false })
  public authMethod: Web2AuthenticationMethods;

  @Column({
    name: "authIdentifier",
    type: "varchar",
    length: 1024,
    nullable: false
  })
  @Field({ nullable: false })
  public authIdentifier: string;

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
