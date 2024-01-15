/**
 * This helper type concatenates a union of string literals with a separator.
 *
 * This type is useful for creating a type that represents a list of words
 * separated by, e.g. a whitespace, where the words are known in advance.
 * The resulting type can be used to validate that a string contains only the
 * allowed words, and no duplicates.
 *
 * **CAUTION**: The max number of string literals supported is 8.
 * Above that, TypeScript will hit the recursion limit.
 *
 * @param TUnion - The union of string literals.
 * @param TSep - The separator string.
 * @param TString - The current string literal being processed.
 */
type UnionConcat<
  TUnion extends string,
  TSep extends string,
  TString extends TUnion = TUnion,
> = [TString] extends [never] ? ""
  : TString extends TString ?
      | TString
      | `${TString}${UnionConcat<Exclude<TUnion, TString>, TSep> extends
        infer str extends string ? str extends "" ? str
        : `${TSep}${str}`
        : ""}`
  : "";

/**
 * See documentation of scopes here:
 * https://developer.vippsmobilepay.com/docs/APIs/login-api/api-guide/core-concepts/#scopes
 */
export type ValidUserScopes =
  | "openid"
  | "address"
  | "birthDate"
  | "email"
  | "name"
  | "phoneNumber"
  | "nin"
  | "delegatedConsents";

export type Scope = UnionConcat<ValidUserScopes, " ">;
