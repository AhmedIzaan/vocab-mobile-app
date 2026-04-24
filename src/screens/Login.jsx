import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';
import { useAuthContext } from '../auth/AuthContext';
import { typography, spacing, radius } from '../theme/theme';

export default function Login() {
  const { theme } = useTheme();
  const { signUp, signIn, continueAsGuest } = useAuthContext();

  const [isSignUp,  setIsSignUp]  = useState(true);
  const [email,     setEmail]     = useState('');
  const [username,  setUsername]  = useState('');
  const [password,  setPassword]  = useState('');
  const [error,     setError]     = useState('');
  const [loading,   setLoading]   = useState(false);

  const handleSubmit = async () => {
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields.');
      return;
    }
    if (isSignUp && !username.trim()) {
      setError('Please enter a username.');
      return;
    }

    setLoading(true);
    const { error: authError } = isSignUp
      ? await signUp(email.trim(), password, username.trim())
      : await signIn(email.trim(), password);
    setLoading(false);

    if (authError) {
      setError(authError.message);
    } else if (isSignUp) {
      setIsSignUp(false);
      setUsername('');
      setPassword('');
    }
  };

  const toggleMode = () => {
    setIsSignUp(v => !v);
    setError('');
    setEmail('');
    setUsername('');
    setPassword('');
  };

  const inputStyle = [styles.input, {
    backgroundColor: theme.card,
    borderColor: theme.border,
    color: theme.textPrimary,
    fontFamily: 'Inter_400Regular',
  }];

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Logo */}
          <View style={styles.logoBlock}>
            <Text style={[styles.logoText, { color: theme.textPrimary, fontFamily: 'Newsreader_400Regular_Italic' }]}>
              lexica
            </Text>
            <Text style={[typography.metaSmall, { color: theme.accentTerracotta, marginTop: spacing.xs }]}>
              BUILD YOUR VOCABULARY
            </Text>
          </View>

          {/* Heading */}
          <Text style={[typography.displayMedium, { color: theme.textPrimary, marginBottom: spacing.sm }]}>
            {isSignUp ? 'Create your account' : 'Welcome back'}
          </Text>
          <Text style={[typography.bodyMedium, { color: theme.textMuted, marginBottom: spacing.xl }]}>
            {isSignUp
              ? 'A few words a day. A richer world.'
              : 'Continue where you left off.'}
          </Text>

          {/* Fields */}
          <View style={styles.fields}>
            <View>
              <Text style={[styles.label, { color: theme.textMuted, fontFamily: 'Inter_400Regular' }]}>
                EMAIL
              </Text>
              <TextInput
                style={inputStyle}
                value={email}
                onChangeText={setEmail}
                placeholder="you@example.com"
                placeholderTextColor={theme.textMuted}
                autoCapitalize="none"
                keyboardType="email-address"
                autoComplete="email"
                textContentType="emailAddress"
              />
            </View>

            {isSignUp && (
              <View>
                <Text style={[styles.label, { color: theme.textMuted, fontFamily: 'Inter_400Regular' }]}>
                  USERNAME
                </Text>
                <TextInput
                  style={inputStyle}
                  value={username}
                  onChangeText={setUsername}
                  placeholder="how you'll appear"
                  placeholderTextColor={theme.textMuted}
                  autoCapitalize="none"
                  autoComplete="username-new"
                  textContentType="username"
                />
              </View>
            )}

            <View>
              <Text style={[styles.label, { color: theme.textMuted, fontFamily: 'Inter_400Regular' }]}>
                PASSWORD
              </Text>
              <TextInput
                style={inputStyle}
                value={password}
                onChangeText={setPassword}
                placeholder="minimum 6 characters"
                placeholderTextColor={theme.textMuted}
                secureTextEntry
                autoComplete={isSignUp ? 'new-password' : 'current-password'}
                textContentType={isSignUp ? 'newPassword' : 'password'}
              />
            </View>
          </View>

          {/* Error */}
          {!!error && (
            <Text style={[styles.error, { color: theme.accentTerracotta, fontFamily: 'Inter_400Regular' }]}>
              {error}
            </Text>
          )}

          {/* Submit */}
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={loading}
            activeOpacity={0.85}
            style={[styles.submitBtn, {
              backgroundColor: theme.accentTerracotta,
              opacity: loading ? 0.7 : 1,
            }]}
          >
            {loading
              ? <ActivityIndicator color="#fff" />
              : <Text style={[styles.submitText, { fontFamily: 'Inter_600SemiBold' }]}>
                  {isSignUp ? 'Create account' : 'Sign in'}
                </Text>
            }
          </TouchableOpacity>

          {/* Toggle */}
          <TouchableOpacity onPress={toggleMode} activeOpacity={0.7} style={styles.toggleRow}>
            <Text style={[styles.toggleText, { color: theme.textMuted, fontFamily: 'Inter_400Regular' }]}>
              {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
            </Text>
            <Text style={[styles.toggleLink, { color: theme.accentTerracotta, fontFamily: 'Inter_600SemiBold' }]}>
              {isSignUp ? 'Sign in' : 'Sign up'}
            </Text>
          </TouchableOpacity>

          {/* Guest */}
          <TouchableOpacity onPress={continueAsGuest} activeOpacity={0.7} style={styles.guestRow}>
            <Text style={[styles.guestText, { color: theme.textMuted, fontFamily: 'Inter_400Regular' }]}>
              Continue without an account
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:       { flex: 1 },
  scroll:     { flexGrow: 1, padding: spacing.lg, paddingTop: spacing.xxl, paddingBottom: spacing.xxl },
  logoBlock:  { alignItems: 'center', marginBottom: spacing.xxl },
  logoText:   { fontSize: 52, lineHeight: 60, letterSpacing: -1 },
  fields:     { gap: spacing.md, marginBottom: spacing.md },
  label:      { fontSize: 10, letterSpacing: 1.4, textTransform: 'uppercase', marginBottom: 6 },
  input:      { borderWidth: 1, borderRadius: radius.md, paddingHorizontal: spacing.md, paddingVertical: 14, fontSize: 15 },
  error:      { fontSize: 13, lineHeight: 18, marginBottom: spacing.md },
  submitBtn:  { borderRadius: radius.full, paddingVertical: 15, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.lg },
  submitText: { color: '#fff', fontSize: 15 },
  toggleRow:  { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  toggleText: { fontSize: 13 },
  toggleLink: { fontSize: 13 },
  guestRow:   { alignItems: 'center', marginTop: spacing.lg },
  guestText:  { fontSize: 13, textDecorationLine: 'underline' },
});
