// @desc    Controllers for CRUD operations on bootcamps
const path = require('path');

const Bootcamp = require("../models/Bootcamp");
const handleAsync = require('../middleware/async');
const CustomError = require('../utils/customError');
const geocoder = require('../utils/geocoder');
const ENV = require('../config/env.config');

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
        // Check if user do not reached the limit of one bootcamp per user
        const isLimitReached = await Bootcamp.findOne({ user: req.user.id });
        if (isLimitReached && req.user.role !== 'admin') {
            return next(new CustomError('This user has already published a bootcamp', 403));
        }

        // Add current user as owner of the bootcamp and create the new bootcamp
        req.body.user = req.user.id;
        const bootcamp = await Bootcamp.create(req.body);

        res.status(201).json({ success: true, body: bootcamp });
    }),

    // Upload photo for bootcamp profile | PUT /api/v1/bootcamps/:id/photo | Privat
    uploadPhoto: handleAsync(async (req, res, next) => {
        const bootcamp = await Bootcamp.findById(req.params.id);
        if (!bootcamp) {
            return next(new CustomError('BOOTCAMP not found', 404));
        }
        // Check user ownership of the requested bootcamp
        if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return next(new CustomError('The user is not authorized to upload a photo for this bootcamp', 403));
        }

        // Check if any file is selected for upload
        if (!req.files) {
            return next(new CustomError('Select a file for upload', 400));
        }
        // Check if file selected is an `image/photo`
        const photo = req.files.photo;
        if (!photo.mimetype.startsWith('image')) {
            return next(new CustomError('Only image file are allowed to be uploaded'), 400);
        }
        // Check size of image to be less than maximum allowed
        if (photo.size > ENV.MAX_FILE_SIZE) {
            return next(new CustomError(`Only images less than ${ENV.MAX_FILE_SIZE_MB} MB are allowed`, 400));
        }
        // Rename the image file to avoid overwriting
        photo.name = `photo_${bootcamp.slug}${path.parse(photo.name).ext}`;
        // Save image file to the server
        photo.mv(`${ENV.FILE_UPLOAD_PATH}/${photo.name}`, async err => {
            if (err) {
                console.error(err);
                return next(new CustomError('Failed upload the image file', 500));
            }

            await Bootcamp.findByIdAndUpdate(req.params.id, { photo: photo.name });
        });


        res.status(200).json({
            success: true,
            body: photo.name
        });
    }),

    // Update a bootcamp by ID | PUT /api/v1/bootcamps/:id | Privat
    update: handleAsync(async (req, res, next) => {
        let bootcamp = await Bootcamp.findById(req.params.id);
        if (!bootcamp) {
            return next(new CustomError('BOOTCAMP not found', 404));
        }

        // Check user ownership of the requested bootcamp
        if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return next(new CustomError(`The user doesn't have access to update this bootcamp`, 403));
        }

        bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
            runValidators: true,
            new: true,
        });

        res.status(200).json({ success: true, body: bootcamp });
    }),

    // Delete a bootcamp by ID | DELETE /api/v1/bootcamps/:id | Privat
    delete: handleAsync(async (req, res, next) => {
        const bootcamp = await Bootcamp.findById(req.params.id);
        if (!bootcamp) {
            return next(new CustomError('BOOTCAMP not found', 404));
        }

        // Check user ownership of the requested boocamp
        if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return next(new CustomError(`The user doesn't have access to delete this bootcamp`, 403));
        }

        bootcamp.remove();
        res.status(200).json({ success: true, body: bootcamp })
    })
};

module.exports = bootcamps;
