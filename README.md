# node-npl
node web app boilerplate

download mysql zip file for windows

type c:\windows\my.cnf

[mysqld]
basedir=C:\\code\\mysql-8.0.20-winx64
datadir=C:\\code\\mysql-8.0.20-winx64\\data

mysqld --initialize --console

note the initial password:

[Note] [MY-010454] [Server] A temporary password is generated for root@localhost: L=Vxv)Oqw5oa

ALTER USER 'root'@'localhost' IDENTIFIED BY 'welcome';

ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'welcome';

flush privileges;