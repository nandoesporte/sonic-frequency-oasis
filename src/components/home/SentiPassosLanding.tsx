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
  Volume2,
  Ear,
  CloudRain,
  Activity,
  Lock,
  MessageCircle,
  Gem,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'sp-glass-nav py-3' : 'bg-transparent py-6'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: '#6366F1' }}>
            <Volume2 className="text-white" size={24} />
          </div>
          <span className="sp-font-display font-bold text-xl tracking-tight text-white">SentiPassos</span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white">
          <a href="#inicio" className="hover:text-[#6366F1] transition-colors">Início</a>
          <a href="#sobre" className="hover:text-[#6366F1] transition-colors">O que é?</a>
          <a href="#caminhadas" className="hover:text-[#6366F1] transition-colors">Caminhadas</a>
          <a href="#testemunhos" className="hover:text-[#6366F1] transition-colors">Relatos</a>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <Link to="/auth" className="text-sm font-medium text-white hover:text-[#6366F1] transition-colors flex items-center gap-1">
            <Lock size={14} /> Entrar
          </Link>
          <Link to="/auth" className="bg-[#6366F1] hover:bg-[#6366F1]/90 px-6 py-2 rounded-full text-sm font-bold text-white transition-all transform hover:scale-105 shadow-lg shadow-[#6366F1]/20 flex items-center gap-2">
            <Gem size={16} /> Obter Premium
          </Link>
        </div>

        <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Menu">
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 sp-glass py-6 px-6 md:hidden flex flex-col gap-4 border-t border-white/10 text-white"
            style={{ borderRadius: 0 }}
          >
            <a href="#inicio" className="text-lg py-2 border-b border-white/5" onClick={() => setMobileMenuOpen(false)}>Início</a>
            <a href="#sobre" className="text-lg py-2 border-b border-white/5" onClick={() => setMobileMenuOpen(false)}>O que é?</a>
            <a href="#caminhadas" className="text-lg py-2 border-b border-white/5" onClick={() => setMobileMenuOpen(false)}>Caminhadas</a>
            <Link to="/auth" className="bg-[#6366F1] py-3 rounded-xl font-bold mt-2 text-center">Obter Premium</Link>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = () => (
  <section id="inicio" className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-[#6366F1]/30 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute top-40 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }}></div>
    </div>

    <div className="container mx-auto px-6 relative z-10 text-center">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full sp-glass border-white/5 mb-6">
          <span className="w-2 h-2 rounded-full bg-[#2DD4BF] mr-1 animate-pulse"></span>
          <span className="text-[10px] uppercase tracking-widest font-bold text-white/80">Sistema v4.2 Ativo</span>
        </span>
        <h1 className="sp-font-display text-4xl md:text-8xl font-bold leading-[0.9] mb-8 sp-glow-text tracking-tighter text-white">
          Restaure sua <br /><span className="sp-text-gradient">Harmonia</span>
        </h1>
        <p className="text-white/50 text-lg md:text-xl max-w-lg mx-auto mb-10 leading-relaxed font-light">
          Elimine dores crônicas, ansiedade e estresse através de ondas sonoras direcionadas e neurociência aplicada.
        </p>

        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
          <Link to="/auth" className="w-full md:w-auto bg-white text-black px-10 py-5 rounded-xl font-bold text-sm transition-all transform hover:scale-105 shadow-2xl">
            Transformar Minha Vida
          </Link>
          <Link to="/scientific" className="w-full md:w-auto sp-glass hover:bg-white/5 px-10 py-5 rounded-xl text-white font-bold text-sm border-white/10 transition-colors">
            Comprovação Científica
          </Link>
        </div>

        <div className="mt-12 p-8 sp-glass max-w-2xl mx-auto flex flex-col justify-center items-center text-center">
          <p className="text-xs text-white/60 italic mb-4">"A arquitetura do futuro não é apenas rápida, é intuitiva e autocurativa."</p>
          <div className="flex items-center justify-center space-x-2">
            <div className="w-6 h-6 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center">
              <Star size={10} className="text-amber-400" fill="currentColor" />
            </div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-white">Protocolo de Ressonância 7D</p>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

const TrustBar = () => (
  <div className="border-y border-white/5 py-10 sp-glass-nav">
    <div className="container mx-auto px-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 items-center uppercase tracking-[0.2em] font-bold text-[10px]">
        <div className="text-center">
          <div className="text-3xl font-bold mb-1 sp-glow-text text-white">5,000+</div>
          <div className="opacity-40 text-[#2DD4BF]">Mulheres</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold mb-1 sp-glow-text text-white">99.9%</div>
          <div className="opacity-40 text-[#6366F1]">Confiabilidade</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold mb-1 sp-glow-text text-white">21 Dias</div>
          <div className="opacity-40 text-[#2DD4BF]">Ciclo de Cura</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold mb-1 sp-glow-text text-white">7D</div>
          <div className="opacity-40 text-[#6366F1]">Dimensões</div>
        </div>
      </div>
    </div>
  </div>
);

const BenefitCard = ({ icon: Icon, title, description, color }: any) => (
  <motion.div whileHover={{ y: -5 }} className="p-8 sp-glass flex flex-col items-start gap-4 h-full">
    <div className={`p-4 rounded-2xl ${color}`}>
      <Icon size={32} className="text-white" />
    </div>
    <h3 className="text-2xl font-bold tracking-tight text-white">{title}</h3>
    <p className="text-white/50 text-sm leading-relaxed font-light">{description}</p>
  </motion.div>
);

const BentoBenefits = () => (
  <section id="sobre" className="py-24">
    <div className="container mx-auto px-6">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-7xl font-bold mb-6 sp-glow-text tracking-tighter text-white">
          Adeus ao <span className="sp-text-gradient">Ciclo de Sofrimento</span>
        </h2>
        <p className="text-white/50 max-w-2xl mx-auto font-light leading-relaxed">
          Frequências que atuam diretamente na vibração das suas células, promovendo cura real e definitiva.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <BenefitCard icon={Brain} title="Ansiedade e Estresse" description="Elimine a angústia no peito e as crises de preocupação. Reestabeleça a calma profunda." color="bg-indigo-600/20" />
        <BenefitCard icon={Activity} title="Dores Crônicas" description="Alívio real para dores nas costas, enxaquecas e tensões musculares sem medicamentos." color="bg-teal-600/20" />
        <BenefitCard icon={CloudRain} title="Sono Reparador" description="Durma profundamente em minutos. Acabe com a insônia que te persegue há anos." color="bg-indigo-600/20" />
        <BenefitCard icon={Heart} title="Equilíbrio Emocional" description="Liberte-se das oscilações de humor e encontre a paz interior que você merece." color="bg-teal-600/20" />
        <BenefitCard icon={ShieldCheck} title="Sem Efeitos Colaterais" description="Tratamento 100% natural baseado em biofísica e neurociência. Seguro para todas." color="bg-indigo-600/20" />
        <BenefitCard icon={Zap} title="Energia Vital" description="Aumente seu foco e disposição diária através da ressonância de alta frequência." color="bg-teal-600/20" />
      </div>
    </div>
  </section>
);

const ProcessStep = ({ number, title, description }: any) => (
  <div className="relative flex flex-col items-center text-center p-6 sp-glass m-2">
    <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center font-bold text-black mb-6">{number}</div>
    <h3 className="text-xl font-bold mb-3 text-white">{title}</h3>
    <p className="text-white/50 text-sm font-light">{description}</p>
  </div>
);

const HowItWorks = () => (
  <section className="py-24 relative">
    <div className="container mx-auto px-6">
      <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 sp-glow-text tracking-tighter text-white">
        Protocolo <span className="sp-text-gradient">7D</span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
        <ProcessStep number="01" title="Escolha sua necessidade" description="Ansiedade? Insônia? Dores? Selecione o protocolo inteligente para você." />
        <ProcessStep number="02" title="Ouça por 15-30 minutos" description="Use fones de ouvido. Deixe as ondas regenerativas atuarem no seu sistema." />
        <ProcessStep number="03" title="Sinta a Transformação" description="Sinta o alívio imediato e a harmonia florescer em todas as áreas da vida." />
      </div>
    </div>
  </section>
);

const WalkingTherapy = () => (
  <section id="caminhadas" className="py-24 relative overflow-hidden">
    <div className="container mx-auto px-6 relative z-10">
      <div className="sp-glass p-8 md:p-16" style={{ borderRadius: 40 }}>
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
            <span className="flex items-center gap-2 text-[#2DD4BF] font-bold text-[10px] uppercase tracking-widest mb-4">
              <Ear size={16} /> Bônus Exclusivo
            </span>
            <h2 className="text-4xl md:text-6xl font-bold mb-8 sp-glow-text tracking-tighter text-white">
              Caminhadas<br /><span className="sp-text-gradient">Terapêuticas</span>
            </h2>
            <p className="text-white/50 text-lg mb-8 leading-relaxed font-light">
              Uma revolução em terapia sonora: caminhadas guiadas que combinam movimento + frequências específicas para transformar estados emocionais.
            </p>
            <ul className="space-y-4 mb-10 text-sm font-light">
              {[
                'Transforme o medo em coragem em 20 minutos',
                'Liberte mágoas através de frequências bioacústicas',
                'Aumente sua autoconfiança enquanto caminha',
                'Sincronização entre corpo, mente e solo',
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-white/70">
                  <CheckCircle2 className="text-[#2DD4BF]" size={18} /> {item}
                </li>
              ))}
            </ul>
            <Link to="/auth" className="inline-block px-8 py-4 rounded-xl bg-white text-black font-bold text-sm hover:scale-105 transition-transform shadow-xl">
              Experimentar SentiPassos
            </Link>
          </div>
          <div className="flex-1 grid grid-cols-2 gap-4">
            <div className="space-y-4 pt-8">
              <div className="sp-glass p-6 text-center sp-animate-bounce-slow">
                <Play className="mx-auto mb-2 text-[#2DD4BF]" fill="currentColor" size={24} />
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">Cultive a Paz</span>
              </div>
              <div className="sp-glass p-6 text-center">
                <Play className="mx-auto mb-2 text-[#6366F1]" fill="currentColor" size={24} />
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">Supere a Tristeza</span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="sp-glass p-6 text-center">
                <Play className="mx-auto mb-2 text-[#6366F1]" fill="currentColor" size={24} />
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">Autoestima +</span>
              </div>
              <div className="sp-glass p-6 text-center sp-animate-bounce-slow">
                <Play className="mx-auto mb-2 text-[#2DD4BF]" fill="currentColor" size={24} />
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">Energia Vital</span>
              </div>
            </div>
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
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-[#2DD4BF] font-bold text-[10px] uppercase tracking-[0.3em] block mb-4">Evidência Clínica</span>
          <h2 className="text-4xl md:text-7xl font-bold mb-6 sp-glow-text tracking-tighter text-white">
            Neurobiologia <span className="sp-text-gradient">Aplicada</span>
          </h2>
          <p className="text-white/50 max-w-2xl mx-auto font-light">
            Não é mágica, é ciência. Nossas frequências são baseadas em décadas de pesquisas em neurociência e medicina integrativa.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
          {data.map((item, i) => (
            <div key={i} className="space-y-4">
              <div className="flex justify-between items-end">
                <span className="font-bold text-[10px] uppercase tracking-widest text-white/40">{item.label}</span>
                <span className="text-[#2DD4BF] font-bold text-2xl">{item.value}</span>
              </div>
              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} whileInView={{ width: item.value }} transition={{ duration: 1.5, ease: 'easeOut' }} className="h-full bg-[#2DD4BF]" />
              </div>
              <p className="text-[10px] text-white/30 leading-relaxed font-mono">{item.desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-16 flex flex-wrap justify-center gap-6 text-[8px] text-white/40 font-bold uppercase tracking-widest">
          <span className="px-4 py-2 sp-glass rounded-full flex items-center gap-2"><CheckCircle2 size={10} /> ISO 27001 Certified System</span>
          <span className="px-4 py-2 sp-glass rounded-full flex items-center gap-2"><CheckCircle2 size={10} /> Peer-Reviewed Research</span>
          <span className="px-4 py-2 sp-glass rounded-full flex items-center gap-2"><CheckCircle2 size={10} /> Clinical Compliance</span>
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
    <section id="testemunhos" className="py-24">
      <div className="container mx-auto px-6">
        <h2 className="sp-font-serif text-4xl font-bold text-center mb-4 sp-glow-text tracking-tighter italic text-white">Histórias Reais</h2>
        <p className="text-white/40 text-center mb-16 font-light uppercase tracking-widest text-[10px]">Depoimentos de transformação</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.map((item, i) => (
            <div key={i} className="p-8 sp-glass relative overflow-hidden h-full flex flex-col">
              <div className="flex gap-1 mb-4">
                {[...Array(item.stars)].map((_, s) => (
                  <Star key={s} size={12} fill="currentColor" className="text-[#2DD4BF]" />
                ))}
              </div>
              <p className="text-white/70 italic mb-6 leading-relaxed font-light text-sm flex-grow">"{item.text}"</p>
              <div>
                <p className="font-bold tracking-tight text-[#2DD4BF] text-sm">{item.name}</p>
                <p className="text-[10px] text-white/30 uppercase tracking-widest">{item.role}</p>
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
        <h2 className="sp-font-serif text-4xl md:text-7xl font-bold mb-4 sp-glow-text tracking-tighter italic text-white">Investimento</h2>
        <p className="text-white/40 font-light text-sm uppercase tracking-widest">Escolha sua arquitetura de vida</p>
      </div>
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-10 sp-glass border-white/5 relative" style={{ borderRadius: 40 }}>
          <h3 className="font-bold text-2xl mb-2 text-white">Mensal</h3>
          <p className="text-white/40 text-sm mb-8">Ideal para experimentar.</p>
          <div className="mb-10">
            <span className="text-4xl font-bold text-white">R$ 39,90</span>
            <span className="text-white/40 text-sm"> /mês</span>
          </div>
          <ul className="space-y-4 mb-10 text-sm font-light text-white">
            <li className="flex items-center gap-3"><CheckCircle2 size={18} className="text-[#6366F1]" /> Acesso total aos protocolos</li>
            <li className="flex items-center gap-3"><CheckCircle2 size={18} className="text-[#6366F1]" /> 21 dias de guia inicial</li>
            <li className="flex items-center gap-3"><CheckCircle2 size={18} className="text-[#6366F1]" /> Atualizações frequentes</li>
            <li className="flex items-center gap-3 opacity-30"><X size={18} /> Caminhadas Terapêuticas (Bônus)</li>
          </ul>
          <Link to="/auth" className="block text-center w-full py-4 rounded-xl border border-white/10 font-bold hover:bg-white/5 transition-colors text-sm text-white">
            Assinar Mensal
          </Link>
        </div>

        <div className="p-10 sp-glass border-[#6366F1]/50 relative overflow-hidden md:scale-105 shadow-2xl shadow-[#6366F1]/20" style={{ borderRadius: 40 }}>
          <div className="absolute top-6 right-6 px-4 py-1 bg-white text-black font-bold text-[8px] uppercase rounded-full tracking-widest">Mais Escolhido</div>
          <h3 className="font-bold text-2xl mb-2 text-white">Anual</h3>
          <p className="text-white/40 text-sm mb-8">Melhor custo-benefício.</p>
          <div className="mb-10">
            <span className="text-4xl font-bold text-white">R$ 199,00</span>
            <span className="text-white/40 italic text-xs"> /ano (menos de R$ 17/mês)</span>
          </div>
          <ul className="space-y-4 mb-10 text-sm font-light text-white">
            <li className="flex items-center gap-3"><CheckCircle2 size={18} className="text-[#2DD4BF]" /> Tudo do plano mensal</li>
            <li className="flex items-center gap-3"><CheckCircle2 size={18} className="text-[#2DD4BF]" /> Caminhadas Terapêuticas (Bônus)</li>
            <li className="flex items-center gap-3"><CheckCircle2 size={18} className="text-[#2DD4BF]" /> Acesso antecipado a novidades</li>
            <li className="flex items-center gap-3"><CheckCircle2 size={18} className="text-[#2DD4BF]" /> Suporte VIP via WhatsApp</li>
          </ul>
          <Link to="/auth" className="block text-center w-full py-4 bg-white text-black rounded-xl font-bold hover:scale-105 transition-transform shadow-lg text-sm">
            Assinar Anual com Desconto
          </Link>
        </div>
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="py-20 border-t border-white/5">
    <div className="container mx-auto px-6">
      <div className="flex flex-col md:flex-row justify-between gap-12 mb-16">
        <div className="max-w-sm">
          <div className="flex items-center gap-2 mb-6 text-[#6366F1]">
            <Volume2 size={32} />
            <span className="sp-font-display font-bold text-2xl tracking-tighter text-white">SentiPassos</span>
          </div>
          <p className="text-gray-500 leading-relaxed text-sm">
            Somos focados em neurociência e bem-estar através de frequências bioacústicas. Nossa missão é restaurar a qualidade de vida de milhares de mulheres.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-12">
          <div>
            <h4 className="font-bold mb-6 text-sm uppercase tracking-widest text-white">Produto</h4>
            <ul className="space-y-4 text-sm text-gray-500">
              <li><a href="#sobre" className="hover:text-[#6366F1] transition-colors">Protocolo 7D</a></li>
              <li><a href="#caminhadas" className="hover:text-[#6366F1] transition-colors">Caminhadas</a></li>
              <li><a href="#" className="hover:text-[#6366F1] transition-colors">Preços</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-sm uppercase tracking-widest text-white">Suporte</h4>
            <ul className="space-y-4 text-sm text-gray-500">
              <li><a href="#" className="hover:text-[#6366F1] transition-colors">FAQ</a></li>
              <li><a href="#" className="hover:text-[#6366F1] transition-colors">Contato</a></li>
              <li><a href="/terms" className="hover:text-[#6366F1] transition-colors">Aviso Legal</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-sm uppercase tracking-widest text-white">Social</h4>
            <ul className="space-y-4 text-sm text-gray-500">
              <li><a href="#" className="hover:text-[#6366F1] transition-colors">Instagram</a></li>
              <li><a href="#" className="hover:text-[#6366F1] transition-colors">YouTube</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-gray-600 uppercase tracking-[0.2em]">
        <p>© 2024 SentiPassos Ltda. Todos os direitos reservados.</p>
        <div className="flex gap-8">
          <a href="/terms">Privacidade</a>
          <a href="/terms">Termos</a>
        </div>
      </div>
    </div>
  </footer>
);

export const SentiPassosLanding = () => {
  return (
    <div className="min-h-screen relative font-sans" style={{ background: '#0A0B10', color: '#fff' }}>
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

      <section className="py-24">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto sp-glass p-12 md:p-20 border-white/5" style={{ borderRadius: 50 }}>
            <h2 className="text-4xl md:text-7xl font-bold mb-8 sp-glow-text tracking-tighter text-white">
              Pronta para sua<br /><span className="sp-text-gradient">Transformação?</span>
            </h2>
            <p className="text-white/50 text-lg mb-12 max-w-xl mx-auto font-light">
              Junte-se a mais de 5.000 mulheres que já resgataram sua saúde emocional e física. Comece agora seu teste gratuito.
            </p>
            <Link to="/auth" className="inline-flex px-12 py-6 rounded-xl bg-white text-black font-bold text-lg hover:scale-105 transition-transform shadow-2xl items-center justify-center gap-3 mx-auto">
              Começar Transformação <Zap size={24} fill="currentColor" />
            </Link>
            <p className="mt-8 text-[10px] text-white/30 uppercase tracking-[0.2em] flex items-center justify-center gap-2">
              <ShieldCheck size={14} className="text-[#2DD4BF]" /> Garantia de 7 dias ou seu dinheiro de volta.
            </p>
          </div>
        </div>
      </section>

      <Footer />

      <a
        href="https://wa.me/5500000000000"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 w-14 h-14 bg-green-500 rounded-full flex items-center justify-center text-white shadow-2xl hover:scale-110 transition-all z-40"
        aria-label="Chat"
      >
        <MessageCircle size={28} />
      </a>
    </div>
  );
};

export default SentiPassosLanding;
