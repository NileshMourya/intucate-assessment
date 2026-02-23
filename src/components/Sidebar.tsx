import type { Session, TabId } from "../types";

interface Props {
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
  session: Session;
  onLogout: () => void;
  hasResults: boolean;
}

const NAV = [
  {
    id: "prompt" as TabId,
    label: "Diagnostic Prompt",
    icon: <ClipboardIcon />,
  },
  { id: "data" as TabId, label: "Upload Data", icon: <UploadIcon /> },
  { id: "results" as TabId, label: "SQI Analysis", icon: <ChartIcon /> },
  { id: "output" as TabId, label: "JSON Output", icon: <PackageIcon /> },
];

export function Sidebar({
  activeTab,
  setActiveTab,
  session,
  onLogout,
  hasResults,
}: Props) {
  const initials = session.email.slice(0, 2).toUpperCase();
  const activeIndex = NAV.findIndex((n) => n.id === activeTab);

  return (
    <aside className="fixed top-0 left-0 bottom-0 w-64 bg-slate-900 flex flex-col z-20 shadow-xl">
      {/* Brand */}
      <div className="px-6 py-7 border-b border-white/10">
        <h2 className="text-2xl text-white font-semibold tracking-tight">
          Intu<span className="text-orange-500">cate</span>
        </h2>
        <p className="text-[10px] tracking-widest uppercase text-white/40 mt-1">
          Admin Console
        </p>
      </div>

      {/* Nav */}
      <nav className="py-5 flex-1">
        <p className="text-[10px] tracking-widest uppercase text-white/40 px-6 mb-3">
          Workflow
        </p>

        {NAV.map((item, i) => {
          const disabled =
            (item.id === "results" || item.id === "output") && !hasResults;

          return (
            <button
              key={item.id}
              disabled={disabled}
              onClick={() => setActiveTab(item.id)}
              className={`
                flex items-center gap-3 w-full px-6 py-3 text-sm transition-all
                ${
                  activeTab === item.id
                    ? "bg-white/10 text-white"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }
                ${disabled ? "opacity-30 cursor-not-allowed" : ""}
              `}
            >
              {item.icon}
              <span>{item.label}</span>

              {i < NAV.length - 1 && (
                <span
                  className={`ml-auto w-1.5 h-1.5 rounded-full ${
                    i < activeIndex ? "bg-emerald-400" : "bg-transparent"
                  }`}
                />
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-white/10">
        {/* Progress bar */}
        <div className="flex gap-1.5 mb-4">
          {NAV.map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                i === activeIndex
                  ? "bg-orange-500"
                  : i < activeIndex
                    ? "bg-emerald-400"
                    : "bg-white/10"
              }`}
            />
          ))}
        </div>

        {/* User */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs font-bold">
            {initials}
          </div>

          <div className="min-w-0">
            <p className="text-white/50 text-xs truncate">{session.email}</p>
            <button
              onClick={onLogout}
              className="text-white/40 text-[11px] hover:text-orange-500 transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}

function ClipboardIcon() {
  return (
    <svg
      className="w-4 h-4 shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
      <rect x="9" y="3" width="6" height="4" rx="1" />
      <line x1="9" y1="12" x2="15" y2="12" />
      <line x1="9" y1="16" x2="13" y2="16" />
    </svg>
  );
}

function UploadIcon() {
  return (
    <svg
      className="w-4 h-4 shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
      <polyline points="17,8 12,3 7,8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg
      className="w-4 h-4 shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  );
}

function PackageIcon() {
  return (
    <svg
      className="w-4 h-4 shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
      <polyline points="3.27,6.96 12,12.01 20.73,6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  );
}
