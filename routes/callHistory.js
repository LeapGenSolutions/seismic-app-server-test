const express = require("express");
const router = express.Router();
const {
  insertCallHistory,
  fetchDoctorsFromCallHistory,
  fetchCallHistoryFromEmails
} = require("../services/callHistoryService");

router.get("/doctors", async (req, res) => {
  try {
    const item = await fetchDoctorsFromCallHistory();
    res.json(item);
  } catch (err) {
    res.status(404).json({ error: "Item not found" });
  }
});


router.post("/:id", async (req, res) => {
  const { id } = req.params;
  const reqBody = req.body;
  let errorMsg = "";
  try {
    if (!reqBody.userID) {
      errorMsg = "UserID is mandatory";
    }
    await insertCallHistory(id, reqBody);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: errorMsg || "Failed to Insert into DB" });
  }
});

// New route to handle multiple emails at once
router.get("/", async (req, res) => {
  const userIDsParam = req.query.userIDs;
  if (!userIDsParam) {
    return res.status(400).json({ error: "userIDs query parameter is required" });
  }
  const userIDs = userIDsParam.split(",").map(id => id.trim()).filter(Boolean);
  if (userIDs.length === 0) {
    return res.status(400).json({ error: "No valid userIDs provided" });
  }
  try {
    // You need to implement fetchCallHistoryFromEmails in your service
    const items = await fetchCallHistoryFromEmails(userIDs);
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch call history for provided userIDs" });
  }
});

module.exports = router;
