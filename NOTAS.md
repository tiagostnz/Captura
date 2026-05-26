NOTAS- quero usar aqui para lembrar de algumas coisas ao longo do projeto logo irei fazer algumas notas 

arquivo package.json:
- não tem como comentar dentro dele
- não esquece que toda linha final de uma composição tem que usar virgula
- por favor olha a syntax antes de surtar, provavelmente é isso, segunda vez que eu faço isso rs

migrations:
- os arquivos são basicamente os mesmos, oq muda é que tem nomes diferentes para cada migration de cada função
- migration são códigos que descrevem mudanças no schema, executadas em uma vez só, em ordem, com histórico no próprio banco
- schema é a estrutura do banco de dados, a definição de quais tabelas existem, quais colunas elas tem, tipos, índices, chaves estrangeiras, etc.
- não dá pra editar uma migration dps que ela já rodou

next-auth:
- pra começar baixar a v5 pois estou usando o app router + next 16, se n ia ser uma dor de cabeça(ele é especifico pra isso)
- tem um sistema de Autenticação VS Autorização - o Auth cuida da autenticação, e as permissões é o adm que define
- quando um usuário loga, o servidor cria uma sessão e devolve no cookie, então, cada request seguinte, o navegador manda esse cookie de volta 

