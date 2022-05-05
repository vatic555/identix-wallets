import { registerEnumType } from "@nestjs/graphql";

export enum Blockchains {
  polygon = 'polygon',
  everscale = 'everscale'
}

registerEnumType(Blockchains, {
  name: 'Blockchains',
});
