const User = require("../models/userSchema");
const Joi = require("joi");
const jwt = require("jsonwebtoken");

const schemaLogin = Joi.object({
    password: Joi.string().min(10).required(),
    email: Joi.string().email().required(),
    subscription: Joi.string().valid("starter", "pro", "business").default("starter"),
    token: Joi.string().default(null),
  });

const register = async (req, res, next) => {
  const { email, password } = req.body;

  const { error } = schemaLogin.validate({email, password });
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    try {
        const user = await User.findOne({ email }).lean();

        if (user) {
            return res.status(409).json({ message: 'This email is already taken' });
        }

        const newUser = new User({ email });
        await newUser.setPassword(password);
        await newUser.save();

      return res.status(201).json(
        {
          "user": {
            "email": email,
            "subscription": "starter",
            }
        });
    } catch (error) {
        next(error);
    }
};

const login = async (req, res, next) => {
  
  const { email, password } = req.body;
  const { error } = schemaLogin.validate({ email, password });
  const user = await User.findOne({ email })
  
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
  
  if (!user){
    return res.status(401).json({message: "User not found"})
  }

  const isPasswordCorrect = await user.validatePassword(password)

  if (isPasswordCorrect) {
      const payload = { id: user._id, }
    const token = jwt.sign(
      payload,
      process.env.SECRET,
      {expiresIn: '12h'}
    )

    await user.setToken(token);
    await user.save();

    return res.json({token})
  } else {
    return res.status(401)
              .json({message: "Wrong password"})
  }
};

const logout = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
  
      user.token = null;
      await user.save();
      console.log("Logged out")
      return res.status(204).send();
      
    } catch (err) {
      next(err);
    }
  };
    
  const current = async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
      return res.status(200).json({ email: user.email, subscription: user.subscription });
    } else {
      return res.status(401).json({ message: "Not authorized" });
    }
  };

module.exports = {
  register,
  login,
  logout,
  current,
};