window.addEventListener('load', () => {
  document.getElementById('dyn1').focus();
});
document.getElementById('searchForm').addEventListener('submit', function(e) {
  e.preventDefault();
  searchFidePlayer();
});
async function searchFidePlayer() {
  const playerInput = document.getElementById("dyn1").value.trim();
  const resultDiv = document.getElementById("result");
  if (!playerInput) {
    resultDiv.innerHTML = "❌ Please enter a FIDE player name or ID.";
    return;
  }
  resultDiv.innerHTML = "🔍 Searching...";
  try {
    const apiUrl = `https://withered-darkness-1b21.wcloudflare247.workers.dev/fide/${encodeURIComponent(playerInput)}`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    if (data.error) {
      resultDiv.innerHTML = `❌ ${data.error}<br><a href="${data.search_link || 'https://ratings.fide.com/'}" target="_blank">Try manual search on FIDE ratings</a>`;
      return;
    }
    let html = `
      ✅ <strong>${data.name} (${data.federation})</strong><br>
      Title: ${data.title ?? "N/A"}<br>
      Classical: ${data.standard ?? "N/A"}<br>
      Rapid: ${data.rapid ?? "N/A"}<br>
      Blitz: ${data.blitz ?? "N/A"}<br>
      Year: ${data.year ?? "N/A"}<br>
      <a href="https://ratings.fide.com/profile/${data.id}" target="_blank">View Profile</a>
    `;
    if (data.multiple && data.warning) {
      html += `<br><span style="color: red;">Warning: ${data.warning}</span>`;
    }
    resultDiv.innerHTML = html;
  } catch (error) {
    resultDiv.innerHTML = "❌ Error fetching data. Try again.";
    console.error(error);
  }
}
