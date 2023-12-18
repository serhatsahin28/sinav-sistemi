// adminRoutes.js
const express = require('express');
const app = express();
const router = express.Router();
const path = require('path');
const controllerAdmin = require("./controller/yonetim/controllerYonetim");
app.set('views', path.join(__dirname, 'view'));
app.set('view engine', 'ejs');

router.get("/", (req, res) => {
    // Yönetici giriş kontrolü yapılabilir
    if (req.session.user == null || req.session.user === "") {
        res.render("yonetim/yonetimLogin");
    } else {
        res.redirect("/Home");
    }
});

router.post("/adminControl", controllerAdmin.LoginAdmin);
router.get("/adminControl", controllerAdmin.LoginAdmin);

router.get("/Home", controllerAdmin.home);
router.get("/LogoutAdmin", controllerAdmin.LogoutAdmin);


router.get("/yonetimSinav", controllerAdmin.yonetimSinav);
router.post("/yonetimSinav", controllerAdmin.yonetimSinav);


router.get("/sinav", controllerAdmin.sinav);
router.post("/sinav", controllerAdmin.sinav);

router.post("/submit", controllerAdmin.soruEkleme);
router.get("/submit", controllerAdmin.soruEkleme);

router.post("/sinavEdit/:id", controllerAdmin.sinavEdit);
router.get("/sinavEdit/:id", controllerAdmin.sinavEdit);


router.post("/deneme", controllerAdmin.deneme);
router.get("/deneme", controllerAdmin.deneme);


router.post("/duyurular", controllerAdmin.duyuruPage);
router.get("/duyurular", controllerAdmin.duyuruPage);


router.post("/duyuruEkle", controllerAdmin.duyuruEkle);
router.get("/duyuruEkle", controllerAdmin.duyuruEkle);



router.get("/ogrenciSistem", (req, res) => {

    res.render("../view/login");

});




module.exports = router;
