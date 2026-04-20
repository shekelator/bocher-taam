# בֹּחֵר טַעַם — Bocher Taam

A client-side Hebrew Nikud & Te'amim editor built with Svelte 5 + TypeScript. Add vowel points (nekudot) and cantillation marks (te'amim) to Hebrew text with a palette or keyboard shortcuts. Enforces SBL-standard code-point ordering within grapheme clusters for highest-quality rendering.

## Getting Started

### Prerequisites
- Node.js 22 LTS (or use the included Dev Container)

### Install & Run
```bash
npm install
npm run dev -- --host 0.0.0.0
```
Open http://localhost:5173

### Build for Production
```bash
npm run build
```
Output is in `build/` — ready for GitHub Pages.

## Deploy to CloudFront

This repo includes a GitHub Actions workflow at `.github/workflows/deploy-cloudfront.yml` that builds the app, uploads `build/` to the `bocher-taam/` prefix in S3, and invalidates a CloudFront distribution.

### GitHub repository variables

Add these repository variables before running the workflow:

| Variable | Description |
|-----|--------|
| `AWS_REGION` | AWS region for the deployment role and S3 bucket |
| `AWS_ROLE_TO_ASSUME` | IAM role ARN assumed by GitHub Actions via OIDC |
| `S3_BUCKET` | S3 bucket name that stores the built site under the hard-coded `bocher-taam/` prefix |
| `CLOUDFRONT_DISTRIBUTION_ID` | CloudFront distribution ID to invalidate after upload |

### AWS prerequisites

1. Configure GitHub OIDC trust on the deployment role for this repository.
2. Grant that role `s3:ListBucket`, `s3:PutObject`, and `s3:DeleteObject` on the bucket, plus `cloudfront:CreateInvalidation` on the distribution.
3. Configure CloudFront with `index.html` as the default root object and map `403` and `404` errors to `/index.html` with a `200` response so SPA routes work on refresh.

### Create the IAM role for GitHub Actions

GitHub Actions needs an IAM role in your AWS account that it can assume with OpenID Connect. Create the role once, then store its ARN in the `AWS_ROLE_TO_ASSUME` repository variable.

1. In AWS IAM, add the OpenID Connect provider `https://token.actions.githubusercontent.com` if your account does not already have it.
2. Create an IAM role for GitHub Actions deployment.
3. Use the trust policy below, replacing `AWS_ACCOUNT_ID`, `YOUR_ORG`, and `YOUR_REPO`.
4. Attach the permission policy below, replacing `YOUR_BUCKET_NAME` and `YOUR_DISTRIBUTION_ID`.
5. Copy the created role ARN into the GitHub repository variable `AWS_ROLE_TO_ASSUME`.

Example trust policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::AWS_ACCOUNT_ID:oidc-provider/token.actions.githubusercontent.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
        },
        "StringLike": {
          "token.actions.githubusercontent.com:sub": "repo:YOUR_ORG/YOUR_REPO:*"
        }
      }
    }
  ]
}
```

To restrict deployments to a single branch, change the `sub` condition to:

```json
"token.actions.githubusercontent.com:sub": "repo:YOUR_ORG/YOUR_REPO:ref:refs/heads/main"
```

Example permissions policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "ListBucket",
      "Effect": "Allow",
      "Action": [
        "s3:ListBucket"
      ],
      "Resource": "arn:aws:s3:::YOUR_BUCKET_NAME"
    },
    {
      "Sid": "ManageSiteObjects",
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:DeleteObject"
      ],
      "Resource": "arn:aws:s3:::YOUR_BUCKET_NAME/bocher-taam/*"
    },
    {
      "Sid": "InvalidateCloudFront",
      "Effect": "Allow",
      "Action": [
        "cloudfront:CreateInvalidation"
      ],
      "Resource": "arn:aws:cloudfront::AWS_ACCOUNT_ID:distribution/YOUR_DISTRIBUTION_ID"
    }
  ]
}
```

Example repository variable value:

```text
arn:aws:iam::123456789012:role/github-actions-bocher-taam-deploy
```

### Triggering deploys

The workflow runs on pushes to `main` or `master`, and it can also be triggered manually from the Actions tab.

## Usage Guide

1. **Type or paste Hebrew text** into the editor area (RTL, large font)
2. **Add diacritics** using:
   - **Palette**: Click a mark in the Nekudot or Te'amim tab to insert it at the cursor
   - **Chord mode**: Press `` ` `` to enter chord mode, then press the key shown on the mark
3. **Search**: Type in the search box to filter marks by name
4. **Common / All toggle**: Show only common marks or the full set
5. **Font size**: Use A− / A+ buttons or Ctrl/Cmd + / −
6. **Export**: Copy to clipboard or Save as .txt

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `` ` `` | Enter chord mode |
| `Tab` (in chord mode) | Switch Nekudot ↔ Te'amim |
| `Esc` (in chord mode) | Cancel chord mode |
| `Ctrl/Cmd + =` or `+` | Increase font size |
| `Ctrl/Cmd + -` | Decrease font size |
| `Ctrl/Cmd + Shift + C` | Copy all to clipboard |
| `Ctrl/Cmd + Shift + S` | Save as .txt |
| `Ctrl/Cmd + Z` | Undo |

## Architecture

```
src/
  lib/
    data/         # Static mark definitions (nekudot.ts, teamim.ts)
    engine/       # cluster.ts (SBL normalization), cursor.ts
    stores/       # Svelte 5 runes-based state
    types.ts      # Shared TypeScript types
  components/     # Svelte UI components
  routes/         # SvelteKit page route
  app.css         # Global CSS variables + reset
```
Simple editor for adding nekudot and te'amim to Hebrew text

## TODOs
- Dark mode
- Build pipeline, deployment somewhere
