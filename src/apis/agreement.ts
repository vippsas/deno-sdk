import { RequestData } from "../types.ts";
import {
  AgreementErrorResponse,
  AgreementResponseV3,
  AgreementStatus,
  DraftAgreementResponseV3,
  DraftAgreementV3,
  ForceAcceptAgreementV3,
  PatchAgreementV3,
} from "./types/agreement_types.ts";

/**
 * Factory object for creating agreement request data.
 */
export const agreementRequestFactory = {
  create(
    token: string,
    body: DraftAgreementV3,
  ): RequestData<DraftAgreementResponseV3, AgreementErrorResponse> {
    return {
      url: "/recurring/v3/agreements",
      method: "POST",
      body,
      token,
    };
  },
  list(
    token: string,
    status: AgreementStatus,
    createdAfter: number,
  ): RequestData<AgreementResponseV3, AgreementErrorResponse> {
    return {
      url:
        `/recurring/v3/agreements?status=${status}&createdAfter=${createdAfter}`,
      method: "GET",
      token,
    };
  },
  info(
    token: string,
    agreementId: string,
  ): RequestData<AgreementResponseV3, AgreementErrorResponse> {
    return {
      url: `/recurring/v3/agreements/${agreementId}`,
      method: "GET",
      token,
    };
  },
  update(
    token: string,
    agreementId: string,
    body: PatchAgreementV3
  ): RequestData<void, AgreementErrorResponse> {
    return {
      url: `/recurring/v3/agreements/${agreementId}`,
      method: "PATCH",
      body,
      token,
    };
  },
  forceAccept(
    token: string,
    agreementId: string,
    body: ForceAcceptAgreementV3
  ): RequestData<void, AgreementErrorResponse> {
    return {
      url: `/recurring/v3/agreements/${agreementId}/accept`,
      method: "PATCH",
      body,
      token,
    };
  }
} as const;
