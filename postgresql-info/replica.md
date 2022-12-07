# replication solutions
There are many replication methods available with their own benefits and flaws.  
Check out its [documentation](https://www.postgresql.org/docs/current/different-replication-solutions.html) for more information.  

---
# standby server
* A standby server can be implemented using file-based log shipping or streaming replication, or a combination of both.  
* A standby server can also be used for read-only queries, in which case it is called a hot standby server.  
* A server enters standby mode if a `standby.signal` file exists in the data directory when the server is started.  

---
# log shipping replication
* Directly moving WAL records from one database server to another is typically described as log shipping.  
PostgreSQL implements file-based log shipping by transferring WAL records one file (WAL segment) at a time.  
WAL files (16MB) can be shipped easily and cheaply over any distance.  
* It should be noted that log shipping is asynchronous, i.e., the WAL records are shipped after transaction commit.  
As a result, there is a window for data loss should the primary server suffer a catastrophic failure;  
transactions not yet shipped will be lost. The size of the data loss window in file-based log shipping can be limited by use of  
the archive_timeout parameter, which can be set as low as a few seconds. However such a low setting will substantially increase  
the bandwidth required for file shipping. Streaming replication allows a much smaller window of data loss.

---
# updating postgres
* When updating to a new minor release, the safest policy is to update the standby servers first; a new minor release  
is more likely to be able to read WAL files from a previous minor release than vice versa.  

---
