import {body} from "express-validator";
import {AvailableUserRole} from "../utils/constants.js";
const userRegisterValidator = () => {
    return [
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required") // it is used to sort of check that the above method has error or not , if it has so then display the message.
        .isEmail()
        .withMessage("Email is invalid"),

    body("username")
        .trim()
        .notEmpty()
        .withMessage("Username is required")
        .isLowercase()
        .withMessage("Username must be in lowercase")
        .isLength({min:3})
        .withMessage("Username must be atleast 3 characters"),

    body("password")
        .trim()
        .notEmpty()
        .withMessage("Password is required"),

    body("fullName")
        .optional()
        .trim(),
        
        
    ]
}

const userLoginValidator = () =>{
    return [
        body("email")
        .optional()
        .isEmail()
        .withMessage("Email is invalid"),

        body("password")
        .notEmpty()
        .withMessage("Password is required")


    ];
}

const userChangeCurrentPasswordValidator = () => {
    return [
        body("oldPassword").notEmpty().withMessage("Old password is required"),

        body("newPassword").notEmpty().withMessage("New password is required")
    ];
}

const userForgotPasswordValidator = () => {
    return [
        body("email")
            .notEmpty()
            .withMessage("Email is required")
            .isEmail()
            .withMessage("Email is invalid")
    ]

}
const userResetForgotPasswordValidator = () => {
    return [
        body("newPassword")
        .notEmpty()
        .withMessage("Password is required")
    ]
}

const createProjectValidator = () => {
    return [
        body("name")
        .notEmpty()
        .withMessage("Name is required."),
        body("description")
        .optional()
    ]
}
const addMemberstoProjectValidator = () => {
    return [
        body("email")
            .trim()
            .notEmpty()
            .withMessage("Email is required.")
            .isEmail()
            .withMessage("Email is invalid"),
        body("role")
            .notEmpty()
            .withMessage("Role is required")
            .isIn(AvailableUserRole)
            .withMessage("Role is invalid")
            ]

}
export {
    userRegisterValidator,
    userLoginValidator,
    userChangeCurrentPasswordValidator,
    userForgotPasswordValidator,
    userResetForgotPasswordValidator,
    createProjectValidator,
    addMemberstoProjectValidator


};


//MIDDLEWARE AND VALIDATION IS DONE BUT NOBODY IS READING OUR THESE THINGS SO OUR MIDDLEWARE AND VALIDATIONS WILL GO INTO ROUTES

 // pehle we make middleware who collects the errors and then we make validations which we want to have and then to display those we indulge in in our routers  but the process goes 
// .post(userRegisterValidator, middleware , registerUser) so basically validations their work and all those errors get collected through middleware and it shows error if needed and then the registring the user part happens...