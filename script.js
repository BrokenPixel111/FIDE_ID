async function searchFidePlayer() {
    const playerName = document.getElementById("playerName").value.trim();
    const resultDiv = document.getElementById("result");

    if (!playerName) {
        resultDiv.innerHTML = "❌ Please enter a FIDE player name.";
        return;
    }

    try {
        // Search Lichess for FIDE players matching the name
        const searchUrl = `https://lichess.org/fide?q=${encodeURIComponent(playerName)}`;
        const searchResponse = await fetch(searchUrl);
        const searchText = await searchResponse.text();

        // Extract first FIDE player ID from search results
        const fideIdMatch = searchText.match(/\/fide\/(\d+)\//);
        if (!fideIdMatch) {
            resultDiv.innerHTML = `❌ No FIDE player found for "${playerName}". Try manually: <a href="${searchUrl}" target="_blank">Lichess Search</a>`;
            return;
        }

        const fideId = fideIdMatch[1];

        // Fetch player data from Cloudflare Worker
        fetchFideData(fideId);
    } catch (error) {
        resultDiv.innerHTML = "❌ Error fetching data. Try again.";
        console.error(error);
    }
}

async function fetchFideData(fideId) {
    const resultDiv = document.getElementById("result");
    const apiUrl = `https://divine-leaf-d907.wcloudflare247.workers.dev/fide/${fideId}`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.error) {
            resultDiv.innerHTML = `⚠️ Error: ${data.error}`;
        } else {
            resultDiv.innerHTML = `
                ✅ <strong>${data.name} (${data.federation})</strong><br>
                Classical: ${data.classical ?? "N/A"}<br>
                Rapid: ${data.rapid ?? "N/A"}<br>
                Blitz: ${data.blitz ?? "N/A"}<br>
                Age: ${data.age ?? "N/A"}<br>
                <a href="https://lichess.org/fide/${fideId}" target="_blank">View Profile</a>
            `;
        }
    } catch (error) {
        resultDiv.innerHTML = "❌ Failed to fetch player data.";
        console.error(error);
    }
}
