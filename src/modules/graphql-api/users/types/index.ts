import {Web2AuthenticationMethods} from "@/libs/database/types/web2.types";
import {Blockchains} from "@/libs/database/types/web3.types";
import {Field, InputType, ObjectType} from "@nestjs/graphql";

@InputType()
class Web2AccountParams {
  @Field(type => Web2AuthenticationMethods)
  method: Web2AuthenticationMethods;

  @Field(type => String)
  identifier: string;
}

@InputType()
class Web3AccountParams {
  @Field(type => Blockchains)
  blockchain: Blockchains;

  @Field(type => String)
  address: string;
}

@ObjectType()
@InputType()
export class TAccountGetOrCreate  {
  @Field(type => Web2AccountParams, { nullable: true })
  web2?: {
    method: Web2AuthenticationMethods;
    identifier: string;
  };

  @Field(type => Web3AccountParams, { nullable: true })
  web3?: {
    blockchain: Blockchains;
    address: string;
  }
};

@ObjectType()
export class TGetOrCreateAccountResult {
  @Field(type => [String])
  dids: string[];
}
