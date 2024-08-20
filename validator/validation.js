// validation functions:
const mongoose = require('mongoose')
// Checks if an object is not empty by verifying if it contains any keys
const isEmpty = (data) => { return Object.keys(data).length > 0 };

// Checks if a value is a non-empty string
const checkData = (data) => { return data.length > 0 || typeof (data) === String };

// Validates a name to ensure it contains only letters(small & capital) and space is allowed
const checkName = (name) => /^[A-Za-z\s]+$/.test(name);

// Validates an email address using a regular expression
const checkEmail = (email) => { return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email) };

// Validates a password to ensure it contains at least one lowercase letter, one uppercase letter, one digit, and one special character. 
// The password must be at least 8 characters long with no maximum length restriction.
const checkPassword = (password) => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]).{8,}$/.test(password);
};

// Validates a mobile number to ensure it starts with a digit from 6 to 9, followed by exactly 9 digits
//  (any digit from 0 to 9) with a total length of 10 digits.
const checkMobile = (mobileNumber) => { return /^[6-9]\d{9}$/.test(mobileNumber) }

// Validate that the pincode must be of 6 digits long, starting with a digit from 1-9.
// Optionally, it can start with a plus sign (+).
const isValidPincode = (pincode) => { return (/^\+?([1-9]{1})\)?([0-9]{5})$/.test(pincode)); }

// Validates input to ensure it consists only of numbers and optional spaces.
const validateInput = (input) => /^[0-9\s]+$/.test(input);

// Validates if the input string represents a valid price in a standard format.
// Examples of valid prices: "100", "1,000", "10,000.00", "99.99".
// Examples of invalid prices: "10.123", "1,00", "abc", "-10.50".
const isValidPrice =(price) => {return (/^\d+(,\d{3})*(\.\d{1,2})?$/.test(price))}


// Validates a MongoDB ObjectId using mongoose.isValidObjectId().
const checkObjectId = (id) => { return mongoose.isValidObjectId(id); }

module.exports = {
    isEmpty, checkData, checkName, checkEmail, checkPassword, validateInput, checkMobile, isValidPincode,
    isValidPrice, checkObjectId
}