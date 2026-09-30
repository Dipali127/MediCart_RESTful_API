const medicineModel = require("../models/medicineModel");
const validation = require("../validator/validation");
const moment = require("moment");
const fs = require("fs");
const uploadFileOnCloudinary = require("../imageUpload/cloudinary.js");

//Helper function to delete locally stored file
function deleteLocalFile(filePath) {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}

//Add Medicine:
const addMedicine = async function (req, res) {
  try {
    const data = req.body;
    if (validation.isEmpty(data)) {
      return res.status(400).send({ status: false, message: "Provide details to add medicine" })
    }

    //multer uploaded file inside req.file property
    if (!req.file) {
      return res.status(400).send({ status: false, message: "Image of medicine is required" });
    }

    const sellerId = req.decodedToken.userId;

    const {
      category,
      medicineName,
      description,
      form,
      price,
      expiryDate
    } = data;

    if (!validation.checkData(category)) {
      return res.status(400).send({ status: false, message: "Category is required" })
    }

    if (!validation.checkData(medicineName)) {
      return res.status(400).send({ status: false, message: "Medicine name is required" })
    }

    const isexistMedicine = await medicineModel.findOne({ seller: sellerId, medicineName: medicineName })

    if (isexistMedicine) {
      return res.status(409).send({ status: false, message: "Provided medicine name already exist" })
    }

    if (!validation.checkData(description)) {
      return res.status(400).send({ status: false, message: "Description is required" })
    }

    if (!validation.checkData(form)) {
      return res.status(400).send({ status: false, message: "Form is required" })
    }

    if (!["tablet", "capsule", "syrup"].includes(form)) {
      return res.status(400).send({
        status: false, message: "Form only include tablet, capsule and syrup"
      })
    }

    if (!validation.checkData(price)) {
      return res.status(400).send({ status: false, message: "Price is required" })
    }

    if (!validation.isValidPrice(price)) {
      return res.status(400).send({ status: false, message: "Enter a valid price" })
    }

    if (!expiryDate) {
      return res.status(400).send({ status: false, message: "expiry date of medicine is required" })
    }

    //Parsing expiry date of medicine using moment.js
    let expiredDateofMedicine = moment(expiryDate, "YYYY-MM-DD", true);

    if (!expiredDateofMedicine.isValid()) {
      return res.status(400).send({ status: false, message: "Invalid date format" });
    }

    //Get the current date
    const currentDate = moment();

    if (!expiredDateofMedicine.isAfter(currentDate)) {
      return res.status(400).send({ status: false, message: "Expiry date of medicine must be in future" });
    }

    const medicineImage = req.file.path;

    //Upload to Cloudinary
    let attempts = 0, maxAttempt = 3;
    let cloudinaryResponse;

    while (attempts < maxAttempt) {
      cloudinaryResponse = await uploadFileOnCloudinary(medicineImage);

      if (cloudinaryResponse) {
        break;
      }

      attempts++;
    }

    if (!cloudinaryResponse) {
      deleteLocalFile(medicineImage);
      return res.status(500).send({
        status: false,
        message: "Failed to upload medicine image to Cloudinary after 3 attempts"
      });
    }

    deleteLocalFile(medicineImage);

    //Prepare new medicine details
    const addnewMedicine = {
      seller: sellerId,
      category: category,
      medicineImage: cloudinaryResponse.url,
      medicineName: medicineName,
      description: description,
      form: form,
      price: price,
      expiryDate: expiredDateofMedicine,
      isDeleted: false
    };

    const addmedicineinDb = await medicineModel.create(addnewMedicine);

    return res.status(201).send({ status: true, message: "Medicine Added Successfully", data: addmedicineinDb })

  } catch (error) {
    //Delete locally stored file if an unexpected error occurs
    if (req.file?.path) {
      deleteLocalFile(req.file.path);
    }
    return res.status(500).send({ status: false, message: error.message });
  }
};

//Get Medicine:
const getMedicine = async function (req, res) {
  try {
    //Extract query parameters from the request
    let filter = req.query;

    //Pagination:
    let page = Number(filter.page);
    let limit = Number(filter.limit);

    if (filter.page !== undefined && (!Number.isInteger(page) || page < 1)) {
      return res.status(400).send({ status: false, message: "Page must be a positive integer" });
    }

    if (filter.limit !== undefined && (!Number.isInteger(limit) || limit < 1)) {
      return res.status(400).send({ status: false, message: "Limit must be a positive integer" });
    }

    page = page || 1;
    limit = limit || 2;
    let skip = (page - 1) * limit;

    let query = { isDeleted: false };

    //Filter provided, fetch medicines based on filter parameters
    const { medicineName, category } = filter;
    if (medicineName) {
      query.medicineName = medicineName;
    }

    if (category) {
      query.category = category;
    }

    let getData = await medicineModel.find(query).skip(skip).limit(limit);

    if (getData.length === 0) {
      return res.status(404).send({ status: false, message: "No medicines found" })
    }

    return res.status(200).send({ status: true, message: "Fetched detail successfully", data: getData })

  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

//Update Medicine:
const updateMedicine = async function (req, res) {
  try {
    const medicineID = req.params.medicineId;

    if (!validation.checkObjectId(medicineID)) {
      return res.status(400).send({ status: false, message: "Invalid medicineId" });
    }

    const isexistMedicine = await medicineModel.findById(medicineID);

    if (!isexistMedicine) {
      return res.status(404).send({ status: false, message: "Medicine not found" })
    }

    if (isexistMedicine.isDeleted === true) {
      return res.status(400).send({ status: false, message: "Deleted medicine cannot be updated" });
    }

    const sellerId = isexistMedicine.seller;

    //Check authorization: Only the seller who created the medicine can update it
    if (req.decodedToken.userId !== sellerId.toString()) {
      return res.status(403).send({ status: false, message: "Unauthorized to update" })
    }

    let updatedField = {};

    //Handle other fields to update
    const {
      category,
      medicineName,
      description,
      form,
      price,
      expiryDate,
    } = req.body;

    if (category) {
      updatedField.category = category;
    }

    if (medicineName) {
      updatedField.medicineName = medicineName;
    }

    if (description) {
      updatedField.description = description;
    }

    if (form) {
      if (!["tablet", "capsule", "syrup"].includes(form)) {
        return res.status(400).send({ status: false, message: "Form only include tablet,capsule and syrup" });
      }
      updatedField.form = form;
    }

    if (price) {
      if (!validation.isValidPrice(price)) {
        return res.status(400).send({ status: false, message: "Enter a valid price" })
      }
      updatedField.price = price;
    }

    if (expiryDate) {
      //Parse and validate the expiry date
      const expiredDateofMedicine = moment(expiryDate, "YYYY-MM-DD", true);

      if (!expiredDateofMedicine.isValid()) {
        return res.status(400).send({ status: false, message: "Invalid date format" });
      }

      //Get the current date
      const currentDate = moment();

      if (!expiredDateofMedicine.isAfter(currentDate)) {
        return res.status(400).send({ status: false, message: "Expiry date of medicine must be in the future" });
      }

      updatedField.expiryDate = expiredDateofMedicine;
    }

    //Handle medicine image update
    if (req.file) {
      //multer uploaded file inside req.file property
      const medicineImage = req.file.path;

      let attempt = 0, maxAttempt = 3, cloudinaryResponse;
      while (attempt < maxAttempt) {
        //Upload file in cloudinary
        cloudinaryResponse = await uploadFileOnCloudinary(medicineImage);
        if (cloudinaryResponse) {
          break;
        }
        attempt++;
      }

      if (!cloudinaryResponse) {
        deleteLocalFile(medicineImage)
        return res.status(500).send({ status: false, message: "Failed to upload image to Cloudinary" });
      }

      //After cloudinary successfully uploaded medicineImage to cloud storage, remove locally stored 
      //medicine image.
      deleteLocalFile(medicineImage);
      //Store hosted URL of uploaded image file returned by cloudinary server to database.
      updatedField.medicineImage = cloudinaryResponse.url;
    }

    const medicineUpdate = await medicineModel.findByIdAndUpdate({ _id: medicineID }, updatedField, { new: true });

    return res.status(200).send({ status: true, message: "Updated Successfully", data: medicineUpdate })

  } catch (error) {
    //Delete locally stored file if an unexpected error occurs
    if (req.file?.path) {
      deleteLocalFile(req.file.path);
    }

    return res.status(500).send({ status: false, message: error.message })
  }
};

//Delete Medicine:
const deleteMedicine = async function (req, res) {
  try {
    const medicineID = req.params.medicineId;
    if (!validation.checkObjectId(medicineID)) {
      return res.status(400).send({ status: false, message: "Invalid medicineId" });
    }

    const isexistMedicine = await medicineModel.findById(medicineID);
    if (!isexistMedicine) {
      return res.status(404).send({ status: false, message: "Medicine not found" })
    }

    if (isexistMedicine.isDeleted === true) {
      return res.status(400).send({ status: false, message: "Medicine is already deleted" })
    }

    const sellerId = isexistMedicine.seller;
    //Check authorization: Only the seller who created the medicine can delete it
    if (req.decodedToken.userId !== sellerId.toString()) {
      return res.status(403).send({ status: false, message: "Unauthorized to delete" })
    }

    await medicineModel.findByIdAndUpdate({ _id: medicineID }, { $set: { isDeleted: true } });

    return res.status(200).send({ status: true, message: "Medicine deleted successfully" })

  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

module.exports = { addMedicine, getMedicine, updateMedicine, deleteMedicine };
