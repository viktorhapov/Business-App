import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, Bookmark, BookOpen, Check, Clock3, Pause, Play, RotateCcw, RotateCw } from 'lucide-react'
import { dayOneClosing, dayOneFinalReview, dayOneIntroduction, type LessonTermContent } from './lessonContent'

export type LearningLesson = { id: number; day: number; title: string; category: string; minutes: number; status: 'not-started' | 'in-progress' | 'completed' }
type Props = { lesson: LearningLesson; content: LessonTermContent[]; audioSrc?: string; introduction?: string; closing?: string; finalReview?: string[]; reviewCase?: { introduction:string; caseStudy:string; questions:{question:string;answer:string}[]; finalQuiz:{question:string;answer:string}[] }; reviewPrompts?: {question:string;answer:string}[]; favorites: string[]; onFavorite: (term: string) => void; onBack: () => void; onComplete: () => void }
const tabs = ['Listen', 'Read', 'Vocabulary', 'Quiz'] as const

export default function LessonPage({ lesson, content, audioSrc, introduction, closing, finalReview, reviewCase, reviewPrompts, favorites, onFavorite, onBack, onComplete }: Props) {
  const [tab, setTab] = useState<(typeof tabs)[number]>('Read')
  const [answer, setAnswer] = useState<number | null>(null)
  const [playing, setPlaying] = useState(false)
  const [time, setTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [speed, setSpeed] = useState(1)
  const [audioReady, setAudioReady] = useState(false)
  const [audioFailed, setAudioFailed] = useState(false)
  const audio = useRef<HTMLAudioElement>(null)
  const narrationSrc = audioSrc?.replace('/mp3/', '/').replace(/\.mp3$/i, '-narration.txt')
  const resolvedFinalReview = finalReview ?? (lesson.day === 1 ? dayOneFinalReview : content.slice(0, 5).map(item => `${item.term}: ${item.simpleEnglish}`))
  const playAudio = () => { if (audio.current) void audio.current.play().catch(() => { setAudioFailed(true); setPlaying(false) }) }
  const togglePlay = () => { if (!audio.current) return; if (audio.current.paused) playAudio(); else audio.current.pause() }
  const seek = (seconds: number) => { if (audio.current) audio.current.currentTime = Math.max(0, Math.min(duration, audio.current.currentTime + seconds)) }
  const formatTime = (seconds: number) => `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2,'0')}`

  useEffect(() => {
    if (!('mediaSession' in navigator) || typeof MediaMetadata === 'undefined') return
    const session = navigator.mediaSession
    session.metadata = new MediaMetadata({
      title: lesson.title,
      artist: 'Business Learning',
      album: `Day ${lesson.day} · ${lesson.category}`,
      artwork: [{ src: '/icons/app-icon-192.png', sizes: '192x192', type: 'image/png' }],
    })
    const seekFromLockScreen = (seconds: number) => {
      const player = audio.current
      if (player) player.currentTime = Math.max(0, Math.min(Number.isFinite(player.duration) ? player.duration : Number.MAX_SAFE_INTEGER, player.currentTime + seconds))
    }
    const handlers: MediaSessionAction[] = ['play', 'pause', 'seekbackward', 'seekforward', 'seekto']
    try {
      session.setActionHandler('play', playAudio)
      session.setActionHandler('pause', () => audio.current?.pause())
      session.setActionHandler('seekbackward', event => seekFromLockScreen(-(event.seekOffset ?? 15)))
      session.setActionHandler('seekforward', event => seekFromLockScreen(event.seekOffset ?? 15))
      session.setActionHandler('seekto', event => {
        if (audio.current && event.seekTime !== undefined) audio.current.currentTime = event.seekTime
      })
    } catch {
      // Individual lock-screen controls vary by iOS version; the audio player still works.
    }
    return () => {
      for (const action of handlers) {
        try { session.setActionHandler(action, null) } catch { /* Unsupported action on this browser. */ }
      }
      session.metadata = null
    }
  }, [lesson.title, lesson.day, lesson.category])

  useEffect(() => {
    if (!('mediaSession' in navigator)) return
    navigator.mediaSession.playbackState = playing ? 'playing' : 'paused'
    if (duration > 0 && Number.isFinite(duration)) {
      try { navigator.mediaSession.setPositionState({ duration, playbackRate: speed, position: Math.min(time, duration) }) } catch { /* Position state is optional on iOS. */ }
    }
  }, [playing, duration, time, speed])
  return <div className="page-content subpage-content lesson-page">
    <button className="text-button" onClick={onBack}><ArrowLeft size={15}/> Back to Course</button>
    <div className="eyebrow"><BookOpen size={13}/> DAY {String(lesson.day).padStart(2,'0')} · {lesson.category.toUpperCase()}</div>
    <div className="subpage-head"><div><h1>{lesson.title}</h1><p className="welcome-sub">A practical introduction to how businesses create and deliver value.</p></div><span className={`status-pill ${lesson.status}`}>{lesson.status === 'completed' ? 'Completed' : lesson.status === 'in-progress' ? 'In progress' : 'Not started'}</span></div>
    <div className="week-tabs lesson-tabs">{tabs.map(item => <button key={item} className={tab === item ? 'tab-active' : ''} onClick={() => setTab(item)}>{item}</button>)}</div>
    <section className="roadmap-panel lesson-section">
      {tab === 'Listen' && <div><h2>Listen · Full lesson audio</h2>{audioSrc && <audio ref={audio} src={audioSrc} preload="metadata" onLoadedMetadata={event => setDuration(event.currentTarget.duration)} onCanPlay={() => { setAudioReady(true); setAudioFailed(false) }} onError={() => { setAudioReady(false); setAudioFailed(true); setPlaying(false) }} onTimeUpdate={event => setTime(event.currentTarget.currentTime)} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onEnded={() => setPlaying(false)} />}{audioReady ? <div className="audio-player"><div className="audio-controls"><button aria-label="Rewind 15 seconds" onClick={() => seek(-15)}><RotateCcw size={17}/><small>15</small></button><button className="audio-play" aria-label={playing ? 'Pause' : 'Play'} onClick={togglePlay}>{playing ? <Pause size={19}/> : <Play size={19} fill="currentColor"/>}</button><button aria-label="Forward 15 seconds" onClick={() => seek(15)}><RotateCw size={17}/><small>15</small></button><span className="audio-time">{formatTime(time)} / {formatTime(duration)}</span><select aria-label="Playback speed" value={speed} onChange={event => { const value = Number(event.target.value); setSpeed(value); if (audio.current) audio.current.playbackRate = value }}>{[0.75,1,1.25,1.5,1.75,2].map(value => <option key={value} value={value}>{value}×</option>)}</select></div><input className="audio-seek" aria-label="Audio position" type="range" min="0" max={duration || 0} value={time} onChange={event => { const value = Number(event.target.value); setTime(value); if (audio.current) audio.current.currentTime = value }}/></div> : <div className="audio-missing"><span><BookOpen size={20}/></span><strong>{audioFailed ? 'Lesson audio could not be loaded' : !audioSrc ? 'Audio is not available yet' : 'Checking for lesson audio…'}</strong><p>{audioFailed ? 'Check your connection and try again. Lesson audio streams online and is not saved for offline use.' : 'The complete lesson audio will appear here when its file is added.'}</p><small>Expected file: public{audioSrc ?? '/audio/mp3/day-01-business-fundamentals.mp3'}</small>{narrationSrc && <a className="text-button narration-download" href={narrationSrc} download>Download complete narration script</a>}</div>}</div>}
      {tab === 'Read' && <div><h2>Read · Complete lesson text</h2>{reviewCase ? <><p className="lesson-intro">{reviewCase.introduction}</p><article className="full-term"><h3>Harbor Box · Case study</h3><p>{reviewCase.caseStudy}</p><h4>Listening comprehension</h4>{reviewCase.questions.map((item,index)=><div key={item.question}><p><strong>{index+1}. {item.question}</strong></p><p className="pause-cue">[Pause for five seconds.]</p><p className="term-answer"><strong>Answer:</strong> {item.answer}</p></div>)}</article><section className="final-review"><h3>Review all 60 terms</h3>{reviewPrompts?.map((item,index)=><p key={`${index}-${item.answer}`}><strong>{String(index+1).padStart(2,'0')}.</strong> {item.question}<br/><span className="pause-cue">[Pause for five seconds.]</span><br/><strong>Answer:</strong> {item.answer}</p>)}<h3>Final review quiz</h3>{reviewCase.finalQuiz.map((item,index)=><p key={item.question}><strong>{index+1}. {item.question}</strong><br/><span className="pause-cue">[Pause for five seconds.]</span><br/><strong>Answer:</strong> {item.answer}</p>)}<p>{closing}</p></section></> : <><p className="lesson-intro">{introduction ?? dayOneIntroduction}</p>{content.map((item,index) => <article className="full-term" key={item.term}><p className="term-transition">{item.transition}</p><div className="term-heading"><span className="term-number">{String(index+1).padStart(2,'0')}</span><div><h3>{item.term}</h3>{item.pronunciation && <small>Pronunciation: {item.pronunciation}</small>}</div></div><p className="term-practice">{item.term}. {item.term}. {item.term}.</p><p className="term-translation"><strong>Перевод:</strong> {item.translation}</p><p className="term-simple"><strong>Simple English:</strong> {item.simpleEnglish}</p><p className="term-russian">{item.russian}</p><h4>Real business examples</h4><ul>{item.examples.map(sentence => <li key={sentence}>{sentence}</li>)}</ul><h4>English in context</h4><ul>{item.context.map(sentence => <li key={sentence}>{sentence}</li>)}</ul><h4>Listen and repeat</h4><ul>{item.repetition.map((sentence,i) => <li key={`${item.term}-${i}`}>{sentence}</li>)}</ul><h4>Quick question</h4><p>{item.question}</p><p className="pause-cue">[Pause for five seconds.]</p><p className="term-answer"><strong>Answer:</strong> {item.answer}</p></article>)}<section className="final-review"><h3>Final review</h3><ul>{resolvedFinalReview.map(line => <li key={line}>{line}</li>)}</ul><p>{closing ?? (lesson.day === 1 ? dayOneClosing : 'That completes this lesson. Review the key ideas, then continue with the next day in your course.')}</p></section></>}</div>}
      {tab === 'Vocabulary' && <div><h2>Vocabulary · {content.length} key terms</h2>{content.length === 0 ? <p>Lesson vocabulary is being prepared.</p> : <div className="lesson-vocab-list">{content.map(item => <article key={item.term}><div><strong>{item.term}</strong><span>{item.translation}</span></div><p>{item.simpleEnglish}</p><em>“{item.examples[0]}”</em><button className={`bookmark-button ${favorites.includes(item.term) ? 'bookmarked' : ''}`} onClick={() => onFavorite(item.term)}><Bookmark size={14} fill={favorites.includes(item.term) ? 'currentColor' : 'none'}/>{favorites.includes(item.term) ? 'Saved' : 'Add favorite'}</button></article>)}</div>}</div>}
      {tab === 'Quiz' && <div><h2>{reviewCase ? 'Weekly review quiz' : 'Quick check'}</h2>{reviewCase ? <><h3>Case study questions</h3><div className="lesson-vocab-list">{reviewCase.questions.map(item=><article key={item.question}><strong>{item.question}</strong><p className="pause-cue">Think of your answer, then reveal it.</p><details><summary>Show answer</summary><p>{item.answer}</p></details></article>)}</div><h3>Vocabulary recall · 60 terms</h3><div className="lesson-vocab-list">{reviewPrompts?.map((item,index)=><article key={`${index}-${item.answer}`}><strong>{String(index+1).padStart(2,'0')}. {item.question}</strong><details><summary>Show answer</summary><p>{item.answer}</p></details></article>)}</div><h3>Final review quiz</h3><div className="lesson-vocab-list">{reviewCase.finalQuiz.map(item=><article key={item.question}><strong>{item.question}</strong><details><summary>Show answer</summary><p>{item.answer}</p></details></article>)}</div></> : content.length === 0 ? <p>Lesson quiz is included in the Read section.</p> : <><p>{content[Math.min(8, content.length - 1)].question}</p><div className="quiz-options">{[content[Math.min(8,content.length-1)].answer, content[Math.min(8,content.length-1)].simpleEnglish, content[Math.min(8,content.length-1)].translation].map((option, i) => <button key={option} className={answer === i ? (i === 0 ? 'correct' : 'incorrect') : ''} onClick={() => setAnswer(i)}>{option}</button>)}</div>{answer !== null && <p className="quiz-feedback">{answer === 0 ? 'Correct!' : 'Not quite. Review the lesson text and try again.'}</p>}</>}</div>}
    </section>
    <div className="lesson-complete-row"><span><Clock3 size={14}/> {lesson.minutes} minutes · Day {lesson.day} of 30</span><button className="primary-button" onClick={onComplete} disabled={lesson.status === 'completed'}><Check size={15}/>{lesson.status === 'completed' ? 'Completed' : 'Mark as Completed'}</button></div>
  </div>
}





