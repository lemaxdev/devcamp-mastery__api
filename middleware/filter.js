const handleAsync = require('./async');

const filterResults = (Model, populate) => handleAsync(async (req, res, next) => {
    // Format query with mongoose operators <$gt, $lt, etc>
    let filtering = JSON.stringify(req.query);
    filtering = filtering.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    // Finding the resource that corresponds to the above filters
    let query = Model.find(JSON.parse(filtering));

    // Apply 'select' and 'sort' filters IF those are available
    if (req.query.select) {
        const selectQuery = req.query.select.split(',').join(' ');
        query = query.select(selectQuery);
    }
    if (req.query.sort) {
        const sortQuery = req.query.sort.split(',').join(' ');
        query = query.sort(sortQuery);
    } else {
        // If 'sort' filter is not provided, sort default by the newest
        query = query.sort('-createdAt');
    }

    // PAGINATION SYSTEM, using 'page' and 'limit' passed in query
    // By DEFAULT, start always from 'page' 1 with a 'limit' of 25 items per page
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit;
    // Apply pagination and populate(if is required) to the query
    query = query.skip(startIndex).limit(limit);
    if (populate) {
        query = query.populate(populate);
    }
    // Execute the query
    const results = await query;

    // Format pagination object to send it in response
    const endIndex = page * limit;
    const totalItems = await Model.countDocuments();
    const pages = Math.ceil(totalItems / limit);
    const pagination = {
        current_page: page,
        next_page: null,
        prev_page: null,
        total_pages: pages,
        limit,
    };
    // Check if exist a next page or a previous page and add to the pagination result
    if (endIndex < totalItems) {
        pagination.next_page = page + 1;
    }
    if (startIndex > 0) {
        pagination.prev_page = page - 1;
    }

    // Create an object on res object that we can use within any routes that use this middleware
    res.filterResults = {
        success: true,
        pagination: totalItems >= limit ? pagination : false,
        count: results.length,
        body: results
    }
    next();
});

module.exports = filterResults;