const express = require("express");
const router = express.Router();
const groupController = require("../controller/group");
const { validateToken } = require("../middlewares/auth");

router.post("/create-group", validateToken, groupController.createGroup);
router.get("/group-info", validateToken, groupController.getGroupInfo);
router.post(
  "/add-group-member/:groupID",
  validateToken,
  groupController.addMember
);
router.get(
  "/group-info/:groupID",
  validateToken,
  groupController.getSpecificGroupInfo
);

router.put(
  "/rename-group/:groupID",
  validateToken,
  groupController.renameGroup
);
router.put(
  "/admin-status/:groupID",
  validateToken,
  groupController.memberAdminStatus
);
router.delete(
  "/remove-member/:groupID",
  validateToken,
  groupController.removeGroupMember
);
router.delete(
  "/delete-group/:groupID",
  validateToken,
  groupController.deleteGroup
);

router.get(
  "/all-group-messages/:groupID",
  validateToken,
  groupController.getAllGroupMessage
);

module.exports = router;
