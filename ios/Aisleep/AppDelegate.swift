import UIKit
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider
import FirebaseCore
//  import FirebaseMessaging
 import UserNotifications


@main
class AppDelegate: UIResponder, UIApplicationDelegate {
  var window: UIWindow?

  var reactNativeDelegate: ReactNativeDelegate?
  var reactNativeFactory: RCTReactNativeFactory?

  func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {
    let delegate = ReactNativeDelegate()
    let factory = RCTReactNativeFactory(delegate: delegate)
    delegate.dependencyProvider = RCTAppDependencyProvider()

    reactNativeDelegate = delegate
    reactNativeFactory = factory
//    UNUserNotificationCenter.current().delegate = self
    application.registerForRemoteNotifications()
//    Messaging.messaging().delegate = self
    window = UIWindow(frame: UIScreen.main.bounds)
   Thread.sleep(forTimeInterval: 0.0)
  //  FirebaseApp.configure()

    factory.startReactNative(
      withModuleName: "Aisleep",
      in: window,
      launchOptions: launchOptions
    )

    return true
  }
  //  func messaging(_ messaging: Messaging, didReceiveRegistrationToken fcmToken: String?) {
  //   print("📱 New FCM token: \(fcmToken ?? "")")
  //   // Optionally send this token to your backend
  // }
}

class ReactNativeDelegate: RCTDefaultReactNativeFactoryDelegate {
  override func sourceURL(for bridge: RCTBridge) -> URL? {
    self.bundleURL()
  }

  override func bundleURL() -> URL? {
#if DEBUG
    RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
#else
    Bundle.main.url(forResource: "main", withExtension: "jsbundle")
#endif
  }
}
