#!/usr/bin/env bash
set -euo pipefail

# configure-dns.sh
# Creates/updates Route 53 DNS records for main site, admin portal, and API custom domain.
#
# Usage:
#   ./scripts/configure-dns.sh <env> <root_domain> [hosted_zone_id]
# Example:
#   ./scripts/configure-dns.sh prod lostal.com.ua
#   ./scripts/configure-dns.sh dev dev.lostal.com.ua Z123ABCDEF456

if [[ $# -lt 2 ]]; then
  echo "Usage: $0 <env: dev|staging|prod> <root_domain> [hosted_zone_id]" >&2
  exit 1
fi

ENV="$1"
ROOT_DOMAIN="$2"          # e.g. lostal.com.ua
HOSTED_ZONE_ID="${3:-}"   # optional, if omitted will be looked up

# Constants
CLOUDFRONT_HOSTED_ZONE_ID="Z2FDTNDATAQYW2"  # Global CF Hosted Zone ID (alias target)

command -v aws >/dev/null 2>&1 || { echo "ERROR: aws CLI not found" >&2; exit 2; }
command -v terraform >/dev/null 2>&1 || { echo "ERROR: terraform not found" >&2; exit 2; }
command -v jq >/dev/null 2>&1 || { echo "ERROR: jq not found (required)" >&2; exit 2; }

echo "Environment: $ENV"
echo "Root domain: $ROOT_DOMAIN"

# Basic validation/sanitization to avoid common arg mistakes
# 1) If ROOT_DOMAIN looks like a hosted zone id, warn and exit
if [[ "$ROOT_DOMAIN" =~ ^/hostedzone/ ]]; then
  echo "ERROR: The second argument must be a root domain (e.g. lostal.com.ua), not a hosted zone id." >&2
  echo "       Example: $0 $ENV lostal.com.ua Z123ABCDEF" >&2
  exit 1
fi

if [[ "$ROOT_DOMAIN" =~ ^Z[A-Z0-9]{6,}$ ]]; then
  echo "ERROR: The second argument looks like a hosted zone id ($ROOT_DOMAIN)." >&2
  echo "       Please pass the domain as the second arg and the hosted zone id as the optional third arg." >&2
  echo "       Example: $0 $ENV lostal.com.ua Z123ABCDEF" >&2
  exit 1
fi

if [[ "$ROOT_DOMAIN" != *.* ]]; then
  echo "ERROR: The second argument must be a valid domain (e.g. lostal.com.ua). Got: $ROOT_DOMAIN" >&2
  exit 1
fi

if [[ -z "$HOSTED_ZONE_ID" ]]; then
  echo "Looking up Hosted Zone ID for $ROOT_DOMAIN ..."
  # Note: list-hosted-zones-by-name requires trailing dot for exact match
  HZ_RAW=$(aws route53 list-hosted-zones-by-name --dns-name "${ROOT_DOMAIN}." \
    --query 'HostedZones[0].Id' --output text)
  if [[ -z "$HZ_RAW" || "$HZ_RAW" == "None" ]]; then
    echo "ERROR: Could not find hosted zone for $ROOT_DOMAIN" >&2
    exit 3
  fi
  HOSTED_ZONE_ID="${HZ_RAW#/hostedzone/}"
fi

echo "Using Hosted Zone ID: $HOSTED_ZONE_ID"

# Resolve repository root relative to this script so it works from any CWD
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# Obtain targets from Terraform and AWS
ENV_DIR="$REPO_ROOT/infrastructure/environments/$ENV"
if [[ ! -d "$ENV_DIR" ]]; then
  echo "ERROR: Environment directory not found: $ENV_DIR" >&2
  exit 4
fi
pushd "$ENV_DIR" >/dev/null

echo "Initializing Terraform backend for $ENV ..."
case "$ENV" in
  dev)      TF_KEY="dev/terraform.tfstate" ;;
  staging)  TF_KEY="staging/terraform.tfstate" ;;
  prod)     TF_KEY="prod/terraform.tfstate" ;;
  *) echo "ERROR: Unknown env $ENV" >&2; exit 4 ;;
esac

terraform init -backend-config="bucket=lostal-terraform-state" \
               -backend-config="key=$TF_KEY" \
               -backend-config="region=eu-central-1" >/dev/null

echo "Reading CloudFront distribution IDs from terraform outputs ..."
MAIN_CF_ID=$(terraform output -raw cloudfront_distribution_id_main)
ADMIN_CF_ID=$(terraform output -raw cloudfront_distribution_id_admin)

if [[ -z "$MAIN_CF_ID" || -z "$ADMIN_CF_ID" ]]; then
  echo "ERROR: Missing CloudFront distribution IDs from terraform outputs" >&2
  exit 5
fi

echo "Fetching CloudFront domain names ..."
MAIN_CF_DOMAIN=$(aws cloudfront get-distribution --id "$MAIN_CF_ID" --query 'Distribution.DomainName' --output text)
ADMIN_CF_DOMAIN=$(aws cloudfront get-distribution --id "$ADMIN_CF_ID" --query 'Distribution.DomainName' --output text)

if [[ -z "$MAIN_CF_DOMAIN" || -z "$ADMIN_CF_DOMAIN" ]]; then
  echo "ERROR: Failed to resolve CloudFront domain names" >&2
  exit 6
fi

# API custom domain: api.<root>
API_CUSTOM_DOMAIN="api.${ROOT_DOMAIN}"
echo "Resolving API Gateway custom domain: $API_CUSTOM_DOMAIN ..."

# apigateway (REST) provides regionalDomainName and regionalHostedZoneId for alias
API_JSON=$(aws apigateway get-domain-name --domain-name "$API_CUSTOM_DOMAIN" \
  --query '{name:domainName,regionalDomainName:regionalDomainName,regionalHostedZoneId:regionalHostedZoneId}' \
  --output json || true)

API_DOMAIN_TARGET=$(echo "$API_JSON" | jq -r '.regionalDomainName // empty' 2>/dev/null || true)
API_HOSTED_ZONE_ID=$(echo "$API_JSON" | jq -r '.regionalHostedZoneId // empty' 2>/dev/null || true)

if [[ -z "$API_DOMAIN_TARGET" || -z "$API_HOSTED_ZONE_ID" ]]; then
  echo "ERROR: Could not find API Gateway custom domain $API_CUSTOM_DOMAIN. Ensure Terraform applied and domain exists." >&2
  exit 7
fi

popd >/dev/null

echo "Targets resolved:"
echo "  - $ROOT_DOMAIN -> $MAIN_CF_DOMAIN (CF)"
echo "  - admin.$ROOT_DOMAIN -> $ADMIN_CF_DOMAIN (CF)"
echo "  - api.$ROOT_DOMAIN -> $API_DOMAIN_TARGET (API Gateway)"

TMP_CHANGES=$(mktemp)
cat > "$TMP_CHANGES" <<JSON
{
  "Comment": "Upsert DNS for $ROOT_DOMAIN ($ENV)",
  "Changes": [
    {
      "Action": "UPSERT",
      "ResourceRecordSet": {
        "Name": "$ROOT_DOMAIN",
        "Type": "A",
        "AliasTarget": {
          "HostedZoneId": "$CLOUDFRONT_HOSTED_ZONE_ID",
          "DNSName": "$MAIN_CF_DOMAIN",
          "EvaluateTargetHealth": false
        }
      }
    },
    {
      "Action": "UPSERT",
      "ResourceRecordSet": {
        "Name": "admin.$ROOT_DOMAIN",
        "Type": "A",
        "AliasTarget": {
          "HostedZoneId": "$CLOUDFRONT_HOSTED_ZONE_ID",
          "DNSName": "$ADMIN_CF_DOMAIN",
          "EvaluateTargetHealth": false
        }
      }
    },
    {
      "Action": "UPSERT",
      "ResourceRecordSet": {
        "Name": "api.$ROOT_DOMAIN",
        "Type": "A",
        "AliasTarget": {
          "HostedZoneId": "$API_HOSTED_ZONE_ID",
          "DNSName": "$API_DOMAIN_TARGET",
          "EvaluateTargetHealth": false
        }
      }
    }
  ]
}
JSON

echo "Submitting Route53 change batch ..."
CHANGE_INFO=$(aws route53 change-resource-record-sets \
  --hosted-zone-id "$HOSTED_ZONE_ID" \
  --change-batch file://"$TMP_CHANGES")

echo "$CHANGE_INFO" | jq '.' || echo "$CHANGE_INFO"

echo "Waiting for Route53 change to INSYNC ..."
CHANGE_ID=$(echo "$CHANGE_INFO" | jq -r '.ChangeInfo.Id' 2>/dev/null || echo "")
CHANGE_ID="${CHANGE_ID#/change/}"
if [[ -n "$CHANGE_ID" ]]; then
  aws route53 wait resource-record-sets-changed --id "$CHANGE_ID"
fi

rm -f "$TMP_CHANGES"
echo "✅ DNS records upserted successfully for $ROOT_DOMAIN ($ENV)"


