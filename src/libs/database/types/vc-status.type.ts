import {registerEnumType} from "@nestjs/graphql";

export enum VcVerificationStatusType {
  PendingVerify = "PENDING_VERIFY",
  Accepted = "ACCEPTED",
  Rejected = "REJECTED"
}


registerEnumType(VcVerificationStatusType, {
  name: 'VcVerificationStatusType',
});
