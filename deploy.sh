#!/usr/bin/env bash

# Triggers automatic deploy for certain branches.
#
# Uses Shippable env variables:
# - BRANCH
# - COMMIT

set -e

elementIn () {
  local e
  for e in "${@:2}"; do [[ "$e" == "$1" ]] && return 0; done
  return 1
}

# Automatic deploy allowed for these branches only.
DEPLOY_BRANCHES=("staging" "master")

if ! elementIn "$BRANCH" "${DEPLOY_BRANCHES[@]}" ;
then
  echo "Skiping deploy as branch is not allowed for automatic deploy"
  exit 0
fi

# Id of the Shippable project containing the deploy script.
DEPLOY_PROJECT_ID=5804f143e8fe021000f9aed1
BUILT_PROJECT_NAME=rgi

echo $REPO_FULL_NAME
echo $COMITTER
echo $COMMIT_MESSAGE
# Trigger Shippable to run the deploy project and pass the current project name, branch, and latest commit hash, committer, commit message
STATUS=$(curl -s\
  -H "Authorization: apiToken $API_TOKEN"\
  -H "Content-Type: application/json"\
  -d "{\"branchName\":\"master\",\"globalEnv\": {\"PROJECT\":\"$BUILT_PROJECT_NAME\", \"PROJECT_BRANCH\":\"$BRANCH\", \"PROJECT_COMMIT\":\"$COMMIT\", \"PROJECT_REPO_FULL_NAME\":\"test_repo_full_name\", \"PROJECT_COMMITTER\":\"test_committer\", \"PROJECT_COMMIT_MESSAGE\":\"test_commit_message\" }}"\
  "https://api.shippable.com/projects/$DEPLOY_PROJECT_ID/newBuild")
echo "$STATUS"

if [[ "$STATUS" == *"runId"* ]]
then
  echo "Deploy triggered successfully";
  exit 0
else
  echo "Failed to trigger deploy.";
  exit 1
fi
