0.Copy past all android files
1.build.gradle: add  implementation("net.java.dev.jna:jna:5.14.0@aar")
2.npm install @react-navigation/native @react-navigation/stack expo-linking


### useful comands:
craete andoird app - npx expo prebuild --platform android                                                                                                    local 20:21:34
### rebuild app
    cd android && ./gradlew clean && ./gradlew assembleDebug && cd .. && npm run android 

### restart gradle - # Stop all Gradle daemons first
    cd android &&
    ./gradlew --stop &&
    cd .. &&
    rm -rf ~/.gradle/caches &&
    rm -rf android/.gradle &&
    npx expo run:android`