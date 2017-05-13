
all: helloworld

helloworld:
	SECRET=ObjectIsAdvantag SPARK_TOKEN=M2I4NWM1MDItZjMyNS00NjI4LWFlYjMtMGI0YmM3OWI5M2FjZTdjOWEyNGEtMjk0 PUBLIC_URL=https://9e9a39e9.ngrok.io node helloworld.js

devnet:
	SECRET=ObjectIsAdvantag SPARK_TOKEN=M2I4NWM1MDItZjMyNS00NjI4LWFlYjMtMGI0YmM3OWI5M2FjZTdjOWEyNGEtMjk0 PUBLIC_URL=https://9e9a39e9.ngrok.io node devnet.js

roomid:
	SECRET=ObjectIsAdvantag SPARK_TOKEN=M2I4NWM1MDItZjMyNS00NjI4LWFlYjMtMGI0YmM3OWI5M2FjZTdjOWEyNGEtMjk0 PUBLIC_URL=https://9e9a39e9.ngrok.io node roomid-phantom.js
