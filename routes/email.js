module.exports = email

function email (app, Users) {
  app.post('/pushOne', async (req,res)=>{ //신뢰이메일리스트에 새 이메일 하나 추가
    var result = await Users.findOne({token : req.body.token})
    if(!result) return res.status(404).json({message : "User Not Found!"})
    for (var i = 0; result.emailList[i] != null; i++)
      if(result.emailList[i].email === req.body.email)
        return res.status(409).json({message : "already exist!"})
    var new_email = { email : req.body.email }
    result = await Users.update({token : req.body.token},{
      $push : {emailList : new_email}
    })
    if(!result.ok) return res.status(500).json({message : "ERR!"})
    else return res.status(200).json({message : "success!"})
  })

  .post('/push', async (req,res)=>{ //신뢰이메일리스트에 새 이메일 여러개 추가
    var result = await Users.findOne({token : req.body.token})
    if(!result) return res.status(404).json({message : "User Not Found!"})
    for (var i = 0; req.body.list[i] != null; i++) {
      var chk = 0;
      for (var j = 0; result.emailList[j] != null; j++){
        if(result.emailList[j].email === req.body.list[i]){
          chk = 1;
        }
      }
      if(!chk){
        var new_email = { email : req.body.list[i] }
        let set = await Users.update({token : req.body.token}, {
          $push: {emailList : new_email}
        })
        if(!set.ok) return res.status(500).json({message : "ERR!"})
      }
    }
    return res.status(200).json({message : "success!"})
  })

  .post('/pullOne', async (req,res)=>{ //신뢰이메일리스트에 이메일 하나 삭제
    var pull_email = { email : req.body.email }
    var result = await Users.update({token : req.body.token}, {
      $pull : {emailList : pull_email}
    })
    if(!result.ok) return res.status(500).json({message : "ERR!"})
    else return res.status(200).json({message : "success!"})
  })
  
  .post('/pull', async (req, res)=>{ //신뢰이메일리스트에 이메일 다중 삭제
    for ( var i = 0; req.body.list[i] != null; i++) {
      let pull_email = { email : req.body.list[i] }
      let result = await Users.update({token : req.body.token}, {
        $pull : {emailList : pull_email}
      })
      if(!result.ok) return res.status(500).json({message : "ERR!"})
    }
    res.status(200).json({message : "success!"})
  })
    
  .post('/list', async (req,res)=>{ //신뢰이메일리스트 보기
    var result = await Users.findOne({token : req.body.token})
    if(!result) return res.status(404).json({message : "User Not Found!"})
    return res.status(200).json({list : result.emailList})
  })

  .post('/check', async (req,res)=>{ //신뢰이메일인지 확인
    var result = await Users.findOne({token : req.body.token})
    if(!result) return res.status(404).json({message : "User Not Found!"})
    var list = [];

    for ( var j = 0; req.body.list[j] != null; j++){
      var email_JSON = {
        email : req.body.list[j],
        check : false
      }
      for (var i = 0; result.emailList[i] != null; i++){
        if( result.emailList[i].email === req.body.list[j] ){
          email_JSON.check = true
        }
      }
      list.push(email_JSON)
    }
    res.status(200).json({list : list})
  })
}
