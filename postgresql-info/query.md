# counting active connections on postgres
```
select count(*) from pg_stat_activity;
```
# checking connection ip addresses
```
select count(client_addr) as c,client_addr from pg_stat_activity group by client_addr order by c desc;
```
