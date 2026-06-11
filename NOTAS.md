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

zod:
- ele serve pra validar dados, então, conferir se o que chegou tá no formato que eu defini antes de ser usado( se a senha tem 6 caracteres por exemplo)
- eu escrevo um schema, que é só a descrição das regras de cada campo, tipo um molde
- usei o .safeParse(dados) pq se der erro, ele não quebra, só devolve o erro

likes:
- like é uma linha numa tabela de ligação, curtir cria a linha e descutir apaga
- o número é só uma contagem dessas linhas
- vou adicionar uma forma que fique melhor e mais completa dps
comentários:
- é basicamente a mesma coisa
- cria e apaga, e uma lista do que e u ja fiz pra decidir oq mostrar
-esse mesmo padrão se aplica tbm pros follows

perfil:
-criei toda a parte de perfil do usuário,

armazenamento de arquivos de posts:
- optei por usar um serviço de nuvem, pelo que pesquisei é o jeito real de produção, então acho melhor usar ele

laboratório de credentials:
- criei um laboratório que vai ser apagado mas vou explicando oq vou testando.
SQL INJECTION:
- primeiro comecei com SQL injection, que, quando vc digita um email qualquer com uma senha tipo ' OR '1'+'1 fecha a string da senha, e o resto vira comando SQL de vdd, n mais um dado, logo o banco devolve todos os usuários (a query pega o primeiro) e o código interpreta o login deu certo (pelo que entendi o knex protege isso mas é sempre bom saber)
- então a solução disso seria separar os dois, aientra a query parametrizada, no caso, quando vc manda algo pro banco, em vez dele analisar tudo, ele só vai procurar alguma senha que seja igual ao que vc mandou, ent tira a possibilidade dele executar aquilo como SQL
HASH DE SENHAS:
- pelo que eu entendi nunca guarda a senha real no banco, pq se o banco vazar, todas as senhas seriam expostas. em vez disso guarda um "hash" que basicamente é um embaralhamento de mão unica, isso significa que é facil ir senha e voltar senha, mas o hash é praticamente impossivel voltar hash
- outra coisa que entendi é que usamos o bcrypt pq ele joga um valor aleatório em cada hash, ent 2 usuários com as mesmas senhas tem hashes diferentes, isso quebra um negocio chamado "raimbow tables" que são tabelas absurdamente grandes de hashes pré caluculados, e esconde quem usa a mesma senha.
-além do fato que ele é lento de propósito, ao modo de, 1 login n da pra sentir, mas se uma pessoa tentar bilhões de senha ao mesmo tempo, fica lento dms pra valer a pena
ENUMERAÇÃO POR MENSAGEM:
- isso é algo tão comum que quase pessa imperceptivel, se toda vez que vc tentar fazer login dissesse "esse email não existe" e em outro momento passasse para senha incorreta", um atacante digitaria uma lista de emails e descobriria quais estão cadastrados no site, e dps fazer o phishing, testar senhas vazadas de outro site e etc
- n tem mto Uma forma certa de se defender, mas a melhor opção seria colocando uma mensagem genérica
ENUMERAÇÃO POR TEMPO
- aqui ta uma coisa mto sutil, mesmo com uma mensagem genérica, o tempo de resposta entrega oq n deveria entregar.
- se o email n existir ele cai no if !(user) e responde na hora, então acontece de não rodar o bcrypt, logo entrega uma resposta rápida
- mas caso o email exista mas a senha está errada, ele roda o bcrypt.compare, que é lento de propósito, e dá pra identificar se o email colocado está certo ou n, então um atacante mede o tempo de respostas e conclui oq ta no banco e oq não está.
- a defesa seria comparar sempre (hash fantasma) pra nivelar o tempo
TENTATIVAS INFINITAS:
- esse é um dos mais simples, basicamente se um site deixa tentar quantas senhas quiser até acertar, mesmo possuindo o bcrypt, abre 2 tipos de ataques:
- a força bruta que a pessoa tentaria diversas vezes até acertar
- credential stuffing que ela pegaria listas gigantes de email/senhas vazadas de outros sites e testa
- a defesa seria limitar o numero de tentativas de um usuário, por exemplo 10 vezes em uma janela de 2 minutos, assim tira a possibilidade de adivinhar
- normalmente sistemas reais combinam IP + conta + capcha, pra evitar travar a conta de uma vitima de proposito, para ela não ter a possibilidade de entrar, e mudar a senha e etc
SESSÃO E COOKIES:
- cada requisição que o navegador faz é independente, logo o servidor não lembra de nada da requisicão anterior, então pra isso serve o cookie, que é nada mais que um crachá que o navegador guarda e reenvia na sua requisição seguite, toda segurança gira em torno de proteger o cookie
- token imprevisível/assinado > basicamente um atacante n consegue inventar um cookie valido
-AUTTH_SECRET > o cookie possui um conteudo oculto, que caso seja alterado, a assinatura quebra e o servidor rejeitaz
- httpOnly > o javascript da pagina n consegue ler o cookie, então, mesmo que injetem um script malicioso, não conseguem acessar o cookie
