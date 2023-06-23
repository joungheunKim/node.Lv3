const express  =require("express");
const router = express.Router();
// const UserSchema = require("../schemas/user")

// 회원가입 Api
router.post("/signup", async (req, res, next)=>{
    try{
        const { nickname, password, confirmPassword} =req.body;
        // []안의 ^ 는 부정(not)을 의미 A-Za-z0-9 대소문자 알파벳과 영어, 즉 특수문자가 들어오면 확인됨
        const regExp1 = /[^A-Za-z0-9]/gi ;
    
        // 알파벳 대소문자, 숫자가 아닐때
        if (regExp1.test(nickname)){
            res.status(412).json({
                errMessage : "닉네임의 형식이 일치하지 않습니다."
            })
            return;
        // 닉네임이 3글자보다 작을 때
        } else if(nickname.length<3 ){
            res.status(412).json({
                errMessage : "닉네임은 최소 3글자 입니다."
            })
            return;
        }
    
        if (password !== confirmPassword){
            res.status(412).json({
                errMessage : "패스워드가 일치하지 않습니다"
            })
            return;
        } else if (nickname === password){
            res.status(412).json({
                errMessage : "닉네임과 비밀번호가 같을 수 없습니다."
            })
            return;
        }
    
        // nickname이 실재로 DB에 존재하는지 확인
        const existsUsers  = await UserSchema.findOne({
            $or: [{nickname}], //  nickname 일치할때 조회한다.
        });
        if(existsUsers){
            res.status(412).json({
                errMessage:"중복된 닉네임입니다."
            });
            return;
        };
        const user = new UserSchema({nickname, password})
        await user.save(); // DB에 저장한다.
    
        return res.status(201).json({ message: "회원 가입에 성공하였습니다."})
        
        next();       
    } catch (error) {
        return res.status(400).json({
          message: "요청한 데이터 형식이 올바르지 않습니다",
        });
    }
});

module.exports = router;