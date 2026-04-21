import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../theme/ThemeContext';
import { spacing, radius, shadows } from '../theme/theme';
import { Icon } from '../icons/Icon';

const FEATURES = [
  { title: 'Unlimited daily words',       sub: 'Free plan caps at 3 per day' },
  { title: 'All retention activities',    sub: 'Speed rounds, story weaver, spelling & more' },
  { title: 'Curated & custom decks',      sub: 'GRE, TOEFL, literary, business, your own lists' },
  { title: 'Audio pronunciation',         sub: 'Native voices, slowed playback, phonetic guide' },
  { title: 'Offline practice',            sub: 'Your library travels with you' },
  { title: 'Unhurried, ad-free forever',  sub: 'No streaks designed to guilt you' },
];

const TIMELINE = [
  { day: 'Today', title: 'Full access opens',    sub: 'No payment needed' },
  { day: 'Day 5', title: 'A gentle reminder',    sub: '48 hours before trial ends' },
  { day: 'Day 8', title: 'Billing begins',       sub: '$9 / month, only if you stay' },
];

const PLANS = [
  { id: 'monthly', label: 'Monthly', price: '$9',  unit: '/ mo', note: 'Starts after 7-day trial', popular: true },
  { id: 'annual',  label: 'Annual',  price: '$72', unit: '/ yr', note: 'Save $36 — two months free' },
];

export default function Paywall({ navigation }) {
  const { theme } = useTheme();
  const [plan, setPlan] = useState('monthly');

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      {/* Top chrome */}
      <View style={[styles.chrome, { backgroundColor: theme.background }]}>
        <Text style={[styles.chromeMeta, { color: theme.accentTerracotta, fontFamily: 'SourceSerif4_400Regular' }]}>
          LEXICA PRO
        </Text>
        <TouchableOpacity
          style={[styles.closeBtn, { backgroundColor: theme.card, borderColor: theme.rule }]}
          onPress={() => navigation.goBack()}
        >
          <Icon name="close" size={12} color={theme.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Headline */}
        <Text style={[styles.headline, { color: theme.textPrimary, fontFamily: 'Newsreader_400Regular' }]}>
          {'A week\n'}
          <Text style={{ fontStyle: 'italic', color: theme.accentTerracotta }}>on the house.</Text>
        </Text>
        <Text style={[styles.sub, { color: theme.textSecondary, fontFamily: 'Newsreader_400Regular' }]}>
          Seven days of the full Lexica. No card charged today. Cancel any time before day seven and pay nothing.
        </Text>

        {/* Timeline */}
        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.rule }, shadows.sm]}>
          <Text style={[styles.cardLabel, { color: theme.textMuted, fontFamily: 'Inter_400Regular' }]}>
            HOW THE TRIAL UNFOLDS
          </Text>
          {TIMELINE.map((step, i) => (
            <View key={i} style={[styles.timelineRow, i < TIMELINE.length - 1 && styles.timelineRowSpaced]}>
              <View style={styles.timelineDotCol}>
                <View style={[
                  styles.timelineDot,
                  { backgroundColor: i === 0 ? theme.accentTerracotta : theme.rule, borderColor: i === 0 ? undefined : theme.textMuted },
                ]} />
                {i < TIMELINE.length - 1 && <View style={[styles.timelineLine, { backgroundColor: theme.rule }]} />}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.timelineDay, { color: theme.textMuted, fontFamily: 'Inter_400Regular' }]}>
                  {step.day.toUpperCase()}
                </Text>
                <Text style={[styles.timelineTitle, { color: theme.textPrimary, fontFamily: 'Newsreader_400Regular' }]}>
                  {step.title}
                </Text>
                <Text style={[styles.timelineSub, { color: theme.textMuted, fontFamily: 'Inter_400Regular' }]}>
                  {step.sub}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Features */}
        <Text style={[styles.sectionLabel, { color: theme.textMuted, fontFamily: 'Inter_400Regular' }]}>
          WHAT YOU GET
        </Text>
        <View style={[styles.featureCard, { backgroundColor: theme.card, borderColor: theme.rule }, shadows.sm]}>
          {FEATURES.map((f, i) => (
            <View
              key={i}
              style={[
                styles.featureRow,
                i < FEATURES.length - 1 && { borderBottomWidth: 1, borderBottomColor: theme.rule },
              ]}
            >
              <View style={[styles.checkCircle, { backgroundColor: theme.sageSoft, borderColor: theme.accentSage }]}>
                <Icon name="check" size={12} color={theme.accentSage} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.featureTitle, { color: theme.textPrimary, fontFamily: 'Inter_600SemiBold' }]}>
                  {f.title}
                </Text>
                <Text style={[styles.featureSub, { color: theme.textMuted, fontFamily: 'Inter_400Regular' }]}>
                  {f.sub}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Plan picker */}
        <Text style={[styles.sectionLabel, { color: theme.textMuted, fontFamily: 'Inter_400Regular' }]}>
          CHOOSE YOUR PLAN
        </Text>
        <View style={styles.planPicker}>
          {PLANS.map(p => {
            const selected = plan === p.id;
            return (
              <TouchableOpacity
                key={p.id}
                onPress={() => setPlan(p.id)}
                style={[
                  styles.planCard,
                  {
                    backgroundColor: selected ? theme.textPrimary : theme.card,
                    borderColor: selected ? theme.textPrimary : theme.rule,
                    borderWidth: selected ? 1.5 : 1,
                  },
                ]}
                activeOpacity={0.9}
              >
                <View style={[
                  styles.planRadio,
                  { borderColor: selected ? theme.textInverse : theme.textMuted },
                ]}>
                  {selected && <View style={[styles.planRadioInner, { backgroundColor: theme.textInverse }]} />}
                </View>
                <View style={{ flex: 1 }}>
                  <View style={styles.planLabelRow}>
                    <Text style={[styles.planLabel, { color: selected ? theme.textInverse : theme.textPrimary, fontFamily: 'Inter_600SemiBold' }]}>
                      {p.label}
                    </Text>
                    {p.popular && (
                      <Text style={[styles.popularBadge, { color: selected ? theme.accentGold : theme.accentTerracotta, fontFamily: 'Inter_400Regular' }]}>
                        POPULAR
                      </Text>
                    )}
                  </View>
                  <Text style={[styles.planNote, { color: selected ? theme.textInverse : theme.textMuted, fontFamily: 'Inter_400Regular' }]}>
                    {p.note}
                  </Text>
                </View>
                <Text style={[styles.planPrice, { color: selected ? theme.textInverse : theme.textPrimary, fontFamily: 'Newsreader_400Regular' }]}>
                  {p.price}
                  <Text style={[styles.planUnit, { color: selected ? theme.textInverse : theme.textMuted }]}>  {p.unit}</Text>
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={[styles.disclaimer, { color: theme.textMuted, fontFamily: 'Newsreader_400Regular' }]}>
          No charge today. We'll remind you before the trial ends.{'\n'}Cancel any time from your profile.
        </Text>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Sticky CTA */}
      <LinearGradient
        colors={['transparent', theme.background]}
        style={styles.ctaGradient}
      >
        <TouchableOpacity
          style={[styles.ctaBtn, { backgroundColor: theme.accentTerracotta }]}
          activeOpacity={0.85}
        >
          <Text style={[styles.ctaBtnText, { fontFamily: 'Inter_600SemiBold' }]}>
            Start 7-day free trial
          </Text>
          <Icon name="arrow" size={14} color="#FBF7EE" />
        </TouchableOpacity>
        <Text style={[styles.ctaNote, { color: theme.textMuted, fontFamily: 'Inter_400Regular' }]}>
          then {plan === 'monthly' ? '$9/mo' : '$72/yr'} · cancel anytime
        </Text>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:          { flex: 1 },
  chrome:        { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: spacing.md },
  chromeMeta:    { fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase' },
  closeBtn:      { width: 32, height: 32, borderRadius: radius.full, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  scroll:        { flex: 1 },
  content:       { padding: spacing.md },
  headline:      { fontSize: 44, lineHeight: 48, letterSpacing: -1, marginBottom: 14 },
  sub:           { fontStyle: 'italic', fontSize: 17, lineHeight: 26, marginBottom: spacing.lg, maxWidth: 320 },
  card:          { borderRadius: radius.lg, padding: spacing.md, borderWidth: 1, marginBottom: spacing.lg },
  cardLabel:     { fontSize: 10, letterSpacing: 1.4, textTransform: 'uppercase', marginBottom: 14 },
  timelineRow:   { flexDirection: 'row', gap: 14 },
  timelineRowSpaced: { marginBottom: 14 },
  timelineDotCol: { width: 10, alignItems: 'center' },
  timelineDot:   { width: 10, height: 10, borderRadius: 5, marginTop: 4 },
  timelineLine:  { width: 2, flex: 1, marginTop: 4, marginBottom: -18 },
  timelineDay:   { fontSize: 10, letterSpacing: 1.2, textTransform: 'uppercase' },
  timelineTitle: { fontSize: 17, letterSpacing: -0.2, marginTop: 2 },
  timelineSub:   { fontSize: 13, marginTop: 2 },
  sectionLabel:  { fontSize: 10, letterSpacing: 1.4, textTransform: 'uppercase', marginBottom: 12 },
  featureCard:   { borderRadius: radius.lg, borderWidth: 1, overflow: 'hidden', marginBottom: spacing.lg },
  featureRow:    { flexDirection: 'row', alignItems: 'flex-start', gap: 12, padding: 14 },
  checkCircle:   { width: 22, height: 22, borderRadius: 11, borderWidth: 1, alignItems: 'center', justifyContent: 'center', marginTop: 1 },
  featureTitle:  { fontSize: 15, letterSpacing: -0.1 },
  featureSub:    { fontSize: 13, marginTop: 2, lineHeight: 18 },
  planPicker:    { gap: 10, marginBottom: spacing.md },
  planCard:      { flexDirection: 'row', alignItems: 'center', gap: 14, borderRadius: radius.md, padding: spacing.md },
  planRadio:     { width: 20, height: 20, borderRadius: 10, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  planRadioInner: { width: 10, height: 10, borderRadius: 5 },
  planLabelRow:  { flexDirection: 'row', alignItems: 'center', gap: 6 },
  planLabel:     { fontSize: 15 },
  popularBadge:  { fontSize: 9, letterSpacing: 1 },
  planNote:      { fontSize: 12, marginTop: 2 },
  planPrice:     { fontSize: 24, letterSpacing: -0.3 },
  planUnit:      { fontSize: 12 },
  disclaimer:    { textAlign: 'center', fontStyle: 'italic', fontSize: 13, lineHeight: 20, marginBottom: spacing.md },
  ctaGradient:   { position: 'absolute', bottom: 0, left: 0, right: 0, padding: spacing.md, paddingBottom: spacing.lg, paddingTop: spacing.xl },
  ctaBtn:        { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: radius.full, paddingVertical: 18 },
  ctaBtnText:    { fontSize: 15, color: '#FBF7EE' },
  ctaNote:       { textAlign: 'center', marginTop: 10, fontSize: 11, letterSpacing: 0.5, textTransform: 'uppercase' },
});
