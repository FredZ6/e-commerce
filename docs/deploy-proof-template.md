# Cloud Deploy Proof Log (Resume Evidence)

Use this checklist after each live demo deployment so you can show an end-to-end proof chain in interviews.

## Session Metadata

- Date:
- Operator:
- Git ref:
- Commit SHA:
- Cloud provider / region:
- Remote host:

## Deploy Evidence

- Workflow: `manual-demo-deploy`
- Run URL:
- Inputs:
  - `confirm_phrase=DEPLOY_DEMO`
  - `deploy_ref=`
  - `run_smoke_check=`
- Result: `success|failure`
- Frontend URL:
- Backend URL:
- Smoke check output summary:

## Product Validation

- [ ] Login works
- [ ] Products page loads with 6 demo products and images
- [ ] Add-to-cart updates header count without manual refresh
- [ ] Checkout page opens and order can be created
- [ ] Admin order status update works

Notes:

-

## Destroy / Rollback Evidence

- Workflow: `manual-demo-destroy`
- Run URL:
- Inputs:
  - `confirm_phrase=DESTROY_DEMO`
  - `remove_volumes=`
- Result: `success|failure`
- Cost control note (what was destroyed/stopped):

## Optional Attachments

- Screenshot / recording link:
- Public status page or health endpoint response:
- Relevant GitHub Actions run logs:

## Guardrail Verification

Run before and after workflow edits:

```bash
./scripts/cloud/verify_manual_workflows.sh
```
