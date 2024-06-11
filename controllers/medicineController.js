const medicineModel = require('../models/medicineModel');
const userModel = require('../models/userModel.js')
const validation = require('../validator/validation');
const moment = require('moment');
const fs = require('fs');
const uploadFileOnCloudinary = require('../imageUpload/cloudinary.js')

// Add Medicine:
const addMedicine = async function (req, res) {
    try {
        const data = req.body;
        // Check if request body is empty 
        if (!validation.isEmpty(data)) {
            return res.status(400).send({ status: false, message: "Provide details to add medicine" });
        }

        // multer uploaded file inside req.file property
        const medicineImage = req.file.path;
        if (!medicineImage) {
            return res.status(400).send({ status: false, message: "Image of medicine is required" });
        }

        // Upload file in cloudinary
        const cloudinaryResponse = await uploadFileOnCloudinary(medicineImage);
        if (!cloudinaryResponse) {
            return res.status(500).send({ status: false, message: "Failed to upload image to Cloudinary" });
        }

        // Extract sellerId from accessToken 
        const sellerId = req.decodedToken.userId;
        const { category, medicineName, description, form, stockQuantity, price, currencyId,
            currencyFormat, expiryDate } = data;

        // Validate mandatory details
        if (!validation.checkData(category)) {
            return res.status(400).send({ status: false, message: "Category is required" })
        }
        if (!validation.checkData(medicineName)) {
            return res.status(400).send({ status: false, message: "Medicine name is required" });
        }
        // Check is provided medicine name already exist
        const isexistMedicine = await medicineModel.findOne({ medicineName: medicineName });
        if (isexistMedicine) {
            return res.status(409).send({ status: false, message: "Provided medicine name already exist" })
        }
        if (!validation.checkData(description)) {
            return res.status(400).send({ status: false, message: "Description is required" });
        }
        if (!validation.checkData(form)) {
            return res.status(400).send({ status: false, message: "Form is required" });
        }
        if (!["tablet", "capsule", "syrup"].includes(form)) {
            return res.status(400).send({ status: false, message: "Form only include tablet,capsule and syrup" });
        }
        if (!validation.checkData(stockQuantity)) {
            return res.status(400).send({ status: false, message: "stockQuantity is required" });
        }
        if (!validation.checkData(price)) {
            return res.status(400).send({ status: false, message: "Price is required" });
        }
        if (!validation.isValidPrice(price)) {
            return res.status(400).send({ status: false, message: "Enter a valid price" });
        }
        if (!validation.checkData(currencyId)) {
            return res.status(400).send({ status: false, message: "CurrencyId is required" });
        }
        if (!(/INR/.test(currencyId))) {
            return res.status(400).send({ status: false, message: " CurrencyId should be in 'INR' Format" });
        }
        if (!validation.checkData(currencyFormat)) {
            return res.status(400).send({ status: false, message: "CurrencyFormat is required" });
        }
        if (!(/₹/.test(currencyFormat))) {
            return res.status(400).send({ status: false, message: "Currency format of product should be in '₹' " });
        }

        // Parsing expiry date of medicine using moment.js
        const expiredDateofMedicine = moment(expiryDate, 'YYYY-MM-DD');
        if (!expiredDateofMedicine.isValid()) {
            return res.status(400).send({ status: false, message: "Invalid date format" });
        }

        // Prepare new medicine details
        const addnewMedicine = {
            seller: sellerId,
            category: category,
            medicineImage: cloudinaryResponse.url,
            medicineName: medicineName,
            description: description,
            form: form,
            stockQuantity: stockQuantity,
            price: price,
            currencyId: currencyId,
            currencyFormat: currencyFormat,
            expiryDate: expiredDateofMedicine,
            isDeleted: false,
            deletedAt: null
        }

        const addmedicineinDb = await medicineModel.create(addnewMedicine);
        return res.status(201).send({ status: true, message: "Medicine Added Successfully", data: addmedicineinDb })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    } finally {
        // Clean up the local image of medicine from your local system after processing
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
    }
}

// Get Medicine:
const getMedicine = async function (req, res) {
    try {
        let filter = req.query;
        let getData;
        // No filter provided, fetch all medicines that are not deleted
        if (Object.keys(filter.length === 0)) {
            getData = await medicineModel.find({ isDeleted: false });
        } else {
        // Filter provided, fetch medicines based on filter parameters
            getData = await medicineModel.find({ isDeleted: false }, { ...filter })
        }

        return res.status(200).send({ status: false, message: "Fetched detail successfully", data: getData });

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
}

// Update Medicine:
const updateMedicine = async function (req, res) {
    try {
        const medicineID = req.params.medicineId;
        if (!validation.checkObjectId(medicineID)) {
            return res.status(400).send({ status: false, message: " Invalid objectId " })
        }

        const isexistMedicine = await medicineModel.findById({ _id: medicineID });
        if (!isexistMedicine) {
            return res.status(400).send({ status: false, message: " Provided medicine objectId does not exist " })
        }

        const sellerId = isexistMedicine.seller;
        // Check authorization: Only the seller who listed the medicine can update it
        if (req.decodedToken.userId != sellerId) {
            return res.status(403).send({ status: false, message: " Unauthorized to update " })
        }

        // Only not deleted medicine can be updated 
        let updatedField = { isDeleted: false }

        // Check if seller updates medicine image
        if (req.file) {
            // multer uploaded file inside req.file property
            const medicineImage = req.file.path;
            // Upload file in cloudinary
            const cloudinaryResponse = await uploadFileOnCloudinary(medicineImage);
            if (!cloudinaryResponse) {
                return res.status(500).send({ status: false, message: " Failed to upload image to Cloudinary " });
            }
            updatedField.medicineImage = cloudinaryResponse.url;
        }

        // Check if request body is empty 
        if (!validation.isEmpty(req.body)) {
            return res.status(400).send({ status: false, message: "Provide details for update" });
        }
        const { category, medicineName, description, form, stockQuantity, price, currencyId,
            currencyFormat, expiryDate } = req.body;
        // Validate updated fields
        if (category) {
            const isexistCategory = await medicineModel.findOne({ category: category })
            if (isexistCategory) {
                return res.status(400).send({ status: false, message: " Cannot Update, category is already exist " })
            }
            updatedField.category = category;
        }
        if (medicineName) {
            //const isexistMedicine = await medicineModel.findOne({ medicineName: medicineName })
            const nameofMedicine = isexistMedicine.medicineName;
            if (medicineName === nameofMedicine) {
                return res.status(400).send({ status: false, message: " Cannot Update, medicine name is already exist " })
            }
            updatedField.medicineName = medicineName;
        }
        if (description) {
            updatedField.description = description;
        }
        if (form) {
            if (!["tablet", "capsule", "syrup"].includes(form)) {
                return res.status(400).send({ status: false, message: " Form only include tablet,capsule and syrup " })
            }
            updatedField.form = form;
        }
        if (stockQuantity) {
            updatedField.stockQuantity = stockQuantity;
        }
        if (price) {
            if (!validation.isValidPrice(price)) {
                return res.status(400).send({ status: false, message: " Enter a valid price" });
            }
            updatedField.price = price;
        }
        if (currencyId) {

            if (!(/INR/.test(currencyId))) {
                return res.status(400).send({ status: false, message: " CurrencyId should be in 'INR' Format" });
            }

            updatedField.currencyId = currencyId;
        }
        if (currencyFormat) {

            if (!(/₹/.test(currencyFormat))) {
                return res.status(400).send({ status: false, message: " Currency format of medicine should be in '₹' " });
            }

            updatedField.currencyFormat = currencyFormat
        }
        if (expiryDate) {
            // Parsing expiry date of medicine using moment.js
            const expiredDateofMedicine = moment(expiryDate, 'YYYY-MM-DD');
            if (!expiredDateofMedicine.isValid()) {
                return res.status(400).send({ status: false, message: " Invalid date format " });
            }
            updatedField.expiryDate = expiryDate;
        }

        const medicineUpdate = await medicineModel.findByIdAndUpdate({ _id: medicineID }, updatedField, { new: true });
        return res.status(200).send({ status: true, message: " Updated Successfully ", data: medicineUpdate });

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    } finally {
        // Clean up the local image of medicine from your local system after processing
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
    }
}

// Delete Medicine:
const deleteMedicine = async function (req, res) {
    try {
        const medicineID = req.params.medicineId;
        if (!validation.checkObjectId(medicineID)) {
            return res.status(400).send({ status: false, message: " Invalid objectId " })
        }

        const isexistMedicine = await medicineModel.findById({ _id: medicineID });
        if (!isexistMedicine) {
            return res.status(400).send({ status: false, message: " Provided medicine objectId does not exist " })
        }

        const sellerId = isexistMedicine.seller;
        // Check authorization: Only the seller who listed the medicine can delete it
        if (req.decodedToken.userId != sellerId) {
            return res.status(403).send({ status: false, message: " Unauthorized to update " })
        }

        if (isexistMedicine.isDeleted === false) {
            await medicineModel.findByIdAndUpdate({ _id: medicineID }, { $set: { isDeleted: true } })
        }

        return res.status(200).send({ status: true, message: "Deleted Successfully" })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
}



module.exports = { addMedicine, getMedicine, updateMedicine, deleteMedicine};