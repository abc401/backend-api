export const auth = {
    error: {
        loginRequired: "Please login to use this resource.",
        invalidAuthTokenProvided: "The provided auth token is invalid.",
        userDoesNotExist: "A user with the provided credentials does not exist."
    }
}

import { userNameLength, passwordLength } from "./config"
export const signUp = {
    error: {
        // Username errors
        userNameLength: `Username has to be at least ${userNameLength} characters long.`,

        // Password errors
        passwordLength: `Password has to be at least ${passwordLength} characters long.`,
        specialCharsInPassword: "Password must contain atleast one special character.",
        upperCharsInPassword: "Password must contain atleast one uppercase character.",
        lowerCharsInPassword: "Password must contain atleast one lowercase character.",
        digitsInPassword: "Password must contain atleast one digit.",

        // Email errors
        badEmail: "Please enter a valid email.",
        emailAlreadyUsed: "The provided email is already in use",
    },
    success: {
        userCreated: "User created successfully.",
    },
}