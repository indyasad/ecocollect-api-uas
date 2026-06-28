#!/usr/bin/env bash
set -e

BASE_URL="${BASE_URL:-http://localhost:3000}"
OUTPUT_FILE="docs/endpoint-test-results.txt"
mkdir -p docs
: > "$OUTPUT_FILE"

log() {
  echo -e "\n==============================" | tee -a "$OUTPUT_FILE"
  echo "$1" | tee -a "$OUTPUT_FILE"
  echo "==============================" | tee -a "$OUTPUT_FILE"
}

request() {
  local title="$1"
  local method="$2"
  local path="$3"
  local body="$4"
  local token="$5"

  log "$title"
  echo "$method $BASE_URL$path" | tee -a "$OUTPUT_FILE"

  if [[ -n "$token" && -n "$body" ]]; then
    curl -s -X "$method" "$BASE_URL$path" \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer $token" \
      -d "$body" | tee -a "$OUTPUT_FILE"
  elif [[ -n "$token" ]]; then
    curl -s -X "$method" "$BASE_URL$path" \
      -H "Authorization: Bearer $token" | tee -a "$OUTPUT_FILE"
  elif [[ -n "$body" ]]; then
    curl -s -X "$method" "$BASE_URL$path" \
      -H "Content-Type: application/json" \
      -d "$body" | tee -a "$OUTPUT_FILE"
  else
    curl -s -X "$method" "$BASE_URL$path" | tee -a "$OUTPUT_FILE"
  fi
  echo "" | tee -a "$OUTPUT_FILE"
}

EMAIL="budi$(date +%s)@mail.com"
PASSWORD="rahasia123"

request "0. Route List API" "GET" "/api/routes" "" ""

request "1. Registrasi" "POST" "/api/auth/register" "{\"name\":\"Budi Santoso\",\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\",\"phone\":\"081234567890\",\"address\":\"Sangatta Selatan\"}" ""

log "2. Login"
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}")
echo "$LOGIN_RESPONSE" | tee -a "$OUTPUT_FILE"
TOKEN=$(node -e "const data=JSON.parse(process.argv[1]); console.log(data.data.token)" "$LOGIN_RESPONSE")
echo "TOKEN berhasil diambil" | tee -a "$OUTPUT_FILE"

request "3. Get Profile" "GET" "/api/profile" "" "$TOKEN"
request "4. Update Profile" "PUT" "/api/profile" "{\"name\":\"Budi Eco\",\"phone\":\"081298765432\",\"address\":\"Jl. Merdeka No. 10\"}" "$TOKEN"
request "5. Get Categories" "GET" "/api/categories" "" "$TOKEN"
request "6. Create Category" "POST" "/api/categories" "{\"name\":\"Botol Kaca\",\"price_per_kg\":1500}" "$TOKEN"
request "7. Create Deposit" "POST" "/api/deposits" "{\"category_id\":1,\"weight_kg\":5,\"note\":\"Setoran plastik mingguan\"}" "$TOKEN"
request "8. Get Deposits" "GET" "/api/deposits" "" "$TOKEN"
request "9. Get Balance" "GET" "/api/balance" "" "$TOKEN"
request "10. Create Withdrawal" "POST" "/api/withdrawals" "{\"amount\":5000,\"method\":\"tunai\",\"note\":\"Ambil saldo sebagian\"}" "$TOKEN"
request "11. Get Withdrawals" "GET" "/api/withdrawals" "" "$TOKEN"
request "12. Dashboard" "GET" "/api/dashboard" "" "$TOKEN"

echo -e "\nHasil percobaan endpoint tersimpan di $OUTPUT_FILE"
