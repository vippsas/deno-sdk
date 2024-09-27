/**
 * This is a workaround for `crypto.randomUUID` not being available in
 * Node.js 18. This will be removed after Node.js 18 reaches End-of-Life
 * 30 Apr 2025.
 */
export { v4 as uuid } from "https://deno.land/std@0.158.0/uuid/mod.ts";
