const yup = require("yup");

const Validation = yup.object().shape({
    Epassword: yup.string()
    .min(5, "Password is too short!")
    .max(20, "Password is too long!")
    .required("Required!"),
    Npassword: yup.string()
    .min(5, "Password is too short!")
    .max(20, "Password is too long!")
    .required("Required!"),
});

export default Validation;
