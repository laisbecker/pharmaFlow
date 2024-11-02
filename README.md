# PharmaFlow - README

O Aplicativo PharmaFlow foi desenvolvido como objetivo de otimizar o controle da movimentações de produtos entre filiais, bem como a gestão os usuários. Ele oferece uma interface intuitiva e funcionalidades robustas para melhorar a experiência de gestão.

O PharmaFlow resolve a necessidade de um sistema eficiente para gerenciar produtos e suas movimentações entre filiais, com funcionalidades de login seguro, cadastro e gerenciamento de usuários, e uma tela de listagem de produtos com busca avançada. 
Além disso, motoristas podem acessar as informações de suas entregas e acompanhar o status das movimentações.

## Tecnologias Utilizadas

- **JavaScript (React Native)** — para a interface do usuário
- **TypeScript** — para garantir a tipagem e evitar erros
- **Lottie** — para ícones animados, melhorando a interatividade

### Bibliotecas Principais:

- `@react-native-async-storage/async-storage`
- `@react-native-picker/picker`
- `@react-navigation/native` e `@react-navigation/stack`
- `axios` — para requisições HTTP
- `expo` e `expo-image-picker` — para funcionalidades nativas do Expo
- `react-native-maps` — para visualização de mapas
- `react-native-picker-select` — para seleção de itens com visual personalizado
- `validator` — para validações de campos de entrada

## Como Executar o Projeto:

1. Clone o servidor local: `template_m1` (link abaixo):
   ```bash
   git clone https://github.com/DEVinHouse-Clamed-V3/template_m1
   cd template_m1
   npm install
   npm run start

2. Clone este projeto, e configure o IP do servidor no arquivo .env do PharmaFlow:

Abra o arquivo .env e atualize o IP para o IP da sua máquina.
Instale as dependências do PharmaFlow com os comandos: npm install / npm run start

3. Baixe o EXPO em seu celular, e leia o QR code que vai aparecer na tela do seu computador depois de npm run star.

O aplictivo vai abrir na tela de login. 

Usuários para Login Pré-Existentes:

Motorista (Acessa a tela de rastreio das movimentações, por status):
Email: clebersilva@gmail.com
Senha: 123456

Admin (Acessa a listagem de produtos existentes em todas as filiais, e gerencia os usuários):
Email: admin@gmail.com
Senha: 123456

Filial (Acessa a tela de listagem de movimentações de todas as filiais, e cadastra novas movimentações):
Email: bemavita@gmail.com
Senha: 123456

====================================================================

Melhorias Futuras
Modo Escuro — para melhor conforto visual em ambientes com pouca luz.
Localização em Tempo Real — para acompanhamento ao vivo das entregas.
Notificações Push — para informar mudanças no status das movimentações em tempo real.
Suporte Multilíngue — para facilitar o uso por colaboradores que falem outros idiomas.
