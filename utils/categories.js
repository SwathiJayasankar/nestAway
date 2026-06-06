const categories = [
    { id: "trending", label: "Trending", icon: "fa-fire" },
    { id: "rooms", label: "Rooms", icon: "fa-bed" },
    { id: "iconic-cities", label: "Iconic Cities", icon: "fa-city" },
    { id: "mountains", label: "Mountains", icon: "fa-mountain" },
    { id: "beaches", label: "Beaches", icon: "fa-umbrella-beach" },
    { id: "resorts", label: "Resorts", icon: "fa-hotel" },
    { id: "castles", label: "Castles", icon: "fa-chess-rook" },
    { id: "amazing-pools", label: "Amazing Pools", icon: "fa-person-swimming" },
    { id: "lakeside", label: "Lakeside", icon: "fa-water" },
    { id: "countryside", label: "Countryside", icon: "fa-tree" },
    { id: "camping", label: "Camping", icon: "fa-campground" },
    { id: "farms", label: "Farms", icon: "fa-cow" },
    { id: "arctic", label: "Arctic", icon: "fa-snowflake" },
];

const listingCategories = categories
    .filter((c) => c.id !== "trending")
    .map((c) => c.id);

const isValidCategory = (id) => listingCategories.includes(id);

const getCategoryLabel = (id) => {
    const cat = categories.find((c) => c.id === id);
    return cat ? cat.label : id;
};

module.exports = { categories, listingCategories, isValidCategory, getCategoryLabel };
