const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const ExpressError = require("../utils/ExpressError.js");

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        } else {
            cb(new ExpressError(400, "Only image files are allowed!"));
        }
    },
});

const parseListingBody = (req, res, next) => {
    if (!req.body) {
        req.body = {};
    }

    if (!req.body.listing) {
        const listing = {};
        for (const [key, value] of Object.entries(req.body)) {
            if (key.startsWith("listing[") && key.endsWith("]")) {
                listing[key.slice(8, -1)] = value;
                delete req.body[key];
            }
        }
        req.body.listing = listing;
    }

    next();
};

const getCloudinaryUrl = (file) => {
    if (!file) return null;
    return file.path || file.secure_url || file.url || null;
};

const saveImageUrl = (req, res, next) => {
    const imageUrl = getCloudinaryUrl(req.file);
    if (imageUrl) {
        if (!req.body) req.body = {};
        if (!req.body.listing) req.body.listing = {};
        req.body.listing.image = imageUrl;
    }
    next();
};

const handleUpload = (req, res, next) => {
    upload.single("image")(req, res, (err) => {
        if (err) return next(err);
        next();
    });
};

module.exports = { upload, handleUpload, parseListingBody, saveImageUrl, getCloudinaryUrl };
