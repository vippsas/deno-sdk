/**
 * Represents an error response for user information.
 */
export type UserInfoError = {
  /**
   * A URI reference that identifies the problem type.
   * @example "https://example.com/validation-error"
   */
  type?: string;
  /**
   * A short, human-readable summary of the problem type.  It will not change from occurrence to occurrence of the problem.
   * @example "Your request parameters didn't validate."
   */
  title?: string;
  /**
   * The HTTP status code.
   * @example 400
   */
  status?: string;
  /**
   * A human-readable explanation specific to this occurrence of the problem.
   * @example "The request body contains one or more errors"
   */
  detail?: string;
  /**
   * An ID that can help when troubleshooting.
   * @example "123e4567-e89b-12d3-a456-426655440000"
   */
  instance?: string;
  /**
   * Additional information related to the error.
   */
  extraInfo?: Record<string, object>;
};

/**
 * Represents the user information.
 */
export type UserInfo = {
  /** Contains the user's preferred (default) address. */
  address?: UserInfoAddress;
  /** Contains an array with the user's non-default addresses, if any. This list can contain an address with the address_type home, work, and/or other, if the user has registered them in the Vipps app */
  other_addresses?: UserInfoAddress[];
  /**
   * The user's birthday formatted as YYYY-MM-DD
   * @example "2000-12-31"
   */
  birthdate?: string;
  /**
   * The user's email address.
   * @example "user@example.com"
   */
  email?: string;
  /**
   * Boolean value indicating whether the user's email address is verified or not.
   * @example true
   */
  email_verified?: boolean;
  /**
   * Surname(s) or last name(s) of the user.
   * @example "Lovelace"
   */
  family_name?: string;
  /**
   * Given name(s) or first name(s) of the user. Note that in some cultures, people can have multiple given names; all can be present, with the names being separated by space characters.
   * @example "Ada"
   */
  given_name?: string;
  /**
   * The user's full name in displayable form including all name parts, possibly including titles and suffixes, ordered according to the user's locale and preferences.
   * @example "Ada Lovelace"
   */
  name?: string;
  /**
   * National identity number.
   * For Norway this is the "fødselsnummer": 11 digits.
   * The format is "YYYYMMDD" + five digits.
   * See https://www.skatteetaten.no/en/person/foreign/norwegian-identification-number/national-identity-number/
   * @pattern ^\d{11}$
   * @example "09057517287"
   */
  nin?: string;
  /**
   * The user's telephone number.
   * The format is MSISDN: Digits only: Country code and subscriber
   * number, but no prefix.
   * See https://en.wikipedia.org/wiki/MSISDN
   * @pattern ^\d{15}$
   * @example "4791234567"
   */
  phone_number?: string;
  /**
   * Session identifier: This represents a session of a User Agent or
   * device. Currently not in use.
   * @example "7d78a726-af92-499e-b857-de263ef9a969"
   */
  sid?: string;
  /**
   * Subject: Unique identifier for the user.
   * The sub is based on the user's national identity number (NIN) and
   * does not change (except in very special cases).
   * The `sub` is the same when the user logs in again and re-consents.
   * @example "c06c4afe-d9e1-4c5d-939a-177d752a0944"
   */
  sub?: string;
};

/**
 * Represents the address information of a user.
 */
export type UserInfoAddress = {
  /**
   * Address type is either `home`, `work` or `other`.
   * @example "home"
   */
  address_type?: string;
  /**
   * Two letter country code
   * @format ^[A-Z]{2}$
   * @example "NO"
   */
  country?: string;
  /**
   * True if this is the default address
   * @example true
   */
  default?: boolean;
  /**
   * The user's address as a formatted string
   * @example "Robert Levins gate 5
   * 0154 Oslo"
   */
  formatted?: string;
  /**
   * Postal code
   * @example "0154"
   */
  postal_code?: string;
  /**
   * The user's region (typically a county, town or city)
   * @example "Oslo"
   */
  region?: string;
  /**
   * The user's street address
   * @example "Robert Levins gate 5"
   */
  street_address?: string;
};
