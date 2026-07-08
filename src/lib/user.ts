// Single-user mode.
//
// The app has no authentication yet, so every database row is tagged with
// this constant user id. When real auth is added later, replace the body of
// getCurrentUserId() with a session lookup — nothing else in the codebase
// (queries, actions, seed) should need to change, because they all go
// through this function instead of hardcoding an id.

export const LOCAL_USER_ID = "local-user";

export function getCurrentUserId(): string {
  return LOCAL_USER_ID;
}
