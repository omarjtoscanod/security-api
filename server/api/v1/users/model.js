const mongoose = require("mongoose");
const { body } = require("express-validator");
const { hash, compare } = require("bcryptjs");
const PasswordValidator = require("password-validator");

const valida = new PasswordValidator()
  .is()
  .min(8, "Password debe tener mínimo 8 carateres")
  .is()
  .max(100, "Password debe tener máximo 100 caracteres")
  .has()
  .uppercase(1, "Password debe contener mínimo una letra mayúscula")
  .has()
  .lowercase(1, "Password debe contener mínimo una letra minúscula")
  .has()
  .digits(1, "Password debe contener mínimo un número")
  .has()
  .symbols(1, "Password debe contener mínimo un caracter especial");

const { Schema } = mongoose;

const fields = {
  userName: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    maxlength: 32,
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    maxlength: 32,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    maxlength: 32,
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 8,
    maxlength: 100,
    validate: {
      validator(value) {
        return valida.validate(value);
      },
      message(props) {
        return `Debe contener mínimo 8 caracteres, 1 número, 1 minúscula, 1 mayúscula y 1 especial`;
      },
    },
  },
};

const protected = {
  enabled: {
    type: Boolean,
    default: true,
    required: true,
  },
};

const sanitizers = [
  body("userName").escape(),
  body("firstName").escape(),
  body("lastName").escape(),
  body("enabled").toBoolean(),
];

const user = new Schema(Object.assign({}, fields, protected), {
  timestamps: true,
  toJSON: {
    virtuals: true,
  },
  toObject: {
    virtuals: true,
  },
});

user.virtual("fullName").get(function () {
  return this.firstName + " " + this.lastName;
});

user.pre(["save"], async function (next) {
  if (this.isNew || this.isModified("password")) {
    this.password = await hash(this.password, 10);
  }
  next();
});

user.methods.toJSON = function () {
  const doc = this.toObject();
  delete doc.password;
  return doc;
};

user.methods.verifyPassword = function (password = "") {
  return compare(password, this.password);
};

module.exports = {
  Model: mongoose.model("user", user),
  fields,
  sanitizers,
};
