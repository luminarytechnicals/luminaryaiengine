// Reject requests whose client IP is geolocated to India by Netlify.
// This runs at the edge before static pages and assets are served.
const BLOCKED_COUNTRY_CODE = "IN";

const blockedPage = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex, nofollow">
  <title>Access restricted | Luminary AI Engine</title>
  <style>
    :root { color-scheme: dark; }
    * { box-sizing: border-box; }
    body {
      min-height: 100vh;
      margin: 0;
      display: grid;
      place-items: center;
      padding: 24px;
      background: #030805;
      color: #e2e8e2;
      font: 16px/1.65 Inter, system-ui, sans-serif;
    }
    main {
      width: min(100%, 620px);
      padding: 36px;
      border: 1px solid #203520;
      border-radius: 16px;
      background: #081108;
    }
    .brand { color: #00e83f; letter-spacing: .12em; font-weight: 700; }
    h1 { margin: 28px 0 12px; font-size: clamp(1.8rem, 5vw, 2.5rem); line-height: 1.15; }
    p { color: #a0b4a0; }
    small { color: #829482; }
  </style>
</head>
<body>
  <main>
    <div class="brand">LUMINARY AI ENGINE</div>
    <h1>Access restricted</h1>
    <p>Access to this website is currently unavailable from your location.</p>
    <small>If you believe your location has been identified incorrectly, contact the site administrator.</small>
  </main>
</body>
</html>`;

export default async function blockIndia(request, context) {
  const countryCode = context.geo?.country?.code?.toUpperCase();

  if (countryCode === BLOCKED_COUNTRY_CODE) {
    return new Response(blockedPage, {
      status: 403,
      headers: {
        "content-type": "text/html; charset=utf-8",
        "cache-control": "private, no-store, no-cache, max-age=0",
        "x-content-type-options": "nosniff",
        "x-frame-options": "DENY",
        "referrer-policy": "no-referrer",
        "x-robots-tag": "noindex, nofollow",
        "content-security-policy": "default-src 'none'; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'"
      }
    });
  }

  // Allow requests outside the blocked country to continue to the site.
  return;
}

export const config = {
  path: "/*"
};
