const express = require("express");
const router = express.Router();
const User = require("../models")
const jwt = require("jsonwebtoken")

// login Api
router.post("/login", async(req, res, next)=>{
    try{
        // 닉네임, 비밀번호를 req.body에서 받아옴
        const { nickname, password } = req.body

        // 닉네임이 일치하는 유저 찾기
        const user = await User.findOne(({nickname}))

        // 1. 유저가 존재하지 않거나
        // 2. 비밀번호가 일치하지 않을 때
        if (!user || user.password !== password){
            res.status(412).json({
                errorMessage : "닉네임 또는 패스워드를 확인해주세요.",
            });
        }

        // jwt 생성
        const token = jwt.sign({userId: user.userId},"secret-penguin");

        res.cookie("Authorization", `Bearer ${token}`)
        res.status(200).json({token})
        
        next();
    } catch(error){
        res.status(400).json({
            errorMessage : "로그인에 실패하였습니다.",
        });
    }
    
});

module.exports = router;