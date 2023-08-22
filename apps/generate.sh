#!/usr/bin/env sh

for i in {51..155}; do
  echo $i
  cp -R spring-boot "spring-boot-${i}"
  yq -i '.name = "spring-boot-'$i'"' "spring-boot-${i}/spring-boot.garden.yml"
done
