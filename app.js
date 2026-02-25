// Paste your Apps Script Web App URL here:
const DATA_ENDPOINT = "PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE";

// Optional: default Stripe link if you don't store one per lead
const DEFAULT_STRIPE_LINK = "PASTE_DEFAULT_STRIPE_PAYMENT_LINK_HERE";

function getParam(name) {
  const u = new URL(window.location.href);
  return u.searchParams.get(name);
}

function serviceDefaults(category) {
  const c = (category || "").toLowerCase();
  if (c.includes("plumber")) return ["Leaks & repairs", "Bathrooms", "Boilers & heating", "Emergency callouts", "General plumbing"];
  if (c.includes("electric")) return ["Fault finding", "Rewires", "Consumer units", "Lighting", "Emergency callouts"];
  if (c.includes("cafe") || c.includes("restaurant")) return ["Fresh food", "Takeaway", "Family friendly", "Local favourites", "Daily specials"];
  return ["Local service", "Fast response", "Trusted workmanship", "Free quotes", "Competitive pricing"];
}

(async function init() {
  const id = getParam("id");
  if (!id) {
    document.getElementById("name").textContent = "Missing ?id=";
    return;
  }

  const res = await fetch(`${DATA_ENDPOINT}?id=${encodeURIComponent(id)}`);
  const lead = await res.json();

  const name = lead.name || "Local Business";
  const category = lead.category || "Service";
  const phone = lead.phone || "";
  const address = lead.address || "";
  const area = lead.area || "Local area";

  document.title = `${name} – Website Preview`;
  document.getElementById("name").textContent = name;
  document.getElementById("footerName").textContent = name;
  document.getElementById("tagline").textContent = `Trusted local ${category} in ${area}.`;
  document.getElementById("phone").textContent = phone || "—";
  document.getElementById("address").textContent = address || "—";
  document.getElementById("area").textContent = area;

  const services = (lead.services && String(lead.services).trim())
    ? String(lead.services).split("|").map(s => s.trim()).filter(Boolean)
    : serviceDefaults(category);

  const ul = document.getElementById("services");
  ul.innerHTML = "";
  services.forEach(s => {
    const li = document.createElement("li");
    li.textContent = s;
    ul.appendChild(li);
  });

  const callBtn = document.getElementById("callBtn");
  callBtn.href = phone ? `tel:${phone}` : "#";

  const payBtn = document.getElementById("payBtn");
  payBtn.href = lead.stripe_link || DEFAULT_STRIPE_LINK || "#";
})();
