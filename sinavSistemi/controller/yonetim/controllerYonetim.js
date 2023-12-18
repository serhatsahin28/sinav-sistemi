const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const session = require("express-session");
const db = require("../../model/yonetim/dbYonetim");
const expressUpload = require("express-fileupload");
const path = require('path');
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'view'));
var http = require('http');
var formidable = require('formidable');
var fs = require('fs');
const crypto = require('crypto');

const LoginAdmin = (req, res) => {

    const no = req.body.no;
    const password = req.body.password;
    db.query("SELECT * FROM ogretmen WHERE No=? ", no, (err, result) => {
        if (err) throw err;

        let active = false;
        result.forEach(v => {

            if (v.No == no && v.sifre == password) {
                active = true;
            }

        });
        if (active) {
            const ogretmenId = result[0].id;
            console.log("LOGİNADMİN OGRETMEN ID: " + ogretmenId);
            req.session.user = { ogretmenId, no, password }
            return res.redirect("/admin/home");
        }
        else {
            return res.redirect("/admin/LogoutAdmin");
        }
    });

}


const home = (req, res) => {
    if (req.session.user != null && req.session.user != "") {
        const no = req.session.user.no;


        db.query("SELECT * FROM ogretmen WHERE No=?", no, (err, result) => {


            if (err) throw err;
            res.render("./yonetim/yonetimHome", { result: result });
        });
    }
    else {
        res.render("./yonetim/yonetimLogin");
    }

}



const LogoutAdmin = (req, res) => {
    if (req.session) {
        req.session.destroy((err) => {
            if (err) {
                console.log(err);
                res.status(500).send('Hata oluştu');
            } else {
                console.log('Oturum başarıyla sonlandırıldı');
                res.render("./yonetim/yonetimLogin");
            }
        });
    } else {
        console.log('Zaten bir oturum yok');
        res.json({ message: 'Zaten bir oturum yok' });
    }
};





const sinav = (req, res) => {
    const ogretmenId1 = req.session.user.ogretmenId;

    db.query(`SELECT o.id AS ogretmenId,o.Ad AS ogretmenAd,o.Soyad,o.No,d.Ad AS dersAd,d.id AS dersId FROM ogretmen as o 
    JOIN ders as d ON o.id=d.ogretmenId WHERE o.id=? `, ogretmenId1, (err, result) => {

        if (err) throw err;
        console.log("OGRETMEN ID'si: " + ogretmenId1);

        const ogretmenIdNew = result[0].ogretmenId;
        const dersId = result[0].dersId;
        const baslangic = req.body.baslangic;
        const bitis = req.body.bitis;
        const tarih = req.body.tarih;

        // console.log(ogretmenId);
        // console.log(result);
        // console.log(baslangic);
        // console.log(bitis);


        const yıl = tarih.slice(6, 10); // Yılı alır
        const ay = tarih.slice(3, 5); // Ayı alır
        const gün = tarih.slice(0, 2); // Günü alır
        console.log("yıl:" + yıl);
        console.log("ay:" + ay);
        console.log("gün:" + gün);


        const newTarih = yıl + ay + gün;
        db.query("INSERT INTO sınav (ogretmenId,dersId,tarih,isActive,baslangic,bitis,isFinish) VALUES (?,?,?,?,?,?,?)", [ogretmenIdNew, dersId, newTarih, 0, baslangic, bitis, 0], (err) => {

            if (err) throw err;
            console.log("sINAV OLUŞTURULDU");
            res.render("./yonetim/yonetimSinavEkle", { eklendi: eklendi });

        });
        let eklendi = "";


    });
}



const soruEkleme = (req, res) => {
    const ogretmenId = req.session.user.ogretmenId;

    db.query("SELECT * FROM sınav WHERE ogretmenId=? ORDER BY id DESC LIMIT 1", ogretmenId, (err, result) => {
        //         console.log(result);
        const sınavId = result[0].id;
        console.log("sınavId'si=" + sınavId);

        const value = req.body;
        const count = value.option0.length;
        const questionCount = Object.keys(value).filter(key => key.startsWith('question')).length;
        console.log("Soru sayısı:", questionCount);
        let durum = false;
        

        console.log(value);
        for (let i = 0; i < questionCount; i++) {
            const question = value["question" + i];
            const value2 = value;
            const option0 = value["option" + 0][i];
            const option1 = value["option" + 1][i];
            const option2 = value["option" + 2][i];
            const option3 = value["option" + 3][i];


            // console.log("********************");

            // console.log("option0[0]:", option0);
            // console.log("option1[0]:", option1);
            // console.log("option1[0]:", option2);
            // console.log("option1[0]:", option3);


            if (question != null && question != "") {

                durum = true;
                db.query("INSERT INTO soru (title, select1, select2, select3, select4, answer,sınavId) VALUES (?,?,?,?,?,?,?)",
                    [question, option0, option1, option2, option3, option0, sınavId],
                    (err) => {
                        if (err) throw err;
                        console.log("Sorular eklendi");
                        console.log("question:" + question);
                        console.log("YONETİM SINAV FONKSİTONU VERİ EKLEMEDEN HEMEN ÖNCE");
                    }
                );
            }
            else {
                console.log("Soru siliniyor burada");
                console.log("Soru siliniyor burada question: " + question);

                db.query("DELETE FROM sınav WHERE id=?", sınavId, (err) => {

                    if (err) throw err;

                    let eklendi = "Lütden soru başlığını giriniz!!";

                    durum = false;
                }
                );
            }
        }


        if (durum) {
            res.redirect("/admin/yonetimSinav");

        }

        else {

            res.render("./yonetim/yonetimSinavEkle", { eklendi: eklendi });

        }
    });


}





const yonetimSinav = (req, res) => {

    const sınavId = req.params.sinavId;
    const ogretmenId = req.session.user.ogretmenId;
    db.query(`SELECT o.id AS ogretmenId,o.Ad AS ogretmenAd,o.Soyad AS ogretmenSoyad,d.Ad AS dersAd,s.id AS sınavId,s.isActive AS isActive,s.baslangic AS sinavBaslangic ,s.bitis AS sinavBitis,s.tarih AS sinavTarih,s.isFinish AS isFinish FROM sınav AS s 
    JOIN ogretmen as o ON o.id=s.ogretmenId
    JOIN ders AS d ON s.dersId=d.id  WHERE o.id=?;`, [ogretmenId], (err, result) => {






        if (err) throw err;
        res.render("./yonetim/yonetimSinav", { result: result, sınavId: sınavId });

    });

}

const sinavEdit = (req, res) => {
    const sinavId = req.params.id;
    //    console.log(sinavId); 
    db.query(`SELECT o.id AS ogretmenId,o.Ad AS ogretmenAd,o.Soyad AS ogretmenSoyad,d.Ad AS dersAd,s.id AS sınavId,s.isActive AS isActive,s.tarih AS sınavTarih,s.baslangic AS sınavBaslangıc,s.bitis AS sınavBitis,s.isFinish AS isFinish FROM sınav AS s 
    JOIN ogretmen as o ON o.id=s.ogretmenId
    JOIN ders AS d ON s.dersId=d.id WHERE s.id=?`, sinavId, (err, result) => {



        res.render("./yonetim/yonetimSinavEdit", { result: result });


    });



}




const deneme = (req, res) => {

    const { tarih, baslangicSaat, bitisSaat, active, sınavId } = req.body;
    const yıl = tarih.slice(6, 10); // Yılı alır
    const ay = tarih.slice(3, 5); // Ayı alır
    const gün = tarih.slice(0, 2); // Günü alır
    console.log(yıl + "-" + ay + "-" + gün);
    const newTarih = yıl + ay + gün;

    db.query(
        'UPDATE sınav SET tarih=?, baslangic=?, bitis=?, isActive=? WHERE id=?',
        [newTarih, baslangicSaat, bitisSaat, active, sınavId],
        (err, result) => {
            if (err) {
                console.error(err);
                // Hata işleme
            } else {
                console.log('Başarıyla güncellendi');
                // Başarılı işlem
                res.redirect("/admin/yonetimSinav");
            }
        }
    );

}



const duyuruPage = (req, res) => {

    const ogretmenId = req.session.user.ogretmenId;

    db.query(`SELECT d.title AS title,d.text AS text,d.date AS dersTarih FROM duyuru AS d 
    JOIN ogretmen AS o ON d.ogretmenId=o.id  WHERE o.id=?;`, [ogretmenId], (err, result) => {

        res.render("./yonetim/yonetimDuyuru", { result: result });

    });

}


const duyuruEkle = (req, res) => {
    const ogretmenId = req.session.user.ogretmenId;

    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
    const dateShort = year + "-" + month + "-" + day;

    var form = new formidable.IncomingForm();

    form.parse(req, function (err, fields, files) {
        const title = fields.title;
        const textArea = fields.messageArea;

        if (title != null && textArea != null && title != "" && textArea != "") {
            if (err) {
                console.log('Dosya yüklenirken hata oluştu:', err);
                // Dosya yüklenmezse bile diğer verileri veritabanına ekleme
                db.query("INSERT INTO duyuru (title,text, doc, date, ogretmenId) VALUES (?,?,?,?,?)", [title, textArea, '', dateShort, ogretmenId], (dbErr, result) => {
                    if (dbErr) {
                        console.log('Veritabanına ekleme hatası:', dbErr);
                        return res.status(500).send('Veritabanına ekleme hatası.');
                    }
                    res.redirect("/admin/duyurular");
                });
            } else {
                const oldpath = files.file[0].filepath;
                const originalFilename = files.file[0].originalFilename;

                const uniqueId = crypto.randomBytes(8).toString('hex');

                // Dosya adına benzersiz bir kimlik ekle
                const yeniDosyaAdı = uniqueId + "_" + originalFilename;



                const newpath = 'C:/Users/sahin/Desktop/Node_projects/eokul/controller/yonetim/files/' + yeniDosyaAdı;

                fs.rename(oldpath, newpath, function (err) {
                    if (err) {
                        console.log('Dosya yüklenirken hata oluştu:', err);
                        // Dosya yüklenmezse bile diğer verileri veritabanına ekleme
                        db.query("INSERT INTO duyuru (title,text,doc, date, ogretmenId) VALUES (?,?,?,?,?)", [title, textArea, '', dateShort, ogretmenId], (dbErr, result) => {
                            if (dbErr) {
                                console.log('Veritabanına ekleme hatası:', dbErr);
                                return res.status(500).send('Veritabanına ekleme hatası.');
                            }
                            res.redirect("/admin/duyurular");
                        });
                    } else {


                        console.log('Dosya yüklendi!');
                        db.query("INSERT INTO duyuru (title,text, doc, date, ogretmenId) VALUES (?,?,?,?,?)", [title, textArea, yeniDosyaAdı, dateShort, ogretmenId], (dbErr, result) => {
                            if (dbErr) {
                                console.log('Veritabanına ekleme hatası:', dbErr);
                                return res.status(500).send('Veritabanına ekleme hatası.');
                            }
                            res.redirect("/admin/duyurular");
                        });
                    }
                });
            }
        }

        else {
            res.redirect("/admin/duyurular");


        }
    });
};









module.exports = { LoginAdmin, home, LogoutAdmin, sinav, soruEkleme, yonetimSinav, sinavEdit, deneme, duyuruPage, duyuruEkle }