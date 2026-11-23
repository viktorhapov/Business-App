import { useEffect, useMemo, useState } from 'react'
import LessonPage from './LessonPage'
import { dayOneAudio, dayOneTerms } from './lessonContent'
import { allWeekOneTerms, daySevenCase, weekOneAudioPaths, weekOneLessons, weekOneReviewPrompts } from './weekOneLessons'
import { ArrowRight, ArrowUpRight, Bookmark, BookOpen, BriefcaseBusiness, Check, ChevronDown, CircleHelp, Clock3, Compass, Flame, GraduationCap, LayoutDashboard, Lightbulb, Menu, MoreHorizontal, Play, Search, Settings2, Sparkles, Target, TrendingUp, Wallet } from 'lucide-react'

type LessonStatus = 'not-started' | 'in-progress' | 'completed'
type Lesson = { id: number; day: number; title: string; category: string; minutes: number; status: LessonStatus; week: number }
type Nav = 'Home' | 'Course' | 'Vocabulary' | 'Review'

const initialLessons: Lesson[] = [
  { id: 1, day: 1, title: 'What makes a business work?', category: 'Business Fundamentals', minutes: 8, status: 'completed', week: 1 },
  { id: 2, day: 2, title: 'Business Ideas & Problems', category: 'Business Fundamentals', minutes: 16, status: 'completed', week: 1 },
  { id: 3, day: 3, title: 'Understanding Your Customer', category: 'Business Fundamentals', minutes: 16, status: 'in-progress', week: 1 },
  { id: 4, day: 4, title: 'Markets & Competition', category: 'Business Fundamentals', minutes: 16, status: 'not-started', week: 1 },
  { id: 5, day: 5, title: 'How Businesses Make Money', category: 'Business Fundamentals', minutes: 16, status: 'not-started', week: 1 },
  { id: 6, day: 6, title: 'Business Models', category: 'Business Fundamentals', minutes: 16, status: 'not-started', week: 1 },
  { id: 7, day: 7, title: 'Weekly Review & Case Study', category: 'Business Fundamentals', minutes: 20, status: 'not-started', week: 1 },
  { id: 8, day: 8, title: 'The marketing mix: 4 Ps', category: 'Marketing', minutes: 10, status: 'not-started', week: 2 },
  { id: 9, day: 9, title: 'Positioning & brand identity', category: 'Marketing', minutes: 11, status: 'not-started', week: 2 },
  { id: 10, day: 10, title: 'Digital marketing channels', category: 'Marketing', minutes: 12, status: 'not-started', week: 2 },
  { id: 11, day: 11, title: 'Writing a message that converts', category: 'Marketing', minutes: 9, status: 'not-started', week: 2 },
  { id: 12, day: 12, title: 'The basics of content marketing', category: 'Marketing', minutes: 10, status: 'not-started', week: 2 },
  { id: 13, day: 13, title: 'Reading marketing metrics', category: 'Marketing', minutes: 8, status: 'not-started', week: 2 },
  { id: 14, day: 14, title: 'Week 2 reflection', category: 'Marketing', minutes: 6, status: 'not-started', week: 2 },
  { id: 15, day: 15, title: 'The psychology of buying', category: 'Sales & Customer Psychology', minutes: 10, status: 'not-started', week: 3 },
  { id: 16, day: 16, title: 'Building trust in a sales conversation', category: 'Sales & Customer Psychology', minutes: 9, status: 'not-started', week: 3 },
  { id: 17, day: 17, title: 'Asking better discovery questions', category: 'Sales & Customer Psychology', minutes: 10, status: 'not-started', week: 3 },
  { id: 18, day: 18, title: 'Handling objections with confidence', category: 'Sales & Customer Psychology', minutes: 12, status: 'not-started', week: 3 },
  { id: 19, day: 19, title: 'Negotiation: finding common ground', category: 'Sales & Customer Psychology', minutes: 11, status: 'not-started', week: 3 },
  { id: 20, day: 20, title: 'The customer journey', category: 'Sales & Customer Psychology', minutes: 9, status: 'not-started', week: 3 },
  { id: 21, day: 21, title: 'Week 3 reflection', category: 'Sales & Customer Psychology', minutes: 6, status: 'not-started', week: 3 },
  { id: 22, day: 22, title: 'Reading a profit & loss statement', category: 'Finance & Management', minutes: 12, status: 'not-started', week: 4 },
  { id: 23, day: 23, title: 'Cash flow: the lifeblood of business', category: 'Finance & Management', minutes: 10, status: 'not-started', week: 4 },
  { id: 24, day: 24, title: 'Unit economics made simple', category: 'Finance & Management', minutes: 11, status: 'not-started', week: 4 },
  { id: 25, day: 25, title: 'Leading a high-trust team', category: 'Finance & Management', minutes: 9, status: 'not-started', week: 4 },
  { id: 26, day: 26, title: 'Strategy, focus & saying no', category: 'Strategy & Modern Business', minutes: 10, status: 'not-started', week: 4 },
  { id: 27, day: 27, title: 'The competitive landscape', category: 'Strategy & Modern Business', minutes: 11, status: 'not-started', week: 4 },
  { id: 28, day: 28, title: 'AI & the future of business', category: 'Strategy & Modern Business', minutes: 12, status: 'not-started', week: 4 },
  { id: 29, day: 29, title: 'Business English: sound more confident', category: 'Strategy & Modern Business', minutes: 9, status: 'not-started', week: 4 },
  { id: 30, day: 30, title: 'Your next 90-day business plan', category: 'Strategy & Modern Business', minutes: 12, status: 'not-started', week: 4 },
]

const categories = [
  { name: 'Business Fundamentals', short: 'Business fundamentals', lessons: '7 lessons', icon: BriefcaseBusiness, tone: 'blue', progress: 43 },
  { name: 'Marketing', short: 'Marketing', lessons: '7 lessons', icon: Target, tone: 'violet', progress: 0 },
  { name: 'Sales & Customer Psychology', short: 'Sales & psychology', lessons: '7 lessons', icon: TrendingUp, tone: 'mint', progress: 0 },
  { name: 'Finance & Management', short: 'Finance & management', lessons: '4 lessons', icon: Wallet, tone: 'amber', progress: 0 },
  { name: 'Strategy & Modern Business', short: 'Strategy & modern business', lessons: '5 lessons', icon: Compass, tone: 'rose', progress: 0 },
]

const vocab = [...dayOneTerms.map(item => ({ ...item, day: 1 })), ...Object.entries(weekOneLessons).flatMap(([day, lesson]) => lesson.terms.map(item => ({ ...item, day: Number(day) })))]

function loadLessons(): Lesson[] {
  try { const saved = localStorage.getItem('business-learning-lessons'); if (!saved) return initialLessons; const previous = JSON.parse(saved) as Lesson[]; return initialLessons.map(item => ({ ...item, status: previous.find(old => old.id === item.id)?.status ?? item.status })) }
  catch { return initialLessons }
}

const navItems: { label: Nav; icon: typeof LayoutDashboard }[] = [
  { label: 'Home', icon: LayoutDashboard }, { label: 'Course', icon: BookOpen }, { label: 'Vocabulary', icon: Bookmark }, { label: 'Review', icon: Clock3 },
]

function App() {
  const [lessons, setLessons] = useState<Lesson[]>(loadLessons)
  const [activeNav, setActiveNav] = useState<Nav>('Home')
  const [activeWeek, setActiveWeek] = useState(1)
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null)
  const [toast, setToast] = useState('')
  const [search, setSearch] = useState('')
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [bookmarked, setBookmarked] = useState<string[]>(() => { try { return JSON.parse(localStorage.getItem('business-learning-favorites') ?? '[]') as string[] } catch { return [] } })

  useEffect(() => { localStorage.setItem('business-learning-lessons', JSON.stringify(lessons)) }, [lessons])
  useEffect(() => { localStorage.setItem('business-learning-favorites', JSON.stringify(bookmarked)) }, [bookmarked])
  useEffect(() => { const timer = window.setTimeout(() => setToast(''), 2800); return () => window.clearTimeout(timer) }, [toast])

  const completed = lessons.filter(lesson => lesson.status === 'completed').length
  const progress = Math.round(completed / lessons.length * 100)
  const currentLesson = lessons.find(lesson => lesson.status === 'in-progress') ?? lessons.find(lesson => lesson.status === 'not-started')!
  const todayLabel = new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'short', day: 'numeric' }).format(new Date())
  const weekLessons = lessons.filter(lesson => lesson.week === activeWeek)
  const filteredVocabulary = useMemo(() => vocab.filter(item => `${item.term} ${item.translation} ${item.simpleEnglish} ${item.russian} ${item.examples.join(' ')}`.toLowerCase().includes(search.toLowerCase())), [search])

  const updateLesson = (id: number, status: LessonStatus) => {
    setLessons(previous => previous.map(lesson => lesson.id === id ? { ...lesson, status } : lesson))
  }
  const startLesson = (lesson: Lesson) => {
    if (lesson.status !== 'completed') {
      setLessons(previous => previous.map(item => ({ ...item, status: item.id === lesson.id ? 'in-progress' : item.status === 'in-progress' ? 'not-started' : item.status })))
    }
    setActiveLesson(lesson)
  }
  const completeLesson = (lesson: Lesson) => {
    updateLesson(lesson.id, 'completed')
    setActiveLesson(null)
    setActiveNav('Course')
    setToast('Lesson completed. Nice work!')
  }
  const toggleBookmark = (term: string) => setBookmarked(previous => previous.includes(term) ? previous.filter(item => item !== term) : [...previous, term])

  return <div className="app-shell">
    <aside className={`sidebar ${mobileNavOpen ? 'sidebar-open' : ''}`}>
      <div className="brand"><div className="brand-mark"><span /></div><span>business<span className="brand-light">learning</span></span></div>
      <div className="nav-group-label">MENU</div>
      <nav className="main-nav" aria-label="Main navigation">
        {navItems.map(item => <button key={item.label} className={`nav-link ${activeNav === item.label ? 'active' : ''}`} onClick={() => { setActiveLesson(null); setActiveNav(item.label); setMobileNavOpen(false) }}><item.icon size={18} strokeWidth={1.8} /><span>{item.label}</span>{item.label === 'Review' && <span className="nav-count">3</span>}</button>)}
      </nav>
      <div className="sidebar-divider" />
      <div className="nav-group-label">YOUR LEARNING</div>
      <div className="sidebar-course"><div className="sidebar-course-icon"><GraduationCap size={17} /></div><div><p>30-Day Business Course</p><span>Week 1 of 4</span></div><ChevronDown size={15} className="side-chevron" /></div>
      <div className="sidebar-week-list">{['Week 01', 'Week 02', 'Week 03', 'Week 04'].map((week, i) => <button key={week} className={`sidebar-week ${activeWeek === i + 1 && activeNav === 'Course' ? 'selected' : ''}`} onClick={() => { setActiveLesson(null); setActiveWeek(i + 1); setActiveNav('Course'); setMobileNavOpen(false) }}><span className={`week-dot ${i < 1 ? 'week-done' : i === 1 ? 'week-active' : ''}`}>{i < 1 ? <Check size={10} /> : ''}</span>{week}<span className="week-side-count">{i === 0 ? '3/7' : i === 1 ? '0/7' : i === 2 ? '0/7' : '0/9'}</span></button>)}</div>
      <div className="sidebar-bottom"><div className="daily-card"><div className="daily-icon"><Flame size={16} fill="currentColor" /></div><div className="daily-copy"><strong>Keep the momentum</strong><span>You're building a great habit.</span></div><ArrowUpRight size={15} className="daily-arrow" /></div><button className="profile-card"><div className="avatar">V</div><div className="profile-text"><strong>Viktor Morgan</strong><span>Free plan</span></div><MoreHorizontal size={18} className="profile-more" /></button></div>
    </aside>

    {mobileNavOpen && <button className="mobile-scrim" aria-label="Close navigation" onClick={() => setMobileNavOpen(false)} />}

    <main className="main-area">
      <header className="topbar"><button className="mobile-menu" aria-label="Open navigation" onClick={() => setMobileNavOpen(true)}><Menu size={21} /></button><div className="breadcrumbs"><span>Workspace</span><span className="breadcrumb-slash">/</span><strong>{activeNav === 'Home' ? 'Overview' : activeNav}</strong></div><div className="topbar-actions"><div className="today-label"><span className="live-dot" />{todayLabel}</div><button className="icon-button search-top" aria-label="Search" onClick={() => document.getElementById('vocab-search')?.focus()}><Search size={17} /></button><button className="icon-button" aria-label="Settings" onClick={() => setToast('Your learning preferences are up to date.')}><Settings2 size={17} /></button><div className="top-avatar">V</div></div></header>

      {!activeLesson && activeNav === 'Home' && <div className="page-content">
        <div className="welcome-row"><div><div className="eyebrow"><Sparkles size={13} /> YOUR LEARNING SPACE</div><h1>Good morning, Viktor <span className="wave">✳</span></h1><p className="welcome-sub">A little progress each day adds up. Let’s keep going.</p></div><button className="date-chip"><span className="date-day">24</span><span>THU <b>OCT</b></span><ChevronDown size={14} /></button></div>

        <section className="hero-card"><div className="hero-grid" /><div className="hero-copy"><div className="hero-kicker"><span className="kicker-dot" /> YOUR LEARNING JOURNEY</div><h2>Build your business<br />acumen, <em>one day at a time.</em></h2><p>A guided 30-day path to sharpen your thinking and grow with confidence.</p><button className="primary-button" onClick={() => startLesson(currentLesson)}><Play size={15} fill="currentColor" /> Continue learning <ArrowRight size={16} /></button><div className="hero-foot"><div className="avatars"><span>J</span><span>M</span><span>K</span></div><span>Join <strong>2,400+</strong> curious minds learning daily</span></div></div><div className="hero-progress"><div className="progress-orbit"><svg viewBox="0 0 170 170" aria-label={`${progress}% progress`}><circle className="orbit-track" cx="85" cy="85" r="73" /><circle className="orbit-value" cx="85" cy="85" r="73" strokeDasharray={`${progress / 100 * 459} 459`} /></svg><div className="orbit-center"><span className="orbit-percent">{progress}<small>%</small></span><span className="orbit-caption">OVERALL<br />PROGRESS</span></div></div><div className="progress-legend"><span className="legend-icon"><Check size={14} /></span><div><strong>{completed} of 30 days</strong><span>completed so far</span></div></div><div className="progress-quote"><span>“</span>Small steps lead to big shifts.</div></div><div className="hero-ornament" /></section>

        <div className="section-heading course-heading"><div><div className="eyebrow">THE 30-DAY PATH</div><h2>Your learning roadmap <span className="heading-pill">4 weeks</span></h2></div><button className="text-button" onClick={() => setActiveNav('Course')}>View full course <ArrowRight size={15} /></button></div>
        <section className="week-overview">{[1,2,3,4].map((week, i) => {const weekData = lessons.filter(lesson => lesson.week === week); const weekComplete = weekData.filter(lesson => lesson.status === 'completed').length; return <button key={week} className={`week-card ${activeWeek === week ? 'week-card-active' : ''}`} onClick={() => { setActiveWeek(week); setActiveNav('Course') }}><div className="week-card-top"><span className={`week-tag ${i === 0 ? 'tag-blue' : i === 1 ? 'tag-violet' : i === 2 ? 'tag-mint' : 'tag-amber'}`}>WEEK 0{week}</span>{i === 0 && <span className="current-label">CURRENT</span>}<ArrowUpRight size={15} className="week-link" /></div><strong>{['The foundations', 'Finding your market', 'Winning customers', 'Grow with confidence'][i]}</strong><span className="week-card-desc">{['Understand how businesses create value.', 'Reach the right people with the right message.', 'Build trust and turn conversations into action.', 'Read the numbers. Think bigger.'][i]}</span><div className="week-card-bottom"><span>{weekComplete} of {weekData.length} lessons</span><div className="mini-track"><i style={{ width: `${weekComplete / weekData.length * 100}%` }} /></div></div></button>})}</section>

        <div className="section-heading topics-heading"><div><div className="eyebrow">EXPLORE BY TOPIC</div><h2>Made for the real world</h2></div><button className="text-button" onClick={() => setActiveNav('Course')}>All topics <ArrowRight size={15} /></button></div>
        <section className="topic-grid">{categories.map(category => {const Icon = category.icon; const topicLessons = lessons.filter(lesson => lesson.category === category.name); const topicCompleted = topicLessons.filter(lesson => lesson.status === 'completed').length; const topicProgress = Math.round(topicCompleted / topicLessons.length * 100); return <button key={category.name} className={`topic-card ${category.tone}`} onClick={() => { const first = topicLessons.find(lesson => lesson.status !== 'completed') ?? topicLessons[0]; setActiveWeek(first.week); setActiveNav('Course') }}><div className="topic-card-top"><div className="topic-icon"><Icon size={19} strokeWidth={1.7} /></div><ArrowUpRight size={15} className="topic-arrow" /></div><div className="topic-name">{category.name}</div><div className="topic-meta">{category.lessons}<span />{topicCompleted > 0 ? `${topicCompleted} completed` : 'Coming up'}</div><div className="topic-track"><i style={{ width: `${topicProgress}%` }} /></div></button>})}</section>

        <div className="bottom-grid"><section className="today-card"><div className="section-heading compact-heading"><div><div className="eyebrow">PICK UP WHERE YOU LEFT OFF</div><h2>Today's lesson</h2></div><button className="icon-button subtle" aria-label="More lesson options"><MoreHorizontal size={18} /></button></div><button className="lesson-feature" onClick={() => startLesson(currentLesson)}><div className="lesson-thumb"><div className="thumb-grid"/><div className="thumb-ring ring-one"/><div className="thumb-ring ring-two"/><span>DAY {String(currentLesson.day).padStart(2,'0')}</span></div><div className="lesson-feature-info"><span className="lesson-topic">{currentLesson.category}</span><strong>{currentLesson.title}</strong><span className="lesson-time"><Clock3 size={13} /> {currentLesson.minutes} min <i /> {currentLesson.status === 'in-progress' ? 'In progress' : 'New lesson'}</span></div><div className="lesson-play"><Play size={17} fill="currentColor" /></div></button></section><section className="streak-card"><div className="streak-header"><div><div className="eyebrow">YOUR CONSISTENCY</div><h2>You're on a roll <span>↗</span></h2></div><div className="streak-badge"><Flame size={16} fill="currentColor" /> 3</div></div><p>Three days of showing up. That’s how good habits begin.</p><div className="streak-days">{['M','T','W','T','F','S','S'].map((day, i) => <div key={`${day}-${i}`} className={`streak-day ${i < 3 ? 'streak-complete' : i === 3 ? 'streak-today' : ''}`}><span>{day}</span><i>{i < 3 ? <Check size={12} /> : i === 3 ? <Flame size={12} /> : ''}</i></div>)}</div><span className="streak-footer"><span className="streak-spark"><Sparkles size={12} /></span> Keep it up! Your future self says thanks.</span></section></div>
      </div>}

      {!activeLesson && activeNav === 'Course' && <div className="page-content subpage-content"><div className="eyebrow"><BookOpen size={13} /> THE 30-DAY PATH</div><div className="subpage-head"><div><h1>Your course roadmap</h1><p className="welcome-sub">Four weeks, five topics, one stronger business mind.</p></div><div className="course-progress-pill"><span>{completed}/30 complete</span><div className="mini-track"><i style={{ width: `${progress}%` }} /></div></div></div><div className="week-tabs">{[1,2,3,4].map(week => <button key={week} className={activeWeek === week ? 'tab-active' : ''} onClick={() => setActiveWeek(week)}><span>Week 0{week}</span><small>{lessons.filter(lesson => lesson.week === week).filter(lesson => lesson.status === 'completed').length}/{lessons.filter(lesson => lesson.week === week).length}</small></button>)}</div><section className="roadmap-panel"><div className="roadmap-header"><div><span className="week-tag tag-blue">WEEK 0{activeWeek}</span><h2>{['The foundations', 'Finding your market', 'Winning customers', 'Grow with confidence'][activeWeek - 1]}</h2><p>{['Understand how businesses create value.', 'Reach the right people with the right message.', 'Build trust and turn conversations into action.', 'Read the numbers. Think bigger.'][activeWeek - 1]}</p></div><div className="roadmap-progress-ring"><strong>{weekLessons.filter(lesson => lesson.status === 'completed').length}<small>/{weekLessons.length}</small></strong><span>LESSONS</span></div></div><div className="lesson-list">{weekLessons.map(lesson => <button key={lesson.id} className={`lesson-row ${lesson.status}`} onClick={() => startLesson(lesson)}><span className="lesson-number">{lesson.status === 'completed' ? <Check size={14} /> : String(lesson.day).padStart(2,'0')}</span><span className="lesson-row-copy"><strong>{lesson.title}</strong><small>{lesson.category}</small></span><span className="lesson-row-time"><Clock3 size={13} />{lesson.minutes} min</span><span className={`status-pill ${lesson.status}`}>{lesson.status === 'not-started' ? 'Not started' : lesson.status === 'in-progress' ? 'In progress' : 'Completed'}</span><ArrowRight size={15} className="lesson-row-arrow" /></button>)}</div></section><div className="quote-banner"><Lightbulb size={19} /><p>Consistency beats intensity.<span> Ten focused minutes each day can change how you see business.</span></p></div></div>}

      {!activeLesson && activeNav === 'Vocabulary' && <div className="page-content subpage-content"><div className="eyebrow"><Bookmark size={13}/> YOUR PERSONAL GLOSSARY</div><div className="subpage-head"><div><h1>Words worth knowing</h1><p className="welcome-sub">Business English from Week 1.</p></div><div className="vocab-count"><strong>{bookmarked.length}</strong><span>favorites</span></div></div><div className="vocab-toolbar"><div className="vocab-search"><Search size={17}/><input id="vocab-search" value={search} onChange={event => setSearch(event.target.value)} placeholder="Search terms, translations, or definitions..."/></div><button className="filter-button" onClick={() => setSearch('')}>Clear search</button></div><div className="vocab-grid">{filteredVocabulary.map((item, i) => <article key={item.term} className="vocab-card"><div className="vocab-card-top"><span className="vocab-index blue">{String(i+1).padStart(2,'0')}</span><button className={`bookmark-button ${bookmarked.includes(item.term) ? 'bookmarked' : ''}`} aria-label={`Favorite ${item.term}`} onClick={() => toggleBookmark(item.term)}><Bookmark size={17} fill={bookmarked.includes(item.term) ? 'currentColor' : 'none'}/></button></div><span className="vocab-type">DAY {String(item.day).padStart(2,'0')} · {item.day === 1 ? 'Business Fundamentals' : weekOneLessons[item.day]?.title}</span><h2>{item.term}</h2><p className="vocab-translation">{item.translation}</p><p>{item.simpleEnglish}</p><p className="term-russian">{item.russian}</p><div className="vocab-example"><span>IN A SENTENCE</span><em>“{item.examples[0]}”</em></div></article>)}{filteredVocabulary.length === 0 && <div className="empty-state"><Search size={22}/><strong>No terms found</strong><span>Try a different search.</span></div>}</div></div>}

      {!activeLesson && activeNav === 'Review' && <div className="page-content subpage-content"><div className="eyebrow"><Clock3 size={13} /> KEEP IT FRESH</div><div className="subpage-head"><div><h1>A quick review</h1><p className="welcome-sub">A few minutes today helps good ideas stick around.</p></div><div className="review-score"><span className="review-score-icon"><Flame size={15} /></span><strong>3 day streak</strong></div></div><section className="review-hero"><div className="review-orb"><Sparkles size={25} /></div><div><span className="eyebrow">YOUR DAILY RECAP</span><h2>3 ideas to revisit</h2><p>Keep the things you’ve learned close, and build on them tomorrow.</p></div><button className="primary-button" onClick={() => setToast('Review session started. You’ve got this!')}><Play size={15} fill="currentColor" /> Start review <ArrowRight size={16} /></button></section><div className="section-heading review-heading"><div><div className="eyebrow">READY WHEN YOU ARE</div><h2>Fresh in your mind</h2></div><span className="muted-caption">3 items · about 2 min</span></div><div className="review-items">{[{ n:'01', title:'The business model canvas', meta:'Day 02 · Business Fundamentals', icon:BriefcaseBusiness, tone:'blue' }, { n:'02', title:'Value proposition', meta:'Business English · Vocabulary', icon:Bookmark, tone:'violet' }, { n:'03', title:'Creating value for customers', meta:'Day 01 · Key idea', icon:Lightbulb, tone:'amber' }].map(item => {const Icon = item.icon; return <button key={item.n} className="review-item" onClick={() => setToast('Added to your review session.')}><div className={`review-item-icon ${item.tone}`}><Icon size={18} /></div><div className="review-item-copy"><strong>{item.title}</strong><span>{item.meta}</span></div><span className="review-ready">READY TO REVIEW</span><ArrowRight size={16} className="lesson-row-arrow" /></button>})}</div><div className="review-tip"><CircleHelp size={17} /><span>Reviews bring a little spaced practice into your learning day. No pressure—just a helpful nudge.</span></div></div>}

      <footer className="page-footer"><span>BUSINESS LEARNING <i>•</i> MADE FOR YOUR NEXT CHAPTER</span><button onClick={() => setToast('Help is on the way!')}><CircleHelp size={13} /> Need a hand?</button><span className="footer-version">V 1.0.0</span></footer>
    </main>

    {activeLesson && <LessonPage lesson={activeLesson} content={activeLesson.day === 1 ? dayOneTerms : activeLesson.day === 7 ? allWeekOneTerms : weekOneLessons[activeLesson.day]?.terms ?? []} audioSrc={activeLesson.day === 1 ? dayOneAudio : weekOneAudioPaths[activeLesson.day]} introduction={weekOneLessons[activeLesson.day]?.introduction ?? (activeLesson.day === 1 ? undefined : daySevenCase.introduction)} closing={weekOneLessons[activeLesson.day]?.closing ?? (activeLesson.day === 7 ? 'You reviewed all 60 terms and applied them to a realistic small business. Keep connecting customer needs, market choices, value, revenue, costs, and a workable business model.' : undefined)} finalReview={activeLesson.day === 7 ? [] : undefined} reviewCase={activeLesson.day === 7 ? daySevenCase : undefined} reviewPrompts={activeLesson.day === 7 ? weekOneReviewPrompts : undefined} favorites={bookmarked} onFavorite={toggleBookmark} onBack={() => { setActiveLesson(null); setActiveNav('Course') }} onComplete={() => completeLesson(activeLesson)} />}
    {toast && <div className="toast"><span><Check size={13}/></span>{toast}</div>}
  </div>
}

export default App




