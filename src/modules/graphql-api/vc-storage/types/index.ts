import {Did} from "@/libs/common/types/ssi.types";

export type TVCStorageCreate = {
  vcDid: string;
  vcData: string;
  issuerDid?: Did;
  holderDid?: Did;
};
