(() => {
    const mapEls = document.querySelectorAll(".listing-map");
    if (!mapEls.length || typeof L === "undefined") return;

    const cacheKey = "nestAwayGeoCache";
    let geoCache = {};
    try {
        geoCache = JSON.parse(localStorage.getItem(cacheKey) || "{}");
    } catch {
        geoCache = {};
    }

    const saveCache = () => {
        try {
            localStorage.setItem(cacheKey, JSON.stringify(geoCache));
        } catch {
            /* ignore quota errors */
        }
    };

    const geocode = async (location, country) => {
        const key = `${location}, ${country}`;
        if (geoCache[key]) return geoCache[key];

        const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(key)}`;
        const res = await fetch(url, { headers: { "Accept-Language": "en" } });
        const data = await res.json();

        if (!data[0]) return null;

        const coords = {
            lat: parseFloat(data[0].lat),
            lng: parseFloat(data[0].lon),
        };
        geoCache[key] = coords;
        saveCache();
        return coords;
    };

    const initMap = (el, lat, lng, title) => {
        if (el._leaflet_id) return;

        const zoom = el.classList.contains("map-sm") ? 11 : 13;
        const map = L.map(el, { scrollWheelZoom: false }).setView([lat, lng], zoom);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            maxZoom: 19,
            attribution: "&copy; OpenStreetMap contributors",
        }).addTo(map);

        L.marker([lat, lng]).addTo(map).bindPopup(title);
    };

    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const bootMaps = async () => {
        let needsDelay = false;

        for (const el of mapEls) {
            let lat = parseFloat(el.dataset.lat);
            let lng = parseFloat(el.dataset.lng);

            if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
                if (needsDelay) await delay(1100);
                needsDelay = true;

                const coords = await geocode(el.dataset.location, el.dataset.country);
                if (!coords) {
                    el.innerHTML = '<p class="map-fallback text-muted small mb-0 p-2">Map unavailable for this location.</p>';
                    continue;
                }
                lat = coords.lat;
                lng = coords.lng;
            }

            initMap(el, lat, lng, el.dataset.title);
        }
    };

    bootMaps();
})();
