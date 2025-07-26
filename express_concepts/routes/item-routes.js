const express = require("express");
const router = express.Router();
const { asyncHandler, APIerror } = require("../middleware/errorHandler");

const item = [
  {
    id: 1,
    name: "item 1",
  },
  {
    id: 2,
    name: "item 2",
  },
  {
    id: 3,
    name: "item 3",
  },
  {
    id: 4,
    name: "item 4",
  },
  {
    id: 5,
    name: "item 5",
  },
  {
    id: 6,
    name: "item 6",
  },
];

router.get(
  "/items",
  asyncHandler(async (req, res) => {
    res.json(item);
  })
);

router.post(
  "/items",
  asyncHandler(async (req, res) => {

    // Check if req.body exists first, then check for name
    if (!req.body || !req.body.name) {
      throw new APIerror("Item name is required! Please add a name", 400);
    }
    const newItem = {
      id: item.length + 1,
      name: req.body.name,
    };
    item.push(newItem);
    res.status(201).json({ item });
  })
);
module.exports = router;
