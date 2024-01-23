import { parseProblemJSON } from "../src/problem.ts";
import { assertEquals } from "./test_deps.ts";

Deno.test("parseProblemJSON - Should return correct error message for Problem JSON", () => {
  const error = {
    type: "https://example.com/error",
    title: "Some problem",
    status: 400,
    instance: "https://example.com/instance",
    traceId: "123456789",
    detail: "Some detail",
  };
  const result = parseProblemJSON(error);
  assertEquals(result.ok, false);
  assertEquals(result.message, `${error.detail}`);
});

Deno.test("parseProblemJSON - Should return correct error message for EPayment Problem JSON with extraDetails", () => {
  const error = {
    type: "https://example.com/error",
    extraDetails: [{
      name: "Some name",
      reason: "Some reason",
    }],
    traceId: "123456789",
  };
  const result = parseProblemJSON(error);
  assertEquals(result.message, `Some name - Some reason`);
});

Deno.test("parseProblemJSON - Should return correct error message for EPayment Problem JSON with multiple extraDetails", () => {
  const error = {
    type: "https://example.com/error",
    extraDetails: [{
      name: "Some name",
      reason: "Some reason",
    }, {
      name: "Another name",
      reason: "Another reason",
    }],
    traceId: "123456789",
  };
  const result = parseProblemJSON(error);
  assertEquals(result.message, `Some name - Some reason`);
});

Deno.test("parseProblemJSON - Should return correct error message for EPayment Problem JSON without extraDetails", () => {
  const error = {
    type: "https://example.com/error",
    extraDetails: [],
    traceId: "123456789",
  };
  const result = parseProblemJSON(error);
  assertEquals(result.message, `Unknown error`);
});

Deno.test("parseProblemJSON - Unknown error", () => {
  const error = {};

  const result = parseProblemJSON(error);

  assertEquals(result.ok, false);
  assertEquals(result.message, "Unknown error");
});

Deno.test("parseProblemJSON - Should return correct error message for Checkout Problem JSON - Has errors", () => {
  const error = {
    errorCode: "Some error code",
    errors: {
      err: ["Some error"],
    },
  };
  const result = parseProblemJSON(error);

  assertEquals(result.ok, false);
  assertEquals(result.message, "Some error");
});

Deno.test("parseProblemJSON - Should return correct error message for Checkout Problem JSON - Has multiple errors", () => {
  const error = {
    errorCode: "Some error code",
    errors: {
      err: ["Some error", "Another error"],
    },
  };
  const result = parseProblemJSON(error);

  assertEquals(result.ok, false);
  assertEquals(result.message, "Some error");
});

Deno.test("parseProblemJSON - Should return correct error message for Checkout Problem JSON - Unknown", () => {
  const error = {
    errorCode: "Some error code",
    errors: {
      err: [],
    },
  };
  const result = parseProblemJSON(error);

  assertEquals(result.ok, false);
  assertEquals(result.message, "Unknown error");
});

Deno.test("parseProblemJSON - Should return correct error message for Checkout Problem JSON - Has Details", () => {
  const error = {
    detail: "Some detail",
    errorCode: "Some error code",
    errors: {},
  };
  const result = parseProblemJSON(error);
  assertEquals(result.ok, false);
  assertEquals(result.message, "Some detail");
});

Deno.test("parseProblemJSON - Should return correct error message for Checkout Problem JSON - Unknown", () => {
  const error = {
    errorCode: "Some error code",
    errors: {},
  };
  const result = parseProblemJSON(error);
  assertEquals(result.ok, false);
  assertEquals(result.message, "Unknown error");
});

Deno.test("parseProblemJSON - Should return correct error message for QRErrorJSON with invalidParms", () => {
  const error = {
    title: "Invalid QR code",
    instance: "https://example.com/qr",
    invalidParams: [
      {
        name: "Some name",
        reason: "Some reason",
      },
    ],
  };
  const result = parseProblemJSON(error);

  assertEquals(result.message, "Some name - Some reason");
});

Deno.test("parseProblemJSON - Should return correct error message for QRErrorJSON with multiple invalidParms", () => {
  const error = {
    title: "Invalid QR code",
    instance: "https://example.com/qr",
    invalidParams: [
      {
        name: "Some name",
        reason: "Some reason",
      },
      {
        name: "Another name",
        reason: "Another reason",
      },
    ],
  };
  const result = parseProblemJSON(error);

  assertEquals(result.message, "Some name - Some reason");
});

Deno.test("parseProblemJSON - Should return correct error message for QRErrorJSON with empty invalidParms", () => {
  const error = {
    title: "Invalid QR code",
    instance: "https://example.com/qr",
    invalidParams: [],
  };
  const result = parseProblemJSON(error);

  assertEquals(result.message, "Unknown error");
});

Deno.test("parseProblemJSON - Should return correct error message for Recurring with extraDetails", () => {
  const error = {
    extraDetails: [{
      field: "Some name",
      text: "Some reason",
    }],
  };
  const result = parseProblemJSON(error);

  assertEquals(result.message, "Some name - Some reason");
});

Deno.test("parseProblemJSON - Should return correct error message for Recurring with multiple extraDetails", () => {
  const error = {
    extraDetails: [{
      field: "Some name",
      text: "Some reason",
    }, {
      field: "Another name",
      text: "Another reason",
    }],
  };
  const result = parseProblemJSON(error);

  assertEquals(result.message, "Some name - Some reason");
});

Deno.test("parseProblemJSON - Should return correct error message for Recurring with empty extraDetails", () => {
  const error = {
    extraDetails: [],
  };
  const result = parseProblemJSON(error);

  assertEquals(result.message, "Unknown error");
});

Deno.test("parseProblemJSON - Should return correct error message for empty Problem JSON", () => {
  const error = {
    type: "https://example.com/error",
  };
  const result = parseProblemJSON(error);
  assertEquals(result.ok, false);
  assertEquals(result.message, `Unknown error`);
});
