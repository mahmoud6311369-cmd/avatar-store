// Avatar Store - Supabase Powered Version

const sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const LS_LANG = "avatar_lang";
const LS_CART = "avatar_cart";

function getLang() {
  return localStorage.getItem(LS_LANG) || "ar";
}

function moneyEGP(n) {
  const label = getLang() === "ar" ? "ج.م" : "EGP";
  return `${n} ${label}`;
}

function setAccent(color) {
  document.documentElement.style.setProperty("--accent", color || "#e11d48");
}

async function loadStoreSettings() {
  const { data } = await sb.from("store_settings").select("*").eq("id", 1).single();
  if (!data) return;

  document.querySelectorAll(".brandText strong").forEach(el => {
    el.textContent = getLang() === "ar" ? data.store_name_ar : data.store_name_en;
  });

  if (data.logo_url) {
    document.querySelectorAll(".logo").forEach(el => {
      el.innerHTML = `<img src="${data.logo_url}" style="width:100%;height:100%;object-fit:cover;border-radius:14px;">`;
    });
  }

  setAccent(data.accent);
}

async function loadProducts() {
  const grid = document.getElementById("featuredGrid") ||
               document.getElementById("productsGrid");

  if (!grid) return;

  const { data } = await sb.from("products")
    .select("*")
    .eq("active", true)
    .order("created_at", { ascending: false });

  if (!data || !data.length) {
    grid.innerHTML = `<div class="muted">لا يوجد منتجات</div>`;
    return;
  }

  grid.innerHTML = data.map(p => `
    <article class="cardItem">
      <div class="img" style="background-image:url('${p.images?.[0] || ""}');background-size:cover;"></div>
      <div class="body">
        <div style="display:flex;justify-content:space-between;align-items:center">
          <strong>${getLang() === "ar" ? p.title_ar : p.title_en}</strong>
          <span class="price">${moneyEGP(p.price)}</span>
        </div>
        <div class="chipRow">
          ${(p.colors || []).map(c => `<span class="chip">${c}</span>`).join("")}
        </div>
      </div>
    </article>
  `).join("");
}

async function loadShipping() {
  const select = document.getElementById("govSelect");
  if (!select) return;

  const { data: govs } = await sb.from("governorates")
    .select("*")
    .eq("active", true);

  const { data: rates } = await sb.from("shipping_rates")
    .select("*")
    .eq("active", true);

  if (!govs || !rates) return;

  const mapRate = new Map(rates.map(r => [r.governorate_id, r]));

  select.innerHTML = govs.map(g => {
    const r = mapRate.get(g.id);
    return `<option value="${r?.price || 0}">
      ${getLang() === "ar" ? g.name_ar : g.name_en}
    </option>`;
  }).join("");

  select.onchange = () => {
    const price = select.value;
    const priceEl = document.getElementById("shipPrice");
    if (priceEl) priceEl.textContent = moneyEGP(price);
  };

  select.dispatchEvent(new Event("change"));
}

document.addEventListener("DOMContentLoaded", async () => {
  await loadStoreSettings();
  await loadProducts();
  await loadShipping();
});
