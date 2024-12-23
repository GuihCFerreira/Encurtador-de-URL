<img src="./url-shortener/public/logo_url.png" width=100 />

# URL-Shortener
O URL-Shortener é um projeto que permite você encurtar suas URL's e definir um prazo de validade.

## Projeto

O URL-Shortener é um projeto feito em Java, utilizando de alguns serviços serverless da AWS, que foi desenvolvido durante o curso de Java da Rocketseat e ministrado pela Fernanda Kipper.

No Back-End, utilizamos o Java para poder criar 2 projetos, o GenerateUrlShortener e o RedirectUrlShortener, eles foram integrados juntamente de uma função Lambda na AWS. A Lambda de gerar a URL encurtada, pega os dados enviados no body da requisição e grava denro de um arquivo .json no S3 Bucket, o de redirecionar, lê os dados desse json e redireciona para a URL original, se estiver dentro do prazo de validade. 

Foi utilizado o serviço do API Gateway para concentrar as 2 requisições em uma mesma URL base, alterando as rotas e os métodos REST.

Como o projeto desenvolvido trata-se de uma API, para pessoas que não são desenvolvedoras possuem mais dificuldade ou não conseguem entender, por isso decidi criar uma aplicação Front-End para consumir essa API. Para isso utilizei o Vite com ReactJs, TypeScript, Tailwind para estilização e ShadcnUI para a parte da UI.

## Tecnologias utilizadas
 - Java
 - AWS Lambda
 - AWS S3 Bucket
 - AWS API Gateway
 - React
 - TailwindCSS

## Executar o projeto Front-End localmente

Para executar o código, é necessário ter instalado o NodeJs, Docker ou Postgres e o Git.

```bash
# Clone este repositório
$ git clone <https://github.com/GuihCFerreira/Encurtador-de-URL.git>

# Acesse a pasta do projeto no terminal/cmd
$ cd Encurtador-de-URL

# Acesse a pasta do projeto front-end no terminal/cmd
$ cd url-shortener

# Instale as dependências
$ npm install

# Execute a aplicação 
$ npm run dev

# O servidor inciará na porta:5173 - acesse <http://localhost:5173>
```

## Deploy

Foi utilizado a Vercel para fazer deploy da aplicação Front-End

https://encurtador-de-url-guih.vercel.app

## Imagens do projeto 

<img src="assets/image_01.png">
<img src="assets/image_02.png">
<img src="assets/image_03.png">
<img src="assets/image_04.png">
<img src="assets/image_05.png">
<img src="assets/image_06.png">

## Licença

Projeto desenvolvido por mim Guilherme durante a NLW Pocket da RockeSeat.
