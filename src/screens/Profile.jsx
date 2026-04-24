import React, { useRef, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Animated,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';
import { useAuthContext } from '../auth/AuthContext';
import { useGame } from '../gamification/GameContext';
import { LEVEL_TITLES } from '../gamification/config';
import { spacing, radius, shadows } from '../theme/theme';
import { Icon } from '../icons/Icon';

const GOAL_PRESETS = [
  { n: 3,  label: 'Gentle',    sub: '~4 min a day' },
  { n: 5,  label: 'Balanced',  sub: '~7 min a day' },
  { n: 10, label: 'Ambitious', sub: '~15 min a day' },
];

const DIFFICULTIES = [
  { key: 'beginner',     label: 'Beginner',     sub: 'Common, everyday words' },
  { key: 'intermediate', label: 'Intermediate', sub: 'Rich vocabulary, varied usage' },
  { key: 'advanced',     label: 'Advanced',     sub: 'Rare, literary, precise' },
];

export default function Profile({ navigation }) {
  const { theme, mode, setTheme } = useTheme();
  const { profile, signOut, updateProfile, isGuest } = useAuthContext();
  const { level, streak, wordsSeen } = useGame();

  const [showGoalModal,       setShowGoalModal]       = useState(false);
  const [showDiffModal,       setShowDiffModal]        = useState(false);
  const [selectedGoal,        setSelectedGoal]        = useState(profile?.daily_goal || 5);
  const [selectedDifficulty,  setSelectedDifficulty]  = useState(profile?.difficulty || 'intermediate');
  const [saving,              setSaving]              = useState(false);

  const toggleAnim = useRef(new Animated.Value(mode === 'dusk' ? 1 : 0)).current;

  const username   = profile?.username    || '—';
  const isPro      = profile?.is_premium  || false;
  const initial    = username[0]?.toUpperCase() || '?';
  const levelTitle = LEVEL_TITLES[level] || LEVEL_TITLES[0];

  const currentDifficulty = profile?.difficulty || 'intermediate';
  const diffLabel = DIFFICULTIES.find(d => d.key === currentDifficulty)?.label || 'Intermediate';

  const handleThemeToggle = (key) => {
    setTheme(key);
    Animated.timing(toggleAnim, {
      toValue: key === 'dusk' ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const saveGoal = async () => {
    setSaving(true);
    await updateProfile({ daily_goal: selectedGoal });
    setSaving(false);
    setShowGoalModal(false);
  };

  const saveDifficulty = async () => {
    setSaving(true);
    await updateProfile({ difficulty: selectedDifficulty });
    setSaving(false);
    setShowDiffModal(false);
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

        {/* Guest register card */}
        {isGuest && (
          <TouchableOpacity
            onPress={() => navigation.navigate('Login')}
            style={[styles.guestCard, { backgroundColor: theme.textPrimary }, shadows.md]}
            activeOpacity={0.85}
          >
            <View style={{ flex: 1 }}>
              <Text style={[styles.guestMeta, { color: theme.goldSoft, fontFamily: 'Inter_400Regular' }]}>
                GUEST MODE
              </Text>
              <Text style={[styles.guestTitle, { color: theme.textInverse, fontFamily: 'Newsreader_400Regular' }]}>
                Save your progress
              </Text>
              <Text style={[styles.guestSub, { color: theme.goldSoft, fontFamily: 'Newsreader_400Regular' }]}>
                Create a free account to keep your XP, streak, and words.
              </Text>
            </View>
            <Icon name="arrow" size={14} color={theme.textInverse} />
          </TouchableOpacity>
        )}

        {/* Avatar hero */}
        <View style={[styles.heroCard, { backgroundColor: theme.card, borderColor: theme.rule }, shadows.sm]}>
          <View style={[styles.avatar, { backgroundColor: theme.accentTerracotta }]}>
            <Text style={[styles.avatarInitial, { color: '#FBF7EE', fontFamily: 'Newsreader_400Regular' }]}>
              {initial}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.userName, { color: theme.textPrimary, fontFamily: 'Newsreader_400Regular' }]}>
              {username}
            </Text>
            <Text style={[styles.userLevel, { color: theme.textMuted, fontFamily: 'Inter_400Regular' }]}>
              LVL {level} · {levelTitle}
            </Text>
          </View>
        </View>

        {/* Subscription card */}
        <TouchableOpacity
          onPress={() => navigation.navigate('Paywall')}
          style={[
            styles.subCard,
            {
              backgroundColor: isPro ? theme.textPrimary : theme.card,
              borderColor:     isPro ? theme.textPrimary : theme.rule,
            },
            shadows.sm,
          ]}
          activeOpacity={0.8}
        >
          <View style={{ flex: 1 }}>
            <Text style={[styles.subMeta, { color: isPro ? theme.goldSoft : theme.accentTerracotta, fontFamily: 'Inter_400Regular' }]}>
              {isPro ? 'LEXICA PRO' : 'UPGRADE TO PRO'}
            </Text>
            <Text style={[styles.subTitle, { color: isPro ? theme.textInverse : theme.textPrimary, fontFamily: 'Newsreader_400Regular' }]}>
              {isPro ? 'Active subscription' : 'Try Pro free for 7 days'}
            </Text>
            <Text style={[styles.subNote, { color: isPro ? theme.goldSoft : theme.textMuted, fontFamily: 'Newsreader_400Regular' }]}>
              {isPro ? 'Thank you for your support' : '$9 / month after trial'}
            </Text>
          </View>
          <Icon name="arrow" size={14} color={isPro ? theme.textInverse : theme.textPrimary} />
        </TouchableOpacity>

        {/* Stats three-up */}
        <View style={[styles.statsBar, { backgroundColor: theme.card, borderColor: theme.rule }, shadows.sm]}>
          {[
            { label: 'Words',  value: wordsSeen },
            { label: 'Streak', value: streak },
            { label: 'Level',  value: level },
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
          <SettingRow
            theme={theme}
            label="Daily goal"
            value={`${profile?.daily_goal || 5} words`}
            onPress={() => { setSelectedGoal(profile?.daily_goal || 5); setShowGoalModal(true); }}
          />
          <SettingRow
            theme={theme}
            label="Difficulty"
            value={diffLabel}
            last
            onPress={() => { setSelectedDifficulty(currentDifficulty); setShowDiffModal(true); }}
          />
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
          <SettingRow
            theme={theme}
            label="Sign out"
            value=""
            danger
            last
            onPress={handleSignOut}
          />
        </SettingGroup>

        <Text style={[styles.version, { color: theme.textMuted, fontFamily: 'Newsreader_400Regular' }]}>
          Lexica · v1.0
        </Text>
      </ScrollView>

      {/* Daily goal modal */}
      <PickerModal
        visible={showGoalModal}
        theme={theme}
        title="Daily goal"
        onClose={() => setShowGoalModal(false)}
        onSave={saveGoal}
        saving={saving}
      >
        {GOAL_PRESETS.map((p) => {
          const selected = selectedGoal === p.n;
          return (
            <TouchableOpacity
              key={p.n}
              onPress={() => setSelectedGoal(p.n)}
              style={[styles.optionRow, {
                backgroundColor: selected ? theme.textPrimary : theme.card,
                borderColor:     selected ? theme.textPrimary : theme.rule,
              }]}
              activeOpacity={0.85}
            >
              <Text style={[styles.optionNum, { color: selected ? theme.textInverse : theme.textPrimary, fontFamily: 'Newsreader_400Regular' }]}>
                {p.n}
              </Text>
              <View style={{ flex: 1 }}>
                <Text style={[styles.optionLabel, { color: selected ? theme.textInverse : theme.textPrimary, fontFamily: 'Inter_600SemiBold' }]}>
                  {p.label}
                </Text>
                <Text style={[styles.optionSub, { color: selected ? theme.textInverse : theme.textMuted, fontFamily: 'Inter_400Regular' }]}>
                  {p.sub}
                </Text>
              </View>
              {selected && <Icon name="check" size={16} color={theme.textInverse} />}
            </TouchableOpacity>
          );
        })}
      </PickerModal>

      {/* Difficulty modal */}
      <PickerModal
        visible={showDiffModal}
        theme={theme}
        title="Difficulty"
        onClose={() => setShowDiffModal(false)}
        onSave={saveDifficulty}
        saving={saving}
      >
        {DIFFICULTIES.map((d) => {
          const selected = selectedDifficulty === d.key;
          return (
            <TouchableOpacity
              key={d.key}
              onPress={() => setSelectedDifficulty(d.key)}
              style={[styles.optionRow, {
                backgroundColor: selected ? theme.textPrimary : theme.card,
                borderColor:     selected ? theme.textPrimary : theme.rule,
              }]}
              activeOpacity={0.85}
            >
              <View style={{ flex: 1 }}>
                <Text style={[styles.optionLabel, { color: selected ? theme.textInverse : theme.textPrimary, fontFamily: 'Inter_600SemiBold' }]}>
                  {d.label}
                </Text>
                <Text style={[styles.optionSub, { color: selected ? theme.textInverse : theme.textMuted, fontFamily: 'Inter_400Regular' }]}>
                  {d.sub}
                </Text>
              </View>
              {selected && <Icon name="check" size={16} color={theme.textInverse} />}
            </TouchableOpacity>
          );
        })}
      </PickerModal>
    </SafeAreaView>
  );
}

function PickerModal({ visible, theme, title, children, onClose, onSave, saving }) {
  return (
    <Modal visible={visible} animationType="slide" transparent presentationStyle="overFullScreen">
      <View style={[modalStyles.overlay]}>
        <View style={[modalStyles.sheet, { backgroundColor: theme.background }]}>
          <View style={[modalStyles.handle, { backgroundColor: theme.rule }]} />
          <Text style={[modalStyles.title, { color: theme.textPrimary, fontFamily: 'Newsreader_400Regular' }]}>
            {title}
          </Text>
          <View style={{ gap: 10, marginTop: 8, marginBottom: 24 }}>
            {children}
          </View>
          <View style={modalStyles.btnRow}>
            <TouchableOpacity
              onPress={onClose}
              style={[modalStyles.cancelBtn, { borderColor: theme.rule }]}
              activeOpacity={0.8}
            >
              <Text style={[modalStyles.cancelText, { color: theme.textPrimary, fontFamily: 'Inter_400Regular' }]}>
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onSave}
              disabled={saving}
              style={[modalStyles.saveBtn, { backgroundColor: theme.textPrimary, opacity: saving ? 0.7 : 1 }]}
              activeOpacity={0.85}
            >
              <Text style={[modalStyles.saveText, { color: theme.textInverse, fontFamily: 'Inter_600SemiBold' }]}>
                {saving ? 'Saving…' : 'Save'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
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

function SettingRow({ theme, label, value, danger, last, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={onPress ? 0.7 : 1}
      style={[styles.settingRow, !last && { borderBottomWidth: 1, borderBottomColor: theme.rule }]}
    >
      <Text style={[styles.rowLabel, { color: danger ? theme.accentTerracotta : theme.textPrimary, fontFamily: 'Inter_400Regular' }]}>
        {label}
      </Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        <Text style={[styles.rowValue, { color: theme.textMuted, fontFamily: 'Inter_400Regular' }]}>
          {value}
        </Text>
        {onPress && !danger && <Icon name="arrow" size={12} color={theme.textMuted} />}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safe:         { flex: 1 },
  scroll:       { flex: 1 },
  content:      { padding: spacing.md, paddingBottom: spacing.xxl },
  screenMeta:   { fontSize: 10, letterSpacing: 1.4, textTransform: 'uppercase' },
  screenTitle:  { fontSize: 36, lineHeight: 40, letterSpacing: -0.5, marginTop: 8, marginBottom: spacing.lg },
  guestCard:    { flexDirection: 'row', alignItems: 'center', gap: 14, borderRadius: radius.xl, padding: spacing.md, marginBottom: spacing.md },
  guestMeta:    { fontSize: 10, letterSpacing: 1.4, textTransform: 'uppercase' },
  guestTitle:   { fontSize: 20, letterSpacing: -0.2, marginTop: 4 },
  guestSub:     { fontSize: 13, marginTop: 4, fontStyle: 'italic', lineHeight: 18 },
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
  version:      { textAlign: 'center', marginTop: 24, fontStyle: 'italic', fontSize: 13 },
  optionRow:    { flexDirection: 'row', alignItems: 'center', gap: 14, borderRadius: radius.lg, padding: spacing.md, borderWidth: 1 },
  optionNum:    { fontSize: 32, lineHeight: 36, width: 40 },
  optionLabel:  { fontSize: 15 },
  optionSub:    { fontSize: 13, marginTop: 2 },
});

const modalStyles = StyleSheet.create({
  overlay:    { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.4)' },
  sheet:      { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: spacing.lg, paddingBottom: 40 },
  handle:     { width: 36, height: 4, borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  title:      { fontSize: 24, letterSpacing: -0.3, marginBottom: 4 },
  btnRow:     { flexDirection: 'row', gap: 10 },
  cancelBtn:  { flex: 1, borderWidth: 1, borderRadius: radius.full, paddingVertical: 13, alignItems: 'center' },
  cancelText: { fontSize: 15 },
  saveBtn:    { flex: 1, borderRadius: radius.full, paddingVertical: 13, alignItems: 'center' },
  saveText:   { fontSize: 15 },
});
