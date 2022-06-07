Semi-stateful Authorization

# on user logs out

## abbreviations

JSON - JavaScript Object Notation
JWT - JSON Web Tokens
IdM - Identity management (see IAM also)
IAM - identity and access management

## Specifications

IETF RFC 7519 - JWT
IETF RFC 6749 - The OAuth 2.0 Authorization Framework

## Useful References

[One does not simply log out when using JWT - Arpy Vanyan](https://medium.com/devgorilla/how-to-log-out-when-using-jwt-a8c7823e8a6)
[JSON Web Tokens (JWT) are Dangerous for User Sessions - Here's a Solution](https://redis.com/blog/json-web-tokens-jwt-are-dangerous-for-user-sessions/)
[Stop using JWT for sessions](http://cryto.net/~joepie91/blog/2016/06/13/stop-using-jwt-for-sessions/)

## Context - Using JWTs for Client Authorization Purposes

Server issues JWT with credentials and expiry date and JWTs "dies" naturally after expiry date. JWTs may also grant authority to revoke itself, which is applicable in use cases like user logging out or IAM reset. The token and its j is encoded in perpetuity - changing a data value (expiration date, for example) would violate the token's integrity. The primary benefit of JWT is leveraging cryptography to imprint a seal on data, such that correctness of the data can be recognised by the entity issuing the seal (in most cases, the authorization server) without cross-referencing with a database.

## Problem - Token Immutability and Revocability Status

JWT is a standard format, when applied with encryption or signing principles allows stateless validation of the token. However, we observe that there are use cases where a token could be revoked, prematurely and rightfully. The revocability status cannot be captured in the same JWT - an alternative operation is required to check this case.

## Solution - Database as Secondary Checkpoint to Check Expiry

We retain the current process and its benefit of reducing database calls.
Additionally, a relation between the token and its revocability status will be recorded in a database. Expiry validation will include querying the relation to check revocability status.

### Existing Authorization Process

Briefly,

1. Authorization Requestor provides JWT to Authority and action scope.
2. Authority validates JWT:
   2.1 Token Integrity
   2.2 ** Token Expiry **
   2.2.1 Checks payload field: exp
3. If validated, performs the action scope (access, resource etc).

### Recommended Authorization Process

We add step ** 2.2.2 **:

1. Authorization Requestor provides JWT to Authority and action scope.
2. Authority validates JWT:
   2.1 Token Integrity
   2.2 ** Token Expiry **
   2.2.1 Checks payload field <exp> in JWT if value exceeds defined time.
   2.2.2 Checks database for revocability status.
3. If validated, performs the action scope (access, resource etc).

### Cost and Mitigation

- The addition of database calls is expensive and slow in performance at scale. The following should be considered during implementation:

1. Use set data structure to store a list of revoked tokens. Only revoked tokens will be recorded.

- Insertion / Deletion / Access of single entry in constant time.

2. Use in-memory or cache database for fast and direct data manipulation. Authorization is arguably the most frequent and inescapable process and should be reasonably close to application layer.

### Recommended Technology

Redis
