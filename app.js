// GitHub 오늘의 트렌딩 — GitHub Search API를 브라우저에서 직접 호출하는 정적 페이지.
// "화제도"는 공식 트렌딩 API가 없으므로 "기간 내 생성된 레포를 스타 순으로" 근사한다.

const listEl = document.getElementById("repo-list");
const statusEl = document.getElementById("status");
const updatedEl = document.getElementById("updated");
const periodEl = document.getElementById("period");
const languageEl = document.getElementById("language");
const refreshBtn = document.getElementById("refresh");

const numberFmt = new Intl.NumberFormat("ko-KR");

function daysAgoISO(days) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10); // YYYY-MM-DD
}

function buildQuery() {
  const days = Number(periodEl.value);
  const lang = languageEl.value;
  const parts = [`created:>=${daysAgoISO(days)}`];
  if (lang) parts.push(`language:${lang}`);
  return parts.join(" ");
}

function repoCard(repo, rank) {
  const li = document.createElement("li");
  li.className = "repo-card";

  const langHtml = repo.language
    ? `<span><span class="lang-dot"></span>${escapeHtml(repo.language)}</span>`
    : "";

  li.innerHTML = `
    <h2><span class="rank">#${rank}</span>
      <a href="${repo.html_url}" target="_blank" rel="noopener">${escapeHtml(repo.full_name)}</a>
    </h2>
    <p class="desc">${escapeHtml(repo.description || "(설명 없음)")}</p>
    <div class="meta">
      <span>⭐ ${numberFmt.format(repo.stargazers_count)}</span>
      <span>🍴 ${numberFmt.format(repo.forks_count)}</span>
      ${langHtml}
      <span>🕒 ${formatDate(repo.created_at)} 생성</span>
    </div>
  `;
  return li;
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function load() {
  listEl.innerHTML = "";
  statusEl.textContent = "불러오는 중…";
  statusEl.classList.remove("error");
  refreshBtn.disabled = true;

  const q = buildQuery();
  const url =
    "https://api.github.com/search/repositories?q=" +
    encodeURIComponent(q) +
    "&sort=stars&order=desc&per_page=30";

  try {
    const res = await fetch(url, {
      headers: { Accept: "application/vnd.github+json" },
    });

    if (res.status === 403) {
      throw new Error("GitHub API 호출 한도를 초과했습니다. 잠시 후 다시 시도하세요.");
    }
    if (!res.ok) {
      throw new Error(`요청 실패 (HTTP ${res.status})`);
    }

    const data = await res.json();
    const repos = data.items || [];

    if (repos.length === 0) {
      statusEl.textContent = "조건에 맞는 레포가 없습니다.";
      return;
    }

    statusEl.textContent = `총 ${numberFmt.format(data.total_count)}개 중 상위 ${repos.length}개`;
    repos.forEach((repo, i) => listEl.appendChild(repoCard(repo, i + 1)));
    updatedEl.textContent = new Date().toLocaleString("ko-KR");
  } catch (err) {
    statusEl.textContent = err.message;
    statusEl.classList.add("error");
  } finally {
    refreshBtn.disabled = false;
  }
}

refreshBtn.addEventListener("click", load);
periodEl.addEventListener("change", load);
languageEl.addEventListener("change", load);

load();
