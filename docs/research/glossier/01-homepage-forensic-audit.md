GLOSSIER HOMEPAGE — FORENSIC UI, INTERACTION & MOTION AUDIT
A. Global Header System
Announcement Bar:
Trigger: Autoplay carousel.
Initial State: Displays first promo ("Get a free Applebaby Keychain...").
Active State: Cycles through text slides via fade transition. Contains "Previous", "Next", and "Pause" buttons.
Behavior: Remains sticky at the top.
Confidence: OBSERVED / TECHNICALLY CONFIRMED.
Logo: Centered.
Behavior: Sticky; maintains size during scroll.
Primary Navigation: Left-aligned text links (SKINCARE, MAKEUP, etc.).
Trigger: Hover opens mega menus.
Utility Navigation: Right-aligned (Search, Account, Cart).
Sticky Behavior: The entire header (Announcement + Nav) is position: sticky; top: 0;.
Confidence: OBSERVED.
B. Navigation & Mega-Menu System
Trigger: Hover-activated.
Layout: Multi-column grid. Includes vertical lists of categories (Face, Brow, Eye) and featured modules with images (e.g., "Meet your dream brows").
Exit State: Closes when pointer leaves the menu area or the nav link.
Transition: Sharp entrance (fade-in), likely standard CSS opacity transition.
Confidence: OBSERVED.
C. Hero System
Media: Native <video> element.
Autoplay: YES, muted by default.
Controls: "Unmute video" and "Pause video" buttons visible in the lower corner of the hero section.
CTA: Primary button "Take a peek" with high-contrast (Black/White) styling.
Confidence: TECHNICALLY CONFIRMED.
D. Video & Dynamic Media System
Source Type: MP4/WebM native video.
Loop: YES.
Muted State: YES, by default.
User Control: Manual toggle for Play/Pause and Mute/Unmute.
Carousels: Announcement bar and product carousels (using dot pagination and arrows).
Confidence: OBSERVED.
E. Product-Card Interaction System
Default State: Product image, Title, Price, and Variant selection (dots/radios).
Hover State: Image swap (Inferred/Observed: swaps to lifestyle or alternate angle).
Variant Selector: Interactive radio buttons (circles) visible on the card.
Quick Add: "Add to bag" button present on the card for immediate action.
Success State: Triggers Cart Drawer opening.
Confidence: OBSERVED.
F. Hover-State System
Buttons: Color inversion or slight opacity change. No significant scale transformations observed.
Links: Primary navigation links may show an underline or color shift.
Product Cards: Elevation or image swap.
Confidence: OBSERVED.
G. Buttons & Links
Primary CTA: Rectangular, sharp corners, solid black background, white uppercase text.
Secondary CTA: "Choose set" or variant-specific buttons.
Text Links: Often underlined or uppercase in the footer.
Confidence: OBSERVED.
H. Category & Editorial Interactions
Modules: "GET THE LOOK" and "SHOP ALL" sections.
Interactions: Entire cards are clickable links. Hovering often triggers a slight visual change in the CTA ("Shop now").
Confidence: OBSERVED.
I. Search System
Entry: Full-width overlay.
Geometry: Covers the top portion of the screen or full viewport depending on viewport height.
Focus: Input field auto-focuses upon opening.
Exit: "Close" button in the top right.
Confidence: OBSERVED.
J. Cart System
Geometry: Side-drawer (right side).
Entrance: Slides in from the right.
Scrim: Dimmed background overlay blocks interaction with the main page.
Empty State: Displays "Your bag is empty" with a "Shop all" link.
Confidence: OBSERVED.
K. Modal System
Email Signup: Triggered by scroll depth (approx. 1000px).
Backdrop: Semi-transparent dark scrim.
Close Mechanism: "X" icon or "No thanks" link.
Confidence: OBSERVED.
L. Scroll System
Lazy Loading: Implemented for images and videos lower in the page (height expands as content loads).
Sticky Elements: Header, Gorgias Chat Widget.
Rhythm: Alternating product grids and full-width editorial/video sections.
Confidence: OBSERVED.
M. Responsive Media System
Technical Evidence: Uses srcset for responsive image delivery.
Platform: Shopify-hosted assets with Imgix-style parameterization for sizing.
Confidence: TECHNICALLY CONFIRMED.
N. Motion System
Patterns:
Fade-ins for mega menus and overlays.
Slide-ins for the Cart Drawer.
Horizontal translation for carousels.
Confidence: OBSERVED.
O. Component State Maps
PRODUCT CARD
Default: Main product image + price + variant circles.
Hover: Alternate image + "Add to bag" button focus.
Selected: Variant circle highlighed (border/fill change).
Action: "Add to bag" clicks -> Cart Drawer opens.
P. Technically Confirmed Implementation Mechanisms
Shopify: Backend platform confirmed by window.Shopify and URL patterns.
Gorgias: Third-party live chat.
Native Video: <video> tag with autoplay, muted, loop, and playsinline attributes.
Q. Inferred Mechanisms
Safe Triangle Navigation: Inferred mega-menu behavior where diagonal movement doesn't close the menu.
Imgix: Inferred as the image processing engine based on Shopify/Glossier's typical stack.
R. Mechanisms That Could Not Be Determined
Exact animation library (e.g., GSAP vs. Framer Motion) without deeper bundle inspection.
Server-side caching strategies.
S. Interaction Pattern Inventory
Overlay: Search, Email Modal.
Drawer: Cart.
Carousel: Announcement bar, Product rows.
Hover-Trigger: Mega Menu.
T. Motion Pattern Inventory
Slide: Right-to-left (Cart).
Fade: Opacity 0 to 1 (Menu/Search).
Scroll-Trigger: Email Modal appearance.
U. Accessibility & Reduced-Motion Findings
Skip Links: "Skip To Main" link present in the DOM (Observed in element list).
ARIA: Use of role="region" for video players and aria-label for buttons.
Reduced Motion: Most animations are basic transitions; video has a manual "Pause" control.
V. Raw Evidence Notes
Page Height: Initially 5820px, grew to 6078px after full scroll.
Sticky: Header remains at top: 0.
Popup: Email signup appeared after initial scroll.
