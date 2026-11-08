#!/usr/bin/env bash
set -euo pipefail

# Run on the approved RS server; the certificate must be trusted on kiosk/display clients.
OUT_DIR="${1:-/etc/ssl/rs-queue}"
SERVER_IP="${2:-127.0.0.1}"
mkdir -p "$OUT_DIR"
openssl req -x509 -nodes -days 365 -newkey rsa:3072 \
  -keyout "$OUT_DIR/privkey.pem" \
  -out "$OUT_DIR/fullchain.pem" \
  -subj "/CN=${SERVER_IP}" \
  -addext "subjectAltName=IP:${SERVER_IP},DNS:localhost,IP:127.0.0.1"
chmod 600 "$OUT_DIR/privkey.pem"
chmod 644 "$OUT_DIR/fullchain.pem"
echo "Certificate created at $OUT_DIR. Install/trust the certificate on each kiosk/display client before UAT."
