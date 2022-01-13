package com.aguapuebla.micuentamovil;

import android.app.Application;
import com.facebook.react.ReactApplication;
import io.github.elyx0.reactnativedocumentpicker.DocumentPickerPackage;
import com.rnfingerprint.FingerprintAuthPackage;
import cl.json.RNSharePackage;
import cl.json.ShareApplication;
import io.invertase.firebase.RNFirebasePackage;
import io.invertase.firebase.analytics.RNFirebaseAnalyticsPackage;
import io.invertase.firebase.messaging.RNFirebaseMessagingPackage;
import io.invertase.firebase.notifications.RNFirebaseNotificationsPackage;
import io.invertase.firebase.fabric.crashlytics.RNFirebaseCrashlyticsPackage;
import com.reactlibrary.PDFViewPackage;
import com.lugg.ReactNativeConfig.ReactNativeConfigPackage;
import com.horcrux.svg.SvgPackage;
import io.realm.react.RealmReactPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.react.rnspinkit.RNSpinkitPackage;
import com.airbnb.android.react.maps.MapsPackage;
import com.imagepicker.ImagePickerPackage;
import com.AlexanderZaytsev.RNI18n.RNI18nPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import org.reactnative.camera.RNCameraPackage;
import com.ocetnik.timer.BackgroundTimerPackage;
import com.heanoria.library.reactnative.locationenabler.RNAndroidLocationEnablerPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.rssignaturecapture.RSSignatureCapturePackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ShareApplication, ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
            new RSSignatureCapturePackage(),
            new MainReactPackage(),
            new DocumentPickerPackage(),
            new FingerprintAuthPackage(),
            new RNSharePackage(),
            new RNFirebasePackage(),
            new RNFirebaseAnalyticsPackage(),
            new RNFirebaseMessagingPackage(),
            new RNFirebaseNotificationsPackage() ,
            new RNFirebaseCrashlyticsPackage(),
            new PDFViewPackage(),
            new ReactNativeConfigPackage(),
            new SvgPackage(),
            new RealmReactPackage(),
            new VectorIconsPackage(),
            new RNSpinkitPackage(),
            new MapsPackage(),
            new ImagePickerPackage(),
            new RNI18nPackage(),
            new RNFetchBlobPackage(),
            new RNDeviceInfo(),
            new RNCameraPackage(),
            new BackgroundTimerPackage(),
            new RNAndroidLocationEnablerPackage()
            );
    }

  @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }


  @Override
  public String getFileProviderAuthority() {
          return "com.aguapuebla.micuentamovil.provider";
  }

}
