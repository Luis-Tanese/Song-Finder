const searchInput = document.getElementById("search");
const resultsDiv = document.getElementById("results");
const lyricsDiv = document.getElementById("lyrics");
const spinner = document.getElementById("spinner");

async function searchSongs(query) {
    if (!query) {
        resultsDiv.innerHTML = "";
        lyricsDiv.innerHTML = "";
        lyricsDiv.classList.remove("visible");
        resultsDiv.classList.add("visible");
        return;
    }
    lyricsDiv.classList.remove("visible");
    resultsDiv.classList.add("visible");
    spinner.style.display = "block";
    try {
        const response = await fetch(`https://api.lyrics.ovh/suggest/${query}`);
        const data = await response.json();
        renderSongs(data.data);
    } catch (error) {
        console.error("Error fetching songs:", error);
        resultsDiv.innerHTML =
            "<p>Error fetching songs. Please try again later.</p>";
    } finally {
        spinner.style.display = "none";
    }
}

function renderSongs(songs) {
    resultsDiv.innerHTML = songs
        .map(
            (song) => `
        <div class="song">
          <div class="song-title">${song.title}</div>
          <div class="song-artist">by ${song.artist.name}</div>
          <button class="get-lyrics" onclick="getLyrics('${song.artist.name}', '${song.title}')">Get Lyrics</button>
        </div>
      `
        )
        .join("");
}

async function getLyrics(artist, title) {
    spinner.style.display = "block";
    try {
        const response = await fetch(
            `https://api.lyrics.ovh/v1/${artist}/${title}`
        );
        const data = await response.json();
        const lyricsContent = data.lyrics
            ? data.lyrics.replace(/\n/g, "<br>")
            : "Lyrics not found.";

        lyricsDiv.innerHTML = `
          <div class="lyrics-title">${title} by ${artist}</div>
          <p>${lyricsContent}</p>
        `;
        lyricsDiv.classList.add("visible");
        resultsDiv.classList.remove("visible");
    } catch (error) {
        console.error("Error fetching lyrics:", error);
        lyricsDiv.innerHTML =
            "<p>Error fetching lyrics. Please try again later.</p>";
        lyricsDiv.classList.add("visible");
        resultsDiv.classList.remove("visible");
    } finally {
        spinner.style.display = "none";
    }
}

searchInput.addEventListener("input", (e) => {
    const query = e.target.value.trim();
    searchSongs(query);
});
