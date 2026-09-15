# Week 12 Starter: Temperature Converter, the Cloud-Native Way

**ITE 3213 – Software Engineering in Practice**

This is the starter repository for the Week 12 lab. It is the Week 11 Temperature Converter plus everything needed to run it as a cloud-native service. Follow the Week 12 lab sheet; this README is only a map of the files.

| Path | What it is | Lab part |
|---|---|---|
| `site/` | The Week 11 static site (`index.html` now shows which replica served it) | 1 |
| `tests/script.test.js` | The three Jest tests from Week 11, unchanged | 1 |
| `server.js` | A dependency-free HTTP server: serves `site/`, plus `/healthz`, `/break`, `/api/info`, `/api/convert` | 1, 4 |
| `Dockerfile`, `.dockerignore` | Builds the container image | 1, 2 |
| `.github/workflows/ci-cd.yml` | The Week 11 `test` job plus a `package` job that pushes the image to GHCR (the Week 11 GitHub Pages job is gone: the site now ships inside the image) | 2 |
| `k8s/configmap.yaml` | Runtime configuration (`GREETING`, `APP_VERSION`) | 3, 5 |
| `k8s/deployment.yaml` | Three replicas, rolling update strategy, liveness and readiness probes | 3 to 6 |
| `k8s/service.yaml` | One stable address on NodePort 30080 | 3 |

## Quick start

```bash
npm install
npm test          # three passing tests
npm start         # http://localhost:3000
```

Then follow the lab sheet from Part 0.

## Endpoints

| Path | Purpose |
|---|---|
| `/` | The converter page; the footer shows the pod that served it |
| `/api/info` | JSON: hostname, version, greeting, uptime |
| `/api/convert?c=100` | JSON conversion, includes `servedBy` |
| `/healthz` | `200` while healthy, `500` after `/break` |
| `/break` | Makes `/healthz` fail so you can watch the liveness probe restart the container |

## One thing you must edit

`k8s/deployment.yaml` line with `image:` must point at **your** image:

```
image: ghcr.io/<your-github-username-in-lowercase>/<your-repo-name>:latest
```
