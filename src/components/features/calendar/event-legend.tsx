interface EventLegendProps {
  isDark: boolean
}

export const EventLegend = ({ isDark }: EventLegendProps) => (
  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 text-sm">
    <div className="flex items-center gap-2">
      <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600" />
      <span className={isDark ? "text-gray-300" : "text-gray-600"}>Orçamento</span>
    </div>
    <div className="flex items-center gap-2">
      <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-600 to-pink-600" />
      <span className={isDark ? "text-gray-300" : "text-gray-600"}>Confirmado</span>
    </div>
    <div className="flex items-center gap-2">
      <div className="w-3 h-3 rounded-full bg-gray-500" />
      <span className={isDark ? "text-gray-300" : "text-gray-600"}>Finalizado</span>
    </div>
    <div className="flex items-center gap-2">
      <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
        <span className="text-white text-[8px] font-bold">+</span>
      </div>
      <span className={isDark ? "text-gray-300" : "text-gray-600"}>Múltiplos eventos</span>
    </div>
  </div>
)
