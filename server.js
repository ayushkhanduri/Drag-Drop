const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const node_mailer = require('nodemailer');
console.log(node_mailer);
const app = express();

app.set(path.join(__dirname));

app.set('view engine', 'ejs');

//middlewares
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname,'app')));


app.post('/sendMail',(req,res,next)=>{
    let transporter = node_mailer.createTransport({
		service: 'gmail',
		auth: {
			user: 'ayushkhanduri@gmail.com',
			pass: 'secretwarspart2'
		}
    });
    console.log(req.body);
    let mailOptions = {
		from: "ayush@silverpush.com",
		to: "ayushkhanduri@gmail.com",
		subject: 'Website submission from template generator',
    	html: req.body.allText
    }
    
    transporter.sendMail(mailOptions,(err,info) => {
		if(err){
			console.log(err);
			return err;
        }
        res.send({status: 200});
		console.log("Message sent : " + info);
	});
})

app.get("/",function(req,res,next){
    res.render('index.ejs');
});


app.listen(process.env.PORT||3000,()=>{
    console.log("listening to port 3000!");
})