const express = require("express");
const router = express.Router();

const {Comment} = require("../models");
const { Posts } = require("../models");
const authMiddleware = require("../middlewares/auth-middleware.js");


// 댓글 작성 Api
router.post("/posts/:postsId/comment", authMiddleware, async (req, res, next) => {
  try{
  const { postsId } = req.params
  const { comment } = req.body;
  const { userId, nickname } = res.locals.user
  
  // 코멘트가 비었을때
  if(!comment){
    res.status(400).json({errorMessage: "댓글 내용을 입력해주세요."})
    return
  }
  await Comment.create({ postsId, userId, nickname, comment });

  res.status(201).json({ message:  "댓글을 작성하였습니다."});
  }
  catch(error){
    console.error(error);
    res.status(400).json({errorMessage: "댓글 작성에 실패했습니다."})
  }
  
});

// 댓글 목록 조회Api
router.get("/posts/:postsId/comment", async (req, res, next) => {
  try{
  const { postsId } = req.params;
  const comment = await Comment.find({ postsId });
  const posts = await Posts.find({ _id: postsId });

  res.status(200).json({ comment });
  next()
  }
  catch(error){
    res.status(400).json({errorMessage: "댓글 조회에 실패하였습니다."})
  }   
});

// 댓글 수정 Api
router.put("/posts/:postsId/comment/:commentId",authMiddleware, async (req, res) => {

  const { userId } = res.locals.user
  const { commentId } = req.params;
  const { comment } = req.body;

  const existsComment = await Comment.find({ _id: commentId });
  if(!comment){
    res.status(400).json({errorMessage: "댓글 내용을 입력해주세요."})
    return
  }

  if (existsComment.length) {
    await Comment.updateOne(
      { userId },
      { $set: { comment: comment } }
    )
    res.status(200).json({ message: "댓글을 수정하였습니다." });
  }
  
})

//댓글 삭제
router.delete("/posts/:postsId/comment/:commentId",authMiddleware, async (req, res) => {
  const { commentId } = req.params;
  const { userId } = res.locals.user

  const existsComment = await Comment.find({ _id: commentId });
  console.log(existsComment)

  if (existsComment.length) {
    await Comment.deleteOne(
      { userId }
    )
    res.status(200).json({message: "댓글을 삭제하였습니다."});
  } else {
    res.status(400).json({ message: "댓글삭제에 실패하였습니다." });
  }

})

module.exports = router;