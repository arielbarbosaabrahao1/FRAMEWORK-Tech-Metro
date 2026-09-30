import React, { useState, useEffect } from 'react';
import { 
  Globe, Settings, Menu, Sun, Moon, Eye, Mic, MicOff, Search, 
  Plus, X, Bot, ShieldCheck, Code2, Users, Calendar, MapPin, User, LogOut, 
  MessageSquare, Sparkles, ArrowRight, Play, CheckCircle2, Award, Volume2, VolumeX
} from 'lucide-react';

const INITIAL_EVENTS = [
  { id: 1, title: "Engenharia de Defesa & Cibersegurança Prática", category: "Cursos", level: "Iniciante ao Avançado", desc: "Domine pentest, análise de vulnerabilidades em aplicações digitais e crie barreiras de proteção contra ataques.", date: "Disponível Imediatamente • 40h", location: "Plataforma Tech Metro (EAD)", maxCapacity: 50, enrolled: 42 },
  { id: 2, title: "Engenharia de Prompts & Agentes de IA Personalizados", category: "Cursos", level: "Intermediário", desc: "Aprenda a treinar modelos de Inteligência Artificial para automatizar rotinas e criar assistentes virtuais.", date: "Disponível Imediatamente • 25h", location: "Plataforma Tech Metro (EAD)", maxCapacity: 40, enrolled: 40 },
  { id: 3, title: "Sustentabilidade Digital & Acessibilidade Web (WCAG 2.2)", category: "Cursos", level: "Todos os Níveis", desc: "Desenvolva sistemas acessíveis para leitores de tela e navegação por teclado com otimização de código.", date: "Disponível Imediatamente • 30h", location: "Plataforma Tech Metro (EAD)", maxCapacity: 60, enrolled: 25 },
  { id: 4, title: "Formação Fullstack: HTML5, CSS3 Moderno e JS", category: "Cursos", level: "Iniciante", desc: "Construa sistemas web completos, dashboards interativos e aplicações reativas do zero absoluto.", date: "Disponível Imediatamente • 60h", location: "Plataforma Tech Metro (EAD)", maxCapacity: 100, enrolled: 88 },
  { id: 5, title: "Arquitetura de Sistemas em Nuvem com AWS e Docker", category: "Workshops", level: "Avançado", desc: "Oficina prática sobre conteinerização, microsserviços e implantação contínua de aplicações em nuvem.", date: "Quinta-feira, às 19:30", location: "Laboratório Virtual Tech Metro", maxCapacity: 30, enrolled: 18 },
  { id: 6, title: "Palestra: O Futuro do Mercado Dev & Vagas Internacionais", category: "Palestras", level: "Todos os Níveis", desc: "Especialistas da indústria debatem as principais tendências de contratação e pretensão salarial.", date: "Amanhã, às 18:00", location: "Auditório Principal Tech Metro", maxCapacity: 150, enrolled: 130 },
  { id: 7, title: "Grupo de Estudos: Resolução de Algoritmos", category: "Grupos de Estudo", level: "Intermediário", desc: "Encontros semanais para exercitar lógica de programação e preparação para entrevistas técnicas.", date: "Todas as Terças, às 20:00", location: "Comunidade Discord / Tech Metro", maxCapacity: 25, enrolled: 21 },
  { id: 8, title: "Oficina Prática de Git, GitHub e Controle de Versão", category: "Workshops", level: "Iniciante", desc: "Aprenda na prática a gerenciar branches, resolver conflitos e colaborar em projetos corporativos.", date: "Sábado, às 10:00", location: "Laboratório Virtual Tech Metro", maxCapacity: 35, enrolled: 30 }
];

export default function App() {
  const [currentPage, setCurrentPage] = useState('landingPage');
  const [activeMenu, setActiveMenu] = useState(null); // 'settings' | 'voice' | 'nav' | null

  const [isLightMode, setIsLightMode] = useState(false);
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [fontScale, setFontScale] = useState(1.0);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('techmetro_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem('techmetro_events');
    return saved ? JSON.parse(saved) : INITIAL_EVENTS;
  });
  const [userSubscriptions, setUserSubscriptions] = useState(() => {
    const saved = localStorage.getItem('techmetro_subscriptions');
    return saved ? JSON.parse(saved) : [];
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [currentCategory, setCurrentCategory] = useState('Todos');
  const [videoPreview, setVideoPreview] = useState('ia');
  const [activeFaqIndex, setActiveFaqIndex] = useState(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackSent, setFeedbackSent] = useState(false);

  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('register');
  const [modalName, setModalName] = useState('');
  const [modalEmail, setModalEmail] = useState('');
  const [modalPassword, setModalPassword] = useState('');

  const [inscriptionModalOpen, setInscriptionModalOpen] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [profileType, setProfileType] = useState('aluno');
  const [college, setCollege] = useState('');
  const [semester, setSemester] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');

  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Leitor de Voz (Síntese de Fala)
  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pt-BR';
      window.speechSynthesis.speak(utterance);
    }
  };

  // Alternar Reconhecimento de Voz
  const toggleVoiceRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      showToast("Seu navegador não suporta reconhecimento por voz.");
      return;
    }

    if (isListening) {
      setIsListening(false);
      showToast("Reconhecimento de voz desativado.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'pt-BR';
    recognition.continuous = false;

    recognition.onstart = () => {
      setIsListening(true);
      showToast("Escutando... Fale o nome do curso ou módulo.");
    };

    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setSearchTerm(transcript);
      setCurrentPage('eventsPage');
      setIsListening(false);
      showToast(`Busca realizada: "${transcript}"`);
      speakText(`Buscando por ${transcript}`);
    };

    recognition.onerror = () => {
      setIsListening(false);
      showToast("Não entendi a fala. Tente novamente.");
    };

    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  // Atalhos de Teclado (Shift + V, Shift + L, Shift + H)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.shiftKey && e.key.toUpperCase() === 'V') {
        e.preventDefault();
        setIsVoiceActive(prev => !prev);
        const newState = !isVoiceActive;
        showToast(newState ? "Comando de voz LIGADO" : "Comando de voz DESLIGADO");
        if (newState) toggleVoiceRecognition();
      }
      if (e.shiftKey && e.key.toUpperCase() === 'L') {
        e.preventDefault();
        speakText("Cursos disponíveis: Cibersegurança, Inteligência Artificial, Acessibilidade Web, Fullstack e Nuvem AWS.");
        showToast("Lendo resumo de cursos...");
      }
      if (e.shiftKey && e.key.toUpperCase() === 'H') {
        e.preventDefault();
        speakText("Atalhos do sistema: Pressione Shift + V para comando de voz, Shift + L para ouvir cursos e Shift + H para listar atalhos.");
        showToast("Lendo atalhos do teclado...");
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isVoiceActive]);

  useEffect(() => {
    if (isLightMode) document.body.classList.add('light-mode');
    else document.body.classList.remove('light-mode');
  }, [isLightMode]);

  useEffect(() => {
    if (isHighContrast) document.body.classList.add('high-contrast');
    else document.body.classList.remove('high-contrast');
  }, [isHighContrast]);

  useEffect(() => {
    document.documentElement.style.setProperty('--font-scale', `${fontScale}rem`);
  }, [fontScale]);

  useEffect(() => {
    localStorage.setItem('techmetro_events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('techmetro_subscriptions', JSON.stringify(userSubscriptions));
  }, [userSubscriptions]);

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    const userData = { nome: modalName || modalEmail.split('@')[0], email: modalEmail };
    setUser(userData);
    localStorage.setItem('techmetro_user', JSON.stringify(userData));
    setRegisterModalOpen(false);
    showToast(`Bem-vindo(a), ${userData.nome}!`);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('techmetro_user');
    showToast("Você saiu da sua conta.");
  };

  const handleCheckAuthAndOpenInscription = (courseId) => {
    if (!user) {
      showToast("Você precisa se cadastrar primeiro!");
      setAuthMode('register');
      setRegisterModalOpen(true);
      return;
    }
    setSelectedCourseId(courseId);
    setInscriptionModalOpen(true);
  };

  const handleInscriptionSubmit = (e) => {
    e.preventDefault();
    const targetEvent = events.find(ev => ev.id === selectedCourseId);
    if (targetEvent && targetEvent.enrolled < targetEvent.maxCapacity) {
      setEvents(prev => prev.map(ev => ev.id === selectedCourseId ? { ...ev, enrolled: ev.enrolled + 1 } : ev));
      if (!userSubscriptions.includes(selectedCourseId)) {
        setUserSubscriptions(prev => [...prev, selectedCourseId]);
      }
      showToast("Inscrição confirmada com sucesso!");
    }
    setInscriptionModalOpen(false);
  };

  const handleCancelInscription = (courseId) => {
    setEvents(prev => prev.map(ev => ev.id === courseId && ev.enrolled > 0 ? { ...ev, enrolled: ev.enrolled - 1 } : ev));
    setUserSubscriptions(prev => prev.filter(id => id !== courseId));
    showToast("Inscrição cancelada com sucesso!");
  };

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    if (feedbackText.trim()) {
      setFeedbackSent(true);
      setFeedbackText('');
      showToast("Feedback enviado com sucesso!");
    }
  };

  const filteredEvents = events.filter(e => {
    const matchCat = currentCategory === 'Todos' || e.category === currentCategory;
    const matchSearch = e.title.toLowerCase().includes(searchTerm.toLowerCase()) || e.desc.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="app-container">
      
      {/* HEADER FIXO */}
      <header role="banner">
        <div className="logo" onClick={() => setCurrentPage('landingPage')} title="Ir para o início">
          <Globe size={24} style={{ color: 'var(--primary)' }} /> Tech<span>Metro</span>
        </div>

        <div className="header-actions">
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, fontSize: '0.85rem', color: 'var(--primary)', background: 'rgba(255,69,0,0.12)', padding: '0.5rem 0.9rem', borderRadius: '8px', border: '1px solid var(--primary)' }}>
              <User size={16} /> {user.nome}
              <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', display: 'flex', alignItems: 'center', marginLeft: '0.4rem' }} title="Sair">
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <>
              <button type="button" className="btn-auth-outline" onClick={() => { setAuthMode('login'); setRegisterModalOpen(true); }}>Entrar</button>
              <button type="button" className="btn-auth-solid" onClick={() => { setAuthMode('register'); setRegisterModalOpen(true); }}>Cadastrar</button>
            </>
          )}

          {/* BOTÃO DO MENU VOZ E ATALHOS */}
          <button type="button" className={`icon-btn ${isListening ? 'recording' : ''}`} onClick={() => setActiveMenu(activeMenu === 'voice' ? null : 'voice')} title="Voz e Atalhos">
            <Mic size={18} />
          </button>

          <button type="button" className="icon-btn" onClick={() => setActiveMenu(activeMenu === 'settings' ? null : 'settings')} title="Configurações e Acessibilidade">
            <Settings size={18} />
          </button>

          <button type="button" className="icon-btn" onClick={() => setActiveMenu(activeMenu === 'nav' ? null : 'nav')} title="Menu do Sistema">
            <Menu size={18} />
          </button>
        </div>

        {/* DROPDOWN VOZ E ATALHOS (IGUAL À FOTO) */}
        {activeMenu === 'voice' && (
          <div className="dropdown-menu active" style={{ width: '310px' }}>
            <h3>VOZ E ATALHOS</h3>
            
            <button className="menu-btn" onClick={() => {
              setIsVoiceActive(!isVoiceActive);
              if (!isVoiceActive) toggleVoiceRecognition();
            }}>
              {isVoiceActive ? <Volume2 size={16} /> : <VolumeX size={16} />}
              Comando de Voz: {isVoiceActive ? 'LIGADO' : 'DESLIGADO'} (Shift + V)
            </button>

            <button className="menu-btn" onClick={() => {
              speakText("Cursos disponíveis: Cibersegurança, Inteligência Artificial, Acessibilidade Web, Fullstack e Nuvem AWS.");
              showToast("Lendo resumo de cursos...");
            }}>
              📢 Ouvir Cursos (Shift + L)
            </button>

            <button className="menu-btn" onClick={() => {
              speakText("Atalhos do sistema: Shift + V ativa voz. Shift + L lê cursos. Shift + H lê os atalhos.");
              showToast("Lendo atalhos...");
            }}>
              ⌨️ Ouvir Atalhos (Shift + H)
            </button>
          </div>
        )}

        {/* DROPDOWN CONFIGURAÇÕES */}
        {activeMenu === 'settings' && (
          <div className="dropdown-menu active">
            <h3>Visual e Tema</h3>
            <button className="menu-btn" onClick={() => setIsLightMode(!isLightMode)}>
              {isLightMode ? <Moon size={16} /> : <Sun size={16} />}
              Modo {isLightMode ? 'Escuro' : 'Claro'}
            </button>
            <button className="menu-btn" onClick={() => setIsHighContrast(!isHighContrast)}>
              <Eye size={16} />
              {isHighContrast ? 'Desativar' : 'Ativar'} Alto Contraste
            </button>
            <h3>Tamanho do Texto</h3>
            <div className="font-controls">
              <button className="menu-btn" onClick={() => setFontScale(prev => Math.min(1.4, prev + 0.1))}>A+ Aumentar</button>
              <button className="menu-btn" onClick={() => setFontScale(prev => Math.max(0.8, prev - 0.1))}>A- Diminuir</button>
            </div>
          </div>
        )}

        {/* DROPDOWN MENU */}
        {activeMenu === 'nav' && (
          <div className="dropdown-menu active">
            <h3>Navegação</h3>
            <button className="menu-btn" onClick={() => { setCurrentPage('eventsPage'); setActiveMenu(null); }}>
              <Search size={16} /> Ver Cursos e Vagas
            </button>
            <button className="menu-btn" onClick={() => { setCurrentPage('landingPage'); setActiveMenu(null); }}>
              <Globe size={16} /> Voltar ao Início
            </button>
          </div>
        )}
      </header>

      {/* CONTEÚDO PRINCIPAL */}
      {currentPage === 'landingPage' ? (
        <section id="landingPage">
          <div className="hero-glow"></div>
          <div className="hero-container">
            <div className="hero-left">
              <h1 className="hero-title">Especialize seu conhecimento no mercado tecnológico digital</h1>
              <p className="hero-subtitle">Conecte-se aos melhores ecossistemas de workshops, cursos práticos, grupos de estudo e aperfeiçoamento contínuo para alavancar sua carreira profissional na Tech Metro.</p>

              <div className="hero-actions">
                <button type="button" className="btn-hero-primary" onClick={() => setCurrentPage('eventsPage')}>
                  <Search size={20} /> Ver Cursos e Vagas
                </button>
                <button type="button" className="btn-hero-secondary" onClick={() => { setAuthMode('register'); setRegisterModalOpen(true); }}>
                  Criar Conta Grátis
                </button>
              </div>

              <div className="stats-row">
                <div className="stat-item">
                  <span className="stat-number">+ 100 mil</span>
                  <span className="stat-label">alunos por todo o Brasil</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">100%</span>
                  <span className="stat-label">taxa de aproveitamento acadêmico</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">100%</span>
                  <span className="stat-label">garantia para ingressar no mercado</span>
                </div>
              </div>
            </div>

            <div className="hero-card-form">
              <h2>Crie sua conta na Tech Metro</h2>
              <p>Preencha Nome, E-mail e Senha para ter acesso ilimitado aos cursos.</p>

              <form onSubmit={handleRegisterSubmit}>
                <div className="form-group">
                  <label>Nome Completo</label>
                  <input type="text" placeholder="Ex: Maria Silva" required value={modalName} onChange={e => setModalName(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>E-mail</label>
                  <input type="email" placeholder="nome@exemplo.com" required value={modalEmail} onChange={e => setModalEmail(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Senha</label>
                  <input type="password" placeholder="••••••••" required value={modalPassword} onChange={e => setModalPassword(e.target.value)} />
                </div>
                <button type="submit" className="btn-hero-primary" style={{ width: '100%', fontSize: '1rem', justifyContent: 'center' }}>
                  Criar Conta e Acessar
                </button>
              </form>
            </div>
          </div>

          <section className="launch-section">
            <h2 className="launch-header-title">Evolução contínua em tecnologia, desenvolvimento e inteligência artificial</h2>

            <div className="launch-grid">
              <div>
                <div className="launch-badge"><Sparkles size={16} style={{ display: 'inline', marginRight: '6px' }} /> Lançamentos & Módulos Exclusivos</div>
                <div className="launch-list">
                  <div className={`launch-item ${videoPreview === 'ia' ? 'active' : ''}`} onClick={() => setVideoPreview('ia')}>
                    <span className="launch-icon"><Bot size={22} /></span>
                    <div className="launch-text">Transforme a IA em uma ferramenta treinada e especializada para atender suas demandas de uso pessoal.</div>
                  </div>
                  <div className={`launch-item ${videoPreview === 'sec' ? 'active' : ''}`} onClick={() => setVideoPreview('sec')}>
                    <span className="launch-icon"><ShieldCheck size={22} /></span>
                    <div className="launch-text">Aprenda sobre cibersegurança para se destacar no mercado de trabalho.</div>
                  </div>
                  <div className={`launch-item ${videoPreview === 'dev' ? 'active' : ''}`} onClick={() => setVideoPreview('dev')}>
                    <span className="launch-icon"><Code2 size={22} /></span>
                    <div className="launch-text">Crie sistemas, HTML, sites e muito mais.</div>
                  </div>
                  <div className={`launch-item ${videoPreview === 'com' ? 'active' : ''}`} onClick={() => setVideoPreview('com')}>
                    <span className="launch-icon"><Users size={22} /></span>
                    <div className="launch-text">Acesse a comunidade mais exclusiva do mercado digital.</div>
                  </div>
                </div>
              </div>

              <div className="video-mockup-container">
                <div className="video-tag"><span className="video-dot"></span> DEMO AO VIVO (5s)</div>
                <div style={{ marginTop: '1rem' }}>
                  <span className="video-badge-btn">
                    {videoPreview === 'ia' && <><Bot size={16} /> Agente de IA Personalizado</>}
                    {videoPreview === 'sec' && <><ShieldCheck size={16} /> Cibersegurança Avançada</>}
                    {videoPreview === 'dev' && <><Code2 size={16} /> Programação e Fullstack</>}
                    {videoPreview === 'com' && <><Users size={16} /> Comunidade Exclusiva</>}
                  </span>
                </div>

                <div className="video-content-card">
                  <div className="video-content-title">
                    {videoPreview === 'ia' && 'Produtividade com LLMs e Prompts'}
                    {videoPreview === 'sec' && 'Proteção e Análise de Vulnerabilidades'}
                    {videoPreview === 'dev' && 'Construção de Sistemas Web e HTML'}
                    {videoPreview === 'com' && 'Networking Tech & Oportunidades'}
                  </div>
                  <div className="video-metrics-grid">
                    <div className="metric-box">
                      <div className="metric-value">{videoPreview === 'dev' ? '10+' : videoPreview === 'com' ? '+100k' : '+98%'}</div>
                      <div className="metric-desc">{videoPreview === 'dev' ? 'Projetos no Portfólio' : videoPreview === 'com' ? 'Membros Ativos' : 'Aproveitamento'}</div>
                    </div>
                    <div className="metric-box">
                      <div className="metric-value">{videoPreview === 'sec' ? 'Top 1%' : '100%'}</div>
                      <div className="metric-desc">{videoPreview === 'sec' ? 'Destaque no Mercado' : 'Engajamento Profissional'}</div>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="video-progress-bar-bg"><div className="video-progress-fill"></div></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
                    <span>0:00</span><span>0:05</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="features-section">
            <h2 className="features-main-title">Tudo o que você precisa para se destacar no mercado tech</h2>

            <div className="features-cards-grid">
              <div className="feature-card">
                <div>
                  <div className="feature-card-header">
                    <h3>Plataforma com a maior taxa de aprovação técnica do mercado</h3>
                    <p>Carregamento super rápido, exercícios práticos preenchidos automaticamente e a estabilidade que só a Tech Metro tem.</p>
                  </div>
                  <a className="feature-link" onClick={() => setCurrentPage('eventsPage')}>Saiba mais <ArrowRight size={16} /></a>
                </div>
                <div className="mockup-chart-box">
                  <div className="bar-group">
                    <span className="bar-val" style={{ color: 'var(--primary)' }}>95,9%</span>
                    <div className="bar-fill highlight"></div>
                    <span className="bar-label active">Tech Metro</span>
                  </div>
                  <div className="bar-group">
                    <span className="bar-val">88,4%</span>
                    <div className="bar-fill normal-a"></div>
                    <span className="bar-label">Método A</span>
                  </div>
                  <div className="bar-group">
                    <span className="bar-val">68,5%</span>
                    <div className="bar-fill normal-b"></div>
                    <span className="bar-label">Método B</span>
                  </div>
                </div>
              </div>

              <div className="feature-card">
                <div>
                  <div className="feature-card-header">
                    <h3>Suporte de dúvidas automático e monitoria em tempo real</h3>
                    <p>Código travado, erro no algoritmo ou dúvida no projeto? 9 em cada 10 dúvidas são resolvidas instantaneamente na plataforma.</p>
                  </div>
                  <a className="feature-link" onClick={() => setCurrentPage('eventsPage')}>Saiba mais <ArrowRight size={16} /></a>
                </div>
                <div className="mockup-chat-box">
                  <div className="chat-msg"><strong><MessageSquare size={14} style={{ display: 'inline', marginRight: '4px' }} /> Monitoria Tech Metro:</strong><br />Olá! Você enviou seu código em HTML/JS mas encontrou um erro no script?</div>
                  <div className="chat-msg highlight-msg"><strong><Bot size={14} style={{ display: 'inline', marginRight: '4px' }} /> Assistente Tech Metro:</strong><br />Analisei seu projeto. A função de evento foi corrigida e está pronta para testes!</div>
                </div>
              </div>

              <div className="feature-card">
                <div>
                  <div className="feature-card-header">
                    <h3>Você tem mais formas de aprender e evoluir na carreira</h3>
                    <p>Com +15 trilhas de conhecimento, o aluno aprende de forma prática mesmo com rotina corrida de estudos ou trabalho.</p>
                  </div>
                  <a className="feature-link" onClick={() => setCurrentPage('eventsPage')}>Saiba mais <ArrowRight size={16} /></a>
                </div>
                <div className="mockup-methods-grid">
                  <div className="method-card featured"><Play size={14} /> Cursos em Vídeo</div>
                  <div className="method-card"><Code2 size={14} /> Desafios Web</div>
                  <div className="method-card"><Award size={14} /> Certificados</div>
                  <div className="method-card featured"><Sparkles size={14} /> Mentorias</div>
                  <div className="method-card"><Bot size={14} /> Projetos IA</div>
                  <div className="method-card"><Users size={14} /> Comunidade</div>
                </div>
              </div>
            </div>
          </section>

          <section className="faq-section">
            <h2 className="faq-main-title">Ainda tem dúvidas? A gente responde.</h2>
            <div className="faq-accordion">
              {[
                { q: "Como o Tech Metro funciona?", a: "O Tech Metro é um ecossistema completo focado no desenvolvimento tecnológico. Você cria sua conta gratuitamente e ganha acesso a cursos, oficinas, palestras e grupos de estudo." },
                { q: "O Tech Metro é para quem está começando?", a: "Com certeza! A plataforma foi projetada tanto para quem está dando os primeiros passos no desenvolvimento quanto para quem busca especializações avançadas em IA e Cibersegurança." },
                { q: "O Tech Metro é uma plataforma de cursos online?", a: "Somos um hub completo! Além de cursos, temos palestras ao vivo, oficinas de código e grupos de estudo diários." },
                { q: "Como funciona o suporte do Tech Metro?", a: "Nosso suporte atua 24 horas por dia. Você tem o Tutor com Inteligência Artificial integrado ao ambiente de estudo para analisar seu código e tirar dúvidas." },
                { q: "Vale a pena usar o Tech Metro?", a: "Sim! O Tech Metro reduz a distância entre os estudos e a conquista de vagas. Nossos alunos constroem portfólios reais contendo aplicações web e agentes de IA." }
              ].map((faq, idx) => (
                <div key={idx} className={`faq-item ${activeFaqIndex === idx ? 'active' : ''}`}>
                  <button type="button" className="faq-header" onClick={() => setActiveFaqIndex(activeFaqIndex === idx ? null : idx)}>
                    <div className="faq-title-box">
                      <span className="faq-number">0{idx + 1}</span>
                      <span className="faq-question">{faq.q}</span>
                    </div>
                    {activeFaqIndex === idx ? <X size={20} style={{ color: 'var(--primary)' }} /> : <Plus size={20} style={{ color: 'var(--text-muted)' }} />}
                  </button>
                  {activeFaqIndex === idx && (
                    <div className="faq-content">
                      <p className="faq-answer">{faq.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          <section className="feedback-section">
            <div className="feedback-card">
              <h2>💬 Envie seu Feedback</h2>
              <p className="feedback-phrase">Nos ajude a tornar o nosso sistema cada vez melhor para o público. Para isso, contribua com o seu feedback.</p>

              <form onSubmit={handleFeedbackSubmit}>
                <div className="form-group">
                  <label>Sua Opinião ou Sugestão</label>
                  <textarea rows="4" placeholder="Escreva aqui seu comentário..." required value={feedbackText} onChange={e => setFeedbackText(e.target.value)}></textarea>
                </div>
                <button type="submit" className="btn-hero-primary" style={{ fontSize: '1rem', width: 'auto' }}>Enviar Feedback</button>
              </form>

              {feedbackSent && (
                <div className="feedback-success-msg">
                  Seu feedback vai ser atendido pela nossa equipe de suporte. Agradecemos a sua contribuição!
                </div>
              )}
            </div>
          </section>
        </section>
      ) : (

        <div id="eventsPage">
          <section className="controls">
            <div className="search-box">
              <span className="search-icon"><Search size={18} /></span>
              <input type="text" placeholder="Buscar cursos, cibersegurança, IA, HTML, cloud..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>

            <div className="category-filters">
              {['Todos', 'Cursos', 'Palestras', 'Workshops', 'Grupos de Estudo'].map(cat => (
                <button key={cat} type="button" className={`filter-chip ${currentCategory === cat ? 'active' : ''}`} onClick={() => setCurrentCategory(cat)}>
                  {cat}
                </button>
              ))}
            </div>
          </section>

          <main className="events-grid">
            {filteredEvents.map(evt => {
              const remaining = evt.maxCapacity - evt.enrolled;
              const percent = Math.min(100, Math.round((evt.enrolled / evt.maxCapacity) * 100));
              const isFull = remaining <= 0;
              const isUserEnrolled = userSubscriptions.includes(evt.id);

              return (
                <article key={evt.id} className="event-card">
                  <div>
                    <div className="card-meta-row">
                      <span className="card-category">{evt.category}</span>
                      <span className="card-level">{evt.level}</span>
                    </div>
                    <h3 className="card-title">{evt.title}</h3>
                    <p className="card-desc-text">{evt.desc}</p>
                    <p className="card-info">
                      <Calendar size={14} style={{ display: 'inline', marginRight: '4px' }} /> {evt.date}<br />
                      <MapPin size={14} style={{ display: 'inline', marginRight: '4px' }} /> {evt.location}
                    </p>

                    <div className="capacity-box">
                      <div className="capacity-row">
                        <span>Inscritos: {evt.enrolled} / Máx: {evt.maxCapacity}</span>
                        <span className={`status-badge ${isFull ? 'full' : 'available'}`}>{isFull ? 'LOTADO' : 'VAGAS DISPONÍVEIS'}</span>
                      </div>
                      <div className="capacity-bar-bg">
                        <div className="capacity-bar-fill" style={{ width: `${percent}%` }}></div>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                        {isFull ? 'Todas as vagas foram preenchidas.' : <>Restam <strong>{remaining} vagas</strong> disponíveis!</>}
                      </div>
                    </div>
                  </div>

                  {isUserEnrolled ? (
                    <button className="btn-action btn-cancel" onClick={() => handleCancelInscription(evt.id)}>Cancelar Inscrição</button>
                  ) : isFull ? (
                    <button className="btn-action btn-disabled" disabled>Inscrições Esgotadas</button>
                  ) : (
                    <button className="btn-action btn-subscribe" onClick={() => handleCheckAuthAndOpenInscription(evt.id)}>Garantir Vaga</button>
                  )}
                </article>
              );
            })}
          </main>
        </div>
      )}

      {/* MODAL CADASTRAR / ENTRAR */}
      {registerModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>{authMode === 'register' ? 'Criar Conta Tech Metro' : 'Entrar na Tech Metro'}</h2>
              <button className="close-btn" onClick={() => setRegisterModalOpen(false)}>&times;</button>
            </div>
            <form onSubmit={handleRegisterSubmit}>
              {authMode === 'register' && (
                <div className="form-group">
                  <label>Nome Completo</label>
                  <input type="text" placeholder="Digite seu nome completo" required value={modalName} onChange={e => setModalName(e.target.value)} />
                </div>
              )}
              <div className="form-group">
                <label>E-mail</label>
                <input type="email" placeholder="seuemail@exemplo.com" required value={modalEmail} onChange={e => setModalEmail(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Senha</label>
                <input type="password" placeholder="••••••••" required value={modalPassword} onChange={e => setModalPassword(e.target.value)} />
              </div>
              <button type="submit" className="btn-action btn-subscribe">
                {authMode === 'register' ? 'Cadastrar Minha Conta' : 'Acessar Conta'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL INSCRIÇÃO NO CURSO */}
      {inscriptionModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Garantir Inscrição no Curso</h2>
              <button className="close-btn" onClick={() => setInscriptionModalOpen(false)}>&times;</button>
            </div>
            <form onSubmit={handleInscriptionSubmit}>
              <div className="form-group">
                <label>Nome Completo</label>
                <input type="text" required defaultValue={user?.nome || ''} />
              </div>
              <div className="form-group">
                <label>E-mail</label>
                <input type="email" required defaultValue={user?.email || ''} />
              </div>

              <label style={{ fontSize: '0.85rem', fontWeight: 700 }}>Selecione seu Perfil Atual:</label>
              <div className="profile-type-container">
                <label className="radio-card">
                  <input type="radio" name="modalProfile" value="aluno" checked={profileType === 'aluno'} onChange={() => setProfileType('aluno')} /> Aluno de Faculdade
                </label>
                <label className="radio-card">
                  <input type="radio" name="modalProfile" value="profissional" checked={profileType === 'profissional'} onChange={() => setProfileType('profissional')} /> Profissional do Mercado
                </label>
              </div>

              {profileType === 'aluno' ? (
                <div>
                  <div className="form-group">
                    <label>Nome da Faculdade / Instituição</label>
                    <input type="text" placeholder="Ex: Faculdade ADS / Uniesp" value={college} onChange={e => setCollege(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>Semestre / Período</label>
                    <input type="text" placeholder="Ex: 3º Semestre" value={semester} onChange={e => setSemester(e.target.value)} />
                  </div>
                </div>
              ) : (
                <div>
                  <div className="form-group">
                    <label>Nome da Empresa</label>
                    <input type="text" placeholder="Ex: Tech Solutions" value={company} onChange={e => setCompany(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>Setor e Cargo</label>
                    <input type="text" placeholder="Ex: TI - Desenvolvedor Web" value={role} onChange={e => setRole(e.target.value)} />
                  </div>
                </div>
              )}

              <button type="submit" className="btn-action btn-subscribe">Confirmar e Garantir Minha Vaga</button>
            </form>
          </div>
        </div>
      )}

      {/* TOAST DE NOTIFICAÇÃO */}
      {toastMessage && (
        <div className="visual-toast">
          <CheckCircle2 size={20} /> <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
}