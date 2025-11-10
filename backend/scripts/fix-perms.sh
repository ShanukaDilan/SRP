#!/usr/bin/env bash
set -e
cd "$(dirname "$0")/.."
mkdir -p storage/framework/{cache,sessions,views} bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache
chmod -R ug+rwx storage bootstrap/cache
