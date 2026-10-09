export type MediaItem = { src: string; alt: string; label: string; ratio: '1:1' | '2:3' | '3:2' | '3:4' }
export type ProductItem = MediaItem & { eyebrow: string; title: string; description: string }

export const pageContent = {
  urgencyBar: {
    enabled: true,
    text: '⚡ ATENÇÃO: de R$ 47,90 por apenas R$ 19,90 ⚡ válido até',
  },
  hero: {
    image: '/images/imagem-hero.webp',
    imageAlt: 'Coleção Suprema de Cifras Gospel: coleção completa e bônus',
    headline: 'Coleção Suprema com +2000 cifras simplificadas de louvores',
    body: 'Chega de dificuldades para tocar na igreja, nos cultos ou em casa. Um método simples para cristãos que querem começar a tocar louvores diferentes em alguns dias, mesmo que achem que não tem talento.',
    ctaLabel: 'Quero os louvores agora',
    securityImage: '/images/selos-seguranca-compra.svg',
    securityImageAlt: 'Selos de compra segura, satisfação garantida e privacidade protegida',
  },
  about: [
    {
      title: 'A Coleção Suprema é o melhor pacote de cifras que você vai encontrar',
      paragraphs: [
        'As cifras mais pesquisadas de todos os tempos agora organizadas, separadas por hinos mais novos e hinos da harpa cristã, prontas para imprimir, revisadas e simplificadas',
        'Talvez você não queira se tornar um músico profissional, mas vai poder tocar seus louvores preferidos na sua igreja',
      ],
    },
    {
      title: '+2000 Cifras para baixar!',
      paragraphs: [
        'Esqueça aquelas cifras bagunçadas da internet cheias de propagandas. Nosso material é limpo, organizado e feito para você tocar sem travar.',
        'Basta pegar seu instrumento, abrir a Coleção Suprema e começar a tocar.',
      ],
      highlights: ['Material limpo e organizado', 'Sem propagandas', 'Pronto para imprimir'],
      ctaLabel: 'Quero baixar agora',
    },
  ],
  sampleSection: {
    eyebrow: 'Presente para você',
    title: 'Teste a qualidade',
    titleHighlight: 'antes de comprar',
    body: 'Baixe agora uma das cifras do pacote GRATUITAMENTE!',
    note: 'Clique no botão abaixo para baixar a cifra no formato PDF e testar antes de comprar',
    ctaLabel: 'Baixar cifra grátis',
    image: '',
    imageAlt: 'Página de cifra gospel do pacote',
  },
  results: {
    title: 'Imagine poder lembrar de um louvor, abrir a Coleção Suprema de Cifras Gospel e começar a tocar.',
    subtitle: 'Veja o que outros cristãos dizem',
    items: Array.from({ length: 6 }, (_, index) => ({
      src: '',
      alt: `Placeholder: Depoimento ${String(index + 1).padStart(2, '0')}`,
      label: `Depoimento ${String(index + 1).padStart(2, '0')}`,
      ratio: '2:3' as const,
    })),
  },
  bonusesSection: { title: 'E para deixar sua experiência ainda mais completa, você ainda recebe 3 bônus' },
  bonuses: [
    { src: '/images/bonus-01.webp', alt: 'Imagem do bônus 01', label: 'Imagem do bônus 01', ratio: '1:1' as const, eyebrow: 'Bônus 01', title: 'Harpa Cristã Especial', description: 'Hinos tradicionais para tocar e louvar a Deus.', value: 'R$ 47,00' },
    { src: '/images/bonus-02.webp', alt: 'Imagem do bônus 02', label: 'Imagem do bônus 02', ratio: '1:1' as const, eyebrow: 'Bônus 02', title: 'Guia de Violão para Iniciantes', description: 'Conceitos básicos para quem está começando a tocar.', value: 'R$ 27,00' },
    { src: '/images/bonus-03.webp', alt: 'Imagem do bônus 03', label: 'Imagem do bônus 03', ratio: '1:1' as const, eyebrow: 'Bônus 03', title: 'Coleção Especial de Corinhos', description: '+200 corinhos com letras e cifras para tocar e cantar.', value: 'R$ 37,00' },
  ],
  offersSection: {
    title: 'Escolha a melhor coleção para você 🎶',
    subtitle: 'Comece com os louvores essenciais ou tenha acesso à coleção completa, com muito mais cifras e bônus especiais para acompanhar seus momentos de louvor.',
    paymentSecurityImage: '/images/metodos-pagamento-seguranca.svg',
    paymentSecurityAlt: 'Métodos de pagamento e selos de compra segura, satisfação garantida e privacidade protegida',
  },
  offers: {
    simple: {
      title: '🎸 Coleção 500 Louvores',
      subtitle: 'Tudo o que você precisa para começar!',
      items: ['🎵 +500 cifras gospel', '🎸 Cifras simplificadas para facilitar o aprendizado', '🙌 Louvores para tocar no violão', '⚡ Acesso imediato', '📱 Material 100% digital'],
      previousPrice: 'R$ XX,00', installmentCount: 4, installmentValue: 'R$ 5,63', cashValue: 'R$ 19,90', ctaLabel: 'Comece com 500 louvores',
    },
    complete: {
      badge: '⭐ MAIS COMPLETA', title: '👑 Coleção Suprema — +2.000 Cifras Gospel',
      subtitle: 'Amplie seu repertório e tenha muito mais louvores à sua disposição!',
      items: [
        '🎵 +2.000 cifras gospel',
        '🎸 Cifras simplificadas para facilitar a execução',
        '🙌 Repertório para seus momentos de louvor',
        '📖 Bônus 01: Harpa Cristã Especial',
        '🎼 Bônus 02: Guia de Violão para Iniciantes',
        '🎹 Bônus 03: Coleção Especial de Corinhos — +200 corinhos com letras e cifras',
        '⚡ Acesso imediato',
        '📱 Material 100% digital',
      ],
      previousPrice: 'R$ XX,00', installmentCount: 9, installmentValue: 'R$ 5,15', cashValue: 'R$ 37,90', ctaLabel: 'Quero a Coleção Suprema',
    },
    popup: {
      eyebrow: 'Espere! Não saia ainda...',
      message: 'Você escolheu a oferta simples. Mas existe uma condição especial antes de finalizar: em vez de ficar apenas com as 7 mágicas, você pode desbloquear agora o Combo 7 Mágicas, os 3 módulos, acesso vitalício e os 3 bônus.',
      title: 'Oferta especial', previousPrice: 'R$ XX,00', installmentCount: 9, installmentValue: 'R$ 5,15', cashValue: 'R$ 37,90',
      ctaLabel: 'Sim! Quero a oferta completa por R$ 37,90', secondaryLabel: 'Não, quero continuar com a oferta simples.',
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
