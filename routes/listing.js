const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js")
const {listingSchema} = require("../schema.js");
const Listing =  require("../models/listing.js");
const { isLoggedIn, isOwner } = require("../middleware.js");
const { handleUpload, parseListingBody, saveImageUrl, getCloudinaryUrl } = require("../middleware/upload.js");
const { geocodeListing } = require("../utils/geocode.js");
const { categories, isValidCategory, getCategoryLabel } = require("../utils/categories.js");
const { buildSearchFilter } = require("../utils/search.js");

const validateListing = (req, res, next) => {
    if (!req.body) req.body = {};
    if (!req.body.listing) req.body.listing = {};

    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

//Index route
router.get("/", wrapAsync(async (req, res) => {
    let { category, search } = req.query;
    const searchQuery = (search || "").trim();

    const activeCategory =
        category && isValidCategory(category) ? category : "trending";

    const searchFilter = buildSearchFilter(searchQuery);
    let filter = {};

    if (searchFilter && activeCategory !== "trending") {
        filter = { $and: [{ category: activeCategory }, searchFilter] };
    } else if (searchFilter) {
        filter = searchFilter;
    } else if (activeCategory !== "trending") {
        filter.category = activeCategory;
    }

    let query = Listing.find(filter);
    if (activeCategory === "trending" && !searchFilter) {
        query = query.sort({ price: -1 });
    } else {
        query = query.sort({ title: 1 });
    }

    const allListings = await query;

    let activeLabel = categories.find((c) => c.id === activeCategory)?.label || "Trending";
    if (searchQuery) {
        activeLabel = `Results for "${searchQuery}"`;
        if (activeCategory !== "trending") {
            activeLabel += ` in ${getCategoryLabel(activeCategory)}`;
        }
    }

    res.locals.activeCategory = activeCategory;

    res.render("listings/index.ejs", {
        allListings,
        categories,
        activeCategory,
        activeLabel,
        searchQuery,
    });
}));

//new route
router.get("/new", isLoggedIn, (req, res) => {
    res.render("listings/new.ejs", { categories: categories.filter((c) => c.id !== "trending") });
});

//show route
router.get("/:id", wrapAsync(async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({path: "reviews", populate: {path: "author"}}).populate("owner");
    if(!listing){
        req.flash("error", "The Listing does not exit");
        return res.redirect("/");
    }
    res.render("listings/show.ejs", {
        listing,
        categoryLabel: getCategoryLabel(listing.category),
    });
}));

//create route
router.post("/", isLoggedIn, handleUpload, parseListingBody, saveImageUrl, validateListing, wrapAsync(async (req, res) => {
        const listingData = { ...req.body.listing };
        const cloudinaryUrl = getCloudinaryUrl(req.file);
        if (cloudinaryUrl) {
            listingData.image = cloudinaryUrl;
        }
        try {
            listingData.geometry = await geocodeListing(listingData.location, listingData.country);
        } catch (err) {
            console.error("Geocoding failed:", err.message);
        }
        const newListing = new Listing(listingData);
        newListing.owner = req.user._id;
        await newListing.save();
        req.flash("success", "New Listing Created!");
        res.redirect("/");
    })
);

//edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(async(req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "The Listing does not exit");
        return res.redirect("/");
    }
    res.render("listings/edit.ejs", {
        listing,
        categories: categories.filter((c) => c.id !== "trending"),
    });
}));

//update route
router.put("/:id", isLoggedIn, isOwner, handleUpload, parseListingBody, saveImageUrl, validateListing, wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listingData = { ...req.body.listing };
    const cloudinaryUrl = getCloudinaryUrl(req.file);

    const existing = await Listing.findById(id);

    if (cloudinaryUrl) {
        listingData.image = cloudinaryUrl;
    } else if (!listingData.image || listingData.image.trim() === "") {
        listingData.image = existing.image;
    }

    if (
        listingData.location !== existing.location ||
        listingData.country !== existing.country
    ) {
        try {
            listingData.geometry = await geocodeListing(listingData.location, listingData.country);
        } catch (err) {
            console.error("Geocoding failed:", err.message);
        }
    }

    await Listing.findByIdAndUpdate(id, listingData);
    req.flash("success", "Listing Updated");
    res.redirect(`/${id}`);
}));

//delete route
router.delete("/:id",isLoggedIn, isOwner, wrapAsync(async (req, res) => {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted!");
    res.redirect("/");
}));

module.exports = router;