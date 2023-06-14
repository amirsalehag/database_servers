# backup command from replicaSet mongodb  
Backup from a replicaset with gzip and archive enabled:  
```
mongodump --host='analysis/mongodb1:27017,mongodb2:27017,mongodb3:27017' --authenticationDatabase=admin \
--username=root --password=<password> --db=<database name> --gzip --archive=/path/to/backupfile
```
* Rememeber to put the replicaset name bafore host urls.  
---
# Restoring the backup file to standalone mongodb
```
mongorestore --host='127.0.0.1:27017' --authenticationDatabase=admin --username=root --password=<password> --gzip --archive=/path/to/backup-file --quiet
```
* if we want to restore to a replicaset, we specify them like bellow:  
```
--host='127.0.0.1:27017,<host2>:27017,...'
```
