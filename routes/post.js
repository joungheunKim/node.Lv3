const express = require("express");
const router = express.Router();
const { Posts } = require("../models");
const authMiddleware = require("../middlewares/auth-middleware.js");

// 전체 게시글 목록 조회 Api
router.get("/posts", async (req, res) => {
  const posts = await Posts.findAll({}) // {createdAt: -1} 내림차순 정렬

  const results = posts.map((item) => {
    return {
      postId: item._id,
      userId: item.userId,
      nickname: item.nickname,
      title: item.title,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    };
  });

  res.json({ posts: results });
});

// 게시글 상세 조회 Api
router.get("/posts/:postId", async (req, res, next) => {
  try {
    const { postId } = req.params;

    const posts = await Posts.find({ _id: postId });

    const results = posts.map((item) => {
      return {
        postId: item._id,
        userId: item.userId,
        nickname: item.nickname,
        title: item.title,
        content: item.content,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      };
    });
    res.json({ posts: results });
    next();
  } catch (error) {
    return res.status(400).json({
      message: "게시글 조회에 실패하였습니다.",
    });
  }
});

// 게시글 작성 Api
router.post("/posts", authMiddleware, async (req, res, next) => {
  try {
    const { userId, nickname } = res.locals.user;
    const { title, content } = req.body;

    if (!title || !content) {
      res.status(412).json({ errMessage: "데이터 형식이 올바르지 않습니다." });
      return;
    }

    const createPost = await Posts.create({
      userId,
      nickname,
      title,
      content,
    });

    res.json({ post: createPost });
  } catch {
    return res.status(400).json({
      message: "게시글 작성에 실패하였습니다.",
    });
  }
});

// 게시글 수정 Api
router.put("/posts/:postId", authMiddleware, async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { userId } = res.locals.user;
    const { title, content } = req.body;

    const putPost = await Posts.findById({ _id: postId });
    if (putPost) {
      if (userId !== putPost.userId) {
        res.status(403).json({ errMessage: "게시글 수정의 권한이 존재하지 않습니다." });
      }
      else if (userId === putPost.userId) {
        await Posts.updateOne(
          { _id: postId },
          {
            $set: {
              title: title,
              content: content,
            },
          }
        );
        res.status(200).json({ success: true });
      } 
    } next();
  } catch (error) {
    res.status(400).json({ errMessage: "게시글 수정에 실패하였습니다." });
  }
});

// 게시글 삭제 Api
router.delete("/posts/:postId", authMiddleware, async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { userId } = res.locals.user;

    const putPost = await Posts.findById({ _id: postId });
    if (!putPost){
      res.status(404).json({ message: "게시글이 존재하지 않습니다." });
    } else {
      if (userId !== putPost.userId) {
        res.status(403).json({ errMessage: "게시글 삭제 권한이 존재하지 않습니다." });
      }else if (userId === putPost.userId) {
        await Posts.deleteOne({ _id: postId });
        res.status(200).json({ message: "게시글을 삭제하였습니다." });
      } 
    } next();
  } catch (error) {
    res.status(400).json({ errMessage: "게시글이 정상적으로 삭제되지 않았습니다." });
  }
});

module.exports = router;
