apply plugin: "com.android.application"
apply plugin: "io.fabric"
apply from: project(':react-native-config').projectDir.getPath() + "/dotenv.gradle"

import com.android.build.OutputFile

/**
 * The react.gradle file registers a task for each build variant (e.g. bundleDebugJsAndAssets
 * and bundleReleaseJsAndAssets).
 * These basically call `react-native bundle` with the correct arguments during the Android build
 * cycle. By default, bundleDebugJsAndAssets is skipped, as in debug/dev mode we prefer to load the
 * bundle directly from the development server. Below you can see all the possible configurations
 * and their defaults. If you decide to add a configuration block, make sure to add it before the
 * `apply from: "../../node_modules/react-native/react.gradle"` line.
 *
 * project.ext.react = [
 *   // the name of the generated asset file containing your JS bundle
 *   bundleAssetName: "index.android.bundle",
 *
 *   // the entry file for bundle generation
 *   entryFile: "index.android.js",
 *
 *   // whether to bundle JS and assets in debug mode
 *   bundleInDebug: false,
 *
 *   // whether to bundle JS and assets in release mode
 *   bundleInRelease: true,
 *
 *   // whether to bundle JS and assets in another build variant (if configured).
 *   // See http://tools.android.com/tech-docs/new-build-system/user-guide#TOC-Build-Variants
 *   // The configuration property can be in the following formats
 *   //         'bundleIn${productFlavor}${buildType}'
 *   //         'bundleIn${buildType}'
 *   // bundleInFreeDebug: true,
 *   // bundleInPaidRelease: true,
 *   // bundleInBeta: true,
 *
 *   // whether to disable dev mode in custom build variants (by default only disabled in release)
 *   // for example: to disable dev mode in the staging build type (if configured)
 *   devDisabledInStaging: true,
 *   // The configuration property can be in the following formats
 *   //         'devDisabledIn${productFlavor}${buildType}'
 *   //         'devDisabledIn${buildType}'
 *
 *   // the root of your project, i.e. where "package.json" lives
 *   root: "../../",
 *
 *   // where to put the JS bundle asset in debug mode
 *   jsBundleDirDebug: "$buildDir/intermediates/assets/debug",
 *
 *   // where to put the JS bundle asset in release mode
 *   jsBundleDirRelease: "$buildDir/intermediates/assets/release",
 *
 *   // where to put drawable resources / React Native assets, e.g. the ones you use via
 *   // require('./image.png')), in debug mode
 *   resourcesDirDebug: "$buildDir/intermediates/res/merged/debug",
 *
 *   // where to put drawable resources / React Native assets, e.g. the ones you use via
 *   // require('./image.png')), in release mode
 *   resourcesDirRelease: "$buildDir/intermediates/res/merged/release",
 *
 *   // by default the gradle tasks are skipped if none of the JS files or assets change; this means
 *   // that we don't look at files in android/ or ios/ to determine whether the tasks are up to
 *   // date; if you have any other folders that you want to ignore for performance reasons (gradle
 *   // indexes the entire tree), add them here. Alternatively, if you have JS files in android/
 *   // for example, you might want to remove it from here.
 *   inputExcludes: ["android/**", "ios/**"],
 *
 *   // override which node gets called and with what additional arguments
 *   nodeExecutableAndArgs: ["node"],
 *
 *   // supply additional arguments to the packager
 *   extraPackagerArgs: []
 * ]
 */

project.ext.react = [
    entryFile: "index.js"
]

apply from: "../../node_modules/react-native/react.gradle"

/**
 * Set this to true to create two separate APKs instead of one:
 *   - An APK that only works on ARM devices
 *   - An APK that only works on x86 devices
 * The advantage is the size of the APK is reduced by about 4MB.
 * Upload all the APKs to the Play Store and people will download
 * the correct one based on the CPU architecture of their device.
 */
def enableSeparateBuildPerCPUArchitecture = false

/**
 * Run Proguard to shrink the Java bytecode in release builds.
 */
def enableProguardInReleaseBuilds = false

android {
    compileSdkVersion rootProject.ext.compileSdkVersion
    buildToolsVersion rootProject.ext.buildToolsVersion

    defaultConfig {
        applicationId "com.aguapuebla.micuentamovil"
        minSdkVersion rootProject.ext.minSdkVersion
        targetSdkVersion rootProject.ext.targetSdkVersion
        versionCode 205041
        versionName "@versionName@"
        //Based on: https://github.com/facebook/react-native/issues/18599#issuecomment-524625577
        ndk {
               abiFilters "armeabi-v7a", "x86", "arm64-v8a", "x86_64"
           }
    }

    signingConfigs {
                release {
                    if (project.hasProperty('MYAPP_RELEASE_STORE_FILE')) {
                        storeFile file(MYAPP_RELEASE_STORE_FILE)
                        storePassword SS_MYAPP_RELEASE_STORE_PASSWORD
                        keyAlias SS_MYAPP_RELEASE_KEY_ALIAS
                        keyPassword SS_MYAPP_RELEASE_KEY_PASSWORD
                    }

                }
    }
    splits {
      abi {
          reset()
          enable enableSeparateBuildPerCPUArchitecture
          universalApk false  // If true, also generate a universal APK
          include "armeabi-v7a", "x86", "arm64-v8a", "x86_64"
      }
    }

    buildTypes {
        release {
            minifyEnabled enableProguardInReleaseBuilds
            proguardFiles getDefaultProguardFile("proguard-android.txt"), "proguard-rules.pro"
            signingConfig signingConfigs.release
        }
    }
    // applicationVariants are e.g. debug, release
    applicationVariants.all { variant ->
        variant.outputs.each { output ->
            // For each separate APK per architecture, set a unique version code as described here:
            // http://tools.android.com/tech-docs/new-build-system/user-guide/apk-splits
            def versionCodes = ["armeabi-v7a":1, "x86":2, "arm64-v8a":3, "x86_64":4]
            def abi = output.getFilter(OutputFile.ABI)
            if (abi != null) {  // null for the universal-debug, universal-release variants
                output.versionCodeOverride =
                        versionCodes.get(abi) * 10 + defaultConfig.versionCode
            }

            def variantName = variant.name
            def abi_ = ''
            if (abi != null) abi_ = "_${abi}_"
            def new_name = "./app-${variantName}${abi_}.apk"
            output.outputFileName = new File(new_name)
        }
    }

    lintOptions {
      abortOnError false
    }
}

configurations.all {
     resolutionStrategy {
       force "com.facebook.soloader:soloader:0.8.2"
       force "org.webkit:android-jsc:r245459"
    }
}

project(':realm') {
    configurations.all {
        resolutionStrategy {
            force "com.facebook.soloader:soloader:0.8.2"
        }
    }
}

dependencies {
	implementation 'org.webkit:android-jsc-cppruntime:+'
    implementation project(':react-native-share')
    implementation project(':react-native-firebase')
    compile(project(':react-native-firebase')) {
        transitive = false
    }
    compile project(':react-native-view-pdf')
    compile project(':react-native-config')
    compile project(':react-native-svg')
    compile project(':realm')
    compile project(':react-native-vector-icons')
    compile project(':react-native-spinkit')
    compile(project(':react-native-maps')){
        exclude group: 'com.google.android.gms'
    }
    compile project(':react-native-image-picker')
    compile project(':react-native-document-picker')
    compile project(':react-native-i18n')
    compile project(':react-native-fetch-blob')
    compile (project(':react-native-device-info')){
        exclude group: "com.google.android.gms"
    }
    compile (project(':react-native-camera')) {
        exclude group: "com.google.android.gms"
        compile 'com.android.support:exifinterface:25.+'
        compile ('com.google.android.gms:play-services-vision:15.0.0') {
            force = true
        }
    }
    compile project(':react-native-background-timer')
    compile project(':react-native-android-location-enabler')
    compile project(':react-native-touch-id')

    compile fileTree(dir: "libs", include: ["*.jar"])
    compile "com.android.support:appcompat-v7:${rootProject.ext.supportLibVersion}"
    compile "com.facebook.react:react-native:+"  // From node_modules
    compile ("com.google.android.gms:play-services-base:15.0.0") {
        force = true;
    }
    compile ("com.google.android.gms:play-services-maps:15.0.0") {
        force = true;
    }
    compile ('com.google.android.gms:play-services-gcm:15.0.0') {
        force = true;
    }
    compile ("com.google.android.gms:play-services-location:15.0.0") {
        force = true;
    }
    compile("com.facebook.react:react-native:0.55.4") {
        force = true
    }
    compile project(':reactnativesignaturecapture')
    implementation "com.google.android.gms:play-services-base:15.0.0"
    implementation "com.google.firebase:firebase-core:15.0.2"
    implementation "com.google.firebase:firebase-analytics:15.0.2"
    implementation "com.google.firebase:firebase-messaging:15.0.2"
    implementation 'me.leolin:ShortcutBadger:1.1.21@aar'
    implementation('com.crashlytics.sdk.android:crashlytics:2.9.1@aar') {
        transitive = true
    }
}

// Run this once to be able to run the application with BUCK
// puts all compile dependencies into folder libs for BUCK to use
task copyDownloadableDepsToLibs(type: Copy) {
    from configurations.compile
    into 'libs'
}

apply plugin: 'com.google.gms.google-services'
task replaceReactNativeLibs(type: Copy) {
    from 'react-native-libs/react-native-0.55.4.aar'
    into '../../node_modules/react-native/android/com/facebook/react/react-native/0.55.4/'
}

gradle.projectsEvaluated {
    preBuild.dependsOn(replaceReactNativeLibs)
}