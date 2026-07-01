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

depois dessa parte feita tive uma reunião com o caio que me pediu algumas coisas

MUDANÇA PRINCIPAL:
Hoje o captura pega os dados do banco dentro da página, então seria melhor separar em duas partes
- backend que só busca dados e devolve
- frontend é só a parte visual que pede esses dados pro back e mostra
é melhor separar pq assim o back serve pra qualquer tela, então se é um site agr dps pode virar um aplicativo

PASTA SRC:
juntar todo o código do app numa pasta só, e deixar os arquivos de configuração na raiz, é melhor pq separa a parte do que eu progamo do que eu configuro do projeto, fica mais fácil de achar as coisas

API REST: 
São arquivos que não mostram tela, eles só recebem um pedido e devolvem dados em formato JSON.

"USE CLIENT":
é basicamente uma marca no topo do arquivo que diz um "isso roda no navegador", ele é usado pq só dá pra usar algumas ferramentas no navegador, tipo os hooks ou o useQuery. As páginas do Next rodam direto no servidor

componente nçao pode ser "async:
quando a parte roda no navegador, ele n pode ficar esperando os dados com um async/await. Em vez disso, ele pede os dados e segue. Quem cuida de esperar e avisar quando chega é o useQuery

FETCH: 
É o comando que o front usa pra pedir os dados pro back
antes ele pegava do banco direto, agora pede pela internet

USEQUERY:
é a ferramenta que cuida de buscar os dados no navegador e volta 3 coisas:
-isLoading: true enquanto tá buscando (mostra "carregando...)
- error: se deu erro (e mostra a mensagem de erro)
- data: quando os dados chegam( mostra na tela)
eu só digo o nome do dado e como buscar, ela guarda o que já buscou, pra não pedir a mesma coisa toda hora, sem ela, eu teria que controlar esses 3 estados na mão 

PROVIDER:
o useQuery precisa estar ligado pra funcionar. O provider é uma coisa que eu coloco uma vez no layout, e a partir daí o useQuery funciona em qualquer parte. Sem ele ligado o useQuery n funciona

CUSTOM HOOK: é uma função que junta a lógica de buscar uma coisa com um nome fácil em vez de repetir o useQuery + fetch em todo componente que precisa de posts, eu escrevo isso uma vez dentro do usePosts, e os componentes só chamam ele, ai se eu precisar mudar como busco, mudo num lugar só

-> O CAMINHO QUE UM DADO FAZ AGORA:
a pagina chama o usePosts -> que usa o useQuery -> que faz o fetch pro endereço /api/posts -> o arquivo do route.ts pega no banco e devolve os dados -> a tela recebe e mostra

USEMUTATION
- ele é mto parecido com o useQuery, a diferença é que ele só le dados, o useMutation muda (cria,apaga,edita)
- dou pra ele a função que faz a mudança(mutationFn) e ele me devolve o .mutate() que eu chamo no clique pra disparar

INVALIDATEQUERIES
- dps que o mutation da certo, eu chamo o invalidadeQueries, que avisa tipo "esse dado já não está mais assim, ou ele tá antigo, rebusca" e o useQuery refaz sozinho

API RESPONDE COM STATUS, NÃO REDIRECT
no API REST, quando n ta logado, ele não redireciona, só responde um status tipo 401 = não foi autorizado, 400 = mandou algo inválido, 200 = é ok
- ao mesmo tempo, a api só informa, quem decide oq fazer é o front

ROTAS PROTEGIDAS (middleware.ts)
- ele é basicamente um "porteiro" que roda antes de cada página
- ele checa se tem cookie de sessão, se não tiver manda pro login
- login e signup ficam públicas, o matcher exlui api e estáticos

ele tem um padrão, que é:
- o GET que le os dados atuais do banco e devolve em json e entrega a informação
- o HOOK que é só o mensageiro pro front. ele usa o useQuery pra chamar o get e entregar os dados prontos, a página n fala com o endpoint direto, fala com o hook
- e a PÁGINA DE EDIÇÃO que pré-preenche os campos com os seus dados atuais (vindos do hook)
e tem o botão salvar que dispara uma mutation pra gravar as mudanças

- aqui basicamente termina o pedido do caio, vou esperar ele falar se ainda preciso mudar algo

SHADCN / TOKENS
-shadcn não é uma lib normal, só copio o código do componente pro meu projeto, só edito da forma que eu quero
- os componentes não tem cor fixa, eles usan tokens do globall css, então é definidor por mim
- eles possuem "papéis", então um botão é um primary e um erro é destructive

EMPACOTAMENTO:
- pra começar, a ideia vale pros 2, pegam o front e transformam em um app funcional, seja pra desktop ou celular
- nenhum dos dois roda o backend dentro do app, tanto o banco quanto a API continuam em um servidor a parte, o app só carrega o front, que conversa pela API pela rede
por isso é bom ter o back e o front separados

ELECTRON:
-ele serve para transformar o app web em um programa de computador
- ele basicamente abre uma janela que por dentro é um navegador e essa janela só carrega o meu app
- é util pq é leve
- o processo que acontece na main cria a janela

CAPACITOR:
- ele é na mesma pegada, mas para mobile
- ele empacota o front num app nativo, em um teste, ele aponta pro app rodando via server.url
- ele é meio pesado, então precisa do Android Studio + sdk do android + emulador
- a função que cria a pasta android e coloca mto arquivo, ainda n sei se coloco pro git ignorar ou n 