//npm i express nodemon express-session body-parser mysql ejs 

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const session = require("express-session");
const port = 3000;
const db = require("./model/db");
const adminRoutes = require("./adminRoutes");
const controller = require("./controller/controller");
const path = require('path');
var fs = require('fs');
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'view'));
app.use(bodyParser.urlencoded({ extended: true }));
// app.use('./controller/yonetim/files', express.static('dosya'));

app.use(session({
    secret: "my-secret",
    resave: true,
    saveUninitialized: true
}));


/***************************-ÖĞRENCİ-İŞLEMLERİ-********************************** */

app.get("/", (req, res) => {
    console.log(req.session.user);
    if (req.session.user == null && req.session.user == "") {
        res.render("login")
    }
    res.redirect("/about");

});
app.get("/control", controller.sessionControl);
app.post("/control", controller.sessionControl);

app.get("/about", controller.about);
app.get("/Logout", controller.Logout);
app.get("/notlar", controller.not);
app.post("/notlar", controller.not);

app.get("/duyurular", controller.duyurular);
app.get("/Sinavlar", controller.sinavlar);
app.post("/Sinavlar", controller.sinavlar);

app.get("/sinavaKatil/:sinavId", controller.sinavKatil);
app.get("/sinavKontrol", controller.sinavKontrol);
app.post("/sinavKontrol", controller.sinavKontrol);
app.post("/notHesapla", controller.notHesapla);
app.get("/notHesapla", controller.notHesapla);

app.post("/notDurum", controller.notDurum);
app.get("/notDurum", controller.notDurum);

app.get("/yonetimLogin", (req, res) => {
    res.render("yonetim/yonetimLogin");

});



app.get("/files/:doc", (req, res) => {
    const docPath = req.params.doc;
    const filePath = path.join(__dirname, 'controller', 'yonetim', 'files', docPath);
    res.setHeader('Content-Disposition', 'inline; filename="' + docPath + '"');
    res.contentType("application/pdf");
    res.sendFile(filePath);
});


/***************************-YÖNETİCİ-İŞLEMLERİ-********************************** */

app.use('/admin', adminRoutes);






app.listen(port, () => {

    console.log("Başarılı");

});