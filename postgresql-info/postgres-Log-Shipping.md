## setting up postgres replica as log-shipping method with hot-standby
we have 2 nodes with postgres 14 locally installed on them.  
for testing, we create a table with values on the primary server:
```
sudo -u postgres psql postgres

CREATE TABLE guestbook (visitor_email text, vistor_id serial, date timestamp, message text);
INSERT INTO guestbook (visitor_email, date, message) VALUES ( 'jim@gmail.com', current_date, 'This is a test.');
\q
```
* then remember to make ssh keys for postgres user between the nodes.  
* and also remember that the postgres servers can listen from the needed range of ip's:  
```
  # /etc/postgresql/14/main/postgresql.conf
listen_addresses = '*'
```
## Configuring the primary server
To configure the primary server, you will:  
Create a Postgres user for replication activities.  
Create a directory to store archive files.  
Edit two configuration files: pg_hba.conf and postgresql.conf.  
* Create a user for replication
```
sudo -u postgres createuser -U postgres repuser -P -c 5 --replication
```
* Create the archive directory on all nodes  
Create a directory to store archive files. This directory is a subdirectory of the cluster's data directory, which is named main by default.  
```
sudo -u postgres mkdir -p /var/lib/postgresql/main/mnt/server/archivedir
```
* Edit pg_hba.conf  
```
# Allow replication connections
host     replication     repuser         [standby-IP]/24        md5
```
* Edit postgresql.conf  
```
wal_level = replica
archive_mode = on
archive_timeout = 900       ### this will trigger WAL switch every 15 mins.
max_wal_senders = 3
archive_command = 'test ! -f /mnt/server/archivedir/%f && rsync < -e "ssh -p 5566" > -a %p postgres@replica-server:/var/lib/postgresql/main/mnt/server/archivedir/%f'  ### for using rsync it need to be installed on all the nodes.
```
* Restart the primary server  
```
sudo service postgresql restart
```
## configuring the standby server  
Before making changes on the standby server, stop its postgres server first.  
* we move the old main directory to somewhere else because when using pg_basebackup it doesnt override it, it adds to it:  
```
sudo mv /var/lib/postgresql/14/main /var/lib/postgresql/14/old_main
```
Then we use the `pg_basebackup` to copy over the main data directories to the replica:  
```
sudo -u postgres pg_basebackup -h 172.*.*.* -p 5432 -U repuser -D /var/lib/postgresql/14/main  -Fp -Xs -P -v
```
and then we are asked for the user password.  
Then we create a file standby.signal in the data directory this file will cause PostgreSQL Server to enter in standby mode:  
```
sudo -u postgres touch /var/lib/postgresql/14/main/standby.signal
```
* Set the below parameters in Standby postgresql.conf file:  
```
restore_command = 'cp /var/lib/postgresql/main/mnt/server/archivedir/%f %p'
archive_cleanup_command = 'pg_archivecleanup -d /var/lib/postgresql/main/mnt/server/archivedir %r'
recovery_target_timeline = 'latest'
hot_standby = on
```
and then restart the postgresql service.  

---
* you can test which postgres is the master or replica by this command in psql:  
```
select pg_is_in_recovery();
```
if t (true) then replica, if f (false) then master.  

---
