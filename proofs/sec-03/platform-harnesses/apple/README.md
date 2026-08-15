# Apple platform harness boundary

No iOS/iPadOS or macOS proof client is asserted here. Current supported public evidence must first establish a target-controlled arbitrary-UI screenshot exclusion mechanism that can satisfy the SEC-03 gate. Post-screenshot notification, active-capture detection, app-switcher snapshot redaction, and narrow protected-video output behavior are different properties and cannot be assembled into a screenshot PASS.

Common secure-text-field/layer reparenting techniques are explicitly outside this proof package when they depend on undocumented behavior, private implementation details, or an implementation accident. They remain `OBSERVED / UNSUPPORTED — NOT ACCEPTABLE FOR PRODUCTION GATE` even if a third-party application appears to use similar behavior.

The local host reports macOS 26.6.1, but `xcodebuild`/`xcrun` fail while loading Xcode frameworks. No Apple simulator/device execution result exists. See the SEC-03 platform verdict and test matrix for the exact blocked evidence.
