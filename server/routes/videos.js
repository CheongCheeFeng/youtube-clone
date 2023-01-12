import express from "express";
import {
  uploadVideo,
  updateVideo,
  deleteVideo,
  getVideo,
  increaseView,
  getTrendingVideos,
  getRandomVideos,
  getSubscribedVideos,
} from "../controllers/video.js";
import { verifyToken } from "../verifyToken.js";

const router = express.Router();

// upload video
router.post("/", verifyToken, uploadVideo);

// update video
router.put("/:id", verifyToken, updateVideo);

// delete video
router.delete("/:id", verifyToken, deleteVideo);

// get video
router.get("/find/:id", getVideo);

router.put("/view/:id", increaseView);

router.get("/trend", getTrendingVideos);

router.get("/random", getRandomVideos);

router.get("/subscribed", verifyToken, getSubscribedVideos);

export default router;
