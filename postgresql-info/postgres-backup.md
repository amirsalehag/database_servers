# backup database
```
pg_dump --file /data/backups/"$dbname"/"$dbname"_db_"${today_date}".sql --host "127.0.0.1" --port "5432" \
--username "postgres" --no-password -c --role "postgres" --format=c --blobs --encoding "UTF8" "$dbname"
```
* When the postgres database needs an authentication, we can make a `.pgpass` file inside the user home directory which the above command is being executed with(if run with <username> then <username>/.pgpass), which contains the format bellow:  
```
<pg host ip>:<port>:<db name>:<db username>:<password>
```
* Remember to change its permissions like this:  
```
sudo chown 600 .pgpass
```
We can use wild cards too. like `*:*:*:postgres:postgres`.  

---
# best practice for backup
https://github.com/pgbackrest/pgbackrest/issues  
https://www.educba.com/postgresql-incremental-backup/

---
# restoring the backup
```
 pg_restore -v --no-owner --dbname postgres -c --create /<path>/<to>/<dump file name>
```
* This command restores a dump into even a newly created postgres for example as a container somewhere else, and with `--create` argument, we tell that it should create the databases inside the postgres if its not even available, and also with `--no-owner` may not be needed if your user name is the same on both machines. But if the dump was done as user1 and the restore done as user2. The new objects need to be owned by user2 and `--no-owner` achieves this.  
* Remember that if we are using postgres as container, then it might be running with user root, which means that the command above is using the root user as the role for the command, which is not going to work because there might not be a specified role as root, so we need to run this command with user:  
```
docker exec -i --user postgres <db container name> pg_restore ...
```
---
# bash function for backup and restoring
 ```
 func_restore () {
    #Making sure that theres no connection to the database before restoring into it, and after restoring, just to be on the safe side, we allow the connections connections again.
  echo -e "$GRN----> Disconnecting and also deactivating any connections to the $db database.$END" ; \
  docker exec -i "$container" psql -U postgres -d postgres -c "UPDATE pg_database SET datallowconn=false WHERE datname='$datname'" && \
  docker exec -i "$container" psql -U postgres -d postgres -c "SELECT pg_terminate_backend(pg_stat_activity.pid) FROM pg_stat_activity WHERE pg_stat_activity.datname = '$datname' AND pid <> pg_backend_pid()" && \
  
  echo -e "$GRN----> Restoring the $db dump-file. ### Started in : $(date "+%Y/%m/%d %H:%M")$END" ; \
  docker exec -i --user postgres "$container" pg_restore --no-owner --dbname postgres -c --create "$dump_path" >>/var/log/database/restore-exec.log && \
  echo -e "$GRN----> Restoring has been done. ### Ended in : $(date "+%Y/%m/%d %H:%M")$END" ; \
  
  docker exec -i "$container" psql -U postgres -d postgres -c "UPDATE pg_database SET datallowconn=true WHERE datname='$datname'" && \
  echo -e "$GRN----> Connection brought back to default state just in case.$END"
}
```
