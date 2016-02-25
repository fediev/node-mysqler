/**
 * sql for testing
 */

DROP TABLE IF EXISTS `tbm_select`;

CREATE TABLE `tbm_select` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `product` varchar(64) NOT NULL DEFAULT '',
  `color` varchar(64) NOT NULL DEFAULT '',
  `price` int(11) NOT NULL DEFAULT '0',
  `count` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
);

INSERT INTO `tbm_select` (`id`,`product`,`color`,`price`,`count`)
VALUES
(1,'apple','red',100,15),
(2,'apple','green',120,10),
(3,'mango','yellow',80,20),
(4,'grape','purple',200,10),
(5,'strawberry','red',80,30),
(6,'banana','yellow',50,25);

DROP TABLE IF EXISTS `tbm_update`;

CREATE TABLE `tbm_update` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `product` varchar(64) NOT NULL DEFAULT '',
  `color` varchar(64) NOT NULL DEFAULT '',
  `price` int(11) NOT NULL DEFAULT '0',
  `count` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
);

INSERT INTO `tbm_update` (`id`,`product`,`color`,`price`,`count`)
VALUES
(1,'apple','red',100,15),
(2,'apple','green',120,10),
(3,'mango','yellow',80,20),
(4,'grape','purple',200,10),
(5,'strawberry','red',80,30),
(6,'banana','yellow',50,25);

DROP TABLE IF EXISTS `tbm_insert_delete`;

CREATE TABLE `tbm_insert_delete` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `product` varchar(64) NOT NULL DEFAULT '',
  `color` varchar(64) NOT NULL DEFAULT '',
  `price` int(11) NOT NULL DEFAULT '0',
  `count` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
);

INSERT INTO `tbm_insert_delete` (`id`,`product`,`color`,`price`,`count`)
VALUES
(1,'apple','red',100,15),
(2,'apple','green',120,10),
(3,'mango','yellow',80,20),
(4,'grape','purple',200,10),
(5,'strawberry','red',80,30),
(6,'banana','yellow',50,25);
