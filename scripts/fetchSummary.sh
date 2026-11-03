#!/usr/bin/env bash

set -e

./scripts/fetchSummary2023.sh
./scripts/fetchSummary2024spring.sh
./scripts/fetchSummary2025spring.sh
./scripts/fetchSummary2025fall.sh
./scripts/fetchSummary2026spring.sh
