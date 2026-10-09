export type MediaItem = { src: string; alt: string; label: string; ratio: '1:1' | '2:3' | '3:2' | '3:4' }
export type ProductItem = MediaItem & { eyebrow: string; title: string; description: string }

export const pageContent = {
  urgencyBar: {
    enabled: true,
    text: '⚡ ATENCIÓN: De $27,00 por solo $4,90 ASEGURANDO DENTRO DE LOS PRÓXIMOS MINUTOS ⚡',
  },
  hero: {
    image: '',
    imageAlt: 'Imagem da Hero',
    headline: 'Nunca mais se sinta inútil no louvor: Aprenda a tocar mais de 300 músicas gospel no violão, com cifras simplificadas para iniciantes.',
    body: 'Chega de dificuldades para tocar na igreja, nos cultos ou em casa. Um método simples para cristãos que querem começar a tocar louvores diferentes em alguns dias, mesmo que achem que não tem talento.',
    ctaLabel: 'Quero os louvores agora',
    securityImage: '/images/selos-seguranca-compra.svg',
    securityImageAlt: 'Selos de compra segura, satisfação garantida e privacidade protegida',
  },
  results: {
    title: 'Imagine poder lembrar de um louvor, abrir a Colección Suprema de Cifras Gospel e começar a tocar. Veja o que os cristãos dizem',
    items: Array.from({ length: 6 }, (_, index) => ({
      src: '',
      alt: `Placeholder: Depoimento ${String(index + 1).padStart(2, '0')}`,
      label: `Depoimento ${String(index + 1).padStart(2, '0')}`,
      ratio: '2:3' as const,
    })),
  },
  bonusesSection: { title: 'E para deixar sua experiência ainda mais completa, você ainda recebe 3 bônus' },
  bonuses: [
    { src: '', alt: 'Imagem do bônus 01', label: 'Imagem do bônus 01', ratio: '1:1' as const, eyebrow: 'Bônus 01', title: 'Colección Suprema — +1.000 Cifras Gospel', description: 'Tenha acesso a uma coleção completa com mais de 1.000 cifras de louvores gospel para encontrar novos louvores e ampliar seu repertório no violão.', value: 'R$ 47,00' },
    { src: '', alt: 'Imagem do bônus 02', label: 'Imagem do bônus 02', ratio: '1:1' as const, eyebrow: 'Bônus 02', title: 'Dicionário de Acordes', description: 'Consulte os principais acordes do violão de forma simples sempre que encontrar um acorde que ainda não conhece.', value: 'R$ 27,00' },
    { src: '', alt: 'Imagem do bônus 03', label: 'Imagem do bônus 03', ratio: '1:1' as const, eyebrow: 'Bônus 03', title: 'Conhecendo seu Violão', description: 'Aprenda os fundamentos do instrumento e entenda melhor o braço, as cordas e os principais elementos do violão antes de começar a praticar.', value: 'R$ 37,00' },
  ],
  offersSection: {
    title: 'Agora você tem duas formas de começar',
    paymentSecurityImage: '/images/metodos-pagamento-seguranca.svg',
    paymentSecurityAlt: 'Métodos de pagamento e selos de compra segura, satisfação garantida e privacidade protegida',
  },
  offers: {
    simple: {
      title: '🎸 Colección 300 Louvores',
      items: ['+300 cifras gospel', 'Cifras simplificadas', 'Louvores para tocar no violão', 'Acesso imediato', 'Material digital'],
      previousPrice: 'R$ XX,00', installmentCount: 0, installmentValue: '', cashValue: 'R$ X,XX', ctaLabel: 'Comece com +300 louvores',
    },
    complete: {
      badge: 'Mais vendido', title: '⭐ Colección Suprema + 2 Bônus',
      items: [
        { label: '+1.000 cifras gospel' },
        { label: 'Cifras simplificadas' },
        { label: 'Dicionário de Acordes', value: 'R$ 27,00' },
        { label: 'Conhecendo seu Violão', value: 'R$ 37,00' },
        { label: 'Acesso imediato' },
        { label: 'Material digital' },
      ],
      previousPrice: 'R$ XX,00', installmentCount: 0, installmentValue: '', cashValue: 'R$ X,XX', ctaLabel: 'Quero a Colección Suprema',
    },
    popup: {
      eyebrow: 'Espere! Não saia ainda...',
      message: 'Você escolheu a oferta simples. Mas existe uma condição especial antes de finalizar: em vez de ficar apenas com as 7 mágicas, você pode desbloquear agora o Combo 7 Mágicas, os 3 módulos, acesso vitalício e os 3 bônus.',
      title: 'Oferta especial', previousPrice: 'R$ 19,90', installmentCount: 3, installmentValue: 'R$ 5,46', cashValue: 'R$ 14,90',
      ctaLabel: 'Sim! Quero a oferta completa por R$ 14,90', secondaryLabel: 'Não, quero continuar com a oferta simples.',
    },
  },
  guarantee: {
    image: '/images/selo-garantia-7-dias.svg',
    imageAlt: 'Selo de garantia de 7 dias',
    days: 7,
    title: 'Aprenda no seu ritmo, sem colocar seu dinheiro em risco',
    body: 'Você terá 7 dias de garantia para conhecer a Colección Suprema de Cifras Gospel. Acesse o material, escolha seus primeiros louvores e comece a praticar. Se dentro desse período você perceber que o material não é para você, basta solicitar o reembolso dentro do prazo. Você não precisa ficar com uma compra que não deseja. 7 dias de garantia para você decidir.',
  },
  faqSection: { title: 'Ainda está com alguma dúvida?' },
  faq: [
    { question: 'Preciso saber tocar violão para usar a coleção?', answer: 'Não. A coleção foi pensada para facilitar a vida de quem está começando e quer ter acesso a cifras de louvores de forma simples e organizada.' },
    { question: 'Preciso conhecer todos os acordes?', answer: 'Não. Você pode começar pelos acordes que aparecem nas músicas que deseja aprender e ir evoluindo aos poucos. E, na oferta completa, você ainda recebe o Dicionário de Acordes para consultar sempre que precisar.' },
    { question: 'Como recebo o acesso?', answer: 'O acesso é disponibilizado de forma digital após a confirmação da compra.' },
    { question: 'Posso acessar pelo celular?', answer: 'Sim. Você poderá consultar seu material pelo dispositivo que for mais conveniente para você.' },
    { question: 'Por quanto tempo posso acessar?', answer: 'Acesso vitalício.' },
    { question: 'E se eu comprar e não gostar?', answer: 'Você tem 7 dias de garantia. Se perceber que o material não é para você, poderá solicitar o reembolso dentro do prazo.' },
  ],
  footer: { brand: 'Colección Suprema', copyright: '© 2026 Colección Suprema' },
}
