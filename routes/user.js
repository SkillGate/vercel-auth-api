const User = require("../models/User");
const { verifyToken } = require("./verifyToken");

const router = require("express").Router();
const CryptoJS = require("crypto-js");

//UPDATE
router.put("/:id", verifyToken, async (req, res) => {
  if (!req.params.id) {
    return res.status(400).json({ error: "ID is required" });
  }

  if (req.body.password) {
    req.body.password = CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SEC
    ).toString();
  }

  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );

    if (
      !updatedUser ||
      (Array.isArray(updatedUser) && updatedUser.length === 0)
    ) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put("/newly/:id", verifyToken, async (req, res) => {
  if (!req.params.id) {
    return res.status(400).json({ error: "ID is required" });
  }

  const experience = req.query["experience"];
  const education = req.query["education"];
  const projects = req.query["projects"];
  const awards = req.query["awards"];
  const volunteering = req.query["volunteering"];

  if (req.body.password) {
    req.body.password = CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SEC
    ).toString();
  }

  try {
    let updatedUser;
    if (experience) {
      updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $push: { experience: req.body },
        },
        { new: true }
      );
    } else if (education) {
      updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $push: { education: req.body },
        },
        { new: true }
      );
    } else if (projects) {
      updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $push: { projects: req.body },
        },
        { new: true }
      );
    } else if (awards) {
      updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $push: { awards: req.body },
        },
        { new: true }
      );
    } else if (volunteering) {
      updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $push: { volunteering: req.body },
        },
        { new: true }
      );
    }

    if (
      !updatedUser ||
      (Array.isArray(updatedUser) && updatedUser.length === 0)
    ) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

//UPDATE SPECIFC STATUS
router.put("/update/:id", verifyToken, async (req, res) => {
  if (!req.params.id) {
    return res.status(400).json({ error: "ID is required" });
  }

  const { type } = req.query;

  if (!type) {
    return res
      .status(400)
      .json({ error: "Type of data to update is required" });
  }

  const allowedTypes = [
    "experience",
    "education",
    "projects",
    "awards",
    "volunteering",
  ];
  if (!allowedTypes.includes(type)) {
    return res.status(400).json({ error: "Invalid type of data to update" });
  }

  try {
    let updatedUser;
    updatedUser = await User.findOneAndUpdate(
      { _id: req.params.id, [`${type}._id`]: req.body._id },
      {
        $set: { [`${type}.$`]: req.body },
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE SPECIFC STATUS
router.delete("/remove/:id", verifyToken, async (req, res) => {
  if (!req.params.id) {
    return res.status(400).json({ error: "ID is required" });
  }

  const { type, itemId } = req.query;

  if (!type) {
    return res
      .status(400)
      .json({ error: "Type of data to remove is required" });
  }

  const allowedTypes = [
    "experience",
    "education",
    "projects",
    "awards",
    "volunteering",
  ];
  if (!allowedTypes.includes(type)) {
    return res.status(400).json({ error: "Invalid type of data to remove" });
  }

  if (!itemId) {
    return res.status(400).json({ error: "Item ID to remove is required" });
  }

  try {
    let updatedUser;
    updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $pull: { [type]: { _id: itemId } },
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE
router.delete("/:id", verifyToken, async (req, res) => {
  if (!req.params.id) {
    return res.status(400).json({ error: "ID is required" });
  }

  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json("User has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET USER
router.get("/find/:id", verifyToken, async (req, res) => {
  if (!req.params.id) {
    return res.status(400).json({ error: "ID is required" });
  }

  try {
    const user = await User.findById(req.params.id);
    const { password, ...others } = user._doc;
    res.status(200).json(others);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET ALL USER
router.get("/", verifyToken, async (req, res) => {
  const query = req.query.new;
  try {
    const users = query
      ? await User.find().sort({ _id: -1 }).limit(5)
      : await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/email", verifyToken, async (req, res) => {
  console.log(req.body.email);
  try {
    const user = await User.find({ email: req.body.email });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET USER STATS
router.get("/stats", verifyToken, async (req, res) => {
  const date = new Date();
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

  try {
    const data = await User.aggregate([
      { $match: { createdAt: { $gte: lastYear } } },
      {
        $project: {
          month: { $month: "$createdAt" },
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: 1 },
        },
      },
    ]);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Endpoint for adding a job ID to apply_job_id_list
router.put("/apply/:userId", verifyToken, async (req, res) => {
  const { jobId } = req.body;
  const userId = req.params.userId;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  if (!jobId) {
    return res.status(400).json({ error: "Job ID is required" });
  }

  try {
    // Find the user by their ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Add the job ID to apply_job_id_list array
    user.apply_job_id_list.push(jobId);

    // Save the updated user
    const updatedUser = await user.save();

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET USER DETAILS BASE ON USER IDs
router.post("/users/details", async (req, res) => {
  const { candidateIds } = req.body;
  // const userIds = candidateIds.split(",");

  if (!candidateIds) {
    return res.status(404).json({ error: "Candidate Ids not found" });
  }

  try {
    const users = await User.find({ _id: { $in: candidateIds } });

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
