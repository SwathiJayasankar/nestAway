const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const buildSearchFilter = (searchTerm) => {
    const term = searchTerm.trim();
    if (!term) return null;

    const regex = new RegExp(escapeRegex(term), "i");
    return {
        $or: [
            { title: regex },
            { description: regex },
            { location: regex },
            { country: regex },
        ],
    };
};

module.exports = { buildSearchFilter };
