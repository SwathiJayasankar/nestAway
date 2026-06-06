const geocodeListing = async (location, country) => {
    const query = encodeURIComponent(`${location}, ${country}`);
    const url = `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`;

    const response = await fetch(url, {
        headers: {
            "User-Agent": "NestAway/1.0",
            "Accept-Language": "en",
        },
    });

    if (!response.ok) {
        throw new Error("Geocoding request failed");
    }

    const data = await response.json();
    if (!data.length) {
        return null;
    }

    return {
        type: "Point",
        coordinates: [parseFloat(data[0].lon), parseFloat(data[0].lat)],
    };
};

module.exports = { geocodeListing };
