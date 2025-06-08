export function EventLegend() {
  return (
    <div className="flex flex-wrap items-center gap-4 text-sm">
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-600 to-pink-600" />
        <span>Confirmado</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600" />
        <span>Orçamento</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-gray-500" />
        <span>Finalizado</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex items-center justify-center w-5 h-5 rounded-full bg-gray-200 text-gray-700 text-xs font-medium">
          +
        </div>
        <span>Múltiplos eventos</span>
      </div>
    </div>
  )
}