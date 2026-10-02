'use client';

import Image from 'next/image';
import { useId, useLayoutEffect, useRef, useState } from 'react';
import { answerLabel, isCorrect, resultFor, topics, type Answer } from './quiz-data';
import styles from './study-game.module.css';

interface GameState {
  view: 'topics' | 'question' | 'results';
  topicIndex: number;
  index: number;
  answers: readonly Answer[];
  selection: Answer | null;
  submitted: boolean;
}

const initialState: GameState = {
  view: 'topics', topicIndex: 0, index: 0, answers: [], selection: null, submitted: false,
};

export default function StudyGame({ interactive }: { interactive: boolean }) {
  const [state, setState] = useState<GameState>(initialState);
  const heading = useRef<HTMLHeadingElement>(null);
  const advanceButton = useRef<HTMLButtonElement>(null);
  const pendingFocus = useRef<'heading' | 'advance' | null>(null);
  const headingId = useId();
  const tabIndex = interactive ? 0 : -1;
  const topic = topics[state.topicIndex];
  const question = topic.questions[state.index];
  const order = question.type === 'order';
  const sequence = typeof state.selection !== 'number' ? state.selection ?? [] : [];
  const score = resultFor(topic.questions.slice(0, state.answers.length), state.answers);
  const result = resultFor(topic.questions, state.answers);
  const correct = state.submitted && isCorrect(question, state.selection);
  const canSubmit = order ? sequence.length === question.options.length : state.selection !== null;

  // Focus follows game actions only, never a visibility/scroll-driven prop change.
  useLayoutEffect(() => {
    const target = pendingFocus.current;
    pendingFocus.current = null;
    if (!interactive || !target) return;
    (target === 'heading' ? heading.current : advanceButton.current)?.focus({ preventScroll: true });
  }, [state, interactive]);

  function start(topicIndex: number) {
    if (!interactive) return;
    pendingFocus.current = 'heading';
    setState({ ...initialState, view: 'question', topicIndex });
  }

  function showTopics() {
    if (!interactive) return;
    pendingFocus.current = 'heading';
    setState({ ...initialState });
  }

  function choose(value: number) {
    if (!interactive || state.submitted) return;
    if (order && sequence.includes(value)) return;
    setState({ ...state, selection: order ? [...sequence, value] : value });
  }

  function remove(position: number) {
    if (!interactive || state.submitted) return;
    setState({ ...state, selection: sequence.filter((_, index) => index !== position) });
  }

  function advance() {
    if (!interactive) return;
    if (state.submitted) {
      pendingFocus.current = 'heading';
      if (state.index === topic.questions.length - 1) {
        setState({ ...state, view: 'results' });
      } else {
        setState({ ...state, index: state.index + 1, selection: null, submitted: false });
      }
    } else if (canSubmit && state.selection !== null) {
      pendingFocus.current = 'advance';
      setState({ ...state, answers: [...state.answers, state.selection], submitted: true });
    }
  }

  return (
    <div className={styles.root} data-theme={state.view === 'topics' ? '0' : state.topicIndex}>
      <header className={styles.header}>
        <a className={styles.brand} href="#study-game-topics" tabIndex={tabIndex} onClick={event => {
          event.preventDefault();
          showTopics();
        }}>
          <Image className={styles.logo} src="/redesign/study-logo.png" alt="" width={42} height={36} unoptimized />
          JStar <b>Study</b>
        </a>
      </header>
      <div className={styles.main}>
        {state.view === 'topics' && (
          <section className={styles.enter} aria-labelledby={headingId}>
            <div className={styles.intro}>
              <div><h1 ref={heading} id={headingId} tabIndex={-1}>Pick your curiosity.<br /><span>Let’s play.</span></h1></div>
            </div>
            <div className={styles.topics}>
              {topics.map((item, index) => (
                <article className={styles.topic} data-theme={index} key={item.name}>
                  <div className={styles.art}><span className={styles.icon} aria-hidden="true">{item.icon}</span></div>
                  <div className={styles.topicBody}>
                    <div className={styles.eyebrow}>{item.tag}</div>
                    <h2>{item.name}</h2>
                    <p>{item.description}</p>
                    <div className={styles.meta}><span>4 questions</span><span>3 question formats</span></div>
                    <button type="button" className={styles.primary} tabIndex={tabIndex} onClick={() => start(index)}>
                      Let’s play <span aria-hidden="true">↗</span>
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
        {state.view === 'question' && (
          <>
            <div className={styles.topline}>
              <button type="button" className={styles.textButton} tabIndex={tabIndex} onClick={showTopics}>← Choose another topic</button>
            </div>
            <div className={`${styles.layout} ${styles.enter}`} key={`${state.topicIndex}-${state.index}-${state.submitted}`}>
              <aside className={styles.session}>
                <span className={styles.sessionIcon} aria-hidden="true">{topic.icon}</span>
                <div className={styles.eyebrow}>{topic.tag}</div>
                <h2>{topic.name}</h2>
                <p>{topic.description}</p>
                <div className={styles.rule} />
                <div className={styles.stat}><span>Points earned</span><b>{score.points}</b></div>
                <div className={styles.stat}><span>Correct answers</span><b>{score.correct} / 4</b></div>
                <div className={styles.dots}>
                  {topic.questions.map((item, index) => {
                    const answered = index < state.answers.length;
                    const good = answered && isCorrect(item, state.answers[index]);
                    const status = index === state.index ? styles.current : answered ? (good ? styles.good : styles.bad) : '';
                    return (
                      <span className={`${styles.dot} ${status}`} key={item.text}
                        aria-current={index === state.index ? 'step' : undefined}
                        aria-label={`Question ${index + 1}${answered ? (good ? ', correct' : ', incorrect') : ''}`}>
                        {answered ? (good ? '✓' : '×') : index + 1}
                      </span>
                    );
                  })}
                </div>
              </aside>
              <section className={styles.play} aria-labelledby={headingId}>
                <div className={styles.questionTop}>
                  <span>Question {state.index + 1} of {topic.questions.length}</span>
                  <span>{order ? 'Put in order' : question.type === 'boolean' ? 'True or false' : 'Multiple choice'}</span>
                </div>
                <div className={styles.progress} role="progressbar" aria-label="Questions completed"
                  aria-valuenow={state.answers.length} aria-valuemin={0} aria-valuemax={4}>
                  <span style={{ width: `${state.answers.length / 4 * 100}%` }} />
                </div>
                <h1 ref={heading} id={headingId} tabIndex={-1}>{question.text}</h1>
                <p className={styles.helper}>{order ? 'Tap the options in order. Tap a chosen item to remove it.' : 'Choose one answer, then check it.'}</p>
                {order && (
                  <div className={styles.orderSlots} role="group" aria-label="Your ordered answer">
                    {sequence.length ? sequence.map((value, index) => (
                      <button type="button" key={value} disabled={state.submitted} tabIndex={tabIndex}
                        aria-label={`Remove ${question.options[value]} from position ${index + 1}`} onClick={() => remove(index)}>
                        {index + 1}. {question.options[value]} {state.submitted ? '' : '×'}
                      </button>
                    )) : <span>Your sequence appears here</span>}
                  </div>
                )}
                <div className={styles.answers}>
                  {question.options.map((option, index) => {
                    const chosen = order ? sequence.includes(index) : state.selection === index;
                    const answerCorrect = state.submitted && !order && index === question.answer;
                    const answerWrong = state.submitted && !order && chosen && !answerCorrect;
                    return (
                      <button type="button" key={option}
                        className={`${styles.answer} ${chosen ? styles.selected : ''} ${answerCorrect ? styles.correct : ''} ${answerWrong ? styles.wrong : ''}`}
                        aria-pressed={chosen} disabled={state.submitted || (order && chosen)} tabIndex={tabIndex} onClick={() => choose(index)}>
                        <span className={styles.letter}>{String.fromCharCode(65 + index)}</span><span>{option}</span>
                        {(answerCorrect || answerWrong) && <span className={styles.mark}>{answerCorrect ? '✓' : '×'}</span>}
                      </button>
                    );
                  })}
                </div>
                {state.submitted && (
                  <div role="status" className={`${styles.feedback} ${correct ? '' : styles.wrong}`}>
                    <strong>{correct ? 'That’s right! +100 points' : 'Not quite. Here’s why.'}</strong>
                    <p>{question.why}</p>
                  </div>
                )}
                <div className={styles.actions}>
                  <small>{state.submitted ? '' : '100 points for a correct answer.'}</small>
                  <button type="button" className={styles.primary} ref={advanceButton} tabIndex={tabIndex}
                    disabled={!state.submitted && !canSubmit} onClick={advance}>
                    {state.submitted ? (state.index === topic.questions.length - 1 ? 'See my results →' : 'Next question →') : 'Check answer'}
                  </button>
                </div>
              </section>
            </div>
          </>
        )}
        {state.view === 'results' && (
          <section className={`${styles.result} ${styles.enter}`} aria-labelledby={headingId}>
            <div className={styles.medal} aria-hidden="true">{result.correct === 4 ? '★' : '✳'}</div>
            <h1 ref={heading} id={headingId} tabIndex={-1}>{result.correct === 4 ? 'You nailed it!' : result.correct >= 2 ? 'Nicely played.' : 'Keep that curiosity.'}</h1>
            <p>{result.correct === 4 ? 'Four for four. Ready for a different challenge?' : 'You’ve finished the round. Take a look at what you learned.'}</p>
            <div className={styles.scores}>
              <div><b>{result.points}</b><span>Points / 400</span></div>
              <div><b>{result.correct} / {result.total}</b><span>Correct answers</span></div>
              <div><b>{result.accuracy}%</b><span>Accuracy</span></div>
            </div>
            <div className={styles.resultActions}>
              <button type="button" className={styles.primary} tabIndex={tabIndex} onClick={() => start(state.topicIndex)}>Play again ↻</button>
              <button type="button" className={styles.textButton} tabIndex={tabIndex} onClick={showTopics}>Try another topic →</button>
            </div>
            <div className={styles.review}>
              <h2>Your answer review</h2>
              {topic.questions.map((item, index) => (
                <details key={item.text}>
                  <summary tabIndex={tabIndex} onClick={event => { if (!interactive) event.preventDefault(); }}>
                    <span>{isCorrect(item, state.answers[index]) ? '✓ Correct' : '× Incorrect'}</span>{item.text}
                  </summary>
                  <p>Your answer: {answerLabel(item, state.answers[index])}<br />Correct answer: {answerLabel(item, item.answer)}</p>
                  <p>{item.why}</p>
                </details>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
