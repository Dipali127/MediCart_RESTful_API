const userModel = require('../models/userModel.js');
const validation = require('../validator/validation');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

// Signup user:
const signUp = async function (req, res) {
    try {
        const data = req.body;
        if (!validation.isEmpty(data)) {
            return res.status(400).send({ status: false, message: "Provide details for registration" });
        }

        const { firstName, lastName, email, password, mobileNumber, role } = data;
        if (!validation.checkData(firstName)) {
            return res.status(400).send({ status: false, message: "firstName is required" })
        }
        if (!validation.checkName(firstName)) {
            return res.status(400).send({ status: false, message: "Invalid firstName" })
        }
        if (!validation.checkData(lastName)) {
            return res.status(400).send({ status: false, message: "lastName is required" })
        }
        if (!validation.checkName(lastName)) {
            return res.status(400).send({ status: false, message: "Invalid lastName" })
        }
        if (!validation.checkData(email)) {
            return res.status(400).send({ status: false, message: "Email is  required" })
        }
        if (!validation.checkEmail(email)) {
            return res.status(400).send({ status: false, message: "Invalid email" })
        }
        const existingEmail = await userModel.findOne({ email: email });
        if (existingEmail) {
            return res.status(409).send({ status: false, message: "The provided email already exists" })
        }
        if (!validation.checkData(password)) {
            return res.status(400).send({ status: false, message: "Password is required" });
        }

        if (!validation.checkPassword(password)) {
            return res.status(400).send({ status: false, message: "Invalid password" });
        }

        // Hash the password before saving it in database
        const encryptPassword = await bcrypt.hash(password, 10)

        if (!validation.checkData(mobileNumber)) {
            return res.status(400).send({ status: false, message: "MobileNumber is required" });
        }
        if (!validation.checkMobile(mobileNumber)) {
            return res.status(400).send({ status: false, message: "Invalid mobile number format" });
        }
        const uniqueMobile = await userModel.findOne({ mobileNumber: mobileNumber });
        if (uniqueMobile) {
            return res.status(409).send({ status: false, message: "Provided mobile number already exist" });
        }

        // Prepare the new user (buyer or seller) details with the encrypted password
        const newDetails = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: encryptPassword,
            mobileNumber: mobileNumber,
            role: role ? role : 'buyer'
        }

        const createUser = await userModel.create(newDetails);
        return res.status(201).send({ status: true, message: "User registered successfully", data: createUser })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
}

const signIn = async function (req, res) {
    try {
        const data = req.body;
        if (!validation.isEmpty(data)) {
            return res.status(400).send({ status: false, message: "Provide email and password for login" });
        }

        const { email, password } = data;
        if (!validation.checkData(email)) {
            return res.status(400).send({ status: false, message: "Provide email for login" })
        }
        if (!validation.checkEmail(email)) {
            return res.status(400).send({ status: false, message: "Invalid email" });
        }

        const isemailExist = await userModel.findOne({ email: email });
        if (!isemailExist) {
            return res.status(404).send({ status: false, message: "Email not found" });
        }
        if (!validation.checkData(password)) {
            return res.status(400).send({ status: false, message: "Provide password for login" });
        }
        if (!validation.checkPassword(password)) {
            return res.status(400).send({ status: false, message: "Invalid password" });
        }

        // Compare hashedPassword with the buyer or seller provided password
        const comparePassword = await bcrypt.compare(password, isemailExist.password);
        if (!comparePassword) {
            return res.status(404).send({ status: false, message: "Incorrect password" })
        }

        // Generate token
        const token = jwt.sign({
            userId: isemailExist._id.toString(),
            role: isemailExist.role
        }, process.env.SECRET_KEY, { expiresIn: "1h" })

        res.set('Authorization', `Bearer ${token}`);

        return res.status(200).send({ status: true, message: "Login successfully", data: token })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
}

// address of user(buyer):
const addressofUser = async function (req, res) {
    try {
        const address = req.body;
        if (!validation.isEmpty(address)) {
            return res.status(400).send({ status: false, message: "Provide details of address" });
        }

        const { state, city, pincode, street } = address;
        if (!validation.checkData(state)) {
            return res.status(400).send({ status: false, message: "State is required" })
        }
        if (!validation.checkData(city)) {
            return res.status(400).send({ status: false, message: "City is required" })
        }
        if (!validation.checkData(pincode)) {
            return res.status(400).send({ status: false, message: "Pincode is required" })
        }
        if (!validation.isValidPincode(pincode)) {
            return res.status(400).send({ status: false, message: "Invalid pincode" })
        }
        if (!validation.checkData(street)) {
            return res.status(400).send({ status: false, message: "Street is required" })
        }
        // Retrieve userId from decoded token
        const userId = req.decodedToken.userId;

        // Update buyer's address in the database
        const addAddress = await userModel.findOneAndUpdate({ _id: userId },
             { $set: { address: address } },
              { new: true })
        return res.status(200).send({ status: true, message: "address added", data: addAddress });

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
}

module.exports = { signUp, signIn, addressofUser }