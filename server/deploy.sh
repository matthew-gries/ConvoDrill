#!/bin/bash

echo What should the version be?
read VERSION

docker build -t convodrill/convodrill:$VERSION .
docker push convodrill/convodrill:$VERSION
echo "Run the following in DigitalOcean:"
echo "docker pull convodrill/convodrill:$VERSION && docker tag convodrill/convodrill:$VERSION dokku/api:$VERSION && dokku deploy api $VERSION"