import { useMemo, useState, type ReactNode } from "react"

type VisitStatus = "Pendente" | "Visitado" | "Positivado"
type Filter = "Todos" | VisitStatus
type IconName = "calendar" | "chevron" | "close" | "filter" | "map" | "route" | "store"

export type RouteClient = {
  id: number
  code: string
  name: string
  document: string
  address: string
  district: string
  status: VisitStatus
  order?: string
}

type Client = RouteClient

const clients: Client[] = [
  {
    id: 1,
    code: "86042",
    name: "Supermercado São Lucas",
    document: "12.345.678/0001-90",
    address: "Rua das Palmeiras, 984",
    district: "Teutônia",
    status: "Visitado",
  },
  {
    id: 2,
    code: "28417",
    name: "Mercado Avenida",
    document: "23.456.789/0001-01",
    address: "Av. Central, 410",
    district: "Westfália",
    status: "Visitado",
  },
  {
    id: 3,
    code: "25084",
    name: "Mercado do Bairro",
    document: "34.567.890/0001-12",
    address: "Estrada RS-128, 1220",
    district: "Teutônia",
    status: "Positivado",
    order: "R$ 1.284,60",
  },
  {
    id: 4,
    code: "16089",
    name: "Comércio e Mecânica Aliança",
    document: "45.678.901/0001-23",
    address: "Estrada Linha Clara, 57",
    district: "Teutônia",
    status: "Visitado",
  },
  {
    id: 5,
    code: "41902",
    name: "Farmácia Bem-Estar",
    document: "56.789.012/0001-34",
    address: "Rua Major Bandeira, 306",
    district: "Languiru",
    status: "Pendente",
  },
  {
    id: 6,
    code: "33271",
    name: "Bar e Lancheria Estação",
    document: "67.890.123/0001-45",
    address: "Rua 3 de Outubro, 731",
    district: "Canabarro",
    status: "Pendente",
  },
]

export function findClientByCnpj(cnpj: string): RouteClient | undefined {
  const normalizedCnpj = cnpj.replace(/\D/g, "")

  return clients.find(
    (client) => client.document.replace(/\D/g, "") === normalizedCnpj,
  )
}

function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, ReactNode> = {
    calendar: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M16 3v4M8 3v4M3 10h18" />
      </>
    ),
    chevron: <path d="m9 18 6-6-6-6" />,
    close: (
      <>
        <path d="m6 6 12 12" />
        <path d="M18 6 6 18" />
      </>
    ),
    filter: (
      <>
        <path d="M4 5h16M7 12h10M10 19h4" />
        <circle cx="8" cy="5" r="1.5" fill="currentColor" stroke="none" />
        <circle cx="15" cy="12" r="1.5" fill="currentColor" stroke="none" />
      </>
    ),
    map: (
      <>
        <path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3V6Z" />
        <path d="M9 3v15M15 6v15" />
      </>
    ),
    route: (
      <>
        <circle cx="6" cy="18" r="2" />
        <circle cx="18" cy="6" r="2" />
        <path d="M8 18h3a3 3 0 0 0 0-6h2a3 3 0 0 0 3-3V8" />
      </>
    ),
    store: (
      <>
        <path d="M4 10v10h16V10" />
        <path d="M3 4h18l-2 6H5L3 4Z" />
        <path d="M9 20v-6h6v6" />
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

function Brand() {
  return (
    <div className="route-brand" aria-label="Fruki">
      <span>fruki</span>
    </div>
  )
}

function ClientCard({
  client,
  onOpen,
}: {
  client: Client
  onOpen: (client: Client) => void
}) {
  return (
    <button className="route-client-card" onClick={() => onOpen(client)}>
      <span className="route-client-card__icon">
        <Icon name="store" size={19} />
      </span>

      <span className="route-client-card__content">
        <span className="route-client-card__title">
          <small>{client.code}</small>
          <strong>{client.name}</strong>
        </span>

        <span className="route-client-card__address">{client.address}</span>
        <span className="route-client-card__district">{client.district}</span>

        <span className={`route-status route-status--${client.status.toLowerCase()}`}>
          {client.status}
        </span>
      </span>

      <span className="route-client-card__arrow">
        <Icon name="chevron" size={19} />
      </span>
    </button>
  )
}

function Sheet({
  title,
  onClose,
  children,
}: {
  title: string
  onClose: () => void
  children: ReactNode
}) {
  return (
    <div
      className="route-sheet-backdrop"
      onMouseDown={(event) =>
        event.target === event.currentTarget && onClose()
      }
    >
      <section
        className="route-sheet"
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="route-sheet__handle" />

        <header>
          <h2>{title}</h2>
          <button onClick={onClose} aria-label="Fechar">
            <Icon name="close" />
          </button>
        </header>

        {children}
      </section>
    </div>
  )
}

export default function RouteScreen({
  embedded = false,
  onSelectClient,
}: {
  embedded?: boolean
  onSelectClient?: (client: RouteClient) => void
}) {
  const [filter, setFilter] = useState<Filter>("Todos")
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [summaryOpen, setSummaryOpen] = useState(false)

  const filteredClients = useMemo(
    () =>
      clients.filter(
        (client) => filter === "Todos" || client.status === filter,
      ),
    [filter],
  )

  const counts = {
    total: 21,
    visits: 13,
    positive: 7,
    pending: 8,
  }

  return (
    <div className={`route-app ${embedded ? "route-app--embedded" : ""}`}>
      <header className="route-header">
        <div className="route-header__inner">
          <Brand />

          <div className="route-header__title">
            <span>Planejamento de visitas</span>
            <h1>Rota do dia</h1>
          </div>

          <div className="route-date">
            <Icon name="calendar" size={17} />
            <span>Hoje, 18 jun.</span>
          </div>
        </div>
      </header>

      <main className="route-main">
        <section className="route-overview">
          <div className="route-overview__copy">
            <span className="route-kicker">
              <Icon name="route" size={15} /> Rota 38
            </span>

            <h2>Bom dia, André.</h2>
            <p>Sua rota está pronta. Tenha um ótimo dia de visitas.</p>
          </div>

          <div className="route-overview__stats">
            <div>
              <strong>21</strong>
              <span>clientes na rota</span>
            </div>
          </div>
        </section>

        <section className="route-list-section">
          <div className="route-list-heading">
            <div>
              <span className="route-section-label">Agenda de hoje</span>
              <h2>Clientes da rota</h2>
              <p>{filteredClients.length} clientes exibidos</p>
            </div>

            <button
              className={`route-filter-button ${filtersOpen ? "active" : ""}`}
              onClick={() => setFiltersOpen((open) => !open)}
              aria-expanded={filtersOpen}
            >
              <Icon name="filter" size={18} />
              Filtros
              {filter !== "Todos" && <span>1</span>}
            </button>
          </div>

          {filtersOpen && (
            <div className="route-filters" role="group" aria-label="Filtrar clientes">
              {(["Todos", "Pendente", "Visitado", "Positivado"] as Filter[]).map(
                (item) => (
                  <button
                    key={item}
                    className={filter === item ? "active" : ""}
                    onClick={() => setFilter(item)}
                  >
                    {item}
                  </button>
                ),
              )}
            </div>
          )}

          <div className="route-client-grid">
            {filteredClients.map((client) => (
              <ClientCard
                key={client.id}
                client={client}
                onOpen={onSelectClient ?? setSelectedClient}
              />
            ))}
          </div>

          {filteredClients.length === 0 && (
            <div className="route-empty">
              <Icon name="map" size={28} />
              <h3>Nenhum cliente neste filtro</h3>
              <p>Escolha outra situação para ver os clientes da rota.</p>
            </div>
          )}
        </section>
      </main>

      <div className="route-summary-bar">
        <div>
          <span>Progresso da rota</span>
          <strong>
            {counts.visits} de {counts.total} visitas concluídas
          </strong>
        </div>

        <div
          className="route-progress"
          aria-label={`${Math.round((counts.visits / counts.total) * 100)}% concluído`}
        >
          <span style={{ width: `${(counts.visits / counts.total) * 100}%` }} />
        </div>

        <button onClick={() => setSummaryOpen(true)}>
          Resumo do dia <Icon name="chevron" size={17} />
        </button>
      </div>

      {selectedClient && (
        <Sheet
          title={selectedClient.name}
          onClose={() => setSelectedClient(null)}
        >
          <div className="route-client-detail">
            <span
              className={`route-status route-status--${selectedClient.status.toLowerCase()}`}
            >
              {selectedClient.status}
            </span>

            <dl>
              <div>
                <dt>Código</dt>
                <dd>{selectedClient.code}</dd>
              </div>
              <div>
                <dt>CNPJ</dt>
                <dd>{selectedClient.document}</dd>
              </div>
              <div>
                <dt>Endereço</dt>
                <dd>{selectedClient.address}</dd>
              </div>
              <div>
                <dt>Bairro</dt>
                <dd>{selectedClient.district}</dd>
              </div>
            </dl>

            <button
              className="route-primary-action"
              onClick={() => setSelectedClient(null)}
            >
              Voltar para a rota
            </button>
          </div>
        </Sheet>
      )}

      {summaryOpen && (
        <Sheet title="Resumo do dia" onClose={() => setSummaryOpen(false)}>
          <div className="route-summary-grid">
            <div>
              <strong>{counts.visits}</strong>
              <span>Visitados</span>
            </div>
            <div>
              <strong>{counts.positive}</strong>
              <span>Positivados</span>
            </div>
            <div>
              <strong>{counts.pending}</strong>
              <span>Pendentes</span>
            </div>
          </div>

          <div className="route-summary-note">
            <Icon name="route" />
            <p>
              <strong>Você está indo bem.</strong> Faltam {counts.pending} clientes
              para concluir a rota de hoje.
            </p>
          </div>
        </Sheet>
      )}
    </div>
  )
}