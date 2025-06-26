#!/bin/bash

FULL_REBUILD=${1:-false}

set -e

if [ "$FULL_REBUILD" == "true" ]; then
  echo "Doing full clean..."
  rm -rf build
  rm -rf node_modules
  rm -rf .expo
  npm install
else
  echo "Doing light clean..."
fi

rm -rf android/.gradle
rm -rf android/app/build
rm -rf android/app/.cxx
rm -rf android/.kotlin

cd android
./gradlew clean
./gradlew assembleDebug --no-daemon
cd ..

npm run android
