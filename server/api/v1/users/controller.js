const { Model } = require("./model");
const { signToken } = require("./../auth/controller");

exports.create = async (req, res, next) => {
  const { body } = req;
  const { userName = "", firstName = "", lastName = "", password = "" } = body;

  const user = {
    userName,
    firstName,
    lastName,
    password,
  };

  const document = new Model(user);

  try {
    const data = await document.save({ validateBeforeSave: true });
    res.json({
      data,
    });
  } catch (error) {
    next(error);
  }
};

exports.id = async (req, res, next) => {
  const { params = {} } = req;
  const { id = "" } = params;

  try {
    const data = await Model.findById(id).exec();

    if (data) {
      req.doc = data;
      next();
    } else {
      next({
        statusCode: 404,
        message: "Document not found",
      });
    }
  } catch (error) {
    next(error);
  }
};

exports.read = (req, res, next) => {
  const { doc = {} } = req;

  res.json({
    data: doc,
  });
};

exports.signIn = async (req, res, next) => {
  const { body = {} } = req;
  const { username = "", password = "" } = body;

  const document = await Model.findOne({ username });

  if (document) {
    const userIsEnabled = document.enabled;

    if (userIsEnabled === false) {
      return next({ message: "User is not enabled.", statusCode: 401 });
    }

    const verified = await document.verifyPassword(password);
    if (verified) {
      const payload = {
        id: document._id,
      };
      const token = signToken(payload);

      res.json({
        data: document,
        meta: {
          token,
        },
      });
    } else {
      next({
        message: "Username or password are incorrect",
      });
    }
  } else {
    next({
      message: "Username or password are incorrect",
    });
  }
};
