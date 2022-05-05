import { registerEnumType } from "@nestjs/graphql";

export enum Web2AuthenticationMethods {
  clientId = 'clientId',
  magicLink = 'magicLink',
  google = 'google',
  facebook = 'facebook',
  twitter = 'twitter',
  telegram = 'telegram'
}

registerEnumType(Web2AuthenticationMethods, {
  name: 'Web2AuthenticationMethods',
});
