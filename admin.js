// يعتمد على config.js اللي عندك (SUPABASE_URL / SUPABASE_ANON_KEY)

const sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const $ = (id) => document.getElementById(id);

const show = (id, on) => $(id).classList.toggle("hidden", !on);

function tab(name){
  ["settings","products","shipping","payments"].forEach(t=>{
    show(`tab-${t}`, t===name);
  });
}

document.querySelectorAll("[data-tab]").forEach(b=>{
  b.addEventListener("click", ()=> tab(b.dataset.tab));
});

// ---------- Helpers ----------
const parseCsv = (v)=> (v||"").split(",").map(s=>s.trim()).filter(Boolean);
const parseLines = (v)=> (v||"").split("\n").map(s=>s.trim()).filter(Boolean);

function parseAttrs(text){
  const obj = {};
  parseLines(text).forEach(line=>{
    const i = line.indexOf(":");
    if(i === -1) obj[line] = true;
    else obj[line.slice(0,i).trim()] = line.slice(i+1).trim();
  });
  return obj;
}

async function uploadToBucket(file, folder="products"){
  const safe = file.name.replace(/[^\w.\-]+/g, "_");
  const path = `${folder}/${Date.now()}_${safe}`;

  const { error } = await sb
    .storage
    .from("product-media")
    .upload(path, file, { upsert:false, contentType:file.type });

  if (error) throw error;

  // bucket Public
  const { data } = sb.storage.from("product-media").getPublicUrl(path);
  return data.publicUrl;
}

// ---------- Accent Picker Sync (بدون كود) ----------
function wireAccentPicker(){
  const picker = $("accentPicker");
  const hex = $("accent");
  if(!picker || !hex) return;

  // من الـ picker → للـ hex
  picker.addEventListener("input", ()=>{
    hex.value = picker.value;
  });

  // من الـ hex → للـ picker (لو المستخدم كتب يدوي)
  hex.addEventListener("input", ()=>{
    const v = (hex.value || "").trim();
    if(/^#([0-9a-fA-F]{6})$/.test(v)) picker.value = v;
  });
}

// ---------- Auth UI ----------
async function ensureAuthUI(){
  const { data: { session } } = await sb.auth.getSession();
  $("logoutBtn").style.display = session ? "inline-flex" : "none";
  show("authCard", !session);
  show("adminCard", !!session);
  if(session) await refreshAll();
}

$("logoutBtn").onclick = async ()=>{
  await sb.auth.signOut();
  await ensureAuthUI();
};

$("loginBtn").onclick = async () => {
  $("authMsg").textContent = "";
  const email = $("email").value.trim();
  const password = $("pass").value;
  const { error } = await sb.auth.signInWithPassword({ email, password });
  $("authMsg").textContent = error ? error.message : "✅ Logged in";
  await ensureAuthUI();
};

// -------- Settings --------
async function loadSettings(){
  const { data } = await sb.from("store_settings").select("*").eq("id", 1).single();
  if(!data) return;

  $("storeNameAr").value = data.store_name_ar || "Avatar";
  $("storeNameEn").value = data.store_name_en || "Avatar";

  if ($("logoUrl")) $("logoUrl").value = data.logo_url || "";

  const accent = data.accent || "#e11d48";
  if ($("accent")) $("accent").value = accent;
  if ($("accentPicker")) $("accentPicker").value = accent;
}

$("saveSettings").onclick = async ()=>{
  $("settingsMsg").textContent = "";

  try{
    // ✅ 1) Upload Logo لو المستخدم اختار ملف
    let logoUrl = ($("logoUrl")?.value || "").trim() || null;
    const logoFile = (($("logoFile")?.files) || [])[0];

    if(logoFile){
      // رفع اللوجو داخل فولدر branding
      logoUrl = await uploadToBucket(logoFile, "branding/logo");
      if ($("logoUrl")) $("logoUrl").value = logoUrl; // يتعبّى تلقائي
    }

    // ✅ 2) Accent from picker (بدون كود)
    const accentValue =
      ($("accentPicker")?.value || "").trim()
      || ($("accent")?.value || "").trim()
      || "#e11d48";

    if ($("accent")) $("accent").value = accentValue;
    if ($("accentPicker")) $("accentPicker").value = accentValue;

    const payload = {
      id: 1,
      store_name_ar: $("storeNameAr").value.trim(),
      store_name_en: $("storeNameEn").value.trim(),
      logo_url: logoUrl,
      accent: accentValue,
      updated_at: new Date().toISOString()
    };

    const { error } = await sb.from("store_settings").upsert(payload);
    $("settingsMsg").textContent = error ? error.message : "✅ تم الحفظ (اللوجو + اللون)";
  }catch(e){
    $("settingsMsg").textContent = e?.message || "حصل خطأ أثناء حفظ الإعدادات";
  }
};

// -------- Products --------
$("clearProduct").onclick = ()=>{
  [
    "pSlug","pTitleAr","pTitleEn","pDescAr","pDescEn",
    "pColors","pSizes","pPrice",
    "pHighlights","pAttrs"
  ].forEach(id=> $(id).value = "");

  // file inputs
  if ($("pImagesFiles")) $("pImagesFiles").value = "";
  if ($("pVideoFile")) $("pVideoFile").value = "";

  // 👈 خلي الافتراضي MEN
  $("pGender").value="MEN";
  $("pType").value="CLOTHING";
  $("productMsg").textContent="";
};

$("saveProduct").onclick = async ()=>{
  $("productMsg").textContent="";

  const slug = $("pSlug").value.trim();
  if(!slug){ $("productMsg").textContent="Slug مطلوب"; return; }

  try{
    // هات المنتج القديم (لو موجود) علشان لو المستخدم ما رفعش جديد من غير ما نمسح القديم
    const { data: oldP } = await sb.from("products").select("*").eq("slug", slug).maybeSingle();

    // 1) Upload الصور (لو اختار صور)
    const imgFiles = Array.from(($("pImagesFiles")?.files) || []);
    let images = (oldP?.images) || [];

    if(imgFiles.length){
      const uploaded = [];
      for(const f of imgFiles){
        const url = await uploadToBucket(f, `products/${slug}/images`);
        uploaded.push(url);
      }
      images = uploaded; // لو رفع صور جديدة نستبدل القديمة
    }

    // 2) Upload الفيديو (لو اختار فيديو)
    const vFile = (($("pVideoFile")?.files) || [])[0];
    let video_url = oldP?.video_url || null;
    if(vFile){
      video_url = await uploadToBucket(vFile, `products/${slug}/video`);
    }

    // 3) highlights + attributes
    // لو فاضيين وإحنا في Edit => خليه القديم (علشان ما يمسحش بالغلط)
    const hText = $("pHighlights")?.value || "";
    const aText = $("pAttrs")?.value || "";

    const highlights = hText.trim() ? parseLines(hText) : (oldP?.highlights || []);
    const attributes = aText.trim() ? parseAttrs(aText) : (oldP?.attributes || {});

    const payload = {
      slug,
      gender: $("pGender").value,
      type: $("pType").value,
      title_ar: $("pTitleAr").value.trim() || slug,
      title_en: $("pTitleEn").value.trim() || slug,
      desc_ar: $("pDescAr").value.trim() || null,
      desc_en: $("pDescEn").value.trim() || null,
      price: Number($("pPrice").value || 0),
      colors: parseCsv($("pColors").value),
      sizes: parseCsv($("pSizes").value),

      images,
      video_url,
      highlights,
      attributes,

      active: true,
      updated_at: new Date().toISOString()
    };

    const { error } = await sb.from("products").upsert(payload, { onConflict:"slug" });
    $("productMsg").textContent = error ? error.message : "✅ تم حفظ المنتج (صور/فيديو)";
    await loadProducts();

  }catch(e){
    $("productMsg").textContent = e?.message || "حصل خطأ أثناء الرفع/الحفظ";
  }
};

async function loadProducts(){
  const list = $("productsList");
  const { data, error } = await sb.from("products").select("*").order("created_at", {ascending:false});

  if(error){
    list.innerHTML = `<div class="muted">${error.message}</div>`;
    return;
  }

  list.innerHTML = (data||[]).map(p=>`
    <div class="cartRow">
      <div class="left">
        <strong>${p.title_ar}</strong>
        <small class="muted">${p.gender} • ${p.type} • ${p.slug}</small>
        <small class="muted">Colors: ${(p.colors||[]).join(", ")} | Sizes: ${(p.sizes||[]).join(", ")}</small>
        <small class="muted">Images: ${(p.images||[]).length} • Video: ${p.video_url ? "Yes" : "No"}</small>
      </div>
      <div class="right">
        <strong>${p.price} EGP</strong>
        <div style="display:flex;gap:8px;margin-top:8px">
          <button class="btnPrimary" data-edit="${p.slug}">Edit</button>
          <button class="btnGhost" data-off="${p.slug}">Disable</button>
        </div>
      </div>
    </div>
  `).join("") || `<div class="muted">لا يوجد منتجات</div>`;

  // Edit
  list.querySelectorAll("[data-edit]").forEach(b=>{
    b.onclick = async ()=>{
      const slug = b.getAttribute("data-edit");
      const { data: p } = await sb.from("products").select("*").eq("slug", slug).single();
      if(!p) return;

      $("pSlug").value = p.slug;
      $("pGender").value = p.gender;
      $("pType").value = p.type;
      $("pTitleAr").value = p.title_ar || "";
      $("pTitleEn").value = p.title_en || "";
      $("pDescAr").value = p.desc_ar || "";
      $("pDescEn").value = p.desc_en || "";
      $("pPrice").value = p.price || 0;
      $("pColors").value = (p.colors||[]).join(", ");
      $("pSizes").value = (p.sizes||[]).join(", ");

      if ($("pHighlights")) $("pHighlights").value = (p.highlights||[]).join("\n");

      if ($("pAttrs")) {
        const attrs = p.attributes || {};
        const lines = Object.keys(attrs).map(k=>{
          const v = attrs[k];
          return (v === true) ? k : `${k}: ${v}`;
        });
        $("pAttrs").value = lines.join("\n");
      }

      if ($("pImagesFiles")) $("pImagesFiles").value = "";
      if ($("pVideoFile")) $("pVideoFile").value = "";

      tab("products");
      window.scrollTo({ top: 0, behavior:"smooth" });
    };
  });

  // Disable
  list.querySelectorAll("[data-off]").forEach(b=>{
    b.onclick = async ()=>{
      const slug = b.getAttribute("data-off");
      await sb.from("products").update({ active:false, updated_at:new Date().toISOString() }).eq("slug", slug);
      await loadProducts();
    };
  });
}

// -------- Shipping --------
$("addGov").onclick = async ()=>{
  $("shipMsg").textContent="";
  const name_ar = $("gAr").value.trim();
  const name_en = $("gEn").value.trim();
  const price = Number($("gPrice").value || 0);
  const eta = ($("gEta").value || "2-4").trim();
  const free_over = $("gFree").value ? Number($("gFree").value) : null;

  if(!name_ar || !name_en){
    $("shipMsg").textContent="اكتب اسم المحافظة عربي/إنجليزي";
    return;
  }

  const { data: gov, error: e1 } = await sb.from("governorates")
    .insert({ name_ar, name_en, active:true }).select("*").single();

  if(e1){ $("shipMsg").textContent=e1.message; return; }

  const { error: e2 } = await sb.from("shipping_rates")
    .insert({ governorate_id: gov.id, price, eta, free_over, active:true });

  $("shipMsg").textContent = e2 ? e2.message : "✅ تم إضافة المحافظة";
  await loadShipping();
};

$("addCompany").onclick = async ()=>{
  const name = $("cName").value.trim();
  if(!name) return;

  await sb.from("shipping_companies").insert({
    name,
    phone: $("cPhone").value.trim() || null,
    notes: $("cNotes").value.trim() || null,
    active:true
  });

  $("cName").value="";
  $("cPhone").value="";
  $("cNotes").value="";
  await loadShipping();
};

async function loadShipping(){
  const govList = $("govList");
  const companyList = $("companyList");

  const { data: govs } = await sb.from("governorates").select("*").order("name_ar");
  const { data: rates } = await sb.from("shipping_rates").select("*");
  const mapRate = new Map((rates||[]).map(r=>[r.governorate_id, r]));

  govList.innerHTML = (govs||[]).map(g=>{
    const r = mapRate.get(g.id);
    return `
      <div class="cartRow">
        <div class="left">
          <strong>${g.name_ar} / ${g.name_en}</strong>
          <small class="muted">Price: ${(r?.price ?? "—")} | ETA: ${(r?.eta ?? "—")} | Free over: ${(r?.free_over ?? "—")}</small>
        </div>
        <div class="right">
          <button class="btnGhost" data-goff="${g.id}">Disable</button>
        </div>
      </div>
    `;
  }).join("") || `<div class="muted">لا يوجد محافظات</div>`;

  govList.querySelectorAll("[data-goff]").forEach(b=>{
    b.onclick = async ()=>{
      const id = b.getAttribute("data-goff");
      await sb.from("governorates").update({ active:false }).eq("id", id);
      await loadShipping();
    };
  });

  const { data: comps } = await sb.from("shipping_companies").select("*").order("name");

  companyList.innerHTML = (comps||[]).map(c=>`
    <div class="cartRow">
      <div class="left">
        <strong>${c.name}</strong>
        <small class="muted">${c.phone||""}${c.notes?(" • "+c.notes):""}</small>
      </div>
      <div class="right">
        <button class="btnGhost" data-coff="${c.id}">Disable</button>
      </div>
    </div>
  `).join("") || `<div class="muted">لا يوجد شركات</div>`;

  companyList.querySelectorAll("[data-coff]").forEach(b=>{
    b.onclick = async ()=>{
      const id = b.getAttribute("data-coff");
      await sb.from("shipping_companies").update({ active:false }).eq("id", id);
      await loadShipping();
    };
  });
}

// -------- Payments --------
async function loadPayments(){
  const box = $("payList");
  const { data, error } = await sb.from("payment_methods").select("*").order("code");
  if(error){ box.innerHTML = `<div class="muted">${error.message}</div>`; return; }

  box.innerHTML = (data||[]).map(p=>`
    <div class="cartRow">
      <div class="left">
        <strong>${p.name_ar} / ${p.name_en}</strong>
        <small class="muted">Code: ${p.code}</small>
        <small class="muted">AR: ${p.instructions_ar || ""}</small>
        <small class="muted">EN: ${p.instructions_en || ""}</small>
      </div>
      <div class="right" style="flex-direction:column;align-items:flex-end;gap:8px">
        <label class="muted" style="display:flex;gap:8px;align-items:center">
          Active <input type="checkbox" ${p.active ? "checked":""} data-tog="${p.code}">
        </label>
        <button class="btnGhost" data-editpay="${p.code}">Edit</button>
      </div>
    </div>
  `).join("");

  box.querySelectorAll("[data-tog]").forEach(ch=>{
    ch.onchange = async ()=>{
      const code = ch.getAttribute("data-tog");
      await sb.from("payment_methods").update({ active: ch.checked, updated_at:new Date().toISOString() }).eq("code", code);
    };
  });

  box.querySelectorAll("[data-editpay]").forEach(btn=>{
    btn.onclick = async ()=>{
      const code = btn.getAttribute("data-editpay");
      const ar = prompt("اكتب تعليمات عربي:", "");
      const en = prompt("Write instructions EN:", "");
      await sb.from("payment_methods").update({
        instructions_ar: ar || null,
        instructions_en: en || null,
        updated_at: new Date().toISOString()
      }).eq("code", code);
      await loadPayments();
    };
  });
}

async function refreshAll(){
  await loadSettings();
  await loadProducts();
  await loadShipping();
  await loadPayments();
}

(async function(){
  tab("settings");
  wireAccentPicker(); // ✅ ربط اللون
  await ensureAuthUI();
  sb.auth.onAuthStateChange(async ()=>{ await ensureAuthUI(); });
})();
