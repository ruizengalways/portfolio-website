#!/usr/bin/env bash
set -e

ENVIRONMENT=${1:-production}

echo "Deploying backend to environment: $ENVIRONMENT"

./backend/scripts/typecheck.sh
./backend/scripts/test.sh

npm run deploy -- --env "$ENVIRONMENT"

echo "Deployment complete."