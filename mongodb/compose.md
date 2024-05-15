```
version: '3.1'
services:
  mongodb_data_analysis:
    container_name: mongodb_data_analysis2
    image: docker.localhost:8082/docker/mongo-enterprise:6.0
    restart: always
    ports:
      - "27017:27017"
    volumes:
      - /etc/localtime:/etc/localtime:ro
      - /etc/timezone:/etc/timezone:ro
      - /data/mongodb_data_analysis:/data/db
      - /srv/mongodb_data_analysis/configdb:/data/configdb
      - /srv/mongodb_data_analysis/backup:/opt/backup
      - /srv/mongodb_data_analysis/config/mongod.conf:/etc/mongod.conf
      - /srv/mongodb_data_analysis/keyfile/KeyFile:/data/keyfile/KeyFile
      - /var/log/mongodb_data_analysis:/var/log/mongodb
    environment:
      MONGO_INITDB_ROOT_USERNAME: root
      MONGO_INITDB_ROOT_PASSWORD: Telemetry
    command: --config /etc/mongod.conf --quiet --replSet analysis --keyFile /data/keyfile/KeyFile
    logging:
      driver: "json-file"
      options:
        max-file: "1"
        max-size: "500m"
    healthcheck:
      test: mongosh --eval 'db.runCommand("ping").ok' --quiet
      interval: 1m
      timeout: 15s
      retries: 2
      start_period: 30s
    networks:
      - data_analysis

networks:
  data_analysis:
    name: data_analysis
    external: true

```
