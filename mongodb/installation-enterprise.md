1)  set the mongo version, for example:  
```
export MONGODB_VERSION=6.0
```
2) Download the build files from the Docker Hub mongo project :
```
curl -O --remote-name-all https://raw.githubusercontent.com/docker-library/mongo/master/$MONGODB_VERSION/{Dockerfile,docker-entrypoint.sh}
```
3) Use the downloaded build files to create a Docker container image wrapped around MongoDB Enterprise:
```
chmod 755 ./docker-entrypoint.sh
docker build --build-arg MONGO_PACKAGE=mongodb-enterprise --build-arg MONGO_REPO=repo.mongodb.com -t mongo-enterprise:$MONGODB_VERSION .
```
We can add shecan for its errors in build process:
```
RUN echo -e "nameserver 178.22.122.100" > /etc/resolv.conf
```
( if it fails,, keep running the build process a couple more time.)

4) push the image to the artifactory repo: 
```
docker tag mongo-enterprise:6.0 docker.localhost:8082/docker/mongo-enterprise:6.0
docker push docker.localhost:8082/docker/mongo-enterprise:6.0
```
(check this link for more info on installation)
