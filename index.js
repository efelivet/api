const express = require('express');
const cors = require('cors');
const mongoose =require('mongoose');
const User = require('./models/User.js');
const PostModel = require('./models/PostModel');
const multer = require('multer');

const path = require('path');
const app = express();
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const salt = bcrypt.genSaltSync(10);

const jwt = require('jsonwebtoken');
const secret = 'nddcnddcnddcnddcnddcnddcnddcnddc';


app.use(cors({credentials:true,
  origin:['http://localhost:3000'],
   methods:["GET","POST","PUT","DELETE"],
   
}));
app.use(express.json());
app.use(cookieParser());
app.use(express.static('Public'));
app.get('/blog',(req,res)=>{
  res.send("hello");
})
mongoose.connect('mongodb+srv://enobakharerichie:8d2rZNSFNWCU0JMq@cluster0.lyce1ng.mongodb.net/Node-API?retryWrites=true&w=majority')
.then(()=>console.log('connected')).catch((error)=>{
  console.log(error)
});

app.post('/registration',async(req,res)=>{
  const {username,password} = req.body;
  //
  try{
   

    const userDoc = await User.create({
      username,
    password:bcrypt.hashSync(password,salt),
     });
     res.json(userDoc);
  
  }
  catch(e){
   res.status(400).json(e);
  }
});


app.post('/login',async (req,res)=>{
    const {username,password} = req.body;
  await User.findOne({username}).then(userDoc=>{
    if(userDoc){
      bcrypt.compare(password, userDoc.password).then(passOk=>{
        if (passOk) {
          // logged in
          jwt.sign({username,id:userDoc._id}, secret, {}, (err,token) => {
            if (err) throw err;
            res.cookie('token', token).json({
              id:userDoc._id,
              username,
            });
          });
        }
      })
    }
      else {
        res.status(400).json('wrong credentials');
      } 
})
  })
  





app.get('/profile',(req,res)=>{
  const {token} = req.cookies;
  jwt.verify(token,secret,{},(err,info)=>{
    if(err) res.json("The token is wrong") ;
    res.json(info);
})
})

app.post('/logout',(req,res)=>{
  res.cookie('token','').json('success');
})

const storage = multer.diskStorage({
  destination:(req,file,cb)=>{
    cb(null,'Public/Images')
  },
  filename:(req,file,cb)=>{
    cb(null,file.fieldname +"_" + Date.now() +path.extname(file.originalname))
  }
})
const upload = multer({
  storage:storage,
})



app.post('/create',upload.single('file'),(req,res)=>{
  PostModel.create({title:req.body.title,
    description: req.body.description,
    file:req.file.filename}).then(result =>{res.json("success")}
    ).catch(err=>{
      res.json(err);
      
    })
})

app.get('/getposts',(req,res)=>{
  PostModel.find().then(posts=>{res.json(posts)}).catch(err=>{res.json(err)});
})

app.get('/getpostbyid/:id',(req,res)=>{
  const id = req.params.id;
  PostModel.findById({_id:id}).then(post=>{res.json(post)}).catch(err=>{res.json(err);})
    
  
})

app.put('/editpost/:id',(req,res)=>{
  const id = req.params.id;
  PostModel.findByIdAndUpdate(
    {_id:id},{
    title:req.body.title,
    description:req.body.description}
    ).then(
      result=>{res.json("success")}).catch(err=>{
        res.json(err);
      })
    
})

app.delete('/deletepost/:id',(req,res)=>{
  PostModel.findByIdAndDelete({_id:req.params.id}).then(
    result=>res.json("success")).catch(err=>res.json(err))
})


const PORT = 4000;
app.listen(PORT,()=>{
    console.log('ah')
});
