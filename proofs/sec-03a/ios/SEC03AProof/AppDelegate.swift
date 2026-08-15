import UIKit

@main
final class AppDelegate: UIResponder, UIApplicationDelegate {
    var window: UIWindow?

    func application(
        _ application: UIApplication,
        didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
    ) -> Bool {
        let window = UIWindow(frame: UIScreen.main.bounds)
        window.rootViewController = ProofViewController()
        window.makeKeyAndVisible()
        self.window = window
        return true
    }

    func applicationDidEnterBackground(_ application: UIApplication) {
        window?.rootViewController?.view.accessibilityElementsHidden = true
        window?.rootViewController?.view.alpha = 0
    }

    func applicationWillEnterForeground(_ application: UIApplication) {
        (window?.rootViewController as? ProofViewController)?.requireFreshSelectionAfterForeground()
        window?.rootViewController?.view.alpha = 1
        window?.rootViewController?.view.accessibilityElementsHidden = false
    }
}
