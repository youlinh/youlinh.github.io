const cards = [...document.querySelectorAll("#sites > li")];
const filters = document.querySelector("#filters");
const buttons = [...filters.querySelectorAll("button")];
const search = document.querySelector("#site-search");
const count = document.querySelector("#result-count");
const empty = document.querySelector("#empty");
let category = "all";

function normalize(text) {
  return text.normalize("NFKC").toLowerCase();
}

const catalog = cards.map((card) => ({
  card,
  content: normalize(`${card.textContent} ${card.dataset.keywords}`),
}));

function updateResults() {
  const query = normalize(search.value).trim().split(/\s+/).filter(Boolean);
  let visible = 0;

  for (const { card, content } of catalog) {
    const matchesCategory = category === "all" || card.dataset.category === category;
    const matchesQuery = query.every((word) => content.includes(word));
    card.hidden = !(matchesCategory && matchesQuery);
    visible += Number(!card.hidden);
  }

  count.textContent = visible === cards.length
    ? `共 ${cards.length} 个站点`
    : `显示 ${visible} 个站点，共 ${cards.length} 个`;
  empty.hidden = visible !== 0;
}

function selectCategory(value) {
  category = value;
  for (const button of buttons) {
    button.setAttribute("aria-pressed", String(button.dataset.filter === category));
  }
  updateResults();
}

for (const button of buttons) {
  button.addEventListener("click", () => selectCategory(button.dataset.filter));
}
search.addEventListener("input", updateResults);
document.querySelector("#clear-filters").addEventListener("click", () => {
  search.value = "";
  selectCategory("all");
  search.focus();
});

updateResults();
filters.hidden = false;
document.querySelector("#search").hidden = false;
