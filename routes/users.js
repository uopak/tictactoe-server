var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var saltrounds = 10;

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// 회원가입
router.post('/signup', async function(req, res, next) {
  try {
    var username = req.body.username;
    var password = req.body.password;
    var nickname = req.body.nickname;

    // 입력값 검증
    if (!username || !password || !nickname) {
      return res.status(400).send("모든 필드를 입력해주세요");
    }

    // 사용자 중복 체크
    var database = req.app.get('database');
    var users = database.collection('users');
   
    const existingUser = await users.findOne({ username: username });
    if (existingUser) {
      return res.status(409).send("이미 존재하는 사용자입니다");
    }
    // 비밀번호 암호화
    var salt = bcrypt.genSaltSync(saltrounds);
    var hash = bcrypt.hashSync(password, salt);
    // DB에 저장
    await users.insertOne({
      username: username,
      password: hash, // 해시된 비밀번호 저장
      nickname: nickname
    });
    res.status(201).send("사용자가 성공적으로 생성되었습니다");
  } catch (err) {
    console.error("사용자 추가 중 오류 발생:", err);
    res.status(500).send("서버 오류가 발생했습니다");
  }
});


module.exports = router;
