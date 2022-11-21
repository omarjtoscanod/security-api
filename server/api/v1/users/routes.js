const express = require("express");
// eslint-disable-next-line
const router = express.Router();
const controller = require("./controller");
const { sanitizers } = require("./model");

const auth = require("./../auth/controller");

/*
 * /api/v1/users/signin POST login
 * /api/v1/users       POST Create
 */

router.route("/signin").post(controller.signIn);

router.route("/").post(sanitizers, controller.create);

router.param("id", controller.id);

router.route("/:id").get(auth.auth, controller.read);

module.exports = router;
