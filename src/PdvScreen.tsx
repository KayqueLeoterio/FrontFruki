import { useState, type ReactNode } from "react"

type ModuleIcon =
  | "back"
  | "bill"
  | "box"
  | "cart"
  | "clipboard"
  | "close"
  | "document"
  | "headset"
  | "target"
  | "users"

type PdvModule = {
  title: string
  description: string
  icon: ModuleIcon
  disabled?: boolean
}

type PdvClient = {
  code: string
  name: string
  document: string
  address: string
  district: string
  status: "Visitado" | "Positivado" | "Pendente"
}

const modules: PdvModule[] = [
  {
    title: "Metas",
    description: "Acompanhe objetivos e resultados do PDV.",
    icon: "target",
  },
  {
    title: "Estoque",
    description: "Consulte disponibilidade e necessidade de reposição.",
    icon: "box",
  },
  {
    title: "Pedido",
    description: "Monte um novo pedido para o estabelecimento.",
    icon: "cart",
  },
  {
    title: "Segmentação",
    description: "Veja o perfil e o potencial comercial do cliente.",
    icon: "users",
  },
  {
    title: "Visita",
    description: "Registre informações e observações deste atendimento.",
    icon: "clipboard",
  },
  {
    title: "Boletos",
    description: "Consulte títulos, vencimentos e situação financeira.",
    icon: "bill",
  },
  {
    title: "SAC",
    description: "Abra ou acompanhe solicitações de atendimento.",
    icon: "headset",
  },
  {
    title: "Recomendação",
    description: "Veja os produtos mais indicados para este cliente.",
    icon: "document",
  },
]

function Icon({ name, size = 30 }: { name: ModuleIcon; size?: number }) {
  const paths: Record<ModuleIcon, ReactNode> = {
    back: (
      <>
        <path d="M19 12H5" />
        <path d="m10 17-5-5 5-5" />
      </>
    ),
    bill: (
      <>
        <rect x="4" y="4" width="14" height="16" rx="2" />
        <path d="M8 8h6M8 12h6M8 16h3M18 9h2a2 2 0 0 1 0 4h-2" />
      </>
    ),
    box: (
      <>
        <path d="m4 8 8-4 8 4-8 4-8-4Z" />
        <path d="M4 8v9l8 4 8-4V8M12 12v9" />
      </>
    ),
    cart: (
      <>
        <path d="M3 4h2l2.2 10.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.6L20 8H6" />
        <circle cx="10" cy="20" r="1.3" />
        <circle cx="17" cy="20" r="1.3" />
      </>
    ),
    clipboard: (
      <>
        <rect x="5" y="4" width="14" height="17" rx="2" />
        <path d="M9 4V2h6v2M8 9h8M8 13h8M8 17h5" />
      </>
    ),
    close: (
      <>
        <path d="m6 6 12 12" />
        <path d="M18 6 6 18" />
      </>
    ),
    document: (
      <>
        <path d="M6 3h9l4 4v14H6V3Z" />
        <path d="M14 3v5h5M9 13h7M9 17h5" />
      </>
    ),
    headset: (
      <>
        <path d="M4 14v-2a8 8 0 0 1 16 0v2" />
        <path d="M4 14h3v6H5a2 2 0 0 1-2-2v-2a2 2 0 0 1 1-2ZM20 14h-3v6h2a2 2 0 0 0 2-2v-2a2 2 0 0 0-1-2ZM17 20c0 1-2 2-4 2" />
      </>
    ),
    target: (
      <>
        <path d="M4 20V10M10 20V6M16 20V3" />
        <path d="m3 8 6-3 5 2 7-5M18 2h3v3" />
      </>
    ),
    users: (
      <>
        <circle cx="9" cy="8" r="3" />
        <circle cx="17" cy="9" r="2.5" />
        <path d="M3 20a6 6 0 0 1 12 0M14 15a5 5 0 0 1 7 4.5" />
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
      strokeWidth="1.65"
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
    <div className="pdv-brand" aria-label="Fruki">
      fruki
    </div>
  )
}

export default function PdvScreen({
  embedded = false,
  client,
  onBack,
  onOpenRecommendations,
}: {
  embedded?: boolean
  client?: PdvClient
  onBack?: () => void
  onOpenRecommendations?: () => void
}) {
  const [selectedModule, setSelectedModule] = useState<PdvModule | null>(null)
  const [serviceStarted, setServiceStarted] = useState(false)

  const currentClient = client ?? {
    code: "17842",
    name: "Mercado e Açougue Costa",
    document: "12.345.678/0001-90",
    address: "Av. Independência, 1958",
    district: "Teutônia",
    status: "Pendente" as const,
  }

  return (
    <div className={`pdv-app ${embedded ? "pdv-app--embedded" : ""}`}>
      <header className="pdv-header">
        <div className="pdv-header__inner">
          <Brand />

          <div>
            <span>Execução no ponto de venda</span>
            <h1>Atendimento PDV</h1>
          </div>

          <span
            className={`pdv-service-status pdv-service-status--${currentClient.status.toLowerCase()}`}
          >
            <i />
            {currentClient.status}
          </span>
        </div>
      </header>

      <main className="pdv-main">
        {onBack && (
          <button className="flow-back-button" onClick={onBack}>
            <Icon name="back" size={17} /> Voltar para a rota
          </button>
        )}

        <section className="pdv-client">
          <div className="pdv-client__code">{currentClient.code}</div>

          <div className="pdv-client__identity">
            <span>Cliente selecionado</span>
            <h2>{currentClient.name}</h2>
          </div>

          <div className="pdv-client__address">
            <span>Endereço</span>
            <strong>{currentClient.address}</strong>
            <small>{currentClient.district} • RS</small>
          </div>
        </section>

        {serviceStarted && (
          <div className="pdv-active-note" role="status">
            <span />
            <p>
              <strong>Atendimento em andamento</strong>
              Registre as atividades realizadas neste PDV.
            </p>
          </div>
        )}

        <section className="pdv-modules-section">
          <div className="pdv-section-heading">
            <div>
              <span>Ferramentas de atendimento</span>
              <h2>O que você precisa fazer?</h2>
            </div>

            <p>Selecione um módulo para continuar</p>
          </div>

          <div className="pdv-module-grid">
            {modules.map((module) => (
              <button
                key={module.title}
                className={`pdv-module-card ${module.disabled ? "disabled" : ""}`}
                onClick={() => {
                  if (
                    module.title === "Recomendação" &&
                    onOpenRecommendations
                  ) {
                    onOpenRecommendations()
                    return
                  }

                  if (!module.disabled) {
                    setSelectedModule(module)
                  }
                }}
                disabled={module.disabled}
              >
                <span className="pdv-module-card__icon">
                  <Icon name={module.icon} />
                </span>

                <strong>{module.title}</strong>

                <small>
                  {module.disabled
                    ? "Novidade a caminho"
                    : module.description}
                </small>

                {!module.disabled && <i>→</i>}
              </button>
            ))}
          </div>
        </section>
      </main>

      <div className="pdv-action-bar">
        <div>
          <span>{currentClient.name}</span>
          <strong>
            {serviceStarted
              ? "Atendimento iniciado às 09:42"
              : "Pronto para iniciar"}
          </strong>
        </div>

        <button
          className={serviceStarted ? "active" : ""}
          onClick={() => setServiceStarted((started) => !started)}
        >
          {serviceStarted
            ? "Finalizar atendimento"
            : "Iniciar atendimento"}
        </button>
      </div>

      {selectedModule && (
        <div
          className="pdv-modal-backdrop"
          onMouseDown={(event) =>
            event.target === event.currentTarget &&
            setSelectedModule(null)
          }
        >
          <section
            className="pdv-modal"
            role="dialog"
            aria-modal="true"
            aria-label={selectedModule.title}
          >
            <button
              className="pdv-modal__close"
              onClick={() => setSelectedModule(null)}
              aria-label="Fechar"
            >
              <Icon name="close" size={20} />
            </button>

            <span className="pdv-modal__icon">
              <Icon name={selectedModule.icon} size={34} />
            </span>

            <span className="pdv-modal__eyebrow">
              Módulo de atendimento
            </span>

            <h2>{selectedModule.title}</h2>
            <p>{selectedModule.description}</p>

            <button
              className="pdv-modal__action"
              onClick={() => setSelectedModule(null)}
            >
              Acessar {selectedModule.title.toLowerCase()}
            </button>
          </section>
        </div>
      )}
    </div>
  )
}