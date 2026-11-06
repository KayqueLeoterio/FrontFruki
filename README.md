# Fruki Recomenda — Frontend

Aplicação web de demonstração da **Fruki Recomenda**: uma interface que recomenda produtos para clientes e ajuda vendedores a entender os motivos de cada sugestão.

O projeto é um protótipo: todos os dados (clientes, produtos, métricas e recomendações) são mockados em memória. 

## Sumário

- [Visão geral](#visão-geral)
- [Stack tecnológica](#stack-tecnológica)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Execução](#execução)
- [Scripts disponíveis](#scripts-disponíveis)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Arquitetura e navegação](#arquitetura-e-navegação)
- [Telas e funcionalidades](#telas-e-funcionalidades)
- [Dados mockados](#dados-mockados)
- [Imagens e assets](#imagens-e-assets)
- [Estilização](#estilização)
- [Build e preview](#build-e-preview)
- [Convenções e cuidados](#convenções-e-cuidados)
- [Limitações conhecidas](#limitações-conhecidas)
- [Próximos passos](#próximos-passos)

---

## Visão geral

A aplicação simula dois perfis de uso:

| Perfil | Objetivo |
| --- | --- |
| **Cliente** | Simular o login do cliente feito por CNPJ, apresentando uma interface personalizada com a lista de produtos recomendados de acordo com seu perfil e a analise feita pelo nosso recomendador.|
| **Vendedor** | Traz uma interface insipirada no super APP dos vendedores da fruki, com a funcionalidade de Recomendação, onde e mostrado os produtos recomendados como também as informações do porque esses produtos foram recomendados pelo nosso recomendador |

---

## Stack tecnológica

- **React 19** + **React DOM 19**
- **TypeScript 5.7** (modo `strict`)
- **Vite 8** como bundler e dev server
- **Tailwind CSS v4** via plugin `@tailwindcss/vite` (sem `tailwind.config` nem PostCSS)
- **oxfmt** para formatação de código
- **Figma Make** como plataforma de origem (plugins customizados no `vite.config.ts`)

Gerenciamento de toolchain:

- **Node.js 22** e **pnpm 10.34.3** definidos em `.mise.toml`

---

## Pré-requisitos

- Node.js **22+**
- Um gerenciador de pacotes: **npm** ou **pnpm** (recomendado usar a versão do `.mise.toml`)

Se usar [mise](https://mise.jdx.dev/):

```bash
mise install
```

---

## Instalação

```bash
# com npm
npm install

# ou com pnpm
pnpm install
```

> O projeto possui `package-lock.json` e `pnpm-lock.yaml`. Escolha um gerenciador e mantenha o lockfile correspondente.

---

## Execução

```bash
# desenvolvimento
npm run dev
# ou
pnpm dev
```

O servidor Vite sobe em:

- **Host:** `0.0.0.0` (aceita acesso na rede local)
- **Porta:** `8443` (definida por `PORT`, padrão `8443`, com `strictPort: true`)

Acesse em `http://localhost:8443` ou pelo IP da máquina na rede local.

> `STRICT PORT`: se a porta `8443` estiver ocupada, o Vite falha em vez de escolher outra porta. Libere a porta ou defina `PORT=outra_porta`.

## Arquitetura e navegação


### Fluxo do cliente

1. O usuário informa o CNPJ na tela de login.
2. Se encontrado, exibe os produtos recomendados.
4. O botão **Sair** no menu do avatar do perfil encerra a sessão local e volta para tela de login.

### Fluxo do vendedor

1. **Rota do dia:** lista a rota de clientes do vendedor.
2. Ao selecionar um cliente, avança para o **PDV**.
3. No PDV, o vendedor:
   - Possui uma tela similar ao super App do vendedor da fruki 
   - Possui a opção Recomendação.
4. Em **Recomendações**, é mostrado dados do cliente selecionado, todos os produtos recomendados e a descrição e motivo do porque esses produtos foram recomendados.

---


## Dados mockados

Os dados vivem no próprio código e não persistem entre recarregamentos.

### Clientes (`src/RouteScreen.tsx`)

CNPJs válidos para teste:

| Cliente | CNPJ |
| --- | --- |
| Supermercado São Lucas | `12.345.678/0001-90` |
| Mercado Avenida | `23.456.789/0001-01` |
| Mercado do Bairro | `34.567.890/0001-12` |
| Comércio e Mecânica Aliança | `45.678.901/0001-23` |
| Farmácia Bem-Estar | `56.789.012/0001-34` |
| Bar e Lancheria Estação | `67.890.123/0001-45` |
