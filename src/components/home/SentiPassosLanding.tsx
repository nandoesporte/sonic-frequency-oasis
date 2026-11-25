import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Play,
  CheckCircle2,
  Brain,
  Heart,
  Zap,
  Star,
  ShieldCheck,
  Menu,
  X,
  Ear,
  CloudRain,
  Activity,
  Lock,
  MessageCircle,
  Gem,
  ChevronRight,
  AudioWaveform,
  MapPin,
  Mail,
  Phone,
} from 'lucide-react';
import { Link } from 'react-router-dom';

/*
 * Página de vendas — paleta musica-roxo (tokens em src/index.css).
 * Regra: um único botão de cor cheia (sp-btn-primary) por tela;
 * demais ações usam sp-btn-secondary (contorno) ou sp-btn-ghost.
 */

const BrandMark = ({ size = 40 }: { size?: number }) => (
  <div className="relative flex items-center justify-center rounded-full bg-brand-primary" style={{ width: size, height: size }}>
    <AudioWaveform className="text-brand-on-primary" size={Math.round(size * 0.55)} strokeWidth={2.5} />
  </div>
);

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'sp-glass-nav py-2' : 'bg-transparent py-4'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <BrandMark />
          <span className="font-bold text-xl tracking-tight">
            <span className="text-brand-primary">Frequency</span>
            <span className="text-brand-text ml-1">App</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-brand-muted">
          <a href="#inicio" className="hover:text-brand-text transition-colors">Início</a>
          <a href="#sobre" className="hover:text-brand-text transition-colors">O que é?</a>
          <a href="#caminhadas" className="hover:text-brand-text transition-colors">Caminhadas</a>
          <a href="#testemunhos" className="hover:text-brand-text transition-colors">Relatos</a>
        </div>

        <div className="hidden md:flex items-center gap-2">
          <Link to="/auth" className="sp-btn sp-btn-ghost">
            <Lock size={16} /> Entrar
          </Link>
          <Link to="/auth" className="sp-btn sp-btn-secondary">
            <Gem size={16} /> Obter Premium
          </Link>
        </div>

        <button className="md:hidden w-12 h-12 flex items-center justify-center text-brand-text" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Menu">
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="absolute top-full left-0 right-0 sp-glass py-6 px-6 md:hidden flex flex-col gap-2 text-brand-text"
            style={{ borderRadius: 0 }}
          >
            <a href="#inicio" className="text-lg py-2 border-b border-brand-border" onClick={() => setMobileMenuOpen(false)}>Início</a>
            <a href="#sobre" className="text-lg py-2 border-b border-brand-border" onClick={() => setMobileMenuOpen(false)}>O que é?</a>
            <a href="#caminhadas" className="text-lg py-2 border-b border-brand-border" onClick={() => setMobileMenuOpen(false)}>Caminhadas</a>
            <Link to="/auth" className="sp-btn sp-btn-primary w-full mt-4">Obter Premium</Link>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = () => (
  <section id="inicio" className="relative pt-32 pb-24 md:pt-48 md:pb-32 overflow-hidden">
    <div className="absolute inset-0 sp-grid-pattern opacity-40 pointer-events-none" />
    <div className="sp-noise absolute inset-0" />

    <div className="container mx-auto px-6 relative z-10">
      {/* Composição 2/3 texto + 1/3 visual, fora do centro */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
        <motion.div
          className="lg:col-span-2 text-left"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full sp-glass mb-8">
            <span className="relative flex">
              <span className="absolute inset-0 rounded-full bg-brand-accent sp-animate-pulse-ring"></span>
              <span className="w-2 h-2 rounded-full bg-brand-accent"></span>
            </span>
            <span className="sp-kicker">Sistema v4.2 Ativo</span>
          </span>

          <h1 className="text-brand-text mb-8" style={{ fontSize: 'clamp(3rem, 9vw, 7.5rem)' }}>
            <span className="sp-hero-l1" style={{ fontSize: '0.55em' }}>Restaure sua</span>
            <span className="sp-hero-l2 text-brand-primary">Saúde</span>
          </h1>

          <p className="text-brand-muted text-lg md:text-xl max-w-xl mb-12 leading-relaxed">
            Elimine dores crônicas, ansiedade e estresse através de ondas sonoras direcionadas e neurociência aplicada.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <Link to="/auth" className="sp-btn sp-btn-primary">
              Transformar Minha Vida
            </Link>
            <Link to="/scientific" className="sp-btn sp-btn-secondary">
              Comprovação Científica
            </Link>
          </div>
        </motion.div>

        {/* Visual: equalizador com halo de luz (claro-escuro) */}
        <div className="relative flex flex-col items-center lg:items-end">
          <div className="sp-halo w-[360px] h-[360px] -top-12 left-1/2 -translate-x-1/2 lg:left-auto lg:right-0 lg:translate-x-0" />
          <div className="relative sp-glass w-full max-w-sm p-8">
            <span className="sp-corner-bracket tl" />
            <span className="sp-corner-bracket tr" />
            <span className="sp-corner-bracket bl" />
            <span className="sp-corner-bracket br" />

            <div className="flex flex-col gap-2 text-xs sp-font-mono text-brand-muted mb-8" aria-hidden="true">
              <span>// PROTOCOLO_7D</span>
              <span>$ status: <span className="text-brand-text">active</span></span>
              <span>$ wavelength: 432Hz</span>
            </div>

            <div className="flex items-end justify-center gap-2 h-24 mb-8" aria-hidden="true">
              {[0.4, 0.7, 1, 0.6, 0.9, 0.5, 0.8, 1, 0.55, 0.75, 0.4].map((h, i) => (
                <span
                  key={i}
                  className="w-2 rounded-full bg-brand-primary sp-animate-wave-bar"
                  style={{ height: `${h * 100}%`, animationDelay: `${i * 0.1}s`, opacity: 0.55 + h * 0.45 }}
                />
              ))}
            </div>

            <p className="text-sm text-brand-muted italic mb-4">"A arquitetura do futuro não é apenas rápida, é intuitiva e autocurativa."</p>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-brand-secondary border border-brand-border flex items-center justify-center">
                <Star size={12} className="text-brand-accent" fill="currentColor" />
              </div>
              <p className="sp-kicker text-brand-text">Protocolo de Ressonância 7D</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const TrustBar = () => (
  <div className="border-y border-brand-border bg-brand-secondary relative overflow-hidden">
    <div className="border-b border-brand-border py-4 overflow-hidden">
      <div className="flex">
        <div className="sp-animate-marquee flex gap-12 whitespace-nowrap text-xs sp-font-mono uppercase text-brand-muted">
          {Array(2).fill(null).map((_, k) => (
            <div key={k} className="flex gap-12 pr-12">
              {['Resonance', '432Hz', 'Theta', 'Binaural', 'Alpha', 'Solfeggio', '528Hz', 'Delta', 'Gamma', '7D Protocol'].map((t, i) => (
                <span key={i} className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-brand-accent" />{t}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
    <div className="container mx-auto px-6 relative py-12">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
        {[
          { value: '5,000+', label: 'Mulheres' },
          { value: '99.9%', label: 'Confiabilidade' },
          { value: '21 Dias', label: 'Ciclo de Cura' },
          { value: '7D', label: 'Dimensões' },
        ].map((s) => (
          <div key={s.label} className="text-center">
            <div className="sp-font-serif text-4xl font-bold mb-2 text-brand-text">{s.value}</div>
            <div className="sp-kicker">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const SectionHeader = ({ kicker, title, accent, description }: { kicker: string; title: string; accent?: string; description?: string }) => (
  <div className="text-center mb-16">
    <span className="sp-kicker inline-flex items-center gap-4 mb-4">
      <span className="w-8 h-px bg-brand-border-strong" /> {kicker} <span className="w-8 h-px bg-brand-border-strong" />
    </span>
    <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight text-brand-text">
      {title} {accent && <span className="sp-text-gradient">{accent}</span>}
    </h2>
    {description && <p className="text-brand-muted max-w-2xl mx-auto leading-relaxed">{description}</p>}
  </div>
);

const BenefitCard = ({ icon: Icon, title, description, index }: any) => (
  <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.1 }} className="p-8 sp-glass flex flex-col items-start gap-4 h-full relative overflow-hidden text-left">
    <span className="absolute top-4 right-4 text-xs sp-font-mono text-brand-muted">0{index}</span>
    <div className="p-4 rounded-2xl bg-brand-secondary border border-brand-border">
      <Icon size={32} className="text-brand-primary" />
    </div>
    <h3 className="text-2xl font-bold tracking-tight text-brand-text">{title}</h3>
    <p className="text-brand-muted text-base leading-relaxed">{description}</p>
  </motion.div>
);

const BentoBenefits = () => (
  <section id="sobre" className="py-24 relative overflow-hidden">
    <div className="absolute inset-0 sp-dot-pattern opacity-50 pointer-events-none" />
    <div className="container mx-auto px-6 relative">
      <SectionHeader
        kicker="Benefícios"
        title="Adeus ao"
        accent="Ciclo de Sofrimento"
        description="Frequências que atuam diretamente na vibração das suas células, promovendo cura real e definitiva."
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <BenefitCard index={1} icon={Brain} title="Ansiedade e Estresse" description="Elimine a angústia no peito e as crises de preocupação. Reestabeleça a calma profunda." />
        <BenefitCard index={2} icon={Activity} title="Dores Crônicas" description="Alívio real para dores nas costas, enxaquecas e tensões musculares sem medicamentos." />
        <BenefitCard index={3} icon={CloudRain} title="Sono Reparador" description="Durma profundamente em minutos. Acabe com a insônia que te persegue há anos." />
        <BenefitCard index={4} icon={Heart} title="Equilíbrio Emocional" description="Liberte-se das oscilações de humor e encontre a paz interior que você merece." />
        <BenefitCard index={5} icon={ShieldCheck} title="Sem Efeitos Colaterais" description="Tratamento 100% natural baseado em biofísica e neurociência. Seguro para todas." />
        <BenefitCard index={6} icon={Zap} title="Energia Vital" description="Aumente seu foco e disposição diária através da ressonância de alta frequência." />
      </div>
    </div>
  </section>
);

const ProcessStep = ({ number, title, description, isLast }: any) => (
  <div className="relative flex flex-col items-start text-left p-8 sp-glass">
    {!isLast && (
      <div className="hidden md:flex absolute top-1/2 -right-8 w-8 items-center justify-center text-brand-border-strong" aria-hidden="true">
        <ChevronRight size={16} />
      </div>
    )}
    <div className="sp-font-serif text-5xl font-black text-brand-primary mb-6 leading-none">{number}</div>
    <h3 className="text-xl font-bold mb-2 text-brand-text">{title}</h3>
    <p className="text-brand-muted text-base">{description}</p>
  </div>
);

const HowItWorks = () => (
  <section className="py-24 relative overflow-hidden">
    <div className="absolute inset-0 sp-grid-pattern opacity-30 pointer-events-none" />
    <div className="container mx-auto px-6 relative">
      <SectionHeader kicker="03 · Processo" title="Protocolo" accent="7D" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
        <ProcessStep number="01" title="Escolha sua necessidade" description="Ansiedade? Insônia? Dores? Selecione o protocolo inteligente para você." />
        <ProcessStep number="02" title="Ouça por 15-30 minutos" description="Use fones de ouvido. Deixe as ondas regenerativas atuarem no seu sistema." />
        <ProcessStep number="03" title="Sinta a Transformação" description="Sinta o alívio imediato e a harmonia florescer em todas as áreas da vida." isLast />
      </div>
    </div>
  </section>
);

const WalkingTherapy = () => (
  <section id="caminhadas" className="py-24 relative overflow-hidden">
    <div className="container mx-auto px-6 relative z-10">
      <div className="sp-glass p-8 md:p-16 relative overflow-hidden" style={{ borderRadius: 40 }}>
        <div className="sp-halo w-[420px] h-[420px] -right-24 -bottom-24" />
        <div className="relative grid grid-cols-1 md:grid-cols-3 items-center gap-12">
          <div className="md:col-span-2 text-left">
            <span className="sp-kicker flex items-center gap-2 mb-4">
              <Ear size={16} className="text-brand-accent" /> Bônus Exclusivo
            </span>
            <h2 className="text-brand-text mb-8" style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)' }}>
              <span className="sp-hero-l1" style={{ fontSize: '0.6em' }}>Caminhadas</span>
              <span className="sp-hero-l2">Terapêuticas</span>
            </h2>
            <p className="text-brand-muted text-lg mb-8 leading-relaxed max-w-xl">
              Uma revolução em terapia sonora: caminhadas guiadas que combinam movimento + frequências específicas para transformar estados emocionais.
            </p>
            <ul className="space-y-4 mb-12 text-base">
              {[
                'Transforme o medo em coragem em 20 minutos',
                'Liberte mágoas através de frequências bioacústicas',
                'Aumente sua autoconfiança enquanto caminha',
                'Sincronização entre corpo, mente e solo',
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-4 text-brand-text">
                  <CheckCircle2 className="text-brand-primary flex-shrink-0" size={20} /> {item}
                </li>
              ))}
            </ul>
            <Link to="/auth" className="sp-btn sp-btn-primary">
              Experimentar SentiPassos
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {['Cultive a Paz', 'Autoestima +', 'Supere a Tristeza', 'Energia Vital'].map((label, i) => (
              <div key={label} className={`sp-glass p-6 text-center ${i % 2 === 1 ? 'mt-8' : ''}`}>
                <Play className="mx-auto mb-2 text-brand-primary" fill="currentColor" size={24} />
                <span className="text-xs font-semibold uppercase tracking-[0.12em] text-brand-muted">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);

const ScientificProof = () => {
  const data = [
    { label: 'Redução de Ansiedade', value: '86%', desc: 'Estudos por Garcia-Argibay (2019) comprovam redução significativa nos níveis de ansiedade com batidas binaurais.' },
    { label: 'Alívio de Dores', value: '72%', desc: 'Pesquisas do Journal of Pain Research mostram eficácia no tratamento de dores crônicas sem medicamentos.' },
    { label: 'Qualidade do Sono', value: '91%', desc: 'Estudos clínicos mostram melhora significativa na qualidade do sono em participantes usando frequências específicas.' },
    { label: 'Equilíbrio Hormonal', value: '78%', desc: 'Pesquisas indicam normalização de cortisol e melhora nos sintomas da menopausa com terapia sonora.' },
  ];
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-6 relative">
        <SectionHeader
          kicker="Evidência Clínica"
          title="Neurobiologia"
          accent="Aplicada"
          description="Não é mágica, é ciência. Nossas frequências são baseadas em décadas de pesquisas em neurociência e medicina integrativa."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {data.map((item, i) => (
            <div key={i} className="space-y-4 sp-glass p-8 relative overflow-hidden text-left">
              <span className="absolute top-4 right-4 text-xs sp-font-mono text-brand-muted">DATA_0{i + 1}</span>
              <div className="flex justify-between items-end gap-4 pt-4">
                <span className="font-semibold text-sm md:text-base uppercase tracking-[0.12em] text-brand-text">{item.label}</span>
                <span className="sp-font-serif text-brand-primary font-black text-5xl leading-none">{item.value}</span>
              </div>
              <div className="h-2 w-full bg-brand-secondary rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} whileInView={{ width: item.value }} transition={{ duration: 1.2, ease: 'easeOut' }} className="h-full bg-brand-primary rounded-full" />
              </div>
              <p className="text-base text-brand-muted leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
        <div className="sp-divider-line my-16 max-w-2xl mx-auto" />
        <div className="flex flex-wrap justify-center gap-4 text-sm text-brand-text font-semibold uppercase tracking-[0.08em]">
          <span className="px-6 py-2 sp-glass rounded-full flex items-center gap-2"><CheckCircle2 size={16} className="text-brand-primary" /> ISO 27001 Certified System</span>
          <span className="px-6 py-2 sp-glass rounded-full flex items-center gap-2"><CheckCircle2 size={16} className="text-brand-primary" /> Peer-Reviewed Research</span>
          <span className="px-6 py-2 sp-glass rounded-full flex items-center gap-2"><CheckCircle2 size={16} className="text-brand-primary" /> Clinical Compliance</span>
        </div>
      </div>
    </section>
  );
};

const Testimonials = () => {
  const items = [
    { name: 'Marina S.', role: 'Empresária, 42 anos', text: 'Em 3 semanas usando as frequências, minha insônia absurda melhorou 80% e consigo passar o dia com aquela angústia no peito sumindo.', stars: 5 },
    { name: 'Claudia M.', role: 'Advogada, 38 anos', text: 'Minhas dores nas costas me impediam de ser a mãe que queria ser. Com este protocolo, voltei a viver. Meu relacionamento com meu marido até melhorou!', stars: 5 },
    { name: 'Luciana A.', role: 'Arquiteta, 44 anos', text: 'Após um divórcio difícil, estava destruída emocionalmente. As frequências me ajudaram a processar a dor e encontrar paz.', stars: 5 },
  ];
  return (
    <section id="testemunhos" className="py-24 bg-brand-secondary border-y border-brand-border">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold italic tracking-tight text-brand-text mb-4">Histórias Reais</h2>
          <p className="sp-kicker">Depoimentos de transformação</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.map((item, i) => (
            <div key={i} className="p-8 rounded-3xl bg-brand-surface border border-brand-border relative overflow-hidden h-full flex flex-col text-left">
              <div className="flex gap-1 mb-4" aria-label={`${item.stars} de 5 estrelas`}>
                {[...Array(item.stars)].map((_, s) => (
                  <Star key={s} size={16} fill="currentColor" className="text-brand-accent" />
                ))}
              </div>
              <p className="text-brand-text italic mb-8 leading-relaxed text-base flex-grow">"{item.text}"</p>
              <div>
                <p className="font-bold tracking-tight text-brand-text text-base">{item.name}</p>
                <p className="text-xs text-brand-muted uppercase tracking-[0.12em]">{item.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Pricing = () => (
  <section className="py-24">
    <div className="container mx-auto px-6">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-6xl font-bold italic tracking-tight text-brand-text mb-4">Investimento</h2>
        <p className="sp-kicker">Escolha sua arquitetura de vida</p>
      </div>
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center text-left">
        <div className="p-8 md:p-12 rounded-[40px] bg-brand-surface border border-brand-border relative">
          <h3 className="font-bold text-2xl mb-2 text-brand-text">Mensal</h3>
          <p className="text-brand-muted text-base mb-8">Ideal para experimentar.</p>
          <div className="mb-8">
            <span className="sp-font-serif text-5xl font-bold text-brand-text">R$ 39,90</span>
            <span className="text-brand-muted text-base"> /mês</span>
          </div>
          <ul className="space-y-4 mb-12 text-base text-brand-text">
            <li className="flex items-center gap-4"><CheckCircle2 size={20} className="text-brand-primary" /> Acesso total aos protocolos</li>
            <li className="flex items-center gap-4"><CheckCircle2 size={20} className="text-brand-primary" /> 21 dias de guia inicial</li>
            <li className="flex items-center gap-4"><CheckCircle2 size={20} className="text-brand-primary" /> Atualizações frequentes</li>
            <li className="flex items-center gap-4 text-brand-muted line-through decoration-brand-border-strong"><X size={20} /> Caminhadas Terapêuticas (Bônus)</li>
          </ul>
          <Link to="/auth" className="sp-btn sp-btn-secondary w-full">
            Assinar Mensal
          </Link>
        </div>

        <div className="p-8 md:p-12 rounded-[40px] bg-brand-surface border-2 border-brand-primary relative overflow-hidden md:scale-105 shadow-[0_24px_64px_-24px_rgba(124,103,255,0.45)]">
          <div className="absolute top-6 right-6 px-4 py-1 bg-brand-accent text-brand-on-primary font-bold text-xs uppercase rounded-full tracking-[0.12em]">Mais Escolhido</div>
          <h3 className="font-bold text-2xl mb-2 text-brand-text">Anual</h3>
          <p className="text-brand-muted text-base mb-8">Melhor custo-benefício.</p>
          <div className="mb-8">
            <span className="sp-font-serif text-5xl font-bold text-brand-text">R$ 199,00</span>
            <span className="text-brand-muted italic text-sm"> /ano (menos de R$ 17/mês)</span>
          </div>
          <ul className="space-y-4 mb-12 text-base text-brand-text">
            <li className="flex items-center gap-4"><CheckCircle2 size={20} className="text-brand-primary" /> Tudo do plano mensal</li>
            <li className="flex items-center gap-4"><CheckCircle2 size={20} className="text-brand-primary" /> Caminhadas Terapêuticas (Bônus)</li>
            <li className="flex items-center gap-4"><CheckCircle2 size={20} className="text-brand-primary" /> Acesso antecipado a novidades</li>
            <li className="flex items-center gap-4"><CheckCircle2 size={20} className="text-brand-primary" /> Suporte VIP via WhatsApp</li>
          </ul>
          <Link to="/auth" className="sp-btn sp-btn-primary w-full">
            Assinar Anual com Desconto
          </Link>
        </div>
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="py-24 border-t border-brand-border">
    <div className="container mx-auto px-6 text-left">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
        <div className="md:col-span-4">
          <div className="flex items-center gap-2 mb-6">
            <BrandMark size={48} />
            <span className="font-bold text-2xl tracking-tight">
              <span className="text-brand-primary">Frequency</span>
              <span className="text-brand-text ml-1">App</span>
            </span>
          </div>
          <p className="text-brand-muted leading-relaxed text-sm mb-4">
            Soluções tecnológicas que transformam frequências em bem-estar e qualidade de vida.
          </p>
          <p className="text-xs text-brand-muted sp-font-mono">CNPJ: 14.164.334/0001-05</p>
        </div>

        <div className="md:col-span-5">
          <h4 className="sp-kicker text-brand-text mb-6">Informações</h4>
          <ul className="space-y-4 text-sm text-brand-muted">
            <li className="flex items-start gap-4">
              <MapPin size={16} className="text-brand-primary mt-1 flex-shrink-0" />
              <span>Avenida Doutor Luiz Teixeira Mendes, 3096 — Zona 05, Maringá - PR, 87.015-001</span>
            </li>
            <li className="flex items-center gap-4">
              <Mail size={16} className="text-brand-primary flex-shrink-0" />
              <a href="mailto:contato@kefersolucoes.com.br" className="hover:text-brand-text transition-colors">contato@kefersolucoes.com.br</a>
            </li>
            <li className="flex items-center gap-4">
              <Phone size={16} className="text-brand-primary flex-shrink-0" />
              <a href="https://wa.me/5544997270698" target="_blank" rel="noopener noreferrer" className="hover:text-brand-text transition-colors">WhatsApp: (44) 99727-0698</a>
            </li>
          </ul>
        </div>

        <div className="md:col-span-3">
          <h4 className="sp-kicker text-brand-text mb-6">Navegação</h4>
          <ul className="space-y-4 text-sm text-brand-muted">
            <li><a href="#sobre" className="hover:text-brand-text transition-colors">Protocolo 7D</a></li>
            <li><a href="#caminhadas" className="hover:text-brand-text transition-colors">Caminhadas</a></li>
            <li><Link to="/scientific" className="hover:text-brand-text transition-colors">Comprovação</Link></li>
            <li><Link to="/terms" className="hover:text-brand-text transition-colors">Termos</Link></li>
          </ul>
        </div>
      </div>
      <div className="pt-8 border-t border-brand-border flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-brand-muted uppercase tracking-[0.12em]">
        <p>© 2024 Frequency App. Todos os direitos reservados.</p>
        <div className="flex gap-8">
          <Link to="/terms" className="hover:text-brand-text transition-colors">Privacidade</Link>
          <Link to="/terms" className="hover:text-brand-text transition-colors">Termos</Link>
        </div>
      </div>
    </div>
  </footer>
);

export const SentiPassosLanding = () => {
  return (
    <div className="min-h-screen relative font-sans bg-brand-bg text-brand-text">
      <div className="sp-mesh-bg" />
      <Navbar />
      <Hero />
      <TrustBar />
      <BentoBenefits />
      <HowItWorks />
      <WalkingTherapy />
      <ScientificProof />
      <Testimonials />
      <Pricing />

      <section className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-6 text-center relative">
          <div className="max-w-4xl mx-auto sp-glass p-12 md:p-24 relative overflow-hidden" style={{ borderRadius: 48 }}>
            <span className="sp-corner-bracket tl" />
            <span className="sp-corner-bracket tr" />
            <span className="sp-corner-bracket bl" />
            <span className="sp-corner-bracket br" />
            <div className="sp-halo w-[480px] h-[480px] left-1/2 -translate-x-1/2 -top-48" />

            <h2 className="text-brand-text mb-8 relative" style={{ fontSize: 'clamp(2.5rem, 7vw, 5rem)' }}>
              <span className="sp-hero-l1" style={{ fontSize: '0.6em' }}>Pronta para sua</span>
              <span className="sp-hero-l2">Transformação?</span>
            </h2>
            <p className="text-brand-muted text-lg mb-12 max-w-xl mx-auto relative">
              Junte-se a mais de 5.000 mulheres que já resgataram sua saúde emocional e física. Comece agora sua jornada de transformação.
            </p>
            <Link to="/auth" className="sp-btn sp-btn-primary relative">
              Começar Transformação <Zap size={20} fill="currentColor" />
            </Link>
            <p className="mt-8 sp-kicker flex items-center justify-center gap-2 relative">
              <ShieldCheck size={16} className="text-brand-primary" /> Acesso imediato e seguro.
            </p>
          </div>
        </div>
      </section>

      <Footer />

      <a
        href="https://wa.me/5500000000000"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 w-14 h-14 bg-brand-secondary border border-brand-border-strong rounded-full flex items-center justify-center text-[#25D366] shadow-[0_12px_32px_-12px_rgba(13,15,23,0.9)] hover:bg-brand-surface transition-colors duration-100 z-40"
        aria-label="Chat"
      >
        <MessageCircle size={28} />
      </a>
    </div>
  );
};

export default SentiPassosLanding;
