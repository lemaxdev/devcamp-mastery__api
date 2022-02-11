// @desc    Controllers for CRUD operations on bootcamps
const Bootcamp = require("../models/Bootcamp");
const handleAsync = require('../middleware/async');
const CustomError = require('../utils/customError');
const geocoder = require('../utils/geocoder');

const bootcamps = {
    // Retrieve all the bootcamps | GET /api/v1/bootcamps | Public
    getAll: handleAsync(async (req, res) => {
        res.status(200).json(res.filterResults);
    }),

    // Retrieve a bootcamp by ID | GET /api/v1/bootcamps/:id | Public
    getById: handleAsync(async (req, res, next) => {
        const bootcamp = await Bootcamp.findById(req.params.id).populate({
            path: 'courses',
            select: 'title description -bootcamp'
        });
        if (!bootcamp) {
            return next(new CustomError('BOOTCAMP not found', 404));
        }

        res.status(200).json({
            success: true,
            body: bootcamp
        })
    }),

    // Get bootcamps within a radius | GET /api/v1/bootcamps/radius/:zipcode/:distance | Privat
    getByDistance: handleAsync(async (req, res, next) => {
        const { zipcode, distance } = req.params;
        // Get the longitude and latitude
        const loc = await geocoder.geocode(zipcode);
        const longitude = loc[0].longitude;
        const latitude = loc[0].latitude;
        // Calculate the radius > divide distance by radius of Earth | 3963 miles / 6378 km
        const radius = distance / 6378 // for km in metric system

        //Fetch bootcamps within radius calculated above
        const bootcamps = await Bootcamp.find({
            location: { $geoWithin: { $centerSphere: [[longitude, latitude], radius] } }
        })

        res.status(200).json({
            success: true,
            count: bootcamps.length,
            body: bootcamps
        })
    }),

    // Add a new bootcamp | POST /api/v1/bootcamps | Privat
    create: handleAsync(async (req, res, next) => {
        const bootcamp = await Bootcamp.create(req.body);

        res.status(201).json({
            success: true,
            body: bootcamp
        });
    }),

    // Update a bootcamp by ID | PUT /api/v1/bootcamps/:id | Privat
    update: handleAsync(async (req, res, next) => {
        const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!bootcamp) {
            return next(new CustomError('BOOTCAMP not found', 404));
        }

        res.status(200).json({
            success: true,
            body: bootcamp
        });
    }),

    // Delete a bootcamp by ID | DELETE /api/v1/bootcamps/:id | Privat
    delete: handleAsync(async (req, res, next) => {
        const bootcamp = await Bootcamp.findById(req.params.id);
        if (!bootcamp) {
            return next(new CustomError('BOOTCAMP not found', 404));
        }
        bootcamp.remove();

        res.status(200).json({
            success: true,
            body: bootcamp
        })
    })
};

module.exports = bootcamps;
