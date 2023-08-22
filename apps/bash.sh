for i in {6..150}; 
do
	cp spring-boot spring-boot$i -R
	yq -i '.name = "springboot'$i'"' spring-boot$i/spring-boot.garden.yml
done
