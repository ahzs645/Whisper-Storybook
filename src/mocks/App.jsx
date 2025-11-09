// Mock App.jsx for Storybook - provides context hooks without full app initialization
import { createContext, useContext, useState, useCallback } from 'react';

// Create contexts for app-wide state and initialization
const AppStateContext = createContext();
const InitializationContext = createContext();

export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within AppStateProvider');
  }
  return context;
};

export const useInitialization = () => {
  const context = useContext(InitializationContext);
  if (!context) {
    throw new Error('useInitialization must be used within InitializationProvider');
  }
  return context;
};

// Mock InitializationProvider for Storybook
export function InitializationProvider({ children }) {
  const [initializationState] = useState({
    isInitializing: false,
    isInitialized: true,
    progress: 100,
    step: 'Ready',
    error: null
  });

  const initialize = async () => {
    console.log('Mock initialization (Storybook)');
  };

  const cleanup = () => {
    console.log('Mock cleanup (Storybook)');
  };

  return (
    <InitializationContext.Provider value={{
      ...initializationState,
      initialize,
      cleanup
    }}>
      {children}
    </InitializationContext.Provider>
  );
}

// Mock AppStateProvider for Storybook
export function AppStateProvider({ children, initialTheme = 'light' }) {
  const [theme, setTheme] = useState(initialTheme);

  const [appState, setAppState] = useState({
    selectedFile: null,
    transcription: '',
    isTranscribing: false,
    progress: 0,
    progressMessage: '',
    activeTranscriptionId: null,
    selectedProvider: 'whisper-native',
    selectedModel: 'whisper-tiny',
    isRecording: false,
    recordingDuration: 0,
    recordingValidated: false,
    recordingSettings: {
      includeMicrophone: true,
      includeSystemAudio: true
    },
    lastTranscriptionResult: null,
    isElectron: false,
    theme: theme
  });

  const updateTheme = useCallback((newTheme) => {
    setTheme(newTheme);
    setAppState(prev => ({ ...prev, theme: newTheme }));
  }, []);

  const updateAppState = useCallback((updates) => {
    if (typeof updates.theme !== 'undefined') {
      updateTheme(updates.theme);
      const { theme: _, ...otherUpdates } = updates;
      updates = otherUpdates;
    }

    setAppState(prev => ({ ...prev, ...updates }));
  }, [updateTheme]);

  const resetTranscription = useCallback(() => {
    updateAppState({
      transcription: '',
      isTranscribing: false,
      progress: 0,
      progressMessage: '',
      lastTranscriptionResult: null,
      activeTranscriptionId: null
    });
  }, [updateAppState]);

  const clearAll = useCallback(() => {
    setAppState(prev => ({
      ...prev,
      selectedFile: null,
      transcription: '',
      isTranscribing: false,
      progress: 0,
      progressMessage: '',
      lastTranscriptionResult: null,
      activeTranscriptionId: null,
      isRecording: false,
      recordingDuration: 0,
      recordingValidated: false
    }));
  }, []);

  return (
    <AppStateContext.Provider value={{
      appState,
      updateAppState,
      resetTranscription,
      clearAll,
      updateTheme
    }}>
      {children}
    </AppStateContext.Provider>
  );
}
