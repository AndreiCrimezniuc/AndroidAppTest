#!/bin/bash

echo "🚀 Starting Expo Production Build..."

# Check for EAS configuration
if [ ! -f "eas.json" ]; then
    echo "❌ No eas.json found. Run 'npx eas build:configure' first"
    exit 1
fi

BUILD_FORMAT=${1:-aab}
BUILD_LOCATION=${2:-local}

echo "🔍 Build format: $BUILD_FORMAT"
echo "🔍 Build location: $BUILD_LOCATION"

case $BUILD_LOCATION in
    "local")
        echo "🏗️ Building locally with EAS..."
        
        if [ "$BUILD_FORMAT" = "aab" ]; then
            echo "📦 Building AAB locally..."
            npx eas build --platform android --profile production --local
        elif [ "$BUILD_FORMAT" = "apk" ]; then
            echo "📦 Building APK locally..."
            npx eas build --platform android --profile production --local --output grid_app.apk
        else
            echo "❌ Invalid format: $BUILD_FORMAT (use 'aab' or 'apk')"
            exit 1
        fi
        ;;
        
    "cloud")
        echo "☁️ Building in the cloud with EAS..."
        
        if [ "$BUILD_FORMAT" = "aab" ]; then
            echo "📦 Building AAB in cloud..."
            npx eas build --platform android --profile production
        elif [ "$BUILD_FORMAT" = "apk" ]; then
            echo "📦 Building APK in cloud..."
            npx eas build --platform android --profile production --output apk
        else
            echo "❌ Invalid format: $BUILD_FORMAT (use 'aab' or 'apk')"
            exit 1
        fi
        ;;
        
    *)
        echo "❌ Invalid build location: $BUILD_LOCATION"
        echo "Usage: ./build-expo-prod.sh [aab|apk] [local|cloud]"
        echo ""
        echo "Examples:"
        echo "  ./build-expo-prod.sh aab local    # Build AAB locally"
        echo "  ./build-expo-prod.sh apk cloud    # Build APK in cloud"
        exit 1
        ;;
esac

echo "✨ Production build process complete!"
echo ""
echo "📋 Next steps:"
if [ "$BUILD_LOCATION" = "local" ]; then
    echo "  - Check the build output directory"
    echo "  - Test the build on devices"
else
    echo "  - Check EAS dashboard for build status"
    echo "  - Download when build completes"
fi