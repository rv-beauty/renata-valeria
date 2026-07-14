# Renata Valéria | Curadoria Exclusiva de Beleza

Landing page premium desenvolvida para o portfólio da consultora de beleza **Renata Valéria**, destacando uma seleção exclusiva de grandes marcas brasileiras e internacionais (O.U.i, Natura, O Boticário, Eudora, Quem Disse Berenice, Avon, Mary Kay e Racco). 

O projeto foi projetado com foco em **design minimalista de luxo**, **alta conversão** e **integração simplificada com o WhatsApp** para fechamento de vendas.

---

## 🚀 Funcionalidades Principais

* **Redirecionamento Inteligente para WhatsApp**:
  * O site é configurado com um número centralizador (`+55 31 9637-8065`).
  * Todos os links e botões estáticos no HTML que apontam para o WhatsApp são atualizados dinamicamente pelo script.
* **Vitrine Interativa com Pedidos Diretos**:
  * Cada card de produto possui preços e um botão **"Pedir no WhatsApp"**.
  * Ao clicar, o cliente é redirecionado para o WhatsApp com uma mensagem personalizada pré-preenchida especificando o nome e a marca do produto solicitado.
* **Filtro de Produtos por Marca**:
  * Grade interativa que permite filtrar os produtos da vitrine ao clicar na logomarca do fabricante.
  * Conta com efeito visual de destaque ativo (a logo selecionada fica colorida e com zoom suave) e esmaecimento suave (*fade-in*) dos produtos filtrados.
* **Botão Flutuante do WhatsApp**:
  * Posicionado no canto inferior direito, acompanha a rolagem da página.
  * Possui uma **animação de pulso ondulada (*ripple effect*)** para otimizar as taxas de conversão de atendimento.
* **Temporizador Regressivo (*Countdown*)**:
  * Localizado no banner de oferta especial. 
  * Exibe dinamicamente as horas, minutos e segundos restantes.
  * **Mecanismo Inteligente**: Se a data definida no HTML tiver expirado, o script gera automaticamente um prazo de 3 dias a partir do momento do acesso, mantendo o apelo de urgência da oferta.
* **Menu Mobile Responsivo**:
  * Menu em cascata acionado por um botão hambúrguer elegante que se transforma em "X" quando aberto.
  * Fecha de forma inteligente ao clicar em um link, fora do menu ou rolar a página.
* **Scrollspy (Destaque Ativo de Navegação)**:
  * O menu de cabeçalho destaca automaticamente a seção onde o usuário está navegando no momento, melhorando a usabilidade.
* **Newsletter com Feedback Premium**:
  * Ao se inscrever, um *Toast Notification* animado desliza do canto inferior esquerdo informando o sucesso do cadastro, sem a necessidade de atualizar a página.

---

## 📂 Estrutura do Projeto

```text
renata-valeria/
├── css/
│   ├── base.css          # Reset CSS, variáveis globais e tokens de design (fontes, cores)
│   ├── components.css    # Estilização de botões, cards, depoimentos e botão flutuante
│   ├── layout.css        # Estrutura das seções (grid, flexbox, responsividade e menu mobile)
│   └── main.css          # Ponto de entrada do CSS (importa base, components e layout)
├── images/
│   ├── logos/            # Logomarcas das fabricantes e logo Renata Valéria
│   ├── products/         # Imagens dos produtos em destaque na vitrine
│   ├── icons/            # Ícones de redes sociais (SVG)
│   ├── perfil.png        # Foto de perfil da consultora na seção sobre
│   └── hero-bg.png       # Imagem de fundo premium da seção hero
├── js/
│   └── script.js         # Lógica da aplicação, filtros, menu, timer e WhatsApp
├── index.html            # Estrutura HTML5 semântica da landing page
└── README.md             # Documentação do projeto
```

---

## 🛠️ Tecnologias Utilizadas

1. **HTML5**: Semântico e otimizado para SEO.
2. **CSS3 (Vanilla)**: Design premium baseado em variáveis, utilizando a metodologia BEM (*Block-Element-Modifier*).
3. **JavaScript (Vanilla/ES6+)**: Código limpo, modular, livre de dependências externas (como jQuery) e de carregamento assíncrono para garantir o máximo desempenho.
4. **Google Fonts**: Fontes carregadas de forma otimizada para manter a estética idêntica ao design original (*Playfair Display* e *Inter*).

---

## ⚙️ Configuração do WhatsApp

Para alterar o número de WhatsApp de destino das mensagens ou a mensagem padrão de contato, abra o arquivo [js/script.js](file:///C:/Users/Meibo/Documents/Porjetos/renata-valeria/js/script.js) e edite a constante global:

```javascript
const WHATSAPP_NUMBER = '553196378065'; // Digite apenas números, incluindo o DDI 55
```

O script cuidará de reconfigurar todos os botões e links de forma 100% automatizada.

---

## 🏃 Como Rodar o Projeto

Como o site é construído em tecnologia estática nativa (HTML, CSS e JS), existem duas maneiras simples de executá-lo:

### Opção 1: Diretamente no Navegador (Offline)
Basta abrir a pasta do projeto e dar um clique duplo no arquivo [index.html](file:///C:/Users/Meibo/Documents/Porjetos/renata-valeria/index.html).
*(Nota: Todos os caminhos de imagem foram convertidos para caminhos relativos para garantir compatibilidade total mesmo abrindo o arquivo direto do disco rígido).*

### Opção 2: Servidor Local (Recomendado para Desenvolvimento)
Para rodar em um servidor de desenvolvimento local, você pode utilizar extensões como o **Live Server** (do VS Code) ou rodar comandos na pasta raiz do projeto usando terminal:

* Com **Node.js**:
  ```bash
  npx http-server .
  ```
* Com **Python**:
  ```bash
  python -m http.server 8000
  ```

---

## 📈 Recomendações e Melhorias Futuras

Avaliando a estrutura do site, abaixo estão listadas sugestões para levar a aplicação ao próximo nível profissional:

1. **Otimização de Imagens**:
   * As imagens `hero-bg.png` (930 KB) e `perfil.png` (1.4 MB) são relativamente pesadas e podem prejudicar a nota de performance do site no Google PageSpeed. 
   * **Recomendação**: Converter essas imagens para o formato `.webp` com compressão e dimensionar corretamente. Isso pode reduzir o tamanho dos arquivos em até 80% sem perda visível de qualidade.
2. **Carregamento Otimizado de Ícones**:
   * Algumas imagens de ícones do menu ou selos poderiam ser embutidas inline como SVG direto no código HTML para diminuir o número de requisições HTTP adicionais.
3. **Mecanismo de Sacola de Compras (*Cart*)**:
   * Criar uma sacola de compras simples no JS, permitindo que a cliente clique em "Pedir" em múltiplos produtos e envie um único carrinho unificado para o WhatsApp da Renata.
4. **Metatags de Redes Sociais (Open Graph)**:
   * Adicionar tags `<meta property="og:..." />` no `<head>` para garantir que ao compartilhar o link do site no WhatsApp, Instagram ou Facebook, apareça uma miniatura bonita com o título e a logo da marca.
5. **Configuração de Domínio e SSL**:
   * Ao publicar a landing page, certificar-se de ativar o protocolo HTTPS (SSL) para transmitir confiança às clientes e melhorar o ranqueamento SEO no Google.
