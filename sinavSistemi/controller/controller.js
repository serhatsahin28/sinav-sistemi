const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const session = require("express-session");
const db = require("../model/db");


const port = 3000;
app.use(bodyParser.urlencoded({ extended: true }));

//Aşağıdaki kodlar ezberlenecek!!
const path = require('path');
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'view'));




const sessionControl = (req, res) => {
    const no = req.body.no;
    const password = req.body.password;

    if (no != null && no != "" && password != null) {
        db.query("SELECT * FROM ogrenci WHERE no=?", [no], (err, result) => {

            if (err) throw err;
            let active = false;
            console.log("RESULT DEĞERİ" + result.length);


            if (result.length > 0 && result[0].no == no && result[0].sifre == password) {
                active = true;
                let id = result[0].id;


                if (active == true) {
                    req.session.user = { id, no, password };

                    console.log(req.session.user);
                    return res.redirect("/about");

                }
                else {
                    return res.redirect("/Logout");

                }


            }

            else {
                return res.redirect("/Logout");

            }



        });



    }


};





const not = ((req, res) => {
    const Userno = req.session.user.no;

    db.query(`SELECT 
    MAX(CASE WHEN row_num = 1 THEN puan END) AS puan1,
    MAX(CASE WHEN row_num = 2 THEN puan END) AS puan2,
    ogretmenAd,
    ogretmenSoyad,
    dersAdı
FROM (
    SELECT 
        n.puan,
        ogrt.Ad AS ogretmenAd,
        ogrt.Soyad AS ogretmenSoyad,
        d.Ad AS dersAdı,
        ROW_NUMBER() OVER (PARTITION BY ogrt.id, d.id ORDER BY n.puan) AS row_num
    FROM 
        ogrenci AS o
    JOIN 
        notid AS n ON n.ogrenciId=o.id
    JOIN 
        ogretmen AS ogrt ON ogrt.id=n.ogretmenId
    JOIN 
        ders AS d ON d.id=n.dersId
    WHERE 
        o.no=?
) AS subquery
GROUP BY 
    ogretmenAd, ogretmenSoyad, dersAdı;
;`, Userno, (err, result) => {

        if (err) {
            throw err;
        }
        let deger = "";
        if (result.length === 0) {
            deger = "Henüz girilmiş notunuz bulunmamaktadır...";
            console.log(deger);

        }
        //console.log(result[0].sınıf);
        res.render("notlar", { result: result, deger: deger });

    });



});



const Logout = (req, res) => {
    if (req.session) {
        req.session.destroy((err) => {
            if (err) {
                console.log(err);
                res.status(500).send('Hata oluştu');
            } else {
                console.log('Oturum başarıyla sonlandırıldı');
                res.render("login");
            }
        });
    } else {
        console.log('Zaten bir oturum yok');
    }
};



const about = ((req, res) => {

    if (req.session.user != null && req.session.user != "") {
        const Userno = req.session.user.no;

        db.query("SELECT * FROM ogrenci WHERE no=?", [Userno], (err, result) => {

            if (err) throw err;
            db.query(`SELECT d.Ad AS dersAdı, COUNT(n.puan) AS sınavSayısı, SUM(n.puan) AS puanToplam, COUNT(DISTINCT d.id) AS dersSayısı FROM ogrenci AS o JOIN notid AS n ON n.ogrenciId=o.id JOIN ogretmen AS ogrt ON ogrt.id=n.ogretmenId JOIN ders AS d ON d.id=n.dersId WHERE o.no=? GROUP BY d.Ad;;
            `, Userno, (err, result2) => {

                if (err) throw err;

                let durum = "";
                let netOrtalama = "";

                // let durum = netOrtalama >= 50 ? "Geçerli" : "kaldı";
                // console.log(ortalama);
                return res.render("home", { result: result, result2: result2, durum: durum });


            });
        });


    }
    else { res.render("login"); }

});




const duyurular = (req, res) => {

    db.query(`SELECT o.Ad AS ogretmenAd,o.Soyad AS ogretmenSoyad,d.title AS  title,d.text AS text,d.doc AS doc,d.date AS tarih FROM duyuru as d 
JOIN ogretmen AS o on o.id=d.ogretmenId`, (err, result) => {

        if (err) throw err;

        res.render("duyurular", { result: result });

    });



}


const sinavlar = (req, res) => {


    const userNo = req.session.user.no;

    db.query(`SELECT   o.id AS ogretmenId,o.Ad AS ogretmenAd, o.Soyad AS ogretmenSoyad, d.Ad AS dersAd,s.id AS sınavId,s.isActive AS isActive,s.baslangic AS sınavBaslangic,s.bitis AS sinavBitis,s.tarih,s.isFinish AS isFinish,sg.isAgree AS katıldımı 
    FROM sınav AS s 
    JOIN ogretmen AS o ON o.id = s.ogretmenId
    JOIN ders AS d ON d.id = s.dersId
    LEFT JOIN sınavgiris AS sg ON sg.sınavId = s.id AND sg.ogrenciNo = ? 
    ORDER BY s.bitis ASC;`, [userNo], (err, result) => {

        if (err) throw err;

        res.render("sinavlar", { result: result });








    });

}



const sinavKatil = (req, res) => {

    const sinavId = req.params.sinavId;
    const ogrenciNo = req.session.user.no;
    db.query(`SELECT so.id AS soruId,o.id AS ogretmenId,o.Ad AS ogretmenAd,o.Soyad AS ogretmenSoyad,d.Ad AS dersAd,s.id AS sınavId,s.isActive AS isActive,s.baslangic AS sınavBaslangic ,s.bitis AS sinavBitis,s.tarih,s.isFinish AS isFinish,so.title,so.select1,so.select2,so.select3,so.select4,so.answer FROM sınav AS s
        JOIN ogretmen as o ON o.id=s.ogretmenId
        JOIN ders AS d ON s.dersId=d.id  
        JOIN soru AS so ON so.sınavId=s.id WHERE isActive=1 AND sınavId=?
    ORDER BY "sinavBitis" ASC;`, sinavId, (err, result) => {

        db.query("INSERT INTO sınavgiris (ogrenciNo,sınavId,isAgree) VALUES (?,?,?)", [ogrenciNo, sinavId, 1], (err) => {
            if (err) throw err;
            res.render("sinavEkran", { result: result });

        });
    });

}



const sinavKontrol = (req, res) => {
    const a = req.body;
    const Userno = req.session.user.no;
    const sınavId = req.body.sınavId;

    for (let key in a) {
        if (key !== 'sınavId') {

            const cevap = key;
            console.log(cevap);


            db.query("INSERT INTO sınavcevap (sınavId,soruId,cevap,ogrenciNo) VALUES(?,?,?,?)", [sınavId, key, a[key], Userno], (err) => {

                if (err) throw err;

            });
        }
    }
    res.redirect("/notHesapla?sınavid=" + sınavId);

}




const notHesapla = (req, res) => {
    let puan = 0;
    let sınavid = req.query.sınavid;
    console.log("nothesapla fonksiyonu içerisin sınavId:" + sınavid);
    const ogrenciNo = req.session.user.no;
    db.query("SELECT * FROM soru WHERE sınavId=?;", [sınavid], (err, sorular) => {
        const sınavId = sorular[0].sınavId;
        if (err) throw err;

        db.query(`SELECT s.sınavId AS sınavId,sc.ogrenciNo AS ogrenciId,s.answer AS cevap,sc.cevap AS ogrenciCevap FROM soru as s
        JOIN sınavcevap as sc ON s.id=sc.soruId WHERE s.sınavId=? AND ogrenciNo=?`, [sınavId,ogrenciNo], (err, result) => {

            let soruPuan = 100 / sorular.length;
            console.log("Soru başına puan" + soruPuan);
            for (let i = 0; i < result.length; i++) {
                if (result[i].cevap != null) {

                    const dogruCevap = result[i].cevap;
                    const ogrenciCevap = result[i].ogrenciCevap;
                    console.log("dogruCEVAP: " + dogruCevap);
                    console.log("oGRENCİcevap:" + ogrenciCevap);

                    if (dogruCevap == ogrenciCevap) {
                        puan = puan + soruPuan;
                        console.log("puan:" + puan);

                    }
                }
            }
            res.redirect("/notDurum?puan=" + puan+"&sınavId="+sınavid);

        });
    });
}



const notDurum = (req, res) => {
    const puan = req.query.puan;
    const sınavid = req.query.sınavId;
    const ogrenciId = req.session.user.id;

    console.log("NOTDURUM FONKSİYONU SINAVıD: "+sınavid);
    console.log("PUAN DEGERİ:" + puan);
    db.query("SELECT * FROM sınav WHERE id=? ORDER BY id DESC LIMIT 1",[sınavid], (err, result1) => {

        const ogretmenId = result1[0].ogretmenId;
        const dersId = result1[0].dersId;
        const sınavId = result1[0].id;


        console.log("dersId:" + result1[0].dersId);


        db.query("SELECT* FROM notid ;", (err, result2) => {
            if (err) throw err;
            const dbPuan = result2.puan;
            if (dbPuan == null) {
                sınavId,ogrenciId,dersId,puan,ogretmenId
                db.query("INSERT INTO notid (sınavId,ogrenciId,dersId,puan,ogretmenId) values(?,?,?,?,?)", [sınavId, ogrenciId, dersId, puan, ogretmenId], (err) => {
                    console.log("Controller>notDurum fonksiyonu çalıştı:");
                    res.redirect("/about");



                });
            }

            else {

                res.redirect("/about");




            }



        });
    });
};





module.exports = { sessionControl, not, Logout, about, duyurular, sinavlar, sinavKatil, sinavKontrol, notHesapla, notDurum }