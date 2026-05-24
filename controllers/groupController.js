const Group = require("../models/Group");

// CREATE GROUP
const createGroup = async (req, res) => {
  try {
    const { name, members, admin } =
      req.body;

    const group = await Group.create({
      name,
      members,
      admin,
    });

    res.status(201).json(group);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// GET GROUPS
const getGroups = async (req, res) => {
  try {
    const groups = await Group.find()
      .populate("members", "name email")
      .populate("admin", "name");

    res.json(groups);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

module.exports = {
  createGroup,
  getGroups,
};