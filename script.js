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

        // Fetch detailed player data
        const fideApiUrl = `https://lichess.org/api/fide/${fideId}`;
        const fideResponse = await fetch(fideApiUrl);
        if (!fideResponse.ok) {
            resultDiv.innerHTML = `❌ Failed to fetch details for FIDE ID: ${fideId}`;
            return;
        }

        const fideData = await fideResponse.json();

        // Display player info
        resultDiv.innerHTML = `
            ✅ <strong>${fideData.name} (${fideData.federation})</strong><br>
            Classical: ${fideData.classical ?? "N/A"}<br>
            Rapid: ${fideData.rapid ?? "N/A"}<br>
            Blitz: ${fideData.blitz ?? "N/A"}<br>
            Age: ${fideData.age ?? "N/A"}<br>
            <a href="https://lichess.org/fide/${fideId}" target="_blank">View Profile</a>
        `;
    } catch (error) {
        resultDiv.innerHTML = "❌ Error fetching data. Try again.";
        console.error(error);
    }
}
