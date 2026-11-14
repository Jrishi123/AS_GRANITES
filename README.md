# A.S. Granites – Website

Structure:
- index.html          page markup (all sections)
- css/style.css       styles, colours (CSS variables at top), animations
- js/main.js          colours list, gallery, scroll animations, WhatsApp enquiry, admin panel
- assets/images/      logo, swatches, edge chart, interior/exterior photos

Edit colours in css/style.css (:root variables --brand, --brand2, --gold).
Edit text directly in index.html. Edit granite names/images in js/main.js (NAMES / SW).

NOTE: The Admin panel (upload photos/videos) runs only on claude.ai's hosting
(it uses Claude's artifact storage). On other hosting it stays hidden. To self-host
with uploads, add a backend (e.g. Firebase/Supabase/Node) – ask Claude to build it.
