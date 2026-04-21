import React, { useRef } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../theme/ThemeContext';
import { spacing, radius, shadows } from '../theme/theme';
import { Icon } from '../icons/Icon';
import { INITIAL_USER } from '../data/words';

export default function Profile({ navigation }) {
  const { theme, mode, setTheme } = useTheme();
  const user = INITIAL_USER;

  const toggleAnim = useRef(new Animated.Value(mode === 'dusk' ? 1 : 0)).current;

  const handleThemeToggle = (key) => {
    setTheme(key);
    Animated.timing(toggleAnim, {
      toValue: key === 'dusk' ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleRestart = async () => {
    await AsyncStorage.multiRemove([
      'vocab:onboarded', 'vocab:streak', 'vocab:xp', 'vocab:level',
      'vocab:wordsLearned', 'vocab:dailyGoal', 'vocab:lastSession',
    ]);
    navigation.replace('Onboarding');
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.screenMeta, { color: theme.textMuted, fontFamily: 'Inter_400Regular' }]}>
          PROFILE
        </Text>
        <Text style={[styles.screenTitle, { color: theme.textPrimary, fontFamily: 'Newsreader_400Regular' }]}>
          You
        </Text>

        {/* Avatar hero */}
        <View style={[styles.heroCard, { backgroundColor: theme.card, borderColor: theme.rule }, shadows.sm]}>
          <View style={[styles.avatar, { backgroundColor: theme.accentTerracotta }]}>
            <Text style={[styles.avatarInitial, { color: '#FBF7EE', fontFamily: 'Newsreader_400Regular' }]}>
              {user.name[0]}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.userName, { color: theme.textPrimary, fontFamily: 'Newsreader_400Regular' }]}>
              {user.name}
            </Text>
            <Text style={[styles.userLevel, { color: theme.textMuted, fontFamily: 'Inter_400Regular' }]}>
              LVL {user.level} · Apprentice Reader
            </Text>
          </View>
        </View>

        {/* Subscription card */}
        <TouchableOpacity
          onPress={() => navigation.navigate('Paywall')}
          style={[
            styles.subCard,
            {
              backgroundColor: user.isPro ? theme.textPrimary : theme.card,
              borderColor: user.isPro ? theme.textPrimary : theme.rule,
            },
            shadows.sm,
          ]}
          activeOpacity={0.8}
        >
          <View style={{ flex: 1 }}>
            <Text style={[styles.subMeta, { color: user.isPro ? theme.goldSoft : theme.accentTerracotta, fontFamily: 'Inter_400Regular' }]}>
              {user.isPro ? 'LEXICA PRO · TRIAL' : 'UPGRADE TO PRO'}
            </Text>
            <Text style={[styles.subTitle, { color: user.isPro ? theme.textInverse : theme.textPrimary, fontFamily: 'Newsreader_400Regular' }]}>
              {user.isPro ? `${user.trialDaysLeft} days of trial left` : 'Try Pro free for 7 days'}
            </Text>
            <Text style={[styles.subNote, { color: user.isPro ? theme.goldSoft : theme.textMuted, fontFamily: 'Newsreader_400Regular' }]}>
              {user.isPro ? 'Then $9 / month · cancel anytime' : '$9 / month after trial'}
            </Text>
          </View>
          <Icon name="arrow" size={14} color={user.isPro ? theme.textInverse : theme.textPrimary} />
        </TouchableOpacity>

        {/* Stats three-up */}
        <View style={[styles.statsBar, { backgroundColor: theme.card, borderColor: theme.rule }, shadows.sm]}>
          {[
            { label: 'Words',  value: user.wordsLearned },
            { label: 'Streak', value: user.streak },
            { label: 'Days',   value: 87 },
          ].map((s, i) => (
            <View
              key={i}
              style={[styles.statCell, i < 2 && { borderRightWidth: 1, borderRightColor: theme.rule }]}
            >
              <Text style={[styles.statValue, { color: theme.textPrimary, fontFamily: 'Newsreader_400Regular' }]}>
                {s.value}
              </Text>
              <Text style={[styles.statLabel, { color: theme.textMuted, fontFamily: 'Inter_400Regular' }]}>
                {s.label.toUpperCase()}
              </Text>
            </View>
          ))}
        </View>

        {/* Practice settings */}
        <SettingGroup theme={theme} title="PRACTICE">
          <SettingRow theme={theme} label="Daily goal" value="5 words" />
          <SettingRow theme={theme} label="Reminder time" value="8:00 AM" />
          <SettingRow theme={theme} label="Difficulty" value="Intermediate" last />
        </SettingGroup>

        {/* Appearance */}
        <SettingGroup theme={theme} title="APPEARANCE">
          <View style={[styles.themeRow, { borderBottomWidth: 0 }]}>
            <Text style={[styles.rowLabel, { color: theme.textPrimary, fontFamily: 'Inter_400Regular' }]}>
              Appearance
            </Text>
            <View style={[styles.themePicker, { backgroundColor: theme.background, borderColor: theme.rule }]}>
              {['paper', 'dusk'].map(k => (
                <TouchableOpacity
                  key={k}
                  onPress={() => handleThemeToggle(k)}
                  style={[
                    styles.themeOption,
                    { backgroundColor: mode === k ? theme.textPrimary : 'transparent' },
                  ]}
                >
                  <Text style={[styles.themeOptionText, {
                    color: mode === k ? theme.textInverse : theme.textSecondary,
                    fontFamily: 'Inter_400Regular',
                  }]}>
                    {k.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </SettingGroup>

        {/* Account */}
        <SettingGroup theme={theme} title="ACCOUNT">
          <SettingRow theme={theme} label="Notifications" value="On" />
          <SettingRow theme={theme} label="Export library" value="CSV" />
          <SettingRow theme={theme} label="Sign out" value="" muted last />
        </SettingGroup>

        <View style={{ height: 16 }} />

        <TouchableOpacity
          style={[styles.restartBtn, { borderColor: theme.rule }]}
          onPress={handleRestart}
          activeOpacity={0.8}
        >
          <Text style={[styles.restartBtnText, { color: theme.textPrimary, fontFamily: 'Inter_600SemiBold' }]}>
            Restart demo from onboarding
          </Text>
        </TouchableOpacity>

        <Text style={[styles.version, { color: theme.textMuted, fontFamily: 'Newsreader_400Regular' }]}>
          Lexica · v1.0
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function SettingGroup({ theme, title, children }) {
  return (
    <View style={styles.settingGroup}>
      <Text style={[styles.groupTitle, { color: theme.textMuted, fontFamily: 'Inter_400Regular' }]}>
        {title}
      </Text>
      <View style={[styles.groupCard, { backgroundColor: theme.card, borderColor: theme.rule }]}>
        {children}
      </View>
    </View>
  );
}

function SettingRow({ theme, label, value, muted, last }) {
  return (
    <View style={[styles.settingRow, !last && { borderBottomWidth: 1, borderBottomColor: theme.rule }]}>
      <Text style={[styles.rowLabel, { color: muted ? theme.accentTerracotta : theme.textPrimary, fontFamily: 'Inter_400Regular' }]}>
        {label}
      </Text>
      <Text style={[styles.rowValue, { color: theme.textMuted, fontFamily: 'Inter_400Regular' }]}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe:         { flex: 1 },
  scroll:       { flex: 1 },
  content:      { padding: spacing.md, paddingBottom: spacing.xxl },
  screenMeta:   { fontSize: 10, letterSpacing: 1.4, textTransform: 'uppercase' },
  screenTitle:  { fontSize: 36, lineHeight: 40, letterSpacing: -0.5, marginTop: 8, marginBottom: spacing.lg },
  heroCard:     { flexDirection: 'row', alignItems: 'center', gap: 16, borderRadius: radius.xl, padding: spacing.md, borderWidth: 1, marginBottom: spacing.md },
  avatar:       { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center' },
  avatarInitial: { fontSize: 26 },
  userName:     { fontSize: 22, letterSpacing: -0.3 },
  userLevel:    { fontSize: 12, marginTop: 4 },
  subCard:      { flexDirection: 'row', alignItems: 'center', gap: 14, borderRadius: radius.lg, padding: spacing.md, borderWidth: 1, marginBottom: spacing.lg },
  subMeta:      { fontSize: 10, letterSpacing: 1.2, textTransform: 'uppercase' },
  subTitle:     { fontSize: 19, marginTop: 6, letterSpacing: -0.2 },
  subNote:      { fontSize: 12, marginTop: 3, fontStyle: 'italic' },
  statsBar:     { flexDirection: 'row', borderRadius: radius.lg, borderWidth: 1, overflow: 'hidden', marginBottom: spacing.lg },
  statCell:     { flex: 1, padding: 18, alignItems: 'center' },
  statValue:    { fontSize: 28, lineHeight: 30, letterSpacing: -0.3 },
  statLabel:    { fontSize: 10, letterSpacing: 1.4, marginTop: 6 },
  settingGroup: { marginBottom: spacing.md },
  groupTitle:   { fontSize: 10, letterSpacing: 1.4, marginBottom: 10, paddingLeft: 4 },
  groupCard:    { borderRadius: radius.md, borderWidth: 1, overflow: 'hidden' },
  settingRow:   { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 14 },
  rowLabel:     { fontSize: 15 },
  rowValue:     { fontSize: 14 },
  themeRow:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 14 },
  themePicker:  { flexDirection: 'row', borderWidth: 1, borderRadius: radius.full, padding: 3 },
  themeOption:  { paddingHorizontal: 14, paddingVertical: 6, borderRadius: radius.full },
  themeOptionText: { fontSize: 10, letterSpacing: 1.2 },
  restartBtn:   { borderWidth: 1, borderRadius: radius.full, paddingVertical: 14, alignItems: 'center', justifyContent: 'center' },
  restartBtnText: { fontSize: 15 },
  version:      { textAlign: 'center', marginTop: 24, fontStyle: 'italic', fontSize: 13 },
});
