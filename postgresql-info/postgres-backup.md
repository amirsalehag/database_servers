# backup database
```
pg_dump --file /data/backups/"$dbname"/"$dbname"_db_"${today_date}".sql --host "127.0.0.1" --port "5432" \
--username "postgres" --no-password --role "postgres" --format=c --blobs --encoding "UTF8" "$dbname"
```
When the postgres database needs an authentication, we can make a `.pgpass` file inside the user home directory which the above command  
is being executed with(if run with <username> then <username>/.pgpass), which contains the format bellow:  
```
 <pg host ip>:<port>:<db name>:<db username>:<password>
```
Remember to change its permissions like this:  
```
sudo chown 600 .pgpass
```
We can use wild cards too. like `*:*:*:postgres:postgres`.  

---
