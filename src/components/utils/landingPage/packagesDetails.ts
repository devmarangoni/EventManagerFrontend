import partySmallSize from "@/assets/images/landingPage/gallery/partySmallSize.jpg";
import partyMediumSize from "@/assets/images/landingPage/gallery/partyMediumSize.jpg";
import partyCustomSize from "@/assets/images/landingPage/gallery/partyCustomSize.jpg";

export const PACKAGES_DETAILS = [
  {
    id: 1,
    title: "Pequena",
    description: "Destinada a ambientes menores, com aproximadamente 2 metros de largura.",
    items: [
      "1 painel redondo ou retangular",
      "1 arco de balões de até 2,5 metros",
      "3 a 4 mesas de apoio, boleiras e doceiras",
      "Itens decorativos no tema da festa",
      "Revestimento de chão (se necessário)"
    ],
    src: partySmallSize
  },
  {
    id: 2,
    title: "Média",
    description: "Para quem busca uma decoração maior, porém com um baixo custo. Como aproximadamente 3,5 metros de largura.",
    items: [
      "2 paineis (redondo e/ou quadrado)",
      "1 arco de balões de até 3 metros",
      "4 a 6 mesas de apoio, boleiras e doceiras",
      "Itens decorativos no tema da festa",
      "Revestimento de chão (se necessário)"
    ],
    src: partyMediumSize
  },
  {
    id: 3,
    title: "Personalizada",
    description: "Realize a festa do seu sonho e solicite um proposta para uma decoração totalmente personalizada.",
    items: [
      "Diversos paineis de tamanhos e formatos distintos",
      "Arco, parede ou escultura de balões",
      "Mesas, boleiras e doceiras",
      "Iluminação de mesas e paineis",
      "Revestimento de chão",
      "Objetos animados ou realistas"
    ],
    src: partyCustomSize
  }
];