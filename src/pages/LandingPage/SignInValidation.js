const yup = require("yup");

const SignInValidation = yup.object().shape({
    email: yup
    .string()
    .email("Invalid email")
    .required("Required!"),
    password: yup
    .string()
    .required("Required!"),
});

export default SignInValidation;