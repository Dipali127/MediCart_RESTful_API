const mongoose = require('mongoose')

//....................................................validation functions.............................................

//Checks if an object is not empty by verifying if it contains any keys
const isEmpty = (data) => !data || Object.keys(data).length === 0;

//Checks if a value is a non-empty string
const checkData = (data) => { return typeof data === 'string' && data.trim().length > 0 };

//Validates a name to ensure it contains only letters(small & capital) and space is allowed
const checkName = (name) => /^[A-Za-z\s]+$/.test(name);

//Validates an email address using a regular expression
const checkEmail = (email) => { return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email) };

//Password must contain one small letter, one capital letter, one digit and one special character.
//Length of password should be a minimum of 8 characters
const checkPassword = (password) => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]).{8,}$/.test(password);
};

//Validates a mobile number to ensure it contains only digits and have a fixed 10 digits
const validateMobile = (input) => /^[0-9]{10}$/.test(input);

//Validates input to ensure it consists only of numbers and optional spaces.
const validateInput = (input) => /^[0-9\s]+$/.test(input);

//Validates if the input string represents a valid price in a standard format.
//Examples of valid prices: "100", "1,000", "10,000.00", "99.99".
//Examples of invalid prices: "10.123", "1,00".
const isValidPrice =(price) => {return (/^\d+(,\d{3})*(\.\d{1,2})?$/.test(price))}


//Validates a MongoDB ObjectId using mongoose.isValidObjectId().
const checkObjectId = (id) => { return mongoose.isValidObjectId(id); }

module.exports = {
    isEmpty, checkData, checkName, checkEmail, checkPassword, validateInput, validateMobile,
    isValidPrice, checkObjectId
}