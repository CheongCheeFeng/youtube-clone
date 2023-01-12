import { createError } from "../error.js";
import User from "../models/User.js";
import Video from "../models/Video.js";

export const uploadVideo = async (req, res, next) => {
  const newVideo = new Video({ userId: req.user.id, ...req.body });
  try {
    const savedVideo = await newVideo.save();
    res.status(200).json(savedVideo);
  } catch (err) {
    next(err);
  }
};

export const updateVideo = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return next(createError(404, "Video not found!"));
    if (video.userId === req.user.id) {
      const updatedVideo = await Video.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      );
      res.status(200).json(updatedVideo);
    } else {
      next(createError(403, "You can only update your video!"));
    }
  } catch (err) {
    next(err);
  }
};

export const deleteVideo = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return next(createError(404, "Video not found!"));
    if (video.userId === req.user.id) {
      await video.delete();
      res.status(200).json("Video has been deleted...");
    } else {
      next(createError(403, "You can only delete your video!"));
    }
  } catch (err) {
    next(err);
  }
};

export const getVideo = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return next(createError(404, "Video not found!"));
    res.status(200).json(video);
  } catch (err) {
    next(err);
  }
};

export const increaseView = async (req, res, next) => {
  try {
    await Video.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });

    res.status(200).json("The views increased");
  } catch (err) {
    next(err);
  }
};

export const getRandomVideos = async (req, res, next) => {
  try {
    const videos = await Video.aggregate([{ $sample: { size: 40 } }]);
    res.status(200).json(videos);
  } catch (err) {
    next(err);
  }
};

export const getTrendingVideos = async (req, res, next) => {
  try {
    const videos = await Video.find().sort({ views: -1 });
    res.status(200).json(videos);
  } catch (err) {
    next(err);
  }
};

export const getSubscribedVideos = async (req, res, next) => {
  try {
    const users = await User.findById(req.user.id);
    const subscribedUsers = users.subscribedUsers;

    const listOfVideos = await Promise.all(
      subscribedUsers.map((channelId) => {
        return Video.find({ userId: channelId });
      })
    );

    return res
      .status(200)
      .json(listOfVideos.flat().sort((a, b) => b.createdAt - a.createdAt));
  } catch (err) {
    next(err);
  }
};
