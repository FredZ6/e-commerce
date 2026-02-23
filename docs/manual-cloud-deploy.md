# Manual Cloud Deploy (Cost-Safe)

Goal: keep cloud spend at zero by default, and deploy only when you explicitly click a manual workflow.

## Why this is cost-safe

- No `push`/`pull_request` deployment workflow exists.
- Deploy and destroy are both `workflow_dispatch` only.
- Both workflows require explicit safety phrases:
  - Deploy: `DEPLOY_DEMO`
  - Destroy: `DESTROY_DEMO`

If you do nothing, no cloud resource is started.

## Deployment model

- Use one remote VM (EC2/Lightsail/Droplet/etc.) with Docker + Compose installed.
- Deploy this repo on the VM and run:
  - `postgres`
  - `backend`
  - `frontend`
- Frontend serves the app and proxies `/api` to backend inside the compose network.

## One-time setup

1. Prepare VM:
- Install `docker`, `docker compose`, `git`, `curl`.
- Allow inbound port `80` (and `22` for SSH).

2. Configure GitHub repository secrets:
- `DEMO_HOST`: VM public host/IP
- `DEMO_USER`: SSH user
- `DEMO_SSH_PRIVATE_KEY`: private key content (PEM)
- `DEMO_ENV_FILE`: full `.env.deploy` content

3. Create deploy env file from template:
- Copy `/Users/fredz/Downloads/e-commerce/.env.deploy.example`
- Fill real secrets/passwords, especially `JWT_SECRET` and DB password
- Put the final content into secret `DEMO_ENV_FILE`

## Deploy when you need a demo

1. Open GitHub Actions workflow:
- `manual-demo-deploy`

2. Input:
- `confirm_phrase`: `DEPLOY_DEMO`
- `deploy_ref`: branch/tag/commit to deploy (default `main`)
- `run_smoke_check`: `true`

3. Click **Run workflow**.

## Destroy right after demo

1. Open workflow:
- `manual-demo-destroy`

2. Input:
- `confirm_phrase`: `DESTROY_DEMO`
- `remove_volumes`: `true` (recommended to fully clean DB/storage)

3. Click **Run workflow**.

## Local fallback (without Actions)

You can run scripts from your machine directly:

```bash
CONFIRM_DEPLOY=DEPLOY_DEMO \
DEPLOY_HOST=<host> \
DEPLOY_USER=<user> \
DEPLOY_SSH_KEY_PATH=~/.ssh/demo.pem \
LOCAL_ENV_FILE=.env.deploy \
./scripts/cloud/deploy_demo_remote.sh
```

Destroy:

```bash
CONFIRM_DESTROY=DESTROY_DEMO \
DEPLOY_HOST=<host> \
DEPLOY_USER=<user> \
DEPLOY_SSH_KEY_PATH=~/.ssh/demo.pem \
./scripts/cloud/destroy_demo_remote.sh
```

## Cost guard checklist

- Set cloud budget alert (email).
- Use smallest VM flavor for demo.
- Keep only port `80` exposed publicly.
- Destroy stack immediately after demo.
- Stop or delete VM if you do not need near-term demos.
