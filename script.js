async function searchFidePlayer() {
  const playerInput = document.getElementById("playerInput").value.trim();
  const resultDiv = document.getElementById("result");

  if (!playerInput) {
    resultDiv.innerHTML = "❌ Please enter a FIDE player name or ID.";
    return;
  }

  resultDiv.innerHTML = "🔍 Searching...";

  try {
    // Build the URL with the player's name as a path parameter
    const apiUrl = `https://divine-leaf-d907.wcloudflare247.workers.dev/fide/${encodeURIComponent(playerInput)}`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.error) {
      resultDiv.innerHTML = `❌ ${data.error} <br>
          ${data.search_link ? `<a href="${data.search_link}" target="_blank">Try manual search</a>` : ''}`;
      return;
    }

    resultDiv.innerHTML = `
        ✅ <strong>${data.name} (${data.federation})</strong><br>
        Title: ${data.title ?? "N/A"}<br>
        Classical: ${data.standard ?? "N/A"}<br>
        Rapid: ${data.rapid ?? "N/A"}<br>
        Blitz: ${data.blitz ?? "N/A"}<br>
        Year: ${data.year ?? "N/A"}<br>
        <a href="https://lichess.org/fide/${data.id}" target="_blank">View Profile</a>
    `;

  } catch (error) {
    resultDiv.innerHTML = "❌ Error fetching data. Try again.";
    console.error(error);
  }
}
