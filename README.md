# Feira

Marketplace de demonstração. Vitrine no estilo de um classificado (busca, anúncio, carrinho, conta), montada como **monorepo híbrido**: várias apps Next (multi-zone), pacotes compartilhados instalados como dependência e módulos descritos por manifesto.

O browser entra sempre por `http://localhost:3000`. As outras apps não aparecem como outro site: o host reescreve o prefixo para a porta da zona.

## Zonas

| App | Prefixo | Porta | Papel |
| --- | --- | --- | --- |
| `@monorepo/home` | `/` | 3000 | Shell, ofertas, proxy de dev |
| `@monorepo/catalog-app` | `/catalog` | 3001 | Busca, categoria, ficha |
| `@monorepo/cart` | `/cart` | 3002 | Carrinho e checkout |
| `@monorepo/account` | `/account` | 3003 | Login, cadastro, pedidos |
| `@monorepo/auth-api` | `/api` | 3333 | Sessão com `@curso/login-sdk` |

Em dev, `apps/home/src/proxy.ts` encaminha o prefixo. Em `next start`, o `rewrites` do host faz o mesmo. Produção real pode trocar isso por nginx/CDN sem mudar as zonas.

## Três abordagens no mesmo repo

1. **Multi-zone.** Cada vertical é uma app Next com `basePath`. Não compartilham bundle nem estado de memória.
2. **Pacotes como dependência.** UI de casca, catálogo, registry e eventos entram pelo `package.json` (`workspace:*`), com subpath explícito. Sem barrel `index.ts`.
3. **Plugin.** `packages/module-registry/src/zones.json` declara id, path, nome e origem de dev. O header e o proxy leem essa lista.

O que atravessa a navegação entre zonas:

- **URL** para busca e ficha (`/catalog/busca?q=`, `/catalog/p/FR1001`).
- **`@monorepo/events`** para carrinho e pedidos. O pacote usa `@isaac545454/frontend-events` e persiste o snapshot em `localStorage`, com `BroadcastChannel` para outra aba. Cada documento hidrata de novo porque a troca de zona é navegação completa.
- **Token** de login no `localStorage` (`curso.token`), gravado pelo `@curso/login-sdk`. A API sobe em `/api` no mesmo domínio, via proxy.

## Dependências externas

Versão única no `catalog` do `pnpm-workspace.yaml`. Cada pacote que importa declara a lib em `dependencies` (não em `peerDependencies`).

| Pacote | Origem |
| --- | --- |
| `@isaac545454/nucleus` | [ds-nucleo](https://github.com/isaac545454/ds-nucleo) |
| `@isaac545454/frontend-events` | [frontend-events](https://github.com/isaac545454/frontend-events) |
| `@curso/login-sdk` | [sdk-auth](https://github.com/isaac545454/sdk-auth) `packages/login-sdk` |

`next`, `react` e `react-dom` também saem do catalog, com o mesmo número em todas as apps.

O git do Nucleus não versiona `dist`. O `postinstall` baixa o source e gera `dist` com `tsup` + Tailwind, dentro do pacote instalado.

## Como rodar

Precisa de Node.js 22.6 ou mais novo (o login usa `node:sqlite`). A API sobe com `tsx` porque o SDK publica TypeScript e o Node não remove tipos dentro de `node_modules`.

```bash
pnpm install
pnpm dev
```

Abra http://localhost:3000.

Crie uma conta em Conta → Criar conta (senha com 8+ caracteres). O banco fica em `apps/auth-api/data/auth.sqlite` e não entra no git.

```bash
pnpm typecheck
pnpm build
```

## Nova zona

1. App em `apps/<nome>` com `basePath` igual ao prefixo público.
2. Entrada em `packages/module-registry/src/zones.json` (`id`, `basePath`, `homeHref`, `devOrigin`).
3. Dependência dos pacotes `@monorepo/*` que a zona importa.

O header e o proxy de dev passam a conhecer o prefixo sem lista solta na home.
