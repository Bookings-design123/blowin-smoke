#!/usr/bin/env python3
"""Validate final PNG integrity, dimensions, distribution, and exact uniqueness."""

from __future__ import annotations

import hashlib
import json
from collections import Counter
from pathlib import Path

from PIL import Image, ImageStat


ROOT = Path(__file__).resolve().parent.parent
SCREENSHOTS = ROOT / "screenshots"
OUTPUT = ROOT / "notes" / "image-integrity.json"
EXPECTED = {"wide": 10, "narrow": 10, "320": 10, "states": 11, "comparison": 10, "overview": 8}


def group_for(path: Path) -> str:
    return path.relative_to(SCREENSHOTS).parts[0]


records = []
hashes: dict[str, list[str]] = {}
violations = []

for image_path in sorted(SCREENSHOTS.rglob("*.png")):
    relative = image_path.relative_to(ROOT).as_posix()
    digest = hashlib.sha256(image_path.read_bytes()).hexdigest()
    hashes.setdefault(digest, []).append(relative)
    try:
        with Image.open(image_path) as image:
            image.verify()
        with Image.open(image_path).convert("RGB") as image:
            width, height = image.size
            extrema = image.getextrema()
            standard_deviation = tuple(round(value, 3) for value in ImageStat.Stat(image).stddev)
        if width <= 0 or height <= 0:
            violations.append({"file": relative, "issue": "non-positive dimensions"})
        if all(low == high for low, high in extrema):
            violations.append({"file": relative, "issue": "single-color image"})
        records.append({
            "file": relative,
            "width": width,
            "height": height,
            "sha256": digest,
            "channelStdDev": standard_deviation,
        })
    except Exception as error:  # Pillow supplies the underlying decoder error.
        violations.append({"file": relative, "issue": f"decode failure: {error}"})

duplicates = [files for files in hashes.values() if len(files) > 1]
if duplicates:
    violations.append({"issue": "exact duplicate PNGs", "groups": duplicates})

distribution = Counter(group_for(SCREENSHOTS / record["file"].split("screenshots/", 1)[1]) for record in records)
for group, expected_count in EXPECTED.items():
    if distribution[group] != expected_count:
        violations.append({"issue": "unexpected group count", "group": group, "expected": expected_count, "actual": distribution[group]})

if len(records) != 59:
    violations.append({"issue": "unexpected total PNG count", "expected": 59, "actual": len(records)})

report = {
    "validation": "PASS" if not violations else "FAIL",
    "total": len(records),
    "distribution": dict(sorted(distribution.items())),
    "exactDuplicateGroups": duplicates,
    "violations": violations,
    "files": records,
}
OUTPUT.write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
print(json.dumps({key: report[key] for key in ("validation", "total", "distribution", "exactDuplicateGroups", "violations")}, indent=2))
raise SystemExit(1 if violations else 0)
