import AVFoundation
import CoreMedia
import UIKit

final class ProtectedSampleBufferView: UIView {
    private let fixtureAccessibilityLabel = "Private wholesale test. Strain: Synthetic Strain A. Private price: one thousand two hundred thirty-four dollars and fifty-six cents. Available: ten pounds. Message: This text must not appear in a screenshot. Synthetic still image. Synthetic moving test content. Synthetic order manifest."

    override class var layerClass: AnyClass { AVSampleBufferDisplayLayer.self }

    private var displayLayer: AVSampleBufferDisplayLayer {
        guard let layer = layer as? AVSampleBufferDisplayLayer else {
            preconditionFailure("ProtectedSampleBufferView requires AVSampleBufferDisplayLayer")
        }
        return layer
    }

    private var timer: Timer?
    private var frameIndex = 0

    var captureProtectionEnabled: Bool {
        get { displayLayer.preventsCapture }
        set {
            displayLayer.preventsCapture = newValue
            accessibilityHint = newValue
                ? "Capture protection is enabled for this sample-buffer layer."
                : "Negative control: capture protection is disabled for this sample-buffer layer."
        }
    }

    @discardableResult
    func prepareForDisplay(captureProtectionEnabled: Bool) -> Bool {
        isHidden = true
        isAccessibilityElement = false
        accessibilityLabel = nil
        displayLayer.flushAndRemoveImage()
        self.captureProtectionEnabled = captureProtectionEnabled
        frameIndex = 0
        let ready = renderCurrentFrame()
        if ready {
            accessibilityLabel = fixtureAccessibilityLabel
            isAccessibilityElement = true
        }
        return ready
    }

    override init(frame: CGRect) {
        super.init(frame: frame)
        configure()
    }

    required init?(coder: NSCoder) {
        super.init(coder: coder)
        configure()
    }

    deinit {
        timer?.invalidate()
    }

    private func configure() {
        backgroundColor = .black
        isOpaque = true
        displayLayer.videoGravity = .resizeAspectFill
        displayLayer.backgroundColor = UIColor.black.cgColor
        captureProtectionEnabled = true

        accessibilityTraits = [.staticText, .updatesFrequently]

        timer = Timer.scheduledTimer(withTimeInterval: 0.5, repeats: true) { [weak self] _ in
            guard let self else { return }
            self.frameIndex += 1
            _ = self.renderCurrentFrame()
        }
        NotificationCenter.default.addObserver(
            self,
            selector: #selector(contentSizeChanged),
            name: UIContentSizeCategory.didChangeNotification,
            object: nil
        )
    }

    @objc private func contentSizeChanged() {
        _ = renderCurrentFrame()
    }

    override func layoutSubviews() {
        super.layoutSubviews()
        _ = renderCurrentFrame()
    }

    @discardableResult
    private func renderCurrentFrame() -> Bool {
        guard bounds.width >= 2, bounds.height >= 2 else { return false }
        let scale = min(window?.screen.scale ?? UIScreen.main.scale, 3)
        let width = max(2, Int((bounds.width * scale).rounded(.up)))
        let height = max(2, Int((bounds.height * scale).rounded(.up)))

        guard let pixelBuffer = makePixelBuffer(width: width, height: height) else { return false }
        guard drawFixture(into: pixelBuffer, width: width, height: height, scale: scale) else { return false }
        guard let sampleBuffer = makeSampleBuffer(from: pixelBuffer) else { return false }

        if displayLayer.status == .failed {
            displayLayer.flush()
        }
        displayLayer.enqueue(sampleBuffer)
        return true
    }

    private func makePixelBuffer(width: Int, height: Int) -> CVPixelBuffer? {
        let attributes: [CFString: Any] = [
            kCVPixelBufferCGImageCompatibilityKey: true,
            kCVPixelBufferCGBitmapContextCompatibilityKey: true,
            kCVPixelBufferIOSurfacePropertiesKey: [String: Any]()
        ]
        var pixelBuffer: CVPixelBuffer?
        let status = CVPixelBufferCreate(
            kCFAllocatorDefault,
            width,
            height,
            kCVPixelFormatType_32BGRA,
            attributes as CFDictionary,
            &pixelBuffer
        )
        return status == kCVReturnSuccess ? pixelBuffer : nil
    }

    private func drawFixture(into pixelBuffer: CVPixelBuffer, width: Int, height: Int, scale: CGFloat) -> Bool {
        guard CVPixelBufferLockBaseAddress(pixelBuffer, []) == kCVReturnSuccess else { return false }
        defer { CVPixelBufferUnlockBaseAddress(pixelBuffer, []) }
        guard let baseAddress = CVPixelBufferGetBaseAddress(pixelBuffer) else { return false }

        let bitmapInfo = CGBitmapInfo.byteOrder32Little.rawValue | CGImageAlphaInfo.premultipliedFirst.rawValue
        guard let context = CGContext(
            data: baseAddress,
            width: width,
            height: height,
            bitsPerComponent: 8,
            bytesPerRow: CVPixelBufferGetBytesPerRow(pixelBuffer),
            space: CGColorSpaceCreateDeviceRGB(),
            bitmapInfo: bitmapInfo
        ) else { return false }

        context.translateBy(x: 0, y: CGFloat(height))
        context.scaleBy(x: scale, y: -scale)
        let canvas = CGRect(x: 0, y: 0, width: CGFloat(width) / scale, height: CGFloat(height) / scale)

        context.setFillColor(UIColor(red: 0.055, green: 0.063, blue: 0.071, alpha: 1).cgColor)
        context.fill(canvas)
        context.setStrokeColor(UIColor(red: 0.85, green: 0.29, blue: 0.20, alpha: 1).cgColor)
        context.setLineWidth(3)
        context.stroke(canvas.insetBy(dx: 2, dy: 2))

        UIGraphicsPushContext(context)
        defer { UIGraphicsPopContext() }

        let margin: CGFloat = 20
        let titleFont = UIFontMetrics(forTextStyle: .headline).scaledFont(for: .boldSystemFont(ofSize: 19))
        let bodyFont = UIFontMetrics(forTextStyle: .body).scaledFont(for: .monospacedSystemFont(ofSize: 15, weight: .semibold))
        let smallFont = UIFontMetrics(forTextStyle: .caption1).scaledFont(for: .monospacedSystemFont(ofSize: 12, weight: .regular))
        let white = UIColor.white
        let accent = UIColor(red: 0.96, green: 0.72, blue: 0.21, alpha: 1)

        draw("PRIVATE WHOLESALE TEST", in: CGRect(x: margin, y: 16, width: canvas.width - margin * 2, height: 32), font: titleFont, color: accent)
        draw("STRAIN: SYNTHETIC STRAIN A\nPRIVATE PRICE: $1,234.56\nAVAILABLE: 10 LB", in: CGRect(x: margin, y: 58, width: canvas.width - margin * 2, height: 86), font: bodyFont, color: white)
        draw("MESSAGE: THIS TEXT MUST NOT APPEAR IN A SCREENSHOT.", in: CGRect(x: margin, y: 146, width: canvas.width - margin * 2, height: 54), font: bodyFont, color: white)

        let stillRect = CGRect(x: margin, y: 208, width: max(80, canvas.width * 0.42), height: 94)
        context.setFillColor(UIColor(red: 0.18, green: 0.36, blue: 0.30, alpha: 1).cgColor)
        context.fill(stillRect)
        let cellWidth = stillRect.width / 8
        let cellHeight = stillRect.height / 6
        for row in 0..<6 {
            for column in 0..<8 where (row + column).isMultiple(of: 2) {
                let red = CGFloat((row + 1) * 31 % 255) / 255
                let green = CGFloat((column + 2) * 37 % 255) / 255
                let blue = CGFloat((row + column + 3) * 29 % 255) / 255
                context.setFillColor(UIColor(red: red, green: green, blue: blue, alpha: 1).cgColor)
                context.fill(CGRect(
                    x: stillRect.minX + CGFloat(column) * cellWidth,
                    y: stillRect.minY + CGFloat(row) * cellHeight,
                    width: cellWidth,
                    height: cellHeight
                ))
            }
        }
        context.setStrokeColor(accent.cgColor)
        context.stroke(stillRect)
        draw("[SYNTHETIC STILL IMAGE]\nDETAIL GRID A7", in: stillRect.insetBy(dx: 8, dy: 17), font: smallFont, color: white)

        let movingRect = CGRect(x: stillRect.maxX + 12, y: 208, width: canvas.width - stillRect.maxX - margin - 12, height: 94)
        context.setFillColor(UIColor(red: 0.19, green: 0.20, blue: 0.42, alpha: 1).cgColor)
        context.fill(movingRect)
        let progress = CGFloat(frameIndex % 10) / 9
        context.setFillColor(accent.cgColor)
        context.fill(CGRect(x: movingRect.minX + 8, y: movingRect.maxY - 16, width: max(4, (movingRect.width - 16) * progress), height: 7))
        draw("[SYNTHETIC VIDEO]\nFRAME \(frameIndex) • T+\(frameIndex * 500)MS\nCC • TEST CONTROLS", in: movingRect.insetBy(dx: 9, dy: 10), font: smallFont, color: white)

        let manifestY = stillRect.maxY + 16
        draw("[SYNTHETIC ORDER MANIFEST]\nITEM A — 10 LB — TEST ONLY\nTOTAL — $1,234.56 — TEST ONLY", in: CGRect(x: margin, y: manifestY, width: canvas.width - margin * 2, height: max(68, canvas.height - manifestY - 18)), font: smallFont, color: white)
        return true
    }

    private func draw(_ string: String, in rect: CGRect, font: UIFont, color: UIColor) {
        let style = NSMutableParagraphStyle()
        style.lineBreakMode = .byWordWrapping
        style.lineSpacing = 2
        NSAttributedString(
            string: string,
            attributes: [.font: font, .foregroundColor: color, .paragraphStyle: style]
        ).draw(with: rect, options: [.usesLineFragmentOrigin, .usesFontLeading], context: nil)
    }

    private func makeSampleBuffer(from pixelBuffer: CVPixelBuffer) -> CMSampleBuffer? {
        var formatDescription: CMVideoFormatDescription?
        guard CMVideoFormatDescriptionCreateForImageBuffer(
            allocator: kCFAllocatorDefault,
            imageBuffer: pixelBuffer,
            formatDescriptionOut: &formatDescription
        ) == noErr, let formatDescription else { return nil }

        var timing = CMSampleTimingInfo(
            duration: CMTime(value: 1, timescale: 2),
            presentationTimeStamp: CMClockGetTime(CMClockGetHostTimeClock()),
            decodeTimeStamp: .invalid
        )
        var sampleBuffer: CMSampleBuffer?
        guard CMSampleBufferCreateReadyWithImageBuffer(
            allocator: kCFAllocatorDefault,
            imageBuffer: pixelBuffer,
            formatDescription: formatDescription,
            sampleTiming: &timing,
            sampleBufferOut: &sampleBuffer
        ) == noErr else { return nil }
        return sampleBuffer
    }
}
