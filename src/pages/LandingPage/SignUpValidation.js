const yup = require("yup");

const SignUpValidation = yup.object().shape({
    email: yup.string()
    .email("Invalid email")
    .required("Required!"),
    dob: yup
    .date("Invalid Date")
    .required("Required"),
    password: yup.string()
    .min(5, "Password is too short!")
    .max(20, "Password is too long!")
    .required("Required!"),
});

export default SignUpValidation;
