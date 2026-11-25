import { suppliers } from "./features/suppliers.js";

function getElement<T extends HTMLElement>(id: string): T {
  const element = document.getElementById(id);
  if (!element) throw new Error(`Missing marketplace element: ${id}`);
  return element as T;
}

function readPreference(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function storePreference(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Keep the current view usable when browser storage is unavailable.
  }
}

const search = getElement<HTMLInputElement>("search");
const inventory = getElement<HTMLSelectElement>("inventory");
const purchase = getElement<HTMLSelectElement>("purchase");
const grid = getElement("supplier-grid");
const result = getElement("result-status");
const themeToggle = getElement<HTMLButtonElement>("theme-toggle");
const savedToggle = getElement<HTMLButtonElement>("saved-toggle");
const savedCount = getElement("saved-count");
const savedIds = new Set(
  (readPreference("pallet.saved") ?? "").split(",").filter(Boolean),
);
let savedOnly = false;

function setTheme(dark: boolean): void {
  document.documentElement.dataset.theme = dark ? "dark" : "light";
  themeToggle.setAttribute("aria-pressed", String(dark));
  const label = themeToggle.querySelector(".theme-label");
  if (label) label.textContent = dark ? "Dark" : "Light";
}

function renderSuppliers(): void {
  const query = search.value.trim().toLowerCase();
  const matches = suppliers.filter((supplier) => {
    const text = [supplier.name, supplier.description, ...supplier.inventory]
      .join(" ")
      .toLowerCase();
    return (
      text.includes(query) &&
      (!inventory.value ||
        supplier.inventory.some((item) => item === inventory.value)) &&
      (!purchase.value ||
        supplier.purchase.some((item) => item === purchase.value)) &&
      (!savedOnly || savedIds.has(supplier.id))
    );
  });

  savedCount.textContent = String(
    suppliers.filter(({ id }) => savedIds.has(id)).length,
  );
  result.textContent = matches.length
    ? `${matches.length} ${matches.length === 1 ? "supplier" : "suppliers"}`
    : savedOnly && savedIds.size === 0
      ? "Save a supplier to find it here later."
      : "No suppliers match these filters.";
  grid.replaceChildren(
    ...matches.map((supplier) => {
      const card = document.createElement("article");
      card.className = "supplier-card";

      // Suppliers are a bundled, hand-reviewed list. Search and stored values never enter this markup.
      const saved = savedIds.has(supplier.id);
      const purchaseLabel = supplier.purchase
        .map((type) => (type === "auction" ? "Auction" : "Direct purchase"))
        .join(" · ");
      card.innerHTML = `
      <div class="card-top">
        <span class="supplier-mark" aria-hidden="true" style="--mark: ${supplier.color}">${supplier.initials}</span>
        <button type="button" class="save-button" aria-label="Save ${supplier.name}" aria-pressed="${saved}">${saved ? "Saved" : "Save"}</button>
      </div>
      <h3>${supplier.name}</h3>
      <p>${supplier.description}</p>
      <div class="card-footer">
        <span class="supplier-type">${purchaseLabel}</span>
        <a class="source-link" href="${supplier.url}" aria-label="View lots at ${supplier.name}">View lots</a>
      </div>`;
      const saveButton = card.querySelector("button");
      saveButton?.addEventListener("click", () => {
        if (savedIds.has(supplier.id)) savedIds.delete(supplier.id);
        else savedIds.add(supplier.id);
        storePreference("pallet.saved", [...savedIds].join(","));
        renderSuppliers();
        const replacement = Array.from(grid.querySelectorAll("button")).find(
          (button) =>
            button.getAttribute("aria-label") === `Save ${supplier.name}`,
        );
        (replacement ?? savedToggle).focus();
      });
      return card;
    }),
  );
}

setTheme(readPreference("pallet.theme") !== "light");
themeToggle.addEventListener("click", () => {
  const dark = document.documentElement.dataset.theme !== "dark";
  setTheme(dark);
  storePreference("pallet.theme", dark ? "dark" : "light");
});
savedToggle.addEventListener("click", () => {
  savedOnly = !savedOnly;
  savedToggle.setAttribute("aria-pressed", String(savedOnly));
  renderSuppliers();
  getElement("catalog").scrollIntoView({ block: "start" });
});
getElement("filters").addEventListener("submit", (event) =>
  event.preventDefault(),
);
search.addEventListener("input", renderSuppliers);
inventory.addEventListener("change", renderSuppliers);
purchase.addEventListener("change", renderSuppliers);
renderSuppliers();
