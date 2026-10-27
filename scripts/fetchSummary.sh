#!/usr/bin/env bash

set -e

./scripts/fetchSummary2024.sh
./scripts/fetchSummary2025spring.sh
./scripts/fetchSummary2025fall.sh
./scripts/fetchSummary2026spring.sh
