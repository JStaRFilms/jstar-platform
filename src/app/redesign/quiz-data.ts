export type Answer = number | readonly number[];

interface QuestionContent {
  text: string;
  options: readonly string[];
  why: string;
}

export type Question = QuestionContent & (
  | { type: 'choice' | 'boolean'; answer: number }
  | { type: 'order'; answer: readonly number[] }
);

export interface Topic {
  name: string;
  tag: string;
  icon: string;
  description: string;
  questions: readonly Question[];
}

export const topics: readonly Topic[] = [
  {
    name: 'Space explorer', tag: 'SCIENCE', icon: '🪐',
    description: 'A small adventure through our solar system.',
    questions: [
      { type: 'choice', text: 'Which planet is known as the Red Planet?', options: ['Venus', 'Mars', 'Jupiter', 'Mercury'], answer: 1, why: 'Iron-rich dust gives Mars its reddish appearance.' },
      { type: 'boolean', text: 'The Sun is a star.', options: ['True', 'False'], answer: 0, why: 'The Sun is the star at the centre of our solar system.' },
      { type: 'choice', text: 'What keeps the planets in orbit around the Sun?', options: ['Magnetism', 'Wind', 'Gravity', 'Sunlight'], answer: 2, why: 'Gravity attracts planets toward the Sun while their motion carries them along their orbits.' },
      { type: 'order', text: 'Put these planets in order, closest to the Sun first.', options: ['Mars', 'Earth', 'Mercury', 'Venus'], answer: [2, 3, 1, 0], why: 'The order is Mercury, Venus, Earth, then Mars.' },
    ],
  },
  {
    name: 'Number ninja', tag: 'MATHEMATICS', icon: '✳',
    description: 'Patterns, percentages and a little mental magic.',
    questions: [
      { type: 'choice', text: 'What is 25% of 80?', options: ['10', '20', '25', '40'], answer: 1, why: '25% is one quarter. 80 divided by 4 is 20.' },
      { type: 'boolean', text: 'Every square is also a rectangle.', options: ['True', 'False'], answer: 0, why: 'A rectangle has four right angles. A square does too, with the additional property that all its sides are equal.' },
      { type: 'choice', text: 'What comes next: 3, 6, 12, 24, …?', options: ['27', '36', '48', '60'], answer: 2, why: 'Each number is twice the previous one. 24 × 2 = 48.' },
      { type: 'order', text: 'Arrange these values from smallest to largest.', options: ['0.75', '½', '1.2', '¼'], answer: [3, 1, 0, 2], why: '¼ = 0.25 and ½ = 0.5. So the order is ¼, ½, 0.75, 1.2.' },
    ],
  },
  {
    name: 'World wanderer', tag: 'GEOGRAPHY', icon: '🌍',
    description: 'Go places. Discover how much you already know.',
    questions: [
      { type: 'choice', text: 'Which ocean is the largest?', options: ['Atlantic', 'Indian', 'Pacific', 'Arctic'], answer: 2, why: 'The Pacific is the largest ocean on Earth.' },
      { type: 'boolean', text: 'The equator divides Earth into northern and southern hemispheres.', options: ['True', 'False'], answer: 0, why: 'The equator is the line of 0° latitude, halfway between the poles.' },
      { type: 'choice', text: 'What is the capital of Nigeria?', options: ['Lagos', 'Abuja', 'Kano', 'Ibadan'], answer: 1, why: 'Abuja is Nigeria’s capital. Lagos was the capital before Abuja.' },
      { type: 'order', text: 'Travel north to south. Put these cities in order.', options: ['Cape Town', 'Cairo', 'London', 'Nairobi'], answer: [2, 1, 3, 0], why: 'From north to south: London, Cairo, Nairobi, Cape Town.' },
    ],
  },
];

export function isCorrect(question: Question, answer: Answer | null | undefined): boolean {
  if (question.type === 'order') {
    return typeof answer !== 'number' && answer != null &&
      answer.length === question.answer.length &&
      answer.every((value, index) => value === question.answer[index]);
  }
  return answer === question.answer;
}

export function resultFor(questions: readonly Question[], answers: readonly Answer[]) {
  const correct = questions.reduce((sum, question, index) => sum + Number(isCorrect(question, answers[index])), 0);
  return {
    correct,
    total: questions.length,
    points: correct * 100,
    accuracy: questions.length ? Math.round(correct / questions.length * 100) : 0,
  };
}

export function answerLabel(question: Question, answer: Answer): string {
  return typeof answer === 'number'
    ? question.options[answer]
    : answer.map(index => question.options[index]).join(' → ');
}
