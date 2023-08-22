#!/usr/bin/env sh

for i in {16..100}; do
  echo $i
  rm -rf  "spring-boot-${i}"
done
