/*
 * siege -c2000 -t10S --header="Cookie: BH=64216a666dac800f8c2cd4b6d13064ae09942a7a5edb0b24f65956e6ba22d6a3" http://localhost:8080/admin
 * "c:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -uroot -proot
 */
drop database if exists foxpad;
create database foxpad;
use foxpad;

drop table if exists User;

create table User (
   id            int unsigned NOT NULL AUTO_INCREMENT,
   name          varchar(128) NOT NULL,
   email         varchar(128) NOT NULL,
   password      varchar(64) NOT NULL,
   image         varchar(255),
   isActive      tinyint default 1,
   isSuper       tinyint default 0,
   primary key (id)
) ENGINE=InnoDB AUTO_INCREMENT=99 DEFAULT CHARSET=latin1;

desc User;
insert into User (name, email, password, isSuper) values ('admin','admin','admin', 1);
insert into User (name, email, password) values ('e3','e3','e3');
select * from User;

create table Session (
   id       int unsigned NOT NULL AUTO_INCREMENT,
   uid      int unsigned NOT NULL,
   hash     varchar(64) NOT NULL,
   primary key (id),
   foreign key (uid) REFERENCES User(id) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=latin1;

desc Session;

drop table if exists Cameras;
drop table if exists Agents;

create table Agents (
   id            int unsigned NOT NULL AUTO_INCREMENT,
   sid           varchar(128) NOT NULL,
   host          varchar(128) NOT NULL,
   port          int unsigned NOT NULL,
   primary key (id)
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=latin1;

create table Cameras (
   id            int unsigned NOT NULL AUTO_INCREMENT,
   sid           varchar(128) NOT NULL,
   source        varchar(128) NOT NULL,
   target        varchar(128) NOT NULL,
   tracker       varchar(128) NOT NULL,
   skipcount     int unsigned DEFAULT 1,
   aid           int unsigned,
   primary key (id),
   foreign key (aid) REFERENCES Agents(id) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=latin1;

create table Trails (
   id            int unsigned NOT NULL AUTO_INCREMENT,
   cid           int unsigned,
   aid           int unsigned,
   ts            DATETIME,
   path          MULTIPOINT,
   primary key (id),
   foreign key (cid) REFERENCES Cameras(id) ON DELETE SET NULL,
   foreign key (aid) REFERENCES Agents(id) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=latin1;

/*
 * insert into trails (cid, aid, ts, path) values (1, 1, NOW(), ST_GeomFromText('MULTIPOINT(0 0,10 10,10 20,20 20)'));
 * SELECT cid,aid,ts,ST_AsText(path) FROM trails;
 */