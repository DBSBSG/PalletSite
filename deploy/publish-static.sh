#!/usr/bin/env bash
set -euo pipefail

: "${HOSTINGER_USERNAME:?Set the HOSTINGER_USERNAME Actions variable}"
: "${HOSTINGER_DOMAIN:?Set the deployment hostname}"
: "${HOSTINGER_API_TOKEN:?Set the HOSTINGER_API_TOKEN Actions secret}"
archive=${1:?Provide the static site ZIP}
[[ -s "$archive" && "$HOSTINGER_USERNAME" =~ ^[a-zA-Z0-9_-]+$ ]]
[[ "$HOSTINGER_DOMAIN" =~ ^[a-zA-Z0-9.-]+$ ]]

api=https://developers.hostinger.com/api/hosting/v1
name="pallet-site-${GITHUB_RUN_ID:?}-${GITHUB_RUN_ATTEMPT:?}.zip"
size=$(wc -c < "$archive" | tr -d '[:space:]')
request() {
  curl -fsS --connect-timeout 15 --max-time 60 \
    -H "Authorization: Bearer $HOSTINGER_API_TOKEN" \
    -H 'Content-Type: application/json' "$@"
}

target=$(jq -nc --arg username "$HOSTINGER_USERNAME" --arg domain "$HOSTINGER_DOMAIN" \
  '{username:$username,domain:$domain}')
credentials=$(request --data "$target" "$api/files/upload-urls")
url=$(jq -er '.url | select(startswith("https://"))' <<< "$credentials")
auth=$(jq -er '.auth_key | select(length > 0)' <<< "$credentials")
rest=$(jq -er '.rest_auth_key | select(length > 0)' <<< "$credentials")
printf '::add-mask::%s\n' "$url" "$auth" "$rest"

upload() {
  curl -fsS --connect-timeout 15 --max-time 300 -o /dev/null \
    -H "X-Auth: $auth" -H "X-Auth-Rest: $rest" -H 'Tus-Resumable: 1.0.0' \
    -H 'Upload-Offset: 0' "$@" "${url%/}/$name"
}
status=$(upload -X POST -H "Upload-Length: $size" -w '%{http_code}')
[[ "$status" == 201 ]] || { echo 'Hostinger did not create the upload.' >&2; exit 1; }
offset=$(upload -X PATCH -H 'Content-Type: application/offset+octet-stream' \
  --data-binary "@$archive" -w '%{http_code} %header{upload-offset}')
[[ "$offset" == "204 $size" ]] || { echo 'Hostinger upload was incomplete.' >&2; exit 1; }

body=$(jq -nc --arg archive "$name" '{archive_path:$archive}')
request --data "$body" "$api/accounts/$HOSTINGER_USERNAME/websites/$HOSTINGER_DOMAIN/deploy" >/dev/null

for attempt in {1..12}; do
  if page=$(curl -fsS --max-time 15 "https://$HOSTINGER_DOMAIN/?deploy=$GITHUB_RUN_ID-$attempt") &&
    [[ "$page" == *'<title>Pallet Site</title>'* ]]; then
    echo "Verified https://$HOSTINGER_DOMAIN/"
    exit 0
  fi
  sleep 5
done
echo 'The deployed homepage could not be verified.' >&2
exit 1
