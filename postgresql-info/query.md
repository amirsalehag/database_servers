# counting active connections on postgres
```
select count(*) from pg_stat_activity;
```
# checking connection ip addresses
```
select count(client_addr) as c,client_addr from pg_stat_activity group by client_addr order by c desc;
```
# dropping all active connections
```
SELECT pg_terminate_backend(pg_stat_activity.pid) FROM pg_stat_activity WHERE pg_stat_activity.datname = '<database name>' AND pid <> pg_backend_pid()
```
# disable connection acceptance on a database
```
UPDATE pg_database SET datallowconn=false WHERE datname='<database name>'
```
