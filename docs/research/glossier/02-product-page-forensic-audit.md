BALM DOTCOM PDP — RECOVERED FORENSIC AUDIT
A. Purchase Panel
Product Title: "Balm Dotcom" [OBSERVED]
Rating: 4.451372 out of 5 stars [OBSERVED]
Review Count: Link "Jump to product reviews" present [OBSERVED]
Badges:
Product-level: "BEST SELLER" [OBSERVED]
Variant-level: "NEW" for the "I ❤️ NY" variant [OBSERVED]
Price: $16 (consistent across variants) [OBSERVED]
Payment Messaging: Afterpay logo and "Learn More" dialog triggers present [OBSERVED]
Short Description: Included within variant selection labels (e.g., "Juicy apple flavor with a clear tint") [OBSERVED]
Variant Selector: 12 radio buttons with swatches and label text [OBSERVED]
Availability: All observed variants appeared available; a "Notify me" button was seen for an related "Big Apple Sticker Pack" but not the main product [OBSERVED]
Add to Bag: Primary CTA button labeled "Add to bag $16" [OBSERVED]
Secondary Actions:
"Subscribe and save 10%" toggle [OBSERVED]
"Details" accordion for subscription info [OBSERVED]
"How often do you want to re-up?" combobox (1–5 months) [OBSERVED]
B. Variant System
VARIANT NAME: Original
INITIAL STATE: Not selected
ACTION PERFORMED: Radio button click
RESULT: Variant selected
URL CHANGE: Updated to .../products/balm-dotcom?variant=46731566088437 [TECHNICALLY CONFIRMED]
PRICE CHANGE: None ($16) [OBSERVED]
IMAGE CHANGE: Gallery updated to "Original" specific assets [OBSERVED]
EVIDENCE CLASSIFICATION: OBSERVED / TECHNICALLY CONFIRMED
VARIANT NAME: Birthday
ACTION PERFORMED: Radio button click
RESULT: Variant selected
URL CHANGE: Updated to .../products/balm-dotcom?variant=46731565891829 [TECHNICALLY CONFIRMED]
PRICE CHANGE: None ($16) [OBSERVED]
EVIDENCE CLASSIFICATION: OBSERVED / TECHNICALLY CONFIRMED
VARIANT NAME: Strawberry
ACTION PERFORMED: Radio button click
RESULT: Variant selected
IMAGE CHANGE: Gallery updated to lifestyle images showing models wearing the shade [OBSERVED]
CTA CHANGE: None [OBSERVED]
EVIDENCE CLASSIFICATION: OBSERVED
C. Product Media Gallery
Primary Media: Large product/lifestyle image [OBSERVED]
Pagination: 6 page dots visible below the media [OBSERVED]
Arrows: Chevron icons (Left/Right). The left chevron is disabled by default on the first slide [OBSERVED]
Lifestyle Images: Confirmed present, showing models (e.g., "Yacine wears Strawberry") [OBSERVED]
Image Switching: Triggered immediately upon variant selection [OBSERVED]
Video/GIF: No <video> tags or video-based iframes were detected in the primary gallery during inspection [OBSERVED]
D. Add-to-Bag Pre-Purchase State
Button Wording: "Add to bag $16" [OBSERVED]
Price Relationship: The price is hard-coded into the button label text [OBSERVED]
Variant Dependency: The button is active by default because a variant is always selected [OBSERVED]
Hover Behavior: Cursor changes to pointer; CSS transition font-size 0.4s ease-in-out identified [OBSERVED]
E. Hover & Focus
Add to Bag: Hover triggers a font-size transition but no background/text color change [OBSERVED]
Details Accordion: Focusable/clickable; opens a text dialog explaining subscription benefits (10% save, cancel anytime) [OBSERVED]
Gallery Arrows: Hoverable; Left arrow disabled state prevents interaction [OBSERVED]
F. Technical Evidence
Shopify Variant IDs:
Original: 46731566088437 [TECHNICALLY CONFIRMED]
Birthday: 46731565891829 [TECHNICALLY CONFIRMED]
URL Structure: Uses standard Shopify ?variant= query parameters [TECHNICALLY CONFIRMED]
DOM Evidence: References to Sentry error handling for "inventory.warehouse metafield" suggest a complex backend/metafield setup for stock [OBSERVED]
G. Completed State Maps
PRODUCT VARIANT Default (I Love NY) → User Selection → URL Param Update → Gallery Asset Swap
ADD TO BAG Default ($16 label) → Hover (Pointer cursor + Font transition) → Click (Add to Bag trigger)
H. Successfully Completed Inspections
Forensic audit of above-the-fold purchase panel elements.
Variant selection testing for URL and Image synchronization (Original, Birthday, Strawberry).
Inspection of subscription/details accordion content.
Media gallery navigation control (dots/chevrons) identification.
I. Interrupted / Unfinished Inspections
Technical Data Extraction: Attempted code execution to grab window.Shopify and window.__NEXT_DATA__ failed twice due to session syntax errors.
Motion Media Verification: Could not programmatically confirm the absence of GIFs or lazy-loaded videos hidden in later slides.
Image Delivery: srcset and lazy-loading implementation details were not retrieved.
J. Remaining Evidence Gaps
Direct JSON State: Confirmation of Shopify vs. Next.js data architecture. [CRITICAL]
Media Motion: Identifying if specific variants (e.g., Mango or Mint) utilize GIFs or native video for texture demonstrations. [USEFUL]
Zoom/Interaction: Verification of "click-to-zoom" or lightbox behavior on the primary gallery. [USEFUL]
Responsive Breakpoints: How the purchase panel collapses for mobile view. [OPTIONAL]
MINIMUM FOLLOW-UP INSPECTION LIST
Technical State Extraction: Execute one command to return window.Shopify.product or the __NEXT_DATA__ script tag content to confirm the data layer.
Gallery Deep-Dive: Click through all 6 slides of a single variant to check for hidden motion media (GIF/Video).
Image Zoom: Click the main gallery image once to determine if a lightbox or zoom state exists.
