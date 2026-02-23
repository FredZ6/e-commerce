# Security and Authorization Checklist

Updated: 2026-02-23

Purpose:
- Keep a concise, verifiable checklist for critical endpoint authorization and abuse controls.
- Pair each rule with an automated test or an executable verification command.

## Endpoint Authorization Matrix

| Area | Endpoint | Anonymous | USER | ADMIN | Evidence |
| --- | --- | --- | --- | --- | --- |
| Product catalog | `GET /api/products` | Allow | Allow | Allow | `SecurityBaselineContractTest.productCatalogShouldRemainPublic` |
| Product write | `POST /api/products/add` | Deny | Deny | Allow | `SecurityRulesTest.nonAdminCannotCreateProduct` |
| Cart read/write | `/api/cart/**` | Deny | Allow | Allow | `WebSecurityConfig` matcher + integration tests |
| User orders | `/api/orders/**` | Deny | Allow (self scope in service layer) | Allow | `OrderContractTest`, runtime checks |
| Admin orders list | `GET /api/orders/admin` | Deny | Deny | Allow | `SecurityBaselineContractTest.adminOrderEndpointShouldBeRoleProtected` |
| Admin status update | `PUT /api/orders/admin/{id}/status` | Deny | Deny | Allow | `AdminOrderControllerTest`, `SecurityBaselineContractTest` |
| Health check | `GET /actuator/health` | Allow | Allow | Allow | `ObservabilityIntegrationTest.healthEndpointShouldBePublic` |
| Metrics | `GET /actuator/metrics` | Deny | Deny | Allow | `SecurityBaselineContractTest.metricsEndpointShouldRequireAdmin` |
| OpenAPI docs | `/v3/api-docs/**`, `/swagger-ui/**` | Allow | Allow | Allow | `OpenApiContractTest.openApiSpecShouldBePublicAndExposeCorePaths` |

## Abuse and Secret Controls

| Control | Current rule | Evidence |
| --- | --- | --- |
| Login rate limit | Temporary block after max failed attempts within configured window | `LoginRateLimitTest` |
| JWT startup validation | Reject weak/default secrets under non-local profile | `SecurityStartupValidatorTest` |
| Stateless auth | JWT filter chain with `SessionCreationPolicy.STATELESS` | `WebSecurityConfig` |

## Verification Commands

```bash
cd backend/shop
./mvnw -q -Dtest=SecurityRulesTest,LoginRateLimitTest,SecurityBaselineContractTest,OpenApiContractTest test
```

```bash
cd backend/shop
./mvnw -q test
```
