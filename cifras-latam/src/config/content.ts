export type MediaItem = { src: string; alt: string; label: string; ratio: '1:1' | '2:3' | '3:2' | '3:4' }
export type ProductItem = MediaItem & { eyebrow: string; title: string; description: string }

export const pageContent = {
  urgencyBar: {
    enabled: true,
    text: '⚡ ATENÇÃO: de R$ 49,90 por apenas R$ 19,90 ⚡ válido até',
  },
  hero: {
    image: '/images/imagem-hero.webp',
    imageAlt: 'Coleção Suprema Gospel para Teclado: coleção digital de cifras',
    headline: 'Tenha 600 cifras gospel organizadas para teclado e encontre seus louvores com mais praticidade',
    body: 'Uma coleção digital para tecladistas que já tocam e querem ter hinos tradicionais e louvores gospel à disposição, sem precisar procurar cada cifra separadamente.',
    highlights: ['Cifras organizadas para facilitar sua consulta.', 'Repertório gospel para seus momentos de louvor.', 'Acesso digital imediato após a compra.'],
    ctaLabel: 'Quero conhecer a coleção',
    securityImage: '/images/selos-seguranca-compra.svg',
    securityImageAlt: 'Selos de compra segura, satisfação garantida e privacidade protegida',
  },
  results: {
    title: 'Veja os feedbacks reais de quem usa a Coleção Suprema Gospel',
    subtitle: '',
    closing: '',
    items: Array.from({ length: 6 }, (_, index) => ({
      src: `/images/depoimento-${String(index + 1).padStart(2, '0')}.webp`,
      alt: `Feedback ${String(index + 1).padStart(2, '0')}`,
      label: `Feedback ${String(index + 1).padStart(2, '0')}`,
      ratio: '2:3' as const,
    })),
  },
  materials: {
    kicker: 'O que você recebe',
    title: 'Seu repertório gospel reunido em um só lugar',
    subtitle: 'Tenha acesso aos materiais digitais incluídos na oferta escolhida e consulte suas cifras com mais praticidade.',
    items: [
      { src: '', alt: 'Imagem do material 01', label: 'Material 01', ratio: '1:1' as const, eyebrow: 'Material 01', title: 'Harpa Cristã Essencial', description: '150 hinos da Harpa Cristã com cifras simplificadas para teclado, reunidos em uma coleção digital.' },
      { src: '', alt: 'Imagem do material 02', label: 'Material 02', ratio: '1:1' as const, eyebrow: 'Material 02', title: 'Corinhos de Fogo', description: 'Corinhos de fogo em material digital, para consultar e tocar nos seus momentos de louvor.' },
    ],
  },
  bonusesSection: {
    title: 'Além do produto principal, a Coleção Suprema reúne 3 bônus ainda melhores',
    subtitle: '',
  },
  bonuses: [
    { src: '/images/bonus-01.webp', alt: 'Imagem do bônus 01', label: 'Imagem do bônus 01', ratio: '1:1' as const, eyebrow: 'Bônus 01', title: 'Harpa Cristã Completa', description: '+400 hinos da Harpa Cristã com cifras simplificadas para teclado.', value: '' },
    { src: '', alt: 'Imagem do bônus 02', label: 'Imagem do bônus 02', ratio: '1:1' as const, eyebrow: 'Bônus 02', title: 'Louvores Modernos Simplificados', description: 'Cifras de louvores modernos em versões simplificadas.', value: '' },
    { src: '', alt: 'Imagem do bônus 03', label: 'Imagem do bônus 03', ratio: '1:1' as const, eyebrow: 'Bônus 03', title: 'Dicionário de Acordes para Teclado', description: 'Referência rápida de acordes para consultar enquanto toca.', value: '' },
  ],
  offersSection: {
    title: 'Escolha a opção ideal para seu repertório',
    subtitle: '',
    paymentSecurityImage: '/images/metodos-pagamento-seguranca.svg',
    paymentSecurityAlt: 'Métodos de pagamento e selos de compra segura, satisfação garantida e privacidade protegida',
  },
  offers: {
    simple: {
      title: '🎹 Cifras Essencial',
      subtitle: 'Para quem prefere hinos tradicionais.',
      items: ['🎵 150 hinos da Harpa Cristã com cifras simplificadas para teclado', '🎵 Corinhos de Fogo', '📱 Materiais digitais incluídos no pacote'],
      previousPrice: 'R$ 49,90', installmentCount: 4, installmentValue: 'R$ 5,63', cashValue: 'R$ 19,90', ctaLabel: 'Quero a Harpa Cristã Essencial',
    },
    complete: {
      badge: '⭐ MAIS COMPLETA', title: '👑 Coleção Suprema',
      subtitle: 'Para quem quer ampliar o repertório gospel.',
      items: [
        '🎵 **+600 cifras organizadas**',
        '🔥 Especiais Corinhos de Fogo',
        '📖 **Bônus 01:** Harpa Cristã Completa +400 hinos',
        '🎼 **Bônus 02:** Louvores Modernos Simplificados',
        '🎹 **Bônus 03:** Dicionário de Acordes para Teclado',
        '⚡ Acesso digital imediato após a compra',
      ],
      previousPrice: 'R$ 89,90', installmentCount: 9, installmentValue: 'R$ 5,15', cashValue: 'R$ 37,90', ctaLabel: 'Quero a Coleção Suprema',
    },
    popup: {
      eyebrow: 'Espere! Antes de escolher a opção essencial...',
      message: 'Por apenas R$ 29,90, você pode levar a Coleção Suprema completa. Se você quer mais opções de cifras gospel, esta é a oportunidade de escolher a versão ampliada por um preço especial. Em vez da oferta essencial de R$ 19,90, você pode levar a Coleção Suprema com 600 cifras organizadas e os três bônus complementares.',
      title: 'Oferta especial', previousPrice: 'R$ 37,90', installmentCount: 0, installmentValue: '', cashValue: 'R$ 29,90',
      ctaLabel: 'Quero a Coleção Completa por R$ 29,90', secondaryLabel: 'Continuar com a oferta simples',
    },
  },
  guarantee: {
    image: '/images/selo-garantia-7-dias.svg',
    imageAlt: 'Selo de garantia de 7 dias',
    days: 7,
    title: 'Conheça a coleção sem assumir o risco de ficar com uma compra indesejada',
    body: 'Você terá 7 dias de garantia para conhecer os materiais adquiridos. Acesse o conteúdo, confira as cifras e avalie se a coleção atende às suas necessidades. Se dentro do prazo você concluir que o produto não é para você, poderá solicitar o reembolso conforme as condições da garantia. Você tem 7 dias para decidir.',
  },
  faqSection: { title: 'Ainda está com alguma dúvida?' },
  faq: [
    { question: 'Preciso saber tocar teclado para usar a coleção?', answer: 'A coleção foi pensada para quem já toca teclado e deseja consultar cifras gospel de maneira organizada. Ela não é apresentada como um curso completo de aprendizagem do instrumento.' },
    { question: 'Qual é a diferença entre a oferta simples e a completa?', answer: 'A oferta simples inclui 150 hinos da Harpa Cristã com cifras simplificadas para teclado e Corinhos de Fogo. A completa inclui 600 cifras organizadas e os três bônus descritos na página.' },
    { question: 'Como recebo o acesso após a compra?', answer: 'O acesso é digital e disponibilizado após a confirmação da compra, conforme o procedimento de entrega informado no checkout.' },
    { question: 'Posso consultar as cifras pelo celular?', answer: 'A coleção é digital. Consulte os requisitos e formatos dos arquivos informados no checkout para confirmar a compatibilidade com seu dispositivo.' },
    { question: 'E se eu comprar e não gostar?', answer: 'Você terá 7 dias de garantia para avaliar o produto e solicitar o reembolso dentro do prazo, conforme as condições informadas na compra.' },
  ],
  footer: { brand: 'Coleção Suprema Gospel', copyright: '© 2026 Coleção Suprema Gospel · Material digital para consulta de cifras gospel.' },
}
