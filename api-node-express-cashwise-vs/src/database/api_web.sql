-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/


SET sql_mode = 'STRICT_TRANS_TABLES,NO_ZERO_DATE,NO_ZERO_IN_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION';
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `api_web`
--
CREATE SCHEMA IF NOT EXISTS api_web;
-- --------------------------------------------------------

USE api_web;


-- -----------------------------------------------------
-- Table `api_web`.`simulacao_beneficio`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `simulacao_beneficio` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `genero` ENUM('m', 'f') NOT NULL,
  `data_nascimento` DATE NOT NULL,
  `idade` INT NULL,
  `tempo_contribuicao_mes` INT NULL,
  `idade_aposentadoria` INT NULL,
  `mes_aposentadoria` INT NULL,
  `anoAposentadoria` INT NULL,
  `tempo_contribuicao_pendente` INT NULL,
   simulacao_beneficio_id INT,
  `valor_beneficio` DECIMAL(10,2) NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `api_web`.`simulacao_periodo_trabalho`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `simulacao_periodo_trabalho` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `mes` INT NOT NULL,
  `ano` INT NOT NULL,
  `salario` DECIMAL(10,2) NOT NULL,
  `mes_ano` VARCHAR(7) NOT NULL,
  `simulacao_beneficio_id` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_simulacao_periodo_trabalho_simulacao_beneficio_idx` (`simulacao_beneficio_id`),
  CONSTRAINT `fk_simulacao_periodo_trabalho_simulacao_beneficio`
    FOREIGN KEY (`simulacao_beneficio_id`)
    REFERENCES `api_web`.`simulacao_beneficio` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `api_web`.`salario_atualizado`
-- -----------------------------------------------------

CREATE TABLE IF NOT EXISTS salario_atualizado (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  mes_ano VARCHAR(7) NOT NULL,
  salario_atualizado DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (id)
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `api_web`.`atualizacao_monetaria`
-- -----------------------------------------------------

CREATE TABLE IF NOT EXISTS atualizacao_monetaria (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  mes_ano VARCHAR(7) NOT NULL,
  indice DECIMAL(10,6) NOT NULL,
  PRIMARY KEY (id)
) ENGINE = InnoDB;

INSERT INTO atualizacao_monetaria (mes_ano, indice) VALUES
('1994-07', '10.534006'),
('1994-08', '9.930246'),
('1994-09', '9.416119'),
('1994-10', '9.276060'),
('1994-11', '9.106674'),
('1994-12', '8.818315'),
('1995-01', '8.629332'),
('1995-02', '8.487585'),
('1995-03', '8.404383'),
('1995-04', '8.287527'),
('1995-05', '8.131407'),
('1995-06', '7.927665'),
('1995-07', '7.785964'),
('1995-08', '7.599023'),
('1995-09', '7.522298'),
('1995-10', '7.435305'),
('1995-11', '7.332645'),
('1995-12', '7.223572'),
('1996-01', '7.106316'),
('1996-02', '7.004063'),
('1996-03', '6.954678'),
('1996-04', '6.934571'),
('1996-05', '6.886365'),
('1996-06', '6.772583'),
('1996-07', '6.690958'),
('1996-08', '6.618812'),
('1996-09', '6.618542'),
('1996-10', '6.609952'),
('1996-11', '6.595442'),
('1996-12', '6.577028'),
('1997-01', '6.519652'),
('1997-02', '6.418246'),
('1997-03', '6.391397'),
('1997-04', '6.318114'),
('1997-05', '6.281052'),
('1997-06', '6.262268'),
('1997-07', '6.218738'),
('1997-08', '6.213146'),
('1997-09', '6.213146'),
('1997-10', '6.176699'),
('1997-11', '6.155770'),
('1997-12', '6.105098'),
('1998-01', '6.063262'),
('1998-02', '6.010376'),
('1998-03', '6.009171'),
('1998-04', '5.995380'),
('1998-05', '5.995380'),
('1998-06', '5.981624'),
('1998-07', '5.964918'),
('1998-08', '5.964918'),
('1998-09', '5.964918'),
('1998-10', '5.964918'),
('1998-11', '5.964918'),
('1998-12', '5.964918'),
('1999-01', '5.907037'),
('1999-02', '5.839867'),
('1999-03', '5.591605'),
('1999-04', '5.483040'),
('1999-05', '5.481398'),
('1999-06', '5.481398'),
('1999-07', '5.426050'),
('1999-08', '5.341131'),
('1999-09', '5.264790'),
('1999-10', '5.188515'),
('1999-11', '5.092274'),
('1999-12', '4.966618'),
('2000-01', '4.906273'),
('2000-02', '4.856732'),
('2000-03', '4.847522'),
('2000-04', '4.838812'),
('2000-05', '4.832529'),
('2000-06', '4.800365'),
('2000-07', '4.756136'),
('2000-08', '4.651028'),
('2000-09', '4.567885'),
('2000-10', '4.536585'),
('2000-11', '4.519861'),
('2000-12', '4.502299'),
('2001-01', '4.468339'),
('2001-02', '4.446559'),
('2001-03', '4.431486'),
('2001-04', '4.396314'),
('2001-05', '4.347194'),
('2001-06', '4.328151'),
('2001-07', '4.265870'),
('2001-08', '4.197864'),
('2001-09', '4.160416'),
('2001-10', '4.144671'),
('2001-11', '4.085431'),
('2001-12', '4.054612'),
('2002-01', '4.047334'),
('2002-02', '4.039660'),
('2002-03', '4.032399'),
('2002-04', '4.027969'),
('2002-05', '3.999968'),
('2002-06', '3.956055'),
('2002-07', '3.888390'),
('2002-08', '3.810288'),
('2002-09', '3.722440'),
('2002-10', '3.626692'),
('2002-11', '3.480177'),
('2002-12', '3.288141'),
('2003-01', '3.201701'),
('2003-02', '3.133695'),
('2003-03', '3.084654'),
('2003-04', '3.034287'),
('2003-05', '3.021893'),
('2003-06', '3.042280'),
('2003-07', '3.063724'),
('2003-08', '3.069868'),
('2003-09', '3.050948'),
('2003-10', '3.019248'),
('2003-11', '3.006018'),
('2003-12', '2.991661'),
('2004-01', '2.973816'),
('2004-02', '2.950216'),
('2004-03', '2.938754'),
('2004-04', '2.922101'),
('2004-05', '2.910169'),
('2004-06', '2.898571'),
('2004-07', '2.884162'),
('2004-08', '2.863251'),
('2004-09', '2.849006'),
('2004-10', '2.844173'),
('2004-11', '2.839347'),
('2004-12', '2.826904'),
('2005-01', '2.802799'),
('2005-02', '2.786916'),
('2005-03', '2.774707'),
('2005-04', '2.754596'),
('2005-05', '2.729757'),
('2005-06', '2.710781'),
('2005-07', '2.713767'),
('2005-08', '2.712952'),
('2005-09', '2.712952'),
('2005-10', '2.708889'),
('2005-11', '2.693272'),
('2005-12', '2.678802'),
('2006-01', '2.668133'),
('2006-02', '2.658032'),
('2006-03', '2.651935'),
('2006-04', '2.644788'),
('2006-05', '2.641621'),
('2006-06', '2.638193'),
('2006-07', '2.640034'),
('2006-08', '2.637140'),
('2006-09', '2.637663'),
('2006-10', '2.633451'),
('2006-11', '2.622177'),
('2006-12', '2.611208'),
('2007-01', '2.595116'),
('2007-02', '2.582470'),
('2007-03', '2.571664'),
('2007-04', '2.560394'),
('2007-05', '2.553760'),
('2007-06', '2.547134'),
('2007-07', '2.539268'),
('2007-08', '2.531162'),
('2007-09', '2.516316'),
('2007-10', '2.510045'),
('2007-11', '2.502539'),
('2007-12', '2.491816'),
('2008-01', '2.467879'),
('2008-02', '2.450970'),
('2008-03', '2.438533'),
('2008-04', '2.426158'),
('2008-05', '2.410732'),
('2008-06', '2.387812'),
('2008-07', '2.366279'),
('2008-08', '2.352632'),
('2008-09', '2.347698'),
('2008-10', '2.344182'),
('2008-11', '2.332520'),
('2008-12', '2.323691'),
('2009-01', '2.316975'),
('2009-02', '2.302239'),
('2009-03', '2.295125'),
('2009-04', '2.290540'),
('2009-05', '2.278019'),
('2009-06', '2.264429'),
('2009-07', '2.254956'),
('2009-08', '2.249782'),
('2009-09', '2.247982'),
('2009-10', '2.244392'),
('2009-11', '2.239020'),
('2009-12', '2.230765'),
('2010-01', '2.225416'),
('2010-02', '2.206009'),
('2010-03', '2.190672'),
('2010-04', '2.175231'),
('2010-05', '2.159465'),
('2010-06', '2.150222'),
('2010-07', '2.152591'),
('2010-08', '2.154100'),
('2010-09', '2.155609'),
('2010-10', '2.144032'),
('2010-11', '2.124480'),
('2010-12', '2.102821'),
('2011-01', '2.090282'),
('2011-02', '2.070815'),
('2011-03', '2.059693'),
('2011-04', '2.046191'),
('2011-05', '2.031556'),
('2011-06', '2.020046'),
('2011-07', '2.015611'),
('2011-08', '2.015611'),
('2011-09', '2.007179'),
('2011-10', '1.998192'),
('2011-11', '1.991818'),
('2011-12', '1.980522'),
('2012-01', '1.970483'),
('2012-02', '1.960482'),
('2012-03', '1.952863'),
('2012-04', '1.949353'),
('2012-05', '1.936964'),
('2012-06', '1.926366'),
('2012-07', '1.921367'),
('2012-08', '1.913145'),
('2012-09', '1.904570'),
('2012-10', '1.892649'),
('2012-11', '1.879306'),
('2012-12', '1.869213'),
('2013-01', '1.855477'),
('2013-02', '1.838566'),
('2013-03', '1.829054'),
('2013-04', '1.818143'),
('2013-05', '1.807479'),
('2013-06', '1.801176'),
('2013-07', '1.796150'),
('2013-08', '1.798485'),
('2013-09', '1.795614'),
('2013-10', '1.790777'),
('2013-11', '1.779925'),
('2013-12', '1.770356'),
('2014-01', '1.757701'),
('2014-02', '1.746707'),
('2014-03', '1.735595'),
('2014-04', '1.721480'),
('2014-05', '1.708151'),
('2014-06', '1.697962'),
('2014-07', '1.693559'),
('2014-08', '1.691361'),
('2014-09', '1.688321'),
('2014-10', '1.680092'),
('2014-11', '1.673733'),
('2014-12', '1.664907'),
('2015-01', '1.654647'),
('2015-02', '1.630517'),
('2015-03', '1.611819'),
('2015-04', '1.587845'),
('2015-05', '1.576650'),
('2015-06', '1.561194'),
('2015-07', '1.549265'),
('2015-08', '1.540333'),
('2015-09', '1.536486'),
('2015-10', '1.528691'),
('2015-11', '1.517013'),
('2015-12', '1.500356'),
('2016-01', '1.486975'),
('2016-02', '1.464857'),
('2016-03', '1.451069'),
('2016-04', '1.444713'),
('2016-05', '1.435526'),
('2016-06', '1.421597'),
('2016-07', '1.414942'),
('2016-08', '1.405942'),
('2016-09', '1.401602'),
('2016-10', '1.400483'),
('2016-11', '1.398100'),
('2016-12', '1.397128'),
('2017-01', '1.395177'),
('2017-02', '1.389335'),
('2017-03', '1.386011'),
('2017-04', '1.381594'),
('2017-05', '1.380488'),
('2017-06', '1.375534'),
('2017-07', '1.379672'),
('2017-08', '1.377335'),
('2017-09', '1.377744'),
('2017-10', '1.378025'),
('2017-11', '1.372939'),
('2017-12', '1.370471'),
('2018-01', '1.366923'),
('2018-02', '1.363787'),
('2018-03', '1.361332'),
('2018-04', '1.360382'),
('2018-05', '1.357530'),
('2018-06', '1.351720'),
('2018-07', '1.332662'),
('2018-08', '1.329336'),
('2018-09', '1.329336'),
('2018-10', '1.325358'),
('2018-11', '1.320082'),
('2018-12', '1.323388'),
('2019-01', '1.321543'),
('2019-02', '1.316796'),
('2019-03', '1.309727'),
('2019-04', '1.299719'),
('2019-05', '1.291968'),
('2019-06', '1.290033'),
('2019-07', '1.289902'),
('2019-08', '1.288612'),
('2019-09', '1.287066'),
('2019-10', '1.287715'),
('2019-11', '1.287197'),
('2019-12', '1.280285'),
('2020-01', '1.264853'),
('2020-02', '1.262457'),
('2020-03', '1.260313'),
('2020-04', '1.258049'),
('2020-05', '1.260946'),
('2020-06', '1.264110'),
('2020-07', '1.260329'),
('2020-08', '1.254804'),
('2020-09', '1.250303'),
('2020-10', '1.239522'),
('2020-11', '1.228585'),
('2020-12', '1.217024'),
('2021-01', '1.199513'),
('2021-02', '1.196283'),
('2021-03', '1.186552'),
('2021-04', '1.176436'),
('2021-05', '1.171984'),
('2021-06', '1.160838'),
('2021-07', '1.153914'),
('2021-08', '1.142263'),
('2021-09', '1.132299'),
('2021-10', '1.118873'),
('2021-11', '1.106041'),
('2021-12', '1.096828'),
('2022-01', '1.088880'),
('2022-02', '1.081633'),
('2022-03', '1.070924'),
('2022-04', '1.052921'),
('2022-05', '1.042080'),
('2022-06', '1.037413'),
('2022-07', '1.031021'),
('2022-08', '1.037245'),
('2022-09', '1.040469'),
('2022-10', '1.043809'),
('2022-11', '1.038926'),
('2022-12', '1.034995'),
('2023-01', '1.027901'),
('2023-02', '1.023194'),
('2023-03', '1.015376'),
('2023-04', '1.008919'),
('2023-05', '1.003600');

-- UPDATE simulacao_periodo_trabalho sp
-- JOIN atualizacao_monetaria am ON sp.mes_ano = am.mes_ano
-- SET sp.salario_atualizado = sp.salario * am.indice_atualizacao
-- WHERE sp.salario > 0;


SET sql_mode = 'STRICT_TRANS_TABLES,NO_ZERO_DATE,NO_ZERO_IN_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION';
SET FOREIGN_KEY_CHECKS = 1;
SET UNIQUE_CHECKS = 1;




