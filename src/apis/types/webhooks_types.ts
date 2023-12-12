// Error types //
type WebhooksProblemJSON = {
  type: string | null;
  title: string | null;
  status: number | null;
  detail: string | null;
  instance: string | null;
};

export type WebhooksErrorResponse = WebhooksProblemJSON & {
  extraDetails: {
    name: string;
    reason: string;
  }[] | null;
};

// Register Webhook //
export type WebhooksRegisterRequest = {
  url: string;
  events: WebhookEventType[];
};

export type WebhooksRegisterOKResponse = {
  id: `${string}-${string}-${string}-${string}-${string}`; // UUID,
  secret: string;
};

// Get all Webhooks //
export type WebhooksGetRegisteredOKResponse = {
  webhooks: WebhookDetails[];
};

type WebhookDetails = {
  id: `${string}-${string}-${string}-${string}-${string}`; // UUID
  url: string;
  events: WebhookEventType[];
};

// All event types currently supported in the SDK for all APIs
type WebhookEventType = EpaymentEventTypes | QREventTypes;

type EpaymentEventTypes =
  | "epayments.payment.created.v1"
  | "epayments.payment.aborted.v1"
  | "epayments.payment.expired.v1"
  | "epayments.payment.cancelled.v1"
  | "epayments.payment.captured.v1"
  | "epayments.payment.refunded.v1"
  | "epayments.payment.authorized.v1"
  | "epayments.payment.terminated.v1";

type QREventTypes = "user.checked-in.v1";
