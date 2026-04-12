# dzzt-android
Port "Dzień z życia TekLaga" na Androida

## Kompilacja
Wymagany jest Gradle 8.7 i Android Studio z SDK w wersji 33.0.2.
Kompilacja na Windowsie nie jest testowana.

Debug:
```
cordova prepare
cordova build
```
Release:
```
cordova prepare
cordova build --release
```
Wygeneruje to .aab który nie jest gotowy do instalacji.

INFO: Gradle musi być w PATH.
