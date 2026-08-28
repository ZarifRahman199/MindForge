import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

const COLORS = {
  bg: '#0B0D12',
  card: '#151922',
  cardAlt: '#1C2130',
  text: '#F4F7FB',
  muted: '#9AA4B2',
  accent: '#8B5CF6',
  accentSoft: '#251A45',
  success: '#34D399',
  danger: '#FB7185',
  border: '#272D3A',
};

const puzzles = [
  {
    question:
      'A machine has three buttons. One turns on a light, one turns on a fan, and one does nothing. You may press only one button. Before pressing it, you are told: “The light is already on.” What can you conclude?',
    options: [
      'The first button definitely does nothing.',
      'At least one button is unnecessary for turning on the light.',
      'The fan button must be the second button.',
      'Nothing can be concluded.',
    ],
    answer: 1,
    explanation:
      'Start from what is actually known. If the light is already on, the button that turns on the light is not currently necessary to make the light on. First-principles thinking separates facts from assumptions.',
  },
  {
    question:
      'You have 8 identical-looking balls. Exactly one is heavier. With a balance scale, what is the best first move?',
    options: [
      'Weigh 1 ball against 1 ball.',
      'Weigh 3 balls against 3 balls.',
      'Weigh 4 balls against 4 balls.',
      'Guess the heaviest-looking ball.',
    ],
    answer: 1,
    explanation:
      'Three vs. three splits the possibilities into balanced (2 possible groups remain) or unbalanced (the heavier ball is among the three on the heavier side). The move maximizes useful information.',
  },
];

function HomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.eyebrow}>MINDFORGE</Text>
        <Text style={styles.hero}>Train your mind to think deeper.</Text>
        <Text style={styles.subtitle}>
          Learn first principles, reasoning, creativity, and languages through short interactive lessons.
        </Text>

        <View style={styles.featureCard}>
          <Text style={styles.cardKicker}>CURRENT MODULE</Text>
          <Text style={styles.cardTitle}>Module 1: First Principles</Text>
          <Text style={styles.cardBody}>Thinking like Newton · 5 min</Text>
          <Pressable style={styles.primaryButton} onPress={() => navigation.navigate('Learn')}>
            <Text style={styles.primaryButtonText}>Continue learning →</Text>
          </Pressable>
        </View>

        <Text style={styles.sectionTitle}>Your forge</Text>
        <View style={styles.statsRow}>
          <Stat label="Streak" value="1 day" />
          <Stat label="Lessons" value="1 / 12" />
          <Stat label="XP" value="40" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Stat({ label, value }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function LearnScreen() {
  const [puzzleIndex, setPuzzleIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const puzzle = puzzles[puzzleIndex];

  const choose = (index) => {
    if (showAnswer) return;
    setSelected(index);
    setShowAnswer(true);
  };

  const nextPuzzle = () => {
    setPuzzleIndex((current) => (current + 1) % puzzles.length);
    setSelected(null);
    setShowAnswer(false);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.eyebrow}>MODULE 01</Text>
        <Text style={styles.heroSmall}>First Principles</Text>
        <Text style={styles.subtitle}>Thinking like Newton</Text>

        <View style={styles.lessonCard}>
          <Text style={styles.lessonNumber}>01 · BREAK THE PROBLEM DOWN</Text>
          <Text style={styles.lessonTitle}>Start with what is true.</Text>
          <Text style={styles.lessonText}>
            First-principles reasoning means reducing a problem to basic facts you can defend, then rebuilding the answer from those facts. Do not begin with “What do people usually do?” Begin with “What do I actually know?”
          </Text>
          <View style={styles.ruleBox}>
            <Text style={styles.ruleTitle}>The Newton rule</Text>
            <Text style={styles.ruleText}>Facts → assumptions → logic → conclusion</Text>
          </View>
        </View>

        <View style={styles.puzzleCard}>
          <Text style={styles.puzzleKicker}>LOGIC PUZZLE {puzzleIndex + 1}/{puzzles.length}</Text>
          <Text style={styles.question}>{puzzle.question}</Text>
          {puzzle.options.map((option, index) => {
            const isCorrect = showAnswer && index === puzzle.answer;
            const isWrong = showAnswer && index === selected && index !== puzzle.answer;
            return (
              <Pressable
                key={option}
                onPress={() => choose(index)}
                style={[
                  styles.option,
                  selected === index && styles.optionSelected,
                  isCorrect && styles.optionCorrect,
                  isWrong && styles.optionWrong,
                ]}
              >
                <Text style={styles.optionLetter}>{String.fromCharCode(65 + index)}</Text>
                <Text style={styles.optionText}>{option}</Text>
              </Pressable>
            );
          })}

          {showAnswer && (
            <View style={styles.feedback}>
              <Text style={styles.feedbackTitle}>
                {selected === puzzle.answer ? '✓ Correct' : 'Not quite — think from the facts.'}
              </Text>
              <Text style={styles.feedbackText}>{puzzle.explanation}</Text>
              <Pressable style={styles.secondaryButton} onPress={nextPuzzle}>
                <Text style={styles.secondaryButtonText}>Next challenge →</Text>
              </Pressable>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function LanguagesScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.eyebrow}>LANGUAGES</Text>
        <Text style={styles.heroSmall}>Build a new voice.</Text>
        <Text style={styles.subtitle}>Short, practical lessons designed for daily practice.</Text>
        {['English', 'Spanish', 'French'].map((language, index) => (
          <View style={styles.languageCard} key={language}>
            <View>
              <Text style={styles.cardTitle}>{language}</Text>
              <Text style={styles.cardBody}>{index === 0 ? '12 lessons · Beginner' : 'Coming soon'}</Text>
            </View>
            <Text style={styles.languageArrow}>{index === 0 ? '→' : '•••'}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

function ProfileScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.eyebrow}>PROFILE</Text>
        <Text style={styles.heroSmall}>Your progress.</Text>
        <View style={styles.profileCard}>
          <View style={styles.avatar}><Text style={styles.avatarText}>M</Text></View>
          <Text style={styles.cardTitle}>MindForge Learner</Text>
          <Text style={styles.cardBody}>Level 1 · Apprentice Thinker</Text>
        </View>
        <View style={styles.progressCard}>
          <Text style={styles.cardKicker}>MODULE PROGRESS</Text>
          <Text style={styles.progressText}>1 of 12 lessons completed</Text>
          <View style={styles.progressTrack}><View style={styles.progressFill} /></View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: styles.tabBar,
          tabBarActiveTintColor: COLORS.text,
          tabBarInactiveTintColor: COLORS.muted,
          tabBarLabelStyle: styles.tabLabel,
        }}
      >
        <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: 'Home' }} />
        <Tab.Screen name="Learn" component={LearnScreen} options={{ tabBarLabel: 'Learn' }} />
        <Tab.Screen name="Languages" component={LanguagesScreen} options={{ tabBarLabel: 'Languages' }} />
        <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarLabel: 'Profile' }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  container: { padding: 24, paddingBottom: 120 },
  eyebrow: { color: COLORS.accent, fontSize: 12, fontWeight: '800', letterSpacing: 2, marginBottom: 10 },
  hero: { color: COLORS.text, fontSize: 38, lineHeight: 44, fontWeight: '800', marginBottom: 12 },
  heroSmall: { color: COLORS.text, fontSize: 32, lineHeight: 38, fontWeight: '800' },
  subtitle: { color: COLORS.muted, fontSize: 16, lineHeight: 24, marginBottom: 24 },
  featureCard: { backgroundColor: COLORS.card, borderRadius: 24, padding: 22, borderWidth: 1, borderColor: COLORS.border, marginBottom: 28 },
  cardKicker: { color: COLORS.muted, fontSize: 11, fontWeight: '800', letterSpacing: 1.5, marginBottom: 8 },
  cardTitle: { color: COLORS.text, fontSize: 20, fontWeight: '750', marginBottom: 5 },
  cardBody: { color: COLORS.muted, fontSize: 14, lineHeight: 21 },
  primaryButton: { backgroundColor: COLORS.accent, borderRadius: 14, paddingVertical: 15, alignItems: 'center', marginTop: 20 },
  primaryButtonText: { color: '#FFF', fontWeight: '800', fontSize: 15 },
  sectionTitle: { color: COLORS.text, fontSize: 21, fontWeight: '800', marginBottom: 12 },
  statsRow: { flexDirection: 'row', gap: 10 },
  stat: { flex: 1, backgroundColor: COLORS.card, borderRadius: 18, padding: 16, borderWidth: 1, borderColor: COLORS.border },
  statValue: { color: COLORS.text, fontSize: 19, fontWeight: '800' },
  statLabel: { color: COLORS.muted, fontSize: 12, marginTop: 4 },
  lessonCard: { backgroundColor: COLORS.card, borderRadius: 22, padding: 20, borderWidth: 1, borderColor: COLORS.border, marginBottom: 18 },
  lessonNumber: { color: COLORS.accent, fontSize: 11, fontWeight: '800', letterSpacing: 1.2, marginBottom: 9 },
  lessonTitle: { color: COLORS.text, fontSize: 24, fontWeight: '800', marginBottom: 10 },
  lessonText: { color: COLORS.muted, fontSize: 15, lineHeight: 23 },
  ruleBox: { backgroundColor: COLORS.accentSoft, borderRadius: 16, padding: 16, marginTop: 18 },
  ruleTitle: { color: COLORS.text, fontWeight: '800', marginBottom: 5 },
  ruleText: { color: '#C4B5FD', fontSize: 14 },
  puzzleCard: { backgroundColor: COLORS.card, borderRadius: 22, padding: 20, borderWidth: 1, borderColor: COLORS.border },
  puzzleKicker: { color: COLORS.muted, fontSize: 11, fontWeight: '800', letterSpacing: 1.2, marginBottom: 12 },
  question: { color: COLORS.text, fontSize: 17, lineHeight: 25, fontWeight: '650', marginBottom: 15 },
  option: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.cardAlt, borderRadius: 14, padding: 13, marginBottom: 10 },
  optionSelected: { borderColor: COLORS.accent },
  optionCorrect: { borderColor: COLORS.success },
  optionWrong: { borderColor: COLORS.danger },
  optionLetter: { color: COLORS.accent, fontWeight: '900', width: 28 },
  optionText: { color: COLORS.text, flex: 1, fontSize: 14, lineHeight: 20 },
  feedback: { marginTop: 8, paddingTop: 16, borderTopWidth: 1, borderTopColor: COLORS.border },
  feedbackTitle: { color: COLORS.text, fontSize: 16, fontWeight: '800', marginBottom: 7 },
  feedbackText: { color: COLORS.muted, fontSize: 14, lineHeight: 21 },
  secondaryButton: { borderWidth: 1, borderColor: COLORS.accent, borderRadius: 13, paddingVertical: 13, alignItems: 'center', marginTop: 16 },
  secondaryButtonText: { color: '#C4B5FD', fontWeight: '800' },
  languageCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: COLORS.card, borderRadius: 18, padding: 18, borderWidth: 1, borderColor: COLORS.border, marginBottom: 12 },
  languageArrow: { color: COLORS.accent, fontSize: 20, fontWeight: '800' },
  profileCard: { alignItems: 'center', backgroundColor: COLORS.card, borderRadius: 22, padding: 24, borderWidth: 1, borderColor: COLORS.border, marginBottom: 16 },
  avatar: { width: 70, height: 70, borderRadius: 35, backgroundColor: COLORS.accentSoft, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  avatarText: { color: '#C4B5FD', fontSize: 28, fontWeight: '900' },
  progressCard: { backgroundColor: COLORS.card, borderRadius: 20, padding: 20, borderWidth: 1, borderColor: COLORS.border },
  progressText: { color: COLORS.text, fontSize: 15, fontWeight: '700', marginBottom: 12 },
  progressTrack: { height: 9, backgroundColor: COLORS.cardAlt, borderRadius: 10, overflow: 'hidden' },
  progressFill: { width: '8%', height: '100%', backgroundColor: COLORS.accent, borderRadius: 10 },
  tabBar: { backgroundColor: '#11141B', borderTopColor: COLORS.border, height: 70, paddingBottom: 8, paddingTop: 8 },
  tabLabel: { fontSize: 11, fontWeight: '700' },
});
