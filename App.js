import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();
const STORAGE_KEY = '@mindforge_progress_v1';

const COLORS = {
  bg: '#0B0D12', card: '#151922', cardAlt: '#1C2130', text: '#F4F7FB',
  muted: '#9AA4B2', accent: '#8B5CF6', accentSoft: '#251A45',
  success: '#34D399', danger: '#FB7185', border: '#272D3A',
};

const puzzles = [
  {
    question: 'You have 8 identical-looking balls. Exactly one is heavier. With a balance scale, what is the best first move?',
    options: ['Weigh 1 against 1.', 'Weigh 3 against 3.', 'Weigh 4 against 4.', 'Guess the heaviest-looking ball.'],
    answer: 1,
    explanation: 'Three versus three gives you the most useful information from the first weighing and leaves a smaller set of possibilities to investigate.',
  },
  {
    question: 'A machine has three buttons. One turns on a light, one turns on a fan, and one does nothing. You are told the light is already on. What should you focus on first?',
    options: ['Assume the first button is broken.', 'Separate what is known from what is merely assumed.', 'Assume the fan button is second.', 'Ignore the information.'],
    answer: 1,
    explanation: 'First-principles reasoning starts with facts. The light already being on is a fact; the button mapping is not enough information to guess without evidence.',
  },
];

const thoughtExperiments = [
  {
    title: 'The Elevator',
    prompt: 'Imagine a sealed elevator in deep space accelerating upward at 9.8 m/s². You drop a ball. How would it appear to behave?',
    options: ['It floats beside you.', 'It falls toward the floor as if gravity were present.', 'It moves to the ceiling.', 'It moves sideways.'],
    answer: 1,
    explanation: 'Inside the accelerating elevator, the ball can appear to fall toward the floor. Einstein used this kind of thought experiment to explore the equivalence of acceleration and gravity.',
    takeaway: 'Change the situation, then ask what remains observable.',
  },
  {
    title: 'Chasing Light',
    prompt: 'Imagine traveling extremely close to the speed of light and trying to chase a light beam. What happens to the measured speed of light in vacuum?',
    options: ['It becomes stationary.', 'It is still measured at the speed of light.', 'It reverses direction.', 'It disappears.'],
    answer: 1,
    explanation: 'Special relativity says every inertial observer measures light in vacuum at the same speed. The thought experiment exposes the limits of everyday intuition about adding velocities.',
    takeaway: 'When intuition conflicts with a principle, test the principle.',
  },
  {
    title: 'The Twin Journey',
    prompt: 'Two twins separate. One travels at a very high speed and returns. What can happen under special relativity?',
    options: ['They must age identically.', 'The traveling twin can age less.', 'Time stops on Earth.', 'The traveler never ages.'],
    answer: 1,
    explanation: 'Different paths through spacetime can contain different amounts of elapsed proper time. This is the idea behind the famous twin scenario.',
    takeaway: 'Compare paths instead of assuming every observer experiences time identically.',
  },
];

const visualChallenges = [
  {
    title: 'Build Before You Build',
    prompt: 'You want to design a desk lamp. Which approach best represents visual prototyping?',
    options: ['Buy parts immediately.', 'Mentally rotate and test the design before construction.', 'Copy a design without testing it.', 'Only use trial and error.'],
    answer: 1,
    explanation: 'A mental model lets you inspect movement, relationships, and possible failures before spending time or materials on a physical prototype.',
    takeaway: 'See the system in your mind before you build it.',
  },
  {
    title: 'Find the Failure Point',
    prompt: 'You visualize a bridge and notice one connection carries most of the load. What should you do?',
    options: ['Ignore it.', 'Stress-test that connection and redesign the weak point.', 'Add random parts.', 'Start over without analysis.'],
    answer: 1,
    explanation: 'Visualization is useful when it helps reveal constraints and weak points. Test the highest-risk part instead of adding complexity blindly.',
    takeaway: 'Use visualization to find failure points early.',
  },
  {
    title: 'Simplify the Machine',
    prompt: 'An imagined machine needs 12 moving parts for one simple action. What is the strongest next step?',
    options: ['Add 12 more parts.', 'Remove every part that is not necessary.', 'Make every part more complex.', 'Stop testing.'],
    answer: 1,
    explanation: 'A strong mental prototype should expose unnecessary complexity. Simplifying the mechanism can make the eventual physical design more reliable.',
    takeaway: 'Make complexity visible—and removable.',
  },
];

const languageLessons = {
  Spanish: [
    ['hello', 'hola'], ['goodbye', 'adiós'], ['please', 'por favor'], ['thanks', 'gracias'], ['yes', 'sí'],
    ['no', 'no'], ['water', 'agua'], ['food', 'comida'], ['house', 'casa'], ['friend', 'amigo'],
  ],
  French: [
    ['hello', 'bonjour'], ['goodbye', 'au revoir'], ['please', "s'il vous plaît"], ['thanks', 'merci'], ['yes', 'oui'],
    ['no', 'non'], ['water', 'eau'], ['food', 'nourriture'], ['house', 'maison'], ['friend', 'ami'],
  ],
  Algebra: [
    ['unknown value', 'variable'], ['fixed number', 'constant'], ['mathematical sentence with =', 'equation'], ['value that makes an equation true', 'solution'], ['number multiplying a variable', 'coefficient'],
    ['expression with one or more terms', 'polynomial'], ['expression with two terms', 'binomial'], ['expression with three terms', 'trinomial'], ['operation that undoes multiplication', 'division'], ['operation that undoes addition', 'subtraction'],
  ],
};

const initialProgress = { completedModules: [], languageIndex: { Spanish: 0, French: 0, Algebra: 0 } };

async function loadProgress() {
  try {
    const saved = await AsyncStorage.getItem(STORAGE_KEY);
    return saved ? { ...initialProgress, ...JSON.parse(saved) } : initialProgress;
  } catch (error) {
    return initialProgress;
  }
}

async function saveProgress(progress) {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (error) {
    // Local progress is best-effort; the app remains usable if storage fails.
  }
}

function HomeScreen({ navigation, progress }) {
  const completed = progress.completedModules.length;
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.eyebrow}>MINDFORGE</Text>
        <Text style={styles.hero}>Train your mind to think deeper.</Text>
        <Text style={styles.subtitle}>Short interactive lessons for reasoning, creativity, and languages.</Text>
        <View style={styles.featureCard}>
          <Text style={styles.cardKicker}>YOUR PROGRESS</Text>
          <Text style={styles.cardTitle}>{completed}/3 mindset modules completed</Text>
          <Text style={styles.cardBody}>Progress is saved locally on this device.</Text>
          <Pressable style={styles.primaryButton} onPress={() => navigation.navigate('Learn')}>
            <Text style={styles.primaryButtonText}>Continue learning →</Text>
          </Pressable>
        </View>
        <Text style={styles.sectionTitle}>Mindset roadmap</Text>
        <ModuleRow number="01" title="First Principles" subtitle="Thinking like Newton" complete={progress.completedModules.includes('module1')} />
        <ModuleRow number="02" title="Thought Experiments" subtitle="Thinking like Einstein" complete={progress.completedModules.includes('module2')} />
        <ModuleRow number="03" title="Visual Prototyping" subtitle="Thinking like Tesla" complete={progress.completedModules.includes('module3')} />
      </ScrollView>
    </SafeAreaView>
  );
}

function ModuleRow({ number, title, subtitle, complete }) {
  return (
    <View style={styles.moduleRow}>
      <View style={styles.moduleNumber}><Text style={styles.moduleNumberText}>{number}</Text></View>
      <View style={styles.moduleRowText}><Text style={styles.cardTitle}>{title}</Text><Text style={styles.cardBody}>{subtitle}</Text></View>
      {complete ? <Text style={styles.checkmark}>✓</Text> : <Text style={styles.lockDot}>○</Text>}
    </View>
  );
}

function LearnScreen({ progress, setProgress }) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const puzzle = puzzles[index];
  const completed = progress.completedModules.includes('module1');

  const choose = (answer) => {
    if (!showAnswer) { setSelected(answer); setShowAnswer(true); }
  };

  const next = async () => {
    if (index === puzzles.length - 1 && !completed) {
      const nextProgress = { ...progress, completedModules: [...progress.completedModules, 'module1'] };
      setProgress(nextProgress);
      await saveProgress(nextProgress);
    }
    setIndex((i) => (i + 1) % puzzles.length);
    setSelected(null);
    setShowAnswer(false);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.eyebrow}>MODULE 01 {completed ? '✓' : ''}</Text>
        <Text style={styles.heroSmall}>First Principles</Text>
        <Text style={styles.subtitle}>Thinking like Newton</Text>
        <View style={styles.lessonCard}>
          <Text style={styles.lessonNumber}>BREAK THE PROBLEM DOWN</Text>
          <Text style={styles.lessonTitle}>Start with what is true.</Text>
          <Text style={styles.lessonText}>Reduce a problem to basic facts, separate assumptions from evidence, and rebuild the answer from those facts.</Text>
          <View style={styles.ruleBox}><Text style={styles.ruleTitle}>The Newton rule</Text><Text style={styles.ruleText}>Facts → assumptions → logic → conclusion</Text></View>
        </View>
        <View style={styles.puzzleCard}>
          <Text style={styles.puzzleKicker}>LOGIC PUZZLE {index + 1}/{puzzles.length}</Text>
          <Text style={styles.question}>{puzzle.question}</Text>
          {puzzle.options.map((option, i) => (
            <Pressable key={option} onPress={() => choose(i)} style={[styles.option, selected === i && styles.optionSelected, showAnswer && i === puzzle.answer && styles.optionCorrect, showAnswer && selected === i && i !== puzzle.answer && styles.optionWrong]}>
              <Text style={styles.optionLetter}>{String.fromCharCode(65 + i)}</Text><Text style={styles.optionText}>{option}</Text>
            </Pressable>
          ))}
          {showAnswer && <View style={styles.feedback}>
            <Text style={styles.feedbackTitle}>{selected === puzzle.answer ? '✓ Correct' : 'Not quite — inspect the facts.'}</Text>
            <Text style={styles.feedbackText}>{puzzle.explanation}</Text>
            <Pressable style={styles.secondaryButton} onPress={next}><Text style={styles.secondaryButtonText}>{index === puzzles.length - 1 ? 'Complete module →' : 'Next challenge →'}</Text></Pressable>
          </View>}
        </View>
        {completed && <View style={styles.completedBanner}><Text style={styles.completedText}>✓ Module 1 complete — saved on this device</Text></View>}
      </ScrollView>
    </SafeAreaView>
  );
}

function MindsetsScreen({ progress, setProgress }) {
  const [module, setModule] = useState('einstein');
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const isTesla = module === 'tesla';
  const challenges = isTesla ? visualChallenges : thoughtExperiments;
  const challenge = challenges[index];
  const moduleId = isTesla ? 'module3' : 'module2';
  const complete = progress.completedModules.includes(moduleId);

  const choose = (answer) => { if (!showAnswer) { setSelected(answer); setShowAnswer(true); } };
  const next = async () => {
    if (index === challenges.length - 1 && !complete) {
      const nextProgress = { ...progress, completedModules: [...progress.completedModules, moduleId] };
      setProgress(nextProgress);
      await saveProgress(nextProgress);
    }
    setIndex((i) => (i + 1) % challenges.length);
    setSelected(null);
    setShowAnswer(false);
  };
  const switchModule = (nextModule) => { setModule(nextModule); setIndex(0); setSelected(null); setShowAnswer(false); };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.eyebrow}>MINDSETS</Text>
        <Text style={styles.heroSmall}>Think differently.</Text>
        <Text style={styles.subtitle}>Learn methods inspired by great thinkers.</Text>
        <View style={styles.moduleSwitcher}>
          <Pressable style={[styles.moduleChip, !isTesla && styles.moduleChipActive]} onPress={() => switchModule('einstein')}><Text style={[styles.moduleChipText, !isTesla && styles.moduleChipTextActive]}>02 · Einstein</Text></Pressable>
          <Pressable style={[styles.moduleChip, isTesla && styles.moduleChipActive]} onPress={() => switchModule('tesla')}><Text style={[styles.moduleChipText, isTesla && styles.moduleChipTextActive]}>03 · Tesla</Text></Pressable>
        </View>
        <View style={styles.lessonCard}>
          <Text style={styles.lessonNumber}>MODULE {isTesla ? '03' : '02'} {complete ? '✓' : ''}</Text>
          <Text style={styles.lessonTitle}>{isTesla ? 'Visual Prototyping' : 'Thought Experiments'}</Text>
          <Text style={styles.subtitle}>{isTesla ? 'Thinking like Tesla' : 'Thinking like Einstein'}</Text>
          <Text style={styles.lessonText}>{isTesla ? 'Build and test an idea in your mind before committing to physical materials. Picture movement, find weak points, then simplify.' : 'Change the conditions of a problem to expose the principles underneath it. Imagine clearly, then follow the consequences.'}</Text>
          <View style={styles.ruleBox}><Text style={styles.ruleTitle}>{isTesla ? 'The Tesla method' : 'The Einstein method'}</Text><Text style={styles.ruleText}>{isTesla ? 'Imagine → simulate → stress-test → simplify' : 'Imagine → change conditions → consequences → rethink'}</Text></View>
        </View>
        <View style={styles.puzzleCard}>
          <Text style={styles.puzzleKicker}>{isTesla ? 'VISUAL CHALLENGE' : 'THOUGHT EXPERIMENT'} {index + 1}/{challenges.length}</Text>
          <Text style={styles.challengeTitle}>{challenge.title}</Text><Text style={styles.question}>{challenge.prompt}</Text>
          {challenge.options.map((option, i) => (
            <Pressable key={option} onPress={() => choose(i)} style={[styles.option, selected === i && styles.optionSelected, showAnswer && i === challenge.answer && styles.optionCorrect, showAnswer && selected === i && i !== challenge.answer && styles.optionWrong]}>
              <Text style={styles.optionLetter}>{String.fromCharCode(65 + i)}</Text><Text style={styles.optionText}>{option}</Text>
            </Pressable>
          ))}
          {showAnswer && <View style={styles.feedback}><Text style={styles.feedbackTitle}>{selected === challenge.answer ? '✓ Correct' : 'Not quite — rethink the scenario.'}</Text><Text style={styles.feedbackText}>{challenge.explanation}</Text><View style={styles.takeawayBox}><Text style={styles.takeawayLabel}>THINKING TAKEAWAY</Text><Text style={styles.takeawayText}>{challenge.takeaway}</Text></View><Pressable style={styles.secondaryButton} onPress={next}><Text style={styles.secondaryButtonText}>{index === challenges.length - 1 ? 'Complete module →' : 'Next challenge →'}</Text></Pressable></View>}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function LanguagesScreen({ progress, setProgress }) {
  const [language, setLanguage] = useState('Spanish');
  const [index, setIndex] = useState(progress.languageIndex?.Spanish || 0);
  const [selected, setSelected] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const words = languageLessons[language];
  const current = words[index];
  const quizOptions = [current[1], ...words.filter((_, i) => i !== index).slice(0, 3).map((item) => item[1])];

  const changeLanguage = (nextLanguage) => {
    setLanguage(nextLanguage); setIndex(progress.languageIndex?.[nextLanguage] || 0); setSelected(null); setShowAnswer(false);
  };
  const choose = (answer) => { if (!showAnswer) { setSelected(answer); setShowAnswer(true); } };
  const next = async () => {
    const nextIndex = (index + 1) % words.length;
    const languageIndex = { ...(progress.languageIndex || initialProgress.languageIndex), [language]: nextIndex };
    const nextProgress = { ...progress, languageIndex };
    setProgress(nextProgress); await saveProgress(nextProgress);
    setIndex(nextIndex); setSelected(null); setShowAnswer(false);
  };

  return (
    <SafeAreaView style={styles.safe}><ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.eyebrow}>LANGUAGE LAB</Text><Text style={styles.heroSmall}>Learn by recall.</Text><Text style={styles.subtitle}>10 beginner words or concepts in each track.</Text>
      <View style={styles.moduleSwitcher}>
        {Object.keys(languageLessons).map((item) => <Pressable key={item} style={[styles.moduleChip, language === item && styles.moduleChipActive]} onPress={() => changeLanguage(item)}><Text style={[styles.moduleChipText, language === item && styles.moduleChipTextActive]}>{item}</Text></Pressable>)}
      </View>
      <View style={styles.lessonCard}><Text style={styles.lessonNumber}>LESSON {index + 1} / 10</Text><Text style={styles.lessonTitle}>{current[0]}</Text><Text style={styles.lessonText}>What is the {language === 'Algebra' ? 'math term' : language + ' word'}?</Text></View>
      <View style={styles.puzzleCard}>{quizOptions.map((option) => <Pressable key={option} onPress={() => choose(option)} style={[styles.option, selected === option && styles.optionSelected, showAnswer && option === current[1] && styles.optionCorrect, showAnswer && selected === option && option !== current[1] && styles.optionWrong]}><Text style={styles.optionText}>{option}</Text></Pressable>)}{showAnswer && <View style={styles.feedback}><Text style={styles.feedbackTitle}>{selected === current[1] ? '✓ Correct' : 'Not quite'}</Text><Text style={styles.feedbackText}>Answer: {current[1]}</Text><Pressable style={styles.secondaryButton} onPress={next}><Text style={styles.secondaryButtonText}>Next lesson →</Text></Pressable></View>}</View>
    </ScrollView></SafeAreaView>
  );
}

function ProfileScreen({ progress }) {
  return <SafeAreaView style={styles.safe}><ScrollView contentContainerStyle={styles.container}><Text style={styles.eyebrow}>PROFILE</Text><Text style={styles.heroSmall}>Your progress.</Text><View style={styles.profileCard}><View style={styles.avatar}><Text style={styles.avatarText}>M</Text></View><Text style={styles.cardTitle}>MindForge Learner</Text><Text style={styles.cardBody}>{progress.completedModules.length} mindset modules completed</Text></View><View style={styles.progressCard}><Text style={styles.cardKicker}>LOCAL SAVE</Text><Text style={styles.progressText}>✓ Your progress is stored locally with AsyncStorage.</Text><Text style={styles.cardBody}>Closing and reopening the app will keep completed modules and language lesson position on this device.</Text></View></ScrollView></SafeAreaView>;
}

export default function App() {
  const [progress, setProgress] = useState(initialProgress);
  const [ready, setReady] = useState(false);

  useEffect(() => { loadProgress().then((saved) => { setProgress(saved); setReady(true); }); }, []);

  if (!ready) return <SafeAreaView style={styles.safe}><View style={styles.loading}><Text style={styles.loadingText}>Loading your forge…</Text></View></SafeAreaView>;

  return <NavigationContainer><Tab.Navigator screenOptions={{ headerShown: false, tabBarStyle: styles.tabBar, tabBarActiveTintColor: COLORS.text, tabBarInactiveTintColor: COLORS.muted, tabBarLabelStyle: styles.tabLabel }}>
    <Tab.Screen name="Home">{(props) => <HomeScreen {...props} progress={progress} />}</Tab.Screen>
    <Tab.Screen name="Learn">{(props) => <LearnScreen {...props} progress={progress} setProgress={setProgress} />}</Tab.Screen>
    <Tab.Screen name="Mindsets">{(props) => <MindsetsScreen {...props} progress={progress} setProgress={setProgress} />}</Tab.Screen>
    <Tab.Screen name="Languages">{(props) => <LanguagesScreen {...props} progress={progress} setProgress={setProgress} />}</Tab.Screen>
    <Tab.Screen name="Profile">{(props) => <ProfileScreen {...props} progress={progress} />}</Tab.Screen>
  </Tab.Navigator></NavigationContainer>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg }, container: { padding: 24, paddingBottom: 120 },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center' }, loadingText: { color: COLORS.muted, fontSize: 16 },
  eyebrow: { color: COLORS.accent, fontSize: 12, fontWeight: '800', letterSpacing: 2, marginBottom: 10 },
  hero: { color: COLORS.text, fontSize: 38, lineHeight: 44, fontWeight: '800', marginBottom: 12 }, heroSmall: { color: COLORS.text, fontSize: 32, lineHeight: 38, fontWeight: '800' },
  subtitle: { color: COLORS.muted, fontSize: 16, lineHeight: 24, marginBottom: 20 },
  featureCard: { backgroundColor: COLORS.card, borderRadius: 24, padding: 22, borderWidth: 1, borderColor: COLORS.border, marginBottom: 28 },
  cardKicker: { color: COLORS.muted, fontSize: 11, fontWeight: '800', letterSpacing: 1.5, marginBottom: 8 }, cardTitle: { color: COLORS.text, fontSize: 19, fontWeight: '800', marginBottom: 5 }, cardBody: { color: COLORS.muted, fontSize: 14, lineHeight: 21 },
  primaryButton: { backgroundColor: COLORS.accent, borderRadius: 14, paddingVertical: 15, alignItems: 'center', marginTop: 20 }, primaryButtonText: { color: '#FFF', fontWeight: '800', fontSize: 15 },
  sectionTitle: { color: COLORS.text, fontSize: 21, fontWeight: '800', marginBottom: 12 },
  moduleRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.card, borderRadius: 18, padding: 15, borderWidth: 1, borderColor: COLORS.border, marginBottom: 10 }, moduleNumber: { width: 42, height: 42, borderRadius: 14, backgroundColor: COLORS.accentSoft, alignItems: 'center', justifyContent: 'center', marginRight: 13 }, moduleNumberText: { color: '#C4B5FD', fontWeight: '900' }, moduleRowText: { flex: 1 }, checkmark: { color: COLORS.success, fontSize: 25, fontWeight: '900' }, lockDot: { color: COLORS.muted, fontSize: 22 },
  lessonCard: { backgroundColor: COLORS.card, borderRadius: 22, padding: 20, borderWidth: 1, borderColor: COLORS.border, marginBottom: 18 }, lessonNumber: { color: COLORS.accent, fontSize: 11, fontWeight: '800', letterSpacing: 1.2, marginBottom: 9 }, lessonTitle: { color: COLORS.text, fontSize: 24, fontWeight: '800', marginBottom: 10 }, lessonText: { color: COLORS.muted, fontSize: 15, lineHeight: 23 },
  ruleBox: { backgroundColor: COLORS.accentSoft, borderRadius: 16, padding: 16, marginTop: 18 }, ruleTitle: { color: COLORS.text, fontWeight: '800', marginBottom: 5 }, ruleText: { color: '#C4B5FD', fontSize: 14 },
  puzzleCard: { backgroundColor: COLORS.card, borderRadius: 22, padding: 20, borderWidth: 1, borderColor: COLORS.border }, puzzleKicker: { color: COLORS.muted, fontSize: 11, fontWeight: '800', letterSpacing: 1.2, marginBottom: 12 }, challengeTitle: { color: COLORS.text, fontSize: 23, fontWeight: '800', marginBottom: 10 }, question: { color: COLORS.text, fontSize: 17, lineHeight: 25, fontWeight: '650', marginBottom: 15 },
  option: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.cardAlt, borderRadius: 14, padding: 13, marginBottom: 10 }, optionSelected: { borderColor: COLORS.accent }, optionCorrect: { borderColor: COLORS.success }, optionWrong: { borderColor: COLORS.danger }, optionLetter: { color: COLORS.accent, fontWeight: '900', width: 28 }, optionText: { color: COLORS.text, flex: 1, fontSize: 14, lineHeight: 20 },
  feedback: { marginTop: 8, paddingTop: 16, borderTopWidth: 1, borderTopColor: COLORS.border }, feedbackTitle: { color: COLORS.text, fontSize: 16, fontWeight: '800', marginBottom: 7 }, feedbackText: { color: COLORS.muted, fontSize: 14, lineHeight: 21 }, secondaryButton: { borderWidth: 1, borderColor: COLORS.accent, borderRadius: 13, paddingVertical: 13, alignItems: 'center', marginTop: 16 }, secondaryButtonText: { color: '#C4B5FD', fontWeight: '800' },
  completedBanner: { backgroundColor: '#0E2A20', borderWidth: 1, borderColor: COLORS.success, borderRadius: 16, padding: 15, marginTop: 18 }, completedText: { color: COLORS.success, fontWeight: '800' }, takeawayBox: { backgroundColor: COLORS.accentSoft, borderRadius: 15, padding: 15, marginTop: 14 }, takeawayLabel: { color: '#C4B5FD', fontSize: 10, fontWeight: '900', letterSpacing: 1.3, marginBottom: 6 }, takeawayText: { color: COLORS.text, fontSize: 14, lineHeight: 21, fontWeight: '700' },
  moduleSwitcher: { flexDirection: 'row', backgroundColor: COLORS.card, borderRadius: 16, padding: 5, borderWidth: 1, borderColor: COLORS.border, marginBottom: 18 }, moduleChip: { flex: 1, paddingVertical: 11, borderRadius: 12, alignItems: 'center' }, moduleChipActive: { backgroundColor: COLORS.accentSoft }, moduleChipText: { color: COLORS.muted, fontSize: 12, fontWeight: '800' }, moduleChipTextActive: { color: COLORS.text },
  profileCard: { alignItems: 'center', backgroundColor: COLORS.card, borderRadius: 22, padding: 24, borderWidth: 1, borderColor: COLORS.border, marginBottom: 16 }, avatar: { width: 70, height: 70, borderRadius: 35, backgroundColor: COLORS.accentSoft, alignItems: 'center', justifyContent: 'center', marginBottom: 12 }, avatarText: { color: '#C4B5FD', fontSize: 28, fontWeight: '900' }, progressCard: { backgroundColor: COLORS.card, borderRadius: 20, padding: 20, borderWidth: 1, borderColor: COLORS.border }, progressText: { color: COLORS.text, fontSize: 15, fontWeight: '700', marginBottom: 12 },
  tabBar: { backgroundColor: '#11141B', borderTopColor: COLORS.border, height: 70, paddingBottom: 8, paddingTop: 8 }, tabLabel: { fontSize: 10, fontWeight: '700' },
});
