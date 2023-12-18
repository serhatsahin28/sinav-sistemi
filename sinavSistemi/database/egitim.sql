-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Anamakine: 127.0.0.1
-- Üretim Zamanı: 18 Ara 2023, 13:43:32
-- Sunucu sürümü: 10.4.28-MariaDB
-- PHP Sürümü: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Veritabanı: `egitim`
--

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `ders`
--

CREATE TABLE `ders` (
  `id` int(11) NOT NULL,
  `ogretmenId` int(11) NOT NULL,
  `Ad` varchar(15) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `ders`
--

INSERT INTO `ders` (`id`, `ogretmenId`, `Ad`) VALUES
(1, 1, 'Matematik'),
(2, 2, 'Türkçe'),
(3, 3, 'Fen');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `duyuru`
--

CREATE TABLE `duyuru` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `text` varchar(255) NOT NULL,
  `doc` varchar(155) DEFAULT NULL,
  `ogretmenId` int(1) NOT NULL,
  `date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `notid`
--

CREATE TABLE `notid` (
  `id` int(1) NOT NULL,
  `sınavId` int(1) NOT NULL,
  `ogrenciId` int(1) NOT NULL,
  `dersId` int(11) NOT NULL,
  `puan` int(11) NOT NULL,
  `ogretmenId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `ogrenci`
--

CREATE TABLE `ogrenci` (
  `id` int(11) NOT NULL,
  `sınıf` varchar(3) NOT NULL,
  `sınıfSube` varchar(10) NOT NULL,
  `no` varchar(8) NOT NULL,
  `Ad` varchar(25) NOT NULL,
  `Soyad` varchar(25) NOT NULL,
  `sifre` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `ogrenci`
--

INSERT INTO `ogrenci` (`id`, `sınıf`, `sınıfSube`, `no`, `Ad`, `Soyad`, `sifre`) VALUES
(1, '12', 'A', '200', 'Ahmet', 'Yılmaz', '123'),
(2, '12', 'A', '201', 'Derya', 'Ulug', '123'),
(5, '12', 'A', '202', 'Altay', 'Meric', '123');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `ogretmen`
--

CREATE TABLE `ogretmen` (
  `id` int(11) NOT NULL,
  `Ad` varchar(25) NOT NULL,
  `Soyad` varchar(25) NOT NULL,
  `No` varchar(50) NOT NULL,
  `sifre` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `ogretmen`
--

INSERT INTO `ogretmen` (`id`, `Ad`, `Soyad`, `No`, `sifre`) VALUES
(1, 'Ahmet', 'Yılmaz', '457', '321'),
(2, 'Mehmet', 'Erdem', '548', '321'),
(3, 'Elif', 'Avcı', '659', '321');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `soru`
--

CREATE TABLE `soru` (
  `id` int(1) NOT NULL,
  `title` varchar(100) NOT NULL,
  `select1` varchar(100) NOT NULL,
  `select2` varchar(100) NOT NULL,
  `select3` varchar(100) NOT NULL,
  `select4` varchar(100) NOT NULL,
  `answer` varchar(100) NOT NULL,
  `sınavId` int(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `sınav`
--

CREATE TABLE `sınav` (
  `id` int(1) NOT NULL,
  `ogretmenId` varchar(12) NOT NULL,
  `dersId` varchar(12) NOT NULL,
  `tarih` date DEFAULT NULL,
  `isActive` int(11) NOT NULL,
  `baslangic` time NOT NULL DEFAULT current_timestamp(),
  `bitis` time NOT NULL DEFAULT current_timestamp(),
  `isFinish` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `sınavcevap`
--

CREATE TABLE `sınavcevap` (
  `id` int(11) NOT NULL,
  `sınavId` int(11) NOT NULL,
  `soruId` varchar(155) NOT NULL,
  `cevap` varchar(255) NOT NULL,
  `ogrenciNo` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `sınavgiris`
--

CREATE TABLE `sınavgiris` (
  `id` int(11) NOT NULL,
  `ogrenciNo` int(11) NOT NULL,
  `sınavId` int(11) NOT NULL,
  `isAgree` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dökümü yapılmış tablolar için indeksler
--

--
-- Tablo için indeksler `ders`
--
ALTER TABLE `ders`
  ADD PRIMARY KEY (`id`);

--
-- Tablo için indeksler `duyuru`
--
ALTER TABLE `duyuru`
  ADD PRIMARY KEY (`id`);

--
-- Tablo için indeksler `notid`
--
ALTER TABLE `notid`
  ADD PRIMARY KEY (`id`);

--
-- Tablo için indeksler `ogrenci`
--
ALTER TABLE `ogrenci`
  ADD PRIMARY KEY (`id`);

--
-- Tablo için indeksler `ogretmen`
--
ALTER TABLE `ogretmen`
  ADD PRIMARY KEY (`id`);

--
-- Tablo için indeksler `soru`
--
ALTER TABLE `soru`
  ADD PRIMARY KEY (`id`);

--
-- Tablo için indeksler `sınav`
--
ALTER TABLE `sınav`
  ADD PRIMARY KEY (`id`);

--
-- Tablo için indeksler `sınavcevap`
--
ALTER TABLE `sınavcevap`
  ADD PRIMARY KEY (`id`);

--
-- Tablo için indeksler `sınavgiris`
--
ALTER TABLE `sınavgiris`
  ADD PRIMARY KEY (`id`);

--
-- Dökümü yapılmış tablolar için AUTO_INCREMENT değeri
--

--
-- Tablo için AUTO_INCREMENT değeri `ders`
--
ALTER TABLE `ders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Tablo için AUTO_INCREMENT değeri `duyuru`
--
ALTER TABLE `duyuru`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- Tablo için AUTO_INCREMENT değeri `notid`
--
ALTER TABLE `notid`
  MODIFY `id` int(1) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- Tablo için AUTO_INCREMENT değeri `ogrenci`
--
ALTER TABLE `ogrenci`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Tablo için AUTO_INCREMENT değeri `ogretmen`
--
ALTER TABLE `ogretmen`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Tablo için AUTO_INCREMENT değeri `soru`
--
ALTER TABLE `soru`
  MODIFY `id` int(1) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=52;

--
-- Tablo için AUTO_INCREMENT değeri `sınav`
--
ALTER TABLE `sınav`
  MODIFY `id` int(1) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=192;

--
-- Tablo için AUTO_INCREMENT değeri `sınavcevap`
--
ALTER TABLE `sınavcevap`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=219;

--
-- Tablo için AUTO_INCREMENT değeri `sınavgiris`
--
ALTER TABLE `sınavgiris`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
