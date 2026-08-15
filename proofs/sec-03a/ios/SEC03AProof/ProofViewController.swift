import UIKit

final class ProofViewController: UIViewController {
    private let modeControl = UISegmentedControl(items: ["UIKIT", "BUFFER OFF", "BUFFER ON"])
    private let statusLabel = UILabel()
    private let captureLabel = UILabel()
    private let contentContainer = UIView()
    private let neutralPlaceholder = UILabel()
    private let ordinaryFixture = UILabel()
    private let protectedFixture = ProtectedSampleBufferView()

    override func viewDidLoad() {
        super.viewDidLoad()
        title = "SEC-03A Proof Only"
        view.backgroundColor = .systemBackground
        configureViews()
        configureObservers()
        selectMode(0)
        updateCaptureState()
    }

    deinit {
        NotificationCenter.default.removeObserver(self)
    }

    private func configureViews() {
        let heading = UILabel()
        heading.text = "SEC-03A / SYNTHETIC / NON-PRODUCTION"
        heading.font = .preferredFont(forTextStyle: .headline)
        heading.adjustsFontForContentSizeCategory = true
        heading.numberOfLines = 0

        modeControl.selectedSegmentIndex = 0
        modeControl.addTarget(self, action: #selector(modeChanged), for: .valueChanged)

        statusLabel.font = .preferredFont(forTextStyle: .footnote)
        statusLabel.adjustsFontForContentSizeCategory = true
        statusLabel.numberOfLines = 0

        captureLabel.font = .preferredFont(forTextStyle: .caption1)
        captureLabel.adjustsFontForContentSizeCategory = true
        captureLabel.numberOfLines = 0

        contentContainer.backgroundColor = .black
        contentContainer.layer.cornerRadius = 8
        contentContainer.clipsToBounds = true

        neutralPlaceholder.text = "PROTECTED RENDERER UNAVAILABLE\nNO PROTECTED CONTENT REVEALED"
        neutralPlaceholder.textColor = .white
        neutralPlaceholder.backgroundColor = .black
        neutralPlaceholder.font = .preferredFont(forTextStyle: .headline)
        neutralPlaceholder.adjustsFontForContentSizeCategory = true
        neutralPlaceholder.numberOfLines = 0
        neutralPlaceholder.textAlignment = .center
        neutralPlaceholder.isAccessibilityElement = true

        ordinaryFixture.text = "PRIVATE WHOLESALE TEST\n\nSTRAIN: SYNTHETIC STRAIN A\nPRIVATE PRICE: $1,234.56\nAVAILABLE: 10 LB\n\nMESSAGE: THIS TEXT MUST NOT APPEAR IN A SCREENSHOT.\n\n[SYNTHETIC STILL IMAGE]\n[SYNTHETIC VIDEO / MOVING TEST CONTENT]\n[SYNTHETIC ORDER MANIFEST]"
        ordinaryFixture.textColor = .white
        ordinaryFixture.backgroundColor = UIColor(red: 0.055, green: 0.063, blue: 0.071, alpha: 1)
        ordinaryFixture.font = .preferredFont(forTextStyle: .body)
        ordinaryFixture.adjustsFontForContentSizeCategory = true
        ordinaryFixture.numberOfLines = 0
        ordinaryFixture.textAlignment = .center
        ordinaryFixture.isAccessibilityElement = true

        [neutralPlaceholder, ordinaryFixture, protectedFixture].forEach {
            $0.translatesAutoresizingMaskIntoConstraints = false
            contentContainer.addSubview($0)
            NSLayoutConstraint.activate([
                $0.leadingAnchor.constraint(equalTo: contentContainer.leadingAnchor),
                $0.trailingAnchor.constraint(equalTo: contentContainer.trailingAnchor),
                $0.topAnchor.constraint(equalTo: contentContainer.topAnchor),
                $0.bottomAnchor.constraint(equalTo: contentContainer.bottomAnchor)
            ])
        }

        let stack = UIStackView(arrangedSubviews: [heading, modeControl, statusLabel, captureLabel, contentContainer])
        stack.axis = .vertical
        stack.spacing = 12
        stack.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(stack)
        NSLayoutConstraint.activate([
            stack.leadingAnchor.constraint(equalTo: view.safeAreaLayoutGuide.leadingAnchor, constant: 16),
            stack.trailingAnchor.constraint(equalTo: view.safeAreaLayoutGuide.trailingAnchor, constant: -16),
            stack.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor, constant: 12),
            stack.bottomAnchor.constraint(equalTo: view.safeAreaLayoutGuide.bottomAnchor, constant: -12),
            contentContainer.heightAnchor.constraint(greaterThanOrEqualToConstant: 390)
        ])
    }

    private func configureObservers() {
        NotificationCenter.default.addObserver(
            self,
            selector: #selector(screenshotObserved),
            name: UIApplication.userDidTakeScreenshotNotification,
            object: nil
        )
        NotificationCenter.default.addObserver(
            self,
            selector: #selector(captureStateChanged),
            name: UIScreen.capturedDidChangeNotification,
            object: nil
        )
    }

    @objc private func modeChanged() {
        selectMode(modeControl.selectedSegmentIndex)
    }

    private func selectMode(_ index: Int) {
        neutralPlaceholder.isHidden = true
        neutralPlaceholder.accessibilityElementsHidden = true
        ordinaryFixture.isHidden = true
        ordinaryFixture.accessibilityElementsHidden = true
        protectedFixture.isHidden = true
        protectedFixture.accessibilityElementsHidden = true

        if index == 0 {
            ordinaryFixture.isHidden = false
            ordinaryFixture.accessibilityElementsHidden = false
            statusLabel.text = "CONTROL: ordinary UIKit rendering. Readable capture is expected and validates the capture path."
        } else {
            let ready = protectedFixture.prepareForDisplay(captureProtectionEnabled: index == 2)
            if ready {
                protectedFixture.accessibilityElementsHidden = false
                protectedFixture.isHidden = false
                statusLabel.text = index == 1
                    ? "CONTROL: identical sample-buffer pipeline with preventsCapture disabled before enqueue. Readable capture isolates the property as the controlled variable."
                    : "CANDIDATE: every synthetic protected pixel is in AVSampleBufferDisplayLayer with preventsCapture enabled before enqueue and reveal. Saved artifacts decide the result."
            } else {
                neutralPlaceholder.accessibilityElementsHidden = false
                neutralPlaceholder.isHidden = false
                statusLabel.text = "FAIL CLOSED: the sample-buffer renderer did not prepare, so no synthetic protected surface was revealed."
            }
        }
    }

    func requireFreshSelectionAfterForeground() {
        modeControl.selectedSegmentIndex = UISegmentedControl.noSegment
        ordinaryFixture.isHidden = true
        ordinaryFixture.accessibilityElementsHidden = true
        protectedFixture.isHidden = true
        protectedFixture.accessibilityElementsHidden = true
        neutralPlaceholder.isHidden = false
        neutralPlaceholder.accessibilityElementsHidden = false
        statusLabel.text = "FAIL CLOSED AFTER FOREGROUND: select a proof mode to prepare a fresh synthetic render."
    }

    @objc private func screenshotObserved() {
        captureLabel.text = "Screenshot notification observed AFTER capture. This event never counts as prevention. Inspect the saved PNG."
    }

    @objc private func captureStateChanged() {
        updateCaptureState()
    }

    private func updateCaptureState() {
        captureLabel.text = UIScreen.main.isCaptured
            ? "System reports active recording/mirroring. No reactive redaction is applied; this indicator is observational only."
            : "System does not report active recording/mirroring. Still screenshots do not set this state."
    }
}
