
import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from "react"
import PdvScreen from "./PdvScreen"
import RouteScreen, {
  findClientByCnpj,
  type RouteClient,
} from "./RouteScreen"

type View = "cliente" | "vendedor"
type SellerStage = "rota" | "pdv" | "recomendacoes"

type IconName =
  | "arrow"
  | "bag"
  | "bell"
  | "chevron"
  | "close"
  | "grid"
  | "heart"
  | "insight"
  | "profile"
  | "route"
  | "search"
  | "sparkles"
  | "store"
  | "trend"

type Product = {
  id: number
  sku: string
  suggestionType:
    | "Novo SKU"
    | "Reposição"
    | "Acompanhamento de aderência de novo SKU"
  suggestionReason: string
  name: string
  category: string
  flavor: string
  price: string
  score: number
  description: string
  reason: string
  salesTip: string
  color: string
  image: string
  accent: string
  kind: "bottle" | "can"
  tag?: string
}

const products: Product[] = [
  {
    id: 1,
    sku: "FRK-001",
    suggestionType: "Reposição",
    suggestionReason:
      "Produto com alta recorrência no histórico e estoque estimado próximo do mínimo.",
    name: "Fruki Guaraná",
    category: "Refrigerante",
    flavor: "Guaraná • 2L",
    price: "R$ 8,49",
    score: 98,
    description:
      "O sabor clássico e refrescante que combina com todos os momentos.",
    reason:
      "Você costuma comprar bebidas para compartilhar nos finais de semana.",
    salesTip:
      "Destaque o tamanho família e o alto score com o histórico do cliente.",
    image: "/imagens-fruki/Guarana2l.png",
    color: "#f7b500",
    accent: "#f15a24",
    kind: "bottle",
    tag: "Mais indicado",
  },
  {
    id: 2,
    sku: "FRK-002",
    suggestionType: "Reposição",
    suggestionReason:
      "Item presente nas últimas compras e com boa saída para acompanhar refeições.",
    name: "Água da Pedra",
    category: "Água mineral",
    flavor: "Com gás • 500ml",
    price: "R$ 2,99",
    score: 95,
    description:
      "Leve, equilibrada e naturalmente refrescante para acompanhar sua rotina.",
    reason:
      "Complementa as compras de almoço e aparece com frequência na sua cesta.",
    salesTip:
      "Sugira para acompanhar refeições e formar um mix de bebidas mais completo.",
    image: "/imagens-fruki/00504.png",
    color: "#38b6c9",
    accent: "#0877b9",
    kind: "bottle",
  },
  {
    id: 3,
    sku: "FRK-003",
    suggestionType: "Novo SKU",
    suggestionReason:
      "O perfil do estabelecimento indica potencial para sabores cítricos em embalagens individuais.",
    name: "Fruki Citrus",
    category: "Refrigerante",
    flavor: "Cítrico • 350ml",
    price: "R$ 3,79",
    score: 92,
    description:
      "Um encontro vibrante de sabores cítricos em uma versão prática e gelada.",
    reason:
      "Seu perfil mostra preferência por sabores leves, cítricos e embalagens individuais.",
    salesTip:
      "Apresente como uma descoberta refrescante próxima aos sabores já preferidos.",
    image: "/imagens-fruki/00088.png",
    color: "#b7d532",
    accent: "#087f4f",
    kind: "can",
  },
  {
    id: 4,
    sku: "FRK-004",
    suggestionType: "Acompanhamento de aderência de novo SKU",
    suggestionReason:
      "SKU incluído recentemente no mix e com sinais positivos de recompra.",
    name: "Fruki Laranja",
    category: "Refrigerante",
    flavor: "Laranja • 2L",
    price: "R$ 8,49",
    score: 89,
    description:
      "Sabor de laranja intenso, alegre e perfeito para dividir com a família.",
    reason:
      "Boa aderência ao seu consumo familiar e à preferência por sabores frutados.",
    salesTip:
      "Conecte com ocasiões em família e sugira junto a lanches de fim de semana.",
    color: "#ff8a24",
    image: "/imagens-fruki/00021.png",
    accent: "#f04f24",
    kind: "bottle",
  },
  {
    id: 5,
    sku: "FRK-005",
    suggestionType: "Reposição",
    suggestionReason:
      "Volume de compras recente sugere necessidade de reposição para manter a disponibilidade.",
    name: "Fruki Cola",
    category: "Refrigerante",
    flavor: "Cola • 600ml",
    price: "R$ 5,49",
    score: 86,
    description:
      "Sabor marcante na medida certa, em uma embalagem ideal para levar.",
    reason:
      "Recomendado pelo equilíbrio entre praticidade, preço e preferências anteriores.",
    salesTip:
      "Reforce a conveniência da embalagem e o ótimo custo-benefício.",
    color: "#e74437",
    image: "/imagens-fruki/00043.png",
    accent: "#991f2d",
    kind: "bottle",
  },
  {
    id: 6,
    sku: "FRK-006",
    suggestionType: "Novo SKU",
    suggestionReason:
      "O aumento da procura por opções sem açúcar cria uma oportunidade para ampliar o mix.",
    name: "Fruki Guaraná Zero",
    category: "Zero açúcar",
    flavor: "Guaraná • 350ml",
    price: "R$ 3,79",
    score: 83,
    description:
      "Todo o sabor do guaraná com zero açúcar e muita refrescância.",
    reason:
      "Alternativa alinhada ao interesse crescente por escolhas com menos açúcar.",
    salesTip:
      "Ofereça como opção leve sem abrir mão do sabor conhecido do guaraná.",
    image: "/imagens-fruki/00018.png",
    color: "#205f49",
    accent: "#153f33",
    kind: "can",
  },
]

/**
 * Gera recomendações personalizadas por cliente.
 * O CNPJ determina a ordem dos produtos.
 * O score é fixo conforme a posição na lista.
 */
function getProductsByCustomer(client: RouteClient): Product[] {
  const rotation = (client.id - 1) % products.length

  const orderedProducts = [
    ...products.slice(rotation),
    ...products.slice(0, rotation),
  ]

  const fixedScores = [98, 95, 92, 89, 86, 83]

  return orderedProducts.map((product, index) => ({
    ...product,
    score: fixedScores[index],
  }))
}
function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, ReactNode> = {
    arrow: (
      <>
        <path d="M5 12h14" />
        <path d="m14 6 6 6-6 6" />
      </>
    ),
    bag: (
      <>
        <path d="M5 8h14l-1 12H6L5 8Z" />
        <path d="M9 9V6a3 3 0 0 1 6 0v3" />
      </>
    ),
    bell: (
      <>
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
        <path d="M10 21h4" />
      </>
    ),
    chevron: <path d="m9 18 6-6-6-6" />,
    close: (
      <>
        <path d="M10 17l5-5-5-5" />
        <path d="M15 12H3" />
        <path d="M12 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6" />
  </>
    ),
    grid: (
      <>
        <rect x="4" y="4" width="6" height="6" rx="1" />
        <rect x="14" y="4" width="6" height="6" rx="1" />
        <rect x="4" y="14" width="6" height="6" rx="1" />
        <rect x="14" y="14" width="6" height="6" rx="1" />
      </>
    ),
    heart: (
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />
    ),
    insight: (
      <>
        <path d="M9 18h6" />
        <path d="M10 22h4" />
        <path d="M8.5 14.5a7 7 0 1 1 7 0c-.8.6-1.1 1.2-1.2 2.5h-4.6c-.1-1.3-.4-1.9-1.2-2.5Z" />
      </>
    ),
    profile: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21a8 8 0 0 1 16 0" />
      </>
    ),
    route: (
      <>
        <circle cx="6" cy="18" r="2" />
        <circle cx="18" cy="6" r="2" />
        <path d="M8 18h3a3 3 0 0 0 0-6h2a3 3 0 0 0 3-3V8" />
      </>
    ),
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4" />
      </>
    ),
    sparkles: (
      <>
        <path d="m12 3 1.4 3.6L17 8l-3.6 1.4L12 13l-1.4-3.6L7 8l3.6-1.4L12 3Z" />
        <path d="m5 14 .8 2.2L8 17l-2.2.8L5 20l-.8-2.2L2 17l2.2-.8L5 14Z" />
        <path d="m19 13 .6 1.4L21 15l-1.4.6L19 17l-.6-1.4L17 15l1.4-.6L19 13Z" />
      </>
    ),
    store: (
      <>
        <path d="M4 10v10h16V10" />
        <path d="M3 4h18l-2 6H5L3 4Z" />
        <path d="M9 20v-6h6v6" />
      </>
    ),
    trend: (
      <>
        <path d="m3 17 6-6 4 4 8-9" />
        <path d="M16 6h5v5" />
      </>
    ),
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  )
}

function Logo() {
  return (
    <div className="logo" aria-label="Fruki Recomenda">
      <span className="logo-mark">
        <img src="/assets/fruki-logo.png" alt="" />
      </span>

      <span className="logo-name">
        fruki<span>recomenda</span>
      </span>
    </div>
  )
}

function ProductVisual({
  product,
  compact = false,
}: {
  product: Product
  compact?: boolean
}) {
  return (
    <div
      className={`product-visual ${compact ? "product-visual--compact" : ""}`}
      style={
        {
          "--product-color": product.color,
          "--product-accent": product.accent,
        } as React.CSSProperties
      }
    >
      <img
        className="product-photo"
        src={product.image}
        alt={`Embalagem de ${product.name}`}
      />

      <div className="product-identifier">
        <span>{product.sku}</span>
        <strong>{product.name}</strong>
      </div>
    </div>
  )
}

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
}

function Header({
  view,
  setView,
  onClientLogout,
  customerName,
}: {
  view: View
  setView: (view: View) => void
  onClientLogout: () => void
  customerName?: string
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false)
      }
    }

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [menuOpen])

  const displayName = view === "cliente" ? (customerName || "Cliente") : "Vendedor"
  const initials = view === "cliente"
    ? (customerName ? getInitials(customerName) : "CL")
    : "AS"

  const handleLogout = () => {
    setMenuOpen(false)
    if (view === "cliente") {
      onClientLogout()
    } else {
      // Vendedor logout - pode ser expandido conforme necessário
      onClientLogout()
    }
  }

  return (
    <header className="app-header">
      <div className="header-inner">
        <Logo />

        <nav className="view-switcher" aria-label="Alternar área">
          <button
            className={view === "cliente" ? "active" : ""}
            onClick={() => setView("cliente")}
          >
            <Icon name="profile" size={17} /> Cliente
          </button>

          <button
            className={view === "vendedor" ? "active" : ""}
            onClick={() => setView("vendedor")}
          >
            <Icon name="store" size={17} /> Vendedor
          </button>
        </nav>

        <div className="header-actions">
          <button className="icon-button" aria-label="Notificações">
            <Icon name="bell" />
          </button>

          <div className="avatar-menu" ref={menuRef}>
            <button
              className="avatar"
              aria-label="Abrir menu do perfil"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
            >
              {initials}
            </button>

            {menuOpen && (
              <div className="avatar-dropdown" role="menu">
                <div className="avatar-dropdown__header">
                  <strong>{displayName}</strong>
                  <span>{view === "cliente" ? "Área do cliente" : "Área do vendedor"}</span>
                </div>
                <button
                  className="avatar-dropdown__item"
                  role="menuitem"
                  onClick={() => {
                    setMenuOpen(false)
                    alert("Perfil - funcionalidade em breve")
                  }}
                >
                  <Icon name="profile" size={16} />
                  Ver perfil
                </button>
                <button
                  className="avatar-dropdown__item avatar-dropdown__item--danger"
                  role="menuitem"
                  onClick={handleLogout}
                >
                  <Icon name="close" size={16} />
                  Sair
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

function CustomerCard({ product }: { product: Product }) {
  const [liked, setLiked] = useState(false)

  return (
    <article className="product-card">
      <div className="product-card__visual">
        {product.tag && <span className="tag">{product.tag}</span>}

        <button
          className={`like-button ${liked ? "liked" : ""}`}
          aria-label={
            liked ? "Remover dos favoritos" : "Adicionar aos favoritos"
          }
          onClick={() => setLiked(!liked)}
        >
          <Icon name="heart" size={18} />
        </button>

        <ProductVisual product={product} />
      </div>

      <div className="product-card__content">
        <span className="eyebrow">{product.category}</span>
        <h3>{product.name}</h3>
        <p className="flavor">{product.flavor}</p>
        <p className="description">{product.description}</p>

        <div className="product-card__footer">
          <strong>{product.price}</strong>

          <button className="round-action" aria-label={`Ver ${product.name}`}>
            <Icon name="arrow" size={18} />
          </button>
        </div>
      </div>
    </article>
  )
}

function CustomerView({ client }: { client: RouteClient }) {
  const customerProducts = useMemo(
    () => getProductsByCustomer(client),
    [client.id],
  )

  return (
    <main>
      <section className="customer-hero">
        <div className="hero-copy">
          <div className="hero-kicker">
            <Icon name="sparkles" size={16} /> Seleção feita para você
          </div>

          <h1>
            {client.name},
            <br />
            <span>preparamos uma seleção especial</span> para você.
          </h1>

          <p>
            Selecionamos bebidas que combinam com o perfil do seu
            estabelecimento e com as oportunidades para o seu negócio.
          </p>
        </div>

        <div className="hero-art">
          <div className="hero-orbit hero-orbit--one" />
          <div className="hero-orbit hero-orbit--two" />

          <img
            className="hero-fruki-logo"
            src="/assets/fruki-hero-logo.jpg"
            alt="Fruki"
          />
        </div>
      </section>

      <section className="content-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Feito para o seu estabelecimento</span>
            <h2>Recomendados para você</h2>
            <p>
              6 produtos selecionados para {client.name}, organizados de acordo
              com o perfil do estabelecimento.
            </p>
          </div>
        </div>

        <div className="product-grid">
          {customerProducts.map((product) => (
            <CustomerCard product={product} key={product.id} />
          ))}
        </div>
      </section>
    </main>
  )
}

function formatCnpj(value: string) {
  return value
    .replace(/\D/g, "")
    .slice(0, 14)
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2")
}

function CustomerLogin({
  onLogin,
}: {
  onLogin: (cnpj: string) => boolean
}) {
  const [cnpj, setCnpj] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const digits = cnpj.replace(/\D/g, "")

    if (digits.length !== 14) {
      setError("Digite um CNPJ válido com 14 números.")
      return
    }

    const loginSuccessful = onLogin(digits)

    if (!loginSuccessful) {
      setError("CNPJ não encontrado. Verifique os dados e tente novamente.")
      return
    }

    setError("")
  }

  return (
    <main className="customer-login">
      <section className="customer-login__card">
        <div className="customer-login__brand">
          <span className="customer-login__kicker">Área do cliente</span>

          <h1>Suas melhores escolhas começam aqui.</h1>

          <p>
            Acesse recomendações preparadas para o perfil do seu
            estabelecimento.
          </p>


        </div>

        <div className="customer-login__form-area">
          <div className="customer-login__heading">
            <span>
              <Icon name="store" size={20} />
            </span>

            <div>
              <small>Bem-vindo à Fruki</small>
              <h2>Acesse sua conta</h2>
            </div>
          </div>

          <p className="customer-login__intro">
            Informe o CNPJ do estabelecimento para visualizar suas
            recomendações.
          </p>

          <form onSubmit={handleSubmit} noValidate>
            <label htmlFor="customer-cnpj">CNPJ</label>

            <div className={`customer-login__input ${error ? "error" : ""}`}>
              <Icon name="store" size={18} />

              <input
                id="customer-cnpj"
                type="text"
                inputMode="numeric"
                autoComplete="username"
                value={cnpj}
                onChange={(event) => {
                  setCnpj(formatCnpj(event.target.value))
                  setError("")
                }}
                placeholder="00.000.000/0000-00"
                aria-describedby={
                  error ? "customer-cnpj-error" : undefined
                }
                autoFocus
              />
            </div>

            {error && (
              <p id="customer-cnpj-error" className="customer-login__error">
                {error}
              </p>
            )}

            <button type="submit">
              Entrar <Icon name="arrow" size={18} />
            </button>
          </form>

          <p className="customer-login__security">
            Acesso exclusivo para clientes cadastrados.
          </p>
        </div>
      </section>
    </main>
  )
}

function getScoreChance(score: number) {
  if (score >= 95) return { label: "Alta chance", tone: "high" }
  if (score >= 90) return { label: "Boa chance", tone: "good" }

  return { label: "Boa opção", tone: "option" }
}

function SellerProduct({
  product,
  index,
}: {
  product: Product
  index: number
}) {
  const chance = getScoreChance(product.score)

  return (
    <article className="seller-product">
      <div className="seller-product__summary">
        <span className="rank">{String(index + 1).padStart(2, "0")}</span>

        <ProductVisual product={product} compact />

        <div className="seller-product__name">
          <span className="eyebrow">{product.category}</span>
          <h3>{product.name}</h3>

          <p>
            {product.flavor} <i /> {product.price}
          </p>
        </div>

        <div className="match-score">
          <div
            className={`score-ring score-ring--${chance.tone}`}
            style={
              { "--score": `${product.score * 3.6}deg` } as React.CSSProperties
            }
          >
            <span>{product.score}%</span>
          </div>

          <small>Score</small>
        </div>

        <span className={`status status--${chance.tone}`}>
          <i /> {chance.label}
        </span>
      </div>

      <div className="seller-suggestion">
        <div>
          <small>Tipo de sugestão</small>
          <strong>{product.suggestionType}</strong>
        </div>

        <div>
          <small>Motivo da sugestão</small>
          <p>{product.suggestionReason}</p>
        </div>
      </div>
    </article>
  )
}

/**
 * A tela do vendedor recebe o cliente selecionado na rota.
 * A lista de produtos é gerada pela mesma função utilizada na tela do cliente.
 */
function SellerView({
  client,
  onBack,
}: {
  client: RouteClient
  onBack?: () => void
}) {
  const customerProducts = useMemo(
    () => getProductsByCustomer(client),
    [client.id],
  )

  return (
    <main className="seller-main">
      {onBack && (
        <button
          className="flow-back-button flow-back-button--chevron"
          onClick={onBack}
        >
          <Icon name="chevron" size={17} /> Voltar para o atendimento PDV
        </button>
      )}

      <section className="seller-topbar">
        <div>
          <span className="eyebrow">Painel de recomendações</span>
          <h1>Bom dia, André!</h1>
          <p>Veja as melhores oportunidades para cada cliente.</p>
        </div>
      </section>

      <section className="seller-workspace">
        <aside className="client-panel">
          <div className="client-panel__heading">
            <div>
              <span className="eyebrow">Cliente selecionado</span>
              <h2>{client.name}</h2>
            </div>

            <button className="more-button" aria-label="Mais opções">
              •••
            </button>
          </div>

          <div className="client-profile">
            <div className="client-avatar">{getInitials(client.name)}</div>

            <div>
              <strong>{client.name}</strong>
              <span>{client.district} • RS</span>
            </div>
          </div>

          <div className="client-info">
            <div>
              <span>Código do cliente</span>
              <strong>{client.code}</strong>
            </div>

            <div>
              <span>CNPJ</span>
              <strong>{client.document}</strong>
            </div>

            <div>
              <span>Endereço</span>
              <strong>{client.address}</strong>
            </div>
          </div>
        </aside>

        <div className="recommendation-panel">
          <div className="recommendation-heading">
            <div>
              <div className="title-line">
                <h2>Produtos recomendados</h2>
                <span>{customerProducts.length} itens</span>
              </div>

              <p>
                Mesmas recomendações exibidas para {client.name}.
              </p>
            </div>

            <div className="panel-actions">
              <button className="search-button" aria-label="Buscar">
                <Icon name="search" size={19} />
              </button>

              <button className="sort-button">
                Ordem personalizada <Icon name="chevron" size={16} />
              </button>
            </div>
          </div>

          <div className="seller-list">
            {customerProducts.map((product, index) => (
              <SellerProduct
                product={product}
                index={index}
                key={product.id}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

export default function App() {
  const [view, setView] = useState<View>("cliente")

  const [selectedCustomer, setSelectedCustomer] =
    useState<RouteClient | null>(null)

  const [sellerStage, setSellerStage] = useState<SellerStage>("rota")

  const [selectedRouteClient, setSelectedRouteClient] =
    useState<RouteClient | null>(null)

  const customerAuthenticated = selectedCustomer !== null

  const handleCustomerLogin = (cnpj: string): boolean => {
    const client = findClientByCnpj(cnpj)

    if (!client) {
      return false
    }

    setSelectedCustomer(client)
    return true
  }

  const selectView = (nextView: View) => {
    setView(nextView)

    if (nextView === "vendedor") {
      setSellerStage("rota")
      setSelectedRouteClient(null)
    }
  }

  const handleClientLogout = () => {
    setSelectedCustomer(null)
  }

  return (
    <div className={`app app--${view}`}>
      <Header
        view={view}
        setView={selectView}
        onClientLogout={handleClientLogout}
        customerName={selectedCustomer?.name}
      />

      {view === "cliente" &&
        (customerAuthenticated && selectedCustomer ? (
          <CustomerView client={selectedCustomer} />
        ) : (
          <CustomerLogin onLogin={handleCustomerLogin} />
        ))}

      {view === "vendedor" && sellerStage === "rota" && (
        <RouteScreen
          embedded
          onSelectClient={(client) => {
            setSelectedRouteClient(client)
            setSellerStage("pdv")
          }}
        />
      )}

      {view === "vendedor" && sellerStage === "pdv" && (
        <PdvScreen
          embedded
          client={selectedRouteClient ?? undefined}
          onBack={() => setSellerStage("rota")}
          onOpenRecommendations={() => setSellerStage("recomendacoes")}
        />
      )}

      {view === "vendedor" &&
        sellerStage === "recomendacoes" &&
        selectedRouteClient && (
          <SellerView
            client={selectedRouteClient}
            onBack={() => setSellerStage("pdv")}
          />
        )}

      {view === "cliente" && customerAuthenticated && (
        <footer>
          <Logo />
          <p>Boas escolhas deixam a vida mais leve.</p>
          <span>© 2025 Fruki Recomenda</span>
        </footer>
      )}
    </div>
  )
}
