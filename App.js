import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  SafeAreaView,
  StatusBar,
  Alert,
  FlatList,
  Dimensions,
  Image
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { StorageService, ALL_155_EXERCISES } from './src/storage/storage';
import { HevyImporter } from './src/services/hevyImporter';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function App() {
  const [activeTab, setActiveTab] = useState('workout'); // 'home', 'workout', 'profile'
  const [user, setUser] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [routines, setRoutines] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [measurements, setMeasurements] = useState([]);
  
  // DEFAULT REST TIMER DURATION SETTING (Default: 180s / 3 mins)
  const [defaultRestTimerSetting, setDefaultRestTimerSetting] = useState(180);

  // Active Workout & Minimization State
  const [activeSession, setActiveSession] = useState(null);
  const [workoutTimer, setWorkoutTimer] = useState(0);
  const [isWorkoutMinimized, setIsWorkoutMinimized] = useState(false);

  // AUTOMATIC REST TIMER COUNTDOWN STATE
  const [restTimerSeconds, setRestTimerSeconds] = useState(180);
  const [isRestTimerRunning, setIsRestTimerRunning] = useState(false);

  // Past Workout Details Modal State
  const [selectedPastSession, setSelectedPastSession] = useState(null);

  // Exercise Library Search & Category Filter
  const [exerciseSearch, setExerciseSearch] = useState('');
  const [selectedMuscleFilter, setSelectedMuscleFilter] = useState('All');
  
  // Search state inside active workout exercise picker
  const [midWorkoutSearch, setMidWorkoutSearch] = useState('');
  const [midWorkoutMuscleFilter, setMidWorkoutMuscleFilter] = useState('All');

  // PR Celebration Alert
  const [prAlert, setPrAlert] = useState(null);

  // Modal States
  const [showCreateRoutine, setShowCreateRoutine] = useState(false);
  const [showCreateExercise, setShowCreateExercise] = useState(false);
  const [showAddMeasurement, setShowAddMeasurement] = useState(false);
  const [editingMeasurement, setEditingMeasurement] = useState(null);
  const [showImport, setShowImport] = useState(false);
  const [showSelectExerciseForWorkout, setShowSelectExerciseForWorkout] = useState(false);
  const [showSelectExerciseForRoutine, setShowSelectExerciseForRoutine] = useState(false);
  
  // Exercise 3-Dots Menu & Reorder Modal State
  const [selectedExerciseForMenu, setSelectedExerciseForMenu] = useState(null);
  const [showExerciseMenu, setShowExerciseMenu] = useState(false);
  const [showReorderModal, setShowReorderModal] = useState(false);
  const [showReplaceModal, setShowReplaceModal] = useState(false);

  // SELECT SET TYPE MODAL STATE
  const [selectedSetForType, setSelectedSetForType] = useState(null);
  const [showSetTypeModal, setShowSetTypeModal] = useState(false);

  // LOG SET RPE MODAL STATE
  const [selectedSetForRPE, setSelectedSetForRPE] = useState(null);
  const [showRPEModal, setShowRPEModal] = useState(false);
  const [currentRPEValue, setCurrentRPEValue] = useState('8');

  // Form Inputs - Routine Builder
  const [newRoutineName, setNewRoutineName] = useState('');
  const [newRoutineCategory, setNewRoutineCategory] = useState('Push');
  const [newRoutineDesc, setNewRoutineDesc] = useState('');
  const [routineItems, setRoutineItems] = useState([]);
  
  // Form Inputs - Custom Exercise Builder
  const [newExName, setNewExName] = useState('');
  const [newExGroup, setNewExGroup] = useState('Chest');
  const [newExEquipment, setNewExEquipment] = useState('Barbell');
  const [newExPart, setNewExPart] = useState('');
  
  // Form Inputs - CSV Import
  const [csvInput, setCsvInput] = useState('');
  
  // Form Inputs - Body Measurement
  const [weightInput, setWeightInput] = useState('75.0');
  const [heightInput, setHeightInput] = useState('175.0');
  const [bodyFatInput, setBodyFatInput] = useState('');

  useEffect(() => {
    loadInitialData();
  }, []);

  // Workout Timer Interval
  useEffect(() => {
    let interval;
    if (activeSession) {
      interval = setInterval(() => {
        setWorkoutTimer(prev => prev + 1);
      }, 1000);
    } else {
      setWorkoutTimer(0);
    }
    return () => clearInterval(interval);
  }, [activeSession]);

  // Rest Timer Countdown Interval
  useEffect(() => {
    let restInterval;
    if (isRestTimerRunning && restTimerSeconds > 0) {
      restInterval = setInterval(() => {
        setRestTimerSeconds(prev => prev - 1);
      }, 1000);
    } else if (restTimerSeconds === 0) {
      setIsRestTimerRunning(false);
    }
    return () => clearInterval(restInterval);
  }, [isRestTimerRunning, restTimerSeconds]);

  const loadInitialData = async () => {
    const u = await StorageService.getUser();
    if (!u) {
      const defaultUser = { name: 'Athlete', age: 25, heightCm: 175, weightKg: 75, gender: 'Male', restTimerSetting: 180 };
      await StorageService.saveUser(defaultUser);
      setUser(defaultUser);
      setDefaultRestTimerSetting(180);
    } else {
      setUser(u);
      setDefaultRestTimerSetting(u.restTimerSetting || 180);
    }
    
    const exList = await StorageService.getExercises();
    setExercises(exList);
    
    const rList = await StorageService.getRoutines();
    setRoutines(rList);
    
    const sList = await StorageService.getSessions();
    setSessions(sList);
    
    const mList = await StorageService.getMeasurements();
    setMeasurements(mList);
  };

  const handleSaveRestTimerSetting = async (newSeconds) => {
    setDefaultRestTimerSetting(newSeconds);
    const updatedUser = { ...user, restTimerSetting: newSeconds };
    setUser(updatedUser);
    await StorageService.saveUser(updatedUser);
    Alert.alert('Saved!', `Default rest timer set to ${formatTime(newSeconds)}.`);
  };

  const handleResetAllData = () => {
    Alert.alert(
      '⚠️ Reset All App Data?',
      'This will erase current workout history and reset exercises to the full 155 exercise database so you can clean import your CSV file.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset Everything',
          style: 'destructive',
          onPress: async () => {
            await StorageService.resetAllData();
            await loadInitialData();
            Alert.alert('Done!', 'All data reset! You can now import your clean CSV file.');
          }
        }
      ]
    );
  };

  // --- WORKOUT LOGIC ---
  const startEmptyWorkout = () => {
    const newSession = {
      id: 'sess_' + Date.now(),
      title: 'Log Workout',
      startDate: new Date().toISOString(),
      durationSeconds: 0,
      totalVolumeKg: 0,
      exerciseOrder: [],
      supersets: {},
      sets: []
    };
    setActiveSession(newSession);
    setIsWorkoutMinimized(false);
    setRestTimerSeconds(defaultRestTimerSetting);
    setIsRestTimerRunning(false);
  };

  const startWorkoutFromRoutine = (routine) => {
    const order = [];
    const newSession = {
      id: 'sess_' + Date.now(),
      title: routine ? routine.name : 'Log Workout',
      startDate: new Date().toISOString(),
      durationSeconds: 0,
      totalVolumeKg: 0,
      exerciseOrder: order,
      supersets: {},
      sets: []
    };

    if (routine && routine.items) {
      routine.items.forEach(item => {
        if (!order.includes(item.exerciseName)) {
          order.push(item.exerciseName);
        }
        for (let i = 1; i <= item.sets; i++) {
          newSession.sets.push({
            id: `set_${Date.now()}_${Math.random()}`,
            setIndex: i,
            setType: 'Normal',
            exerciseName: item.exerciseName,
            weightKg: item.targetWeight || 50,
            reps: item.reps || 10,
            rpe: '8',
            previousBest: `${item.targetWeight || 50}kg x ${item.reps || 10}`,
            isCompleted: false
          });
        }
      });
    }

    setActiveSession(newSession);
    setIsWorkoutMinimized(false);
    setRestTimerSeconds(defaultRestTimerSetting);
    setIsRestTimerRunning(false);
  };

  const addExerciseToActiveWorkout = (exName) => {
    if (!activeSession) return;
    const currentOrder = activeSession.exerciseOrder && activeSession.exerciseOrder.length > 0
      ? [...activeSession.exerciseOrder]
      : Array.from(new Set(activeSession.sets.map(s => s.exerciseName)));

    if (!currentOrder.includes(exName)) {
      currentOrder.push(exName);
    }

    const existingCount = activeSession.sets.filter(s => s.exerciseName === exName).length;
    const exObj = exercises.find(e => e.name.toLowerCase() === exName.toLowerCase());
    const prevText = exObj && exObj.maxWeight > 0 ? `${exObj.maxWeight}kg x ${exObj.maxReps}` : '-';
    
    const newSets = [...activeSession.sets];
    for (let i = 1; i <= 2; i++) {
      newSets.push({
        id: `set_${Date.now()}_${Math.random()}`,
        setIndex: existingCount + i,
        setType: 'Normal',
        exerciseName: exName,
        weightKg: exObj && exObj.maxWeight > 0 ? exObj.maxWeight : 50,
        reps: 10,
        rpe: '8',
        previousBest: prevText,
        isCompleted: false
      });
    }

    setActiveSession({
      ...activeSession,
      exerciseOrder: currentOrder,
      sets: newSets
    });
    setMidWorkoutSearch('');
    setShowSelectExerciseForWorkout(false);
  };

  const toggleExerciseSuperset = (exName) => {
    if (!activeSession) return;
    const currentSupersets = { ...(activeSession.supersets || {}) };
    
    if (currentSupersets[exName]) {
      delete currentSupersets[exName];
      Alert.alert('Unlinked', `Removed ${exName} from Superset.`);
    } else {
      const usedTags = Object.values(currentSupersets);
      const tag = usedTags.length > 0 ? usedTags[usedTags.length - 1] : 'A';
      currentSupersets[exName] = tag;
      Alert.alert('Superset Linked!', `Added ${exName} to SUPERSET ${tag}.`);
    }

    setActiveSession({
      ...activeSession,
      supersets: currentSupersets
    });
    setShowExerciseMenu(false);
  };

  const moveExerciseInOrder = (fromIdx, toIdx) => {
    if (!activeSession) return;
    const currentOrder = getActiveExerciseOrder();
    if (toIdx < 0 || toIdx >= currentOrder.length) return;

    const newOrder = [...currentOrder];
    const [moved] = newOrder.splice(fromIdx, 1);
    newOrder.splice(toIdx, 0, moved);

    setActiveSession({
      ...activeSession,
      exerciseOrder: newOrder
    });
  };

  const replaceExerciseInWorkout = (targetOldExName, newExName) => {
    if (!activeSession) return;
    const currentOrder = getActiveExerciseOrder().map(name => name === targetOldExName ? newExName : name);
    const updatedSets = activeSession.sets.map(s => s.exerciseName === targetOldExName ? { ...s, exerciseName: newExName } : s);

    setActiveSession({
      ...activeSession,
      exerciseOrder: currentOrder,
      sets: updatedSets
    });
    setShowReplaceModal(false);
    setShowExerciseMenu(false);
  };

  const getActiveExerciseOrder = () => {
    if (!activeSession) return [];
    if (activeSession.exerciseOrder && activeSession.exerciseOrder.length > 0) {
      return activeSession.exerciseOrder;
    }
    return Array.from(new Set(activeSession.sets.map(s => s.exerciseName)));
  };

  const addSetToExercise = (exName) => {
    if (!activeSession) return;
    const exerciseSets = activeSession.sets.filter(s => s.exerciseName === exName);
    const nextIndex = exerciseSets.length + 1;
    const lastSet = exerciseSets[exerciseSets.length - 1];

    const newSet = {
      id: `set_${Date.now()}_${Math.random()}`,
      setIndex: nextIndex,
      setType: 'Normal',
      exerciseName: exName,
      weightKg: lastSet ? lastSet.weightKg : 50,
      reps: lastSet ? lastSet.reps : 10,
      rpe: '8',
      previousBest: lastSet ? `${lastSet.weightKg}kg x ${lastSet.reps}` : '-',
      isCompleted: false
    };

    setActiveSession({ ...activeSession, sets: [...activeSession.sets, newSet] });
  };

  const applySetTypeChange = (newType) => {
    if (!activeSession || !selectedSetForType) return;

    if (newType === 'REMOVE') {
      const updatedSets = activeSession.sets.filter(s => s.id !== selectedSetForType.id);
      setActiveSession({ ...activeSession, sets: updatedSets });
    } else {
      const updatedSets = activeSession.sets.map(s => s.id === selectedSetForType.id ? { ...s, setType: newType } : s);
      setActiveSession({ ...activeSession, sets: updatedSets });
    }

    setShowSetTypeModal(false);
    setSelectedSetForType(null);
  };

  const saveRPEScore = () => {
    if (!activeSession || !selectedSetForRPE) return;
    const updatedSets = activeSession.sets.map(s => s.id === selectedSetForRPE.id ? { ...s, rpe: currentRPEValue } : s);
    setActiveSession({ ...activeSession, sets: updatedSets });
    setShowRPEModal(false);
    setSelectedSetForRPE(null);
  };

  const removeExerciseFromWorkout = (exName) => {
    if (!activeSession) return;
    const filteredSets = activeSession.sets.filter(s => s.exerciseName !== exName);
    const newOrder = getActiveExerciseOrder().filter(name => name !== exName);
    setActiveSession({ ...activeSession, exerciseOrder: newOrder, sets: filteredSets });
    setShowExerciseMenu(false);
  };

  const updateSetWeight = (setId, val) => {
    if (!activeSession) return;
    const numericVal = parseFloat(val) || 0;
    const updatedSets = activeSession.sets.map(s => s.id === setId ? { ...s, weightKg: numericVal } : s);
    recalculateActiveVolume(updatedSets);
  };

  const updateSetReps = (setId, val) => {
    if (!activeSession) return;
    const numericVal = parseInt(val, 10) || 0;
    const updatedSets = activeSession.sets.map(s => s.id === setId ? { ...s, reps: numericVal } : s);
    recalculateActiveVolume(updatedSets);
  };

  const toggleSetCompletion = (setId) => {
    if (!activeSession) return;
    const updatedSets = activeSession.sets.map(s => {
      if (s.id === setId) {
        const isComp = !s.isCompleted;
        if (isComp) {
          checkPR(s.exerciseName, s.weightKg, s.reps);
          setRestTimerSeconds(defaultRestTimerSetting);
          setIsRestTimerRunning(true);
        }
        return { ...s, isCompleted: isComp };
      }
      return s;
    });

    recalculateActiveVolume(updatedSets);
  };

  const adjustRestTimer = (secondsDelta) => {
    setRestTimerSeconds(prev => Math.max(0, prev + secondsDelta));
  };

  const recalculateActiveVolume = (setsList) => {
    const totalVol = setsList
      .filter(s => s.isCompleted)
      .reduce((acc, curr) => acc + (curr.weightKg * curr.reps), 0);

    setActiveSession({
      ...activeSession,
      sets: setsList,
      totalVolumeKg: totalVol
    });
  };

  const checkPR = (exName, weight, reps) => {
    if (weight <= 0 || reps <= 0) return;
    const ex = exercises.find(e => e.name.toLowerCase() === exName.toLowerCase());
    const currentMax = ex ? (ex.maxWeight || 0) : 0;
    
    if (weight > currentMax) {
      setPrAlert({ exerciseName: exName, newWeight: weight, reps: reps });
      setTimeout(() => setPrAlert(null), 4000);

      const updatedExercises = exercises.map(e => {
        if (e.name.toLowerCase() === exName.toLowerCase()) {
          return { ...e, maxWeight: weight, maxReps: reps };
        }
        return e;
      });
      setExercises(updatedExercises);
      StorageService.saveExercises(updatedExercises);
    }
  };

  const finishWorkout = async () => {
    if (!activeSession) return;
    const completedSession = {
      ...activeSession,
      durationSeconds: workoutTimer,
      endDate: new Date().toISOString()
    };

    const updatedSessions = [completedSession, ...sessions];
    setSessions(updatedSessions);
    await StorageService.saveSessions(updatedSessions);

    setActiveSession(null);
    setIsWorkoutMinimized(false);
    setIsRestTimerRunning(false);
    setActiveTab('home');
    Alert.alert('🎉 Workout Saved!', 'Great session! Your metrics and PRs have been updated.');
  };

  const discardWorkout = () => {
    Alert.alert('Discard Workout?', 'Are you sure you want to discard this workout session?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Discard',
        style: 'destructive',
        onPress: () => {
          setActiveSession(null);
          setIsWorkoutMinimized(false);
          setIsRestTimerRunning(false);
        }
      }
    ]);
  };

  // --- CSV IMPORT ---
  const processImportedSessions = async (importedSessions) => {
    if (!importedSessions || importedSessions.length === 0) {
      Alert.alert('Error', 'No valid workout sessions found in CSV.');
      return;
    }

    const existingIds = new Set(sessions.map(s => s.id));
    const newSessions = importedSessions.filter(s => !existingIds.has(s.id));
    const allSessions = [...newSessions, ...sessions];

    let updatedExercises = [...exercises];
    
    allSessions.forEach(sess => {
      if (sess.sets) {
        sess.sets.forEach(set => {
          if (set.exerciseName && set.weightKg > 0) {
            const exIdx = updatedExercises.findIndex(e => e.name.toLowerCase() === set.exerciseName.toLowerCase());
            if (exIdx >= 0) {
              if (set.weightKg > (updatedExercises[exIdx].maxWeight || 0)) {
                updatedExercises[exIdx] = {
                  ...updatedExercises[exIdx],
                  maxWeight: set.weightKg,
                  maxReps: set.reps
                };
              }
            } else {
              updatedExercises.push({
                id: 'ex_' + Math.random().toString(36).substring(2, 8),
                name: set.exerciseName,
                muscleGroup: 'Custom',
                equipment: 'Other',
                maxWeight: set.weightKg,
                maxReps: set.reps
              });
            }
          }
        });
      }
    });

    setSessions(allSessions);
    setExercises(updatedExercises);

    await StorageService.saveSessions(allSessions);
    await StorageService.saveExercises(updatedExercises);

    setShowImport(false);
    setCsvInput('');
    Alert.alert('🎉 Import Complete!', `Successfully imported ALL ${importedSessions.length} workout sessions into WORTHY!`);
  };

  const handlePickCSVFile = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true
      });
      
      if (!res.canceled && res.assets && res.assets.length > 0) {
        const fileUri = res.assets[0].uri;
        const response = await fetch(fileUri);
        const fileContent = await response.text();
        
        const imported = HevyImporter.parseCSV(fileContent);
        await processImportedSessions(imported);
      }
    } catch (err) {
      Alert.alert('Import Error', 'Failed to read file: ' + err.message);
    }
  };

  const handleImportTextCSV = async () => {
    const imported = HevyImporter.parseCSV(csvInput);
    await processImportedSessions(imported);
  };

  // --- CUSTOM ROUTINE BUILDER ---
  const handleSaveNewRoutine = async () => {
    if (!newRoutineName.trim() || routineItems.length === 0) {
      Alert.alert('Error', 'Please enter a routine name and add at least one exercise.');
      return;
    }

    const newRoutine = {
      id: 'r_' + Date.now(),
      name: newRoutineName,
      category: newRoutineCategory,
      description: newRoutineDesc || 'Custom routine',
      items: routineItems
    };

    const updated = [newRoutine, ...routines];
    setRoutines(updated);
    await StorageService.saveRoutines(updated);
    
    setNewRoutineName('');
    setNewRoutineDesc('');
    setRoutineItems([]);
    setShowCreateRoutine(false);
    Alert.alert('Success!', 'New routine created successfully.');
  };

  const addExerciseToRoutineBuilder = (exName) => {
    setRoutineItems([
      ...routineItems,
      { exerciseName: exName, sets: 3, reps: 10, targetWeight: 50 }
    ]);
    setShowSelectExerciseForRoutine(false);
  };

  // --- CUSTOM EXERCISE BUILDER ---
  const handleSaveCustomExercise = async () => {
    if (!newExName.trim()) {
      Alert.alert('Error', 'Please enter an exercise name.');
      return;
    }

    const newEx = {
      id: 'ex_' + Date.now(),
      name: newExName,
      muscleGroup: newExGroup,
      equipment: newExEquipment,
      primaryMuscle: newExGroup,
      musclePart: newExPart || 'Overall',
      secondaryMuscles: 'Various',
      isCompound: true,
      maxWeight: 0,
      maxReps: 0
    };

    const updated = [newEx, ...exercises];
    setExercises(updated);
    await StorageService.saveExercises(updated);
    
    setNewExName('');
    setNewExPart('');
    setShowCreateExercise(false);
    Alert.alert('Success!', `Custom exercise "${newExName}" added to Exercise Library.`);
  };

  // --- BODY METRICS ---
  const handleOpenAddMeasurement = () => {
    setEditingMeasurement(null);
    setWeightInput('75.0');
    setHeightInput('175.0');
    setBodyFatInput('');
    setShowAddMeasurement(true);
  };

  const handleOpenEditMeasurement = (m) => {
    setEditingMeasurement(m);
    setWeightInput(String(m.weightKg || '75.0'));
    setHeightInput(String(m.heightCm || '175.0'));
    setBodyFatInput(m.bodyFat ? String(m.bodyFat) : '');
    setShowAddMeasurement(true);
  };

  const handleSaveMeasurement = async () => {
    let updated;
    if (editingMeasurement) {
      updated = measurements.map(m => m.id === editingMeasurement.id ? {
        ...m,
        weightKg: parseFloat(weightInput) || 75.0,
        heightCm: parseFloat(heightInput) || 175.0,
        bodyFat: bodyFatInput ? parseFloat(bodyFatInput) : null
      } : m);
    } else {
      const newM = {
        id: 'm_' + Date.now(),
        date: new Date().toISOString().substring(0, 10),
        weightKg: parseFloat(weightInput) || 75.0,
        heightCm: parseFloat(heightInput) || 175.0,
        bodyFat: bodyFatInput ? parseFloat(bodyFatInput) : null
      };
      updated = [newM, ...measurements];
    }

    setMeasurements(updated);
    await StorageService.saveMeasurements(updated);
    setShowAddMeasurement(false);
    setEditingMeasurement(null);
  };

  const handleDeleteMeasurement = (mId) => {
    Alert.alert('Delete Entry?', 'Are you sure you want to delete this measurement entry?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          const updated = measurements.filter(m => m.id !== mId);
          setMeasurements(updated);
          await StorageService.saveMeasurements(updated);
        }
      }
    ]);
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  const totalVolume = sessions.reduce((acc, curr) => acc + (curr.totalVolumeKg || 0), 0);
  const totalTimeSeconds = sessions.reduce((acc, curr) => acc + (curr.durationSeconds || 0), 0);
  const totalHours = (totalTimeSeconds / 3600).toFixed(1);

  const activeWorkoutExercises = getActiveExerciseOrder();

  const filteredExercises = exercises.filter(ex => {
    const matchesSearch = ex.name.toLowerCase().includes(exerciseSearch.toLowerCase()) ||
                          (ex.muscleGroup && ex.muscleGroup.toLowerCase().includes(exerciseSearch.toLowerCase()));
    const matchesGroup = selectedMuscleFilter === 'All' || 
                         (ex.muscleGroup && ex.muscleGroup.toLowerCase() === selectedMuscleFilter.toLowerCase());
    return matchesSearch && matchesGroup;
  });

  const midWorkoutFilteredExercises = exercises.filter(ex => {
    const matchesSearch = ex.name.toLowerCase().includes(midWorkoutSearch.toLowerCase()) ||
                          (ex.muscleGroup && ex.muscleGroup.toLowerCase().includes(midWorkoutSearch.toLowerCase()));
    const matchesGroup = midWorkoutMuscleFilter === 'All' || 
                         (ex.muscleGroup && ex.muscleGroup.toLowerCase() === midWorkoutMuscleFilter.toLowerCase());
    return matchesSearch && matchesGroup;
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      {/* PR Celebration Banner */}
      {prAlert && (
        <View style={styles.prBanner}>
          <Text style={styles.prTitle}>🎉 NEW PERSONAL RECORD!</Text>
          <Text style={styles.prBody}>
            {prAlert.exerciseName}: {prAlert.newWeight} kg x {prAlert.reps} reps!
          </Text>
        </View>
      )}

      {/* MAIN SCREEN RENDER */}
      <View style={styles.content}>

        {/* ACTIVE WORKOUT SCREEN */}
        {activeSession && !isWorkoutMinimized ? (
          <View style={{ flex: 1, backgroundColor: '#000000' }}>
            {/* HEVY TOP NAV BAR */}
            <View style={styles.hevyTopHeader}>
              <TouchableOpacity onPress={() => setIsWorkoutMinimized(true)}>
                <Text style={styles.hevyMinimizeText}>∨</Text>
              </TouchableOpacity>
              
              <Text style={styles.hevyHeaderTitle}>Log Workout</Text>

              <TouchableOpacity style={styles.hevyFinishPill} onPress={finishWorkout}>
                <Text style={styles.hevyFinishPillText}>Finish</Text>
              </TouchableOpacity>
            </View>

            {/* HEVY SESSION SUMMARY BAR */}
            <View style={styles.hevySummaryBar}>
              <View style={styles.hevyStatItem}>
                <Text style={styles.hevyStatLabel}>Duration</Text>
                <Text style={[styles.hevyStatVal, { color: '#0084FF' }]}>{formatTime(workoutTimer)}</Text>
              </View>
              <View style={styles.hevyStatItem}>
                <Text style={styles.hevyStatLabel}>Volume</Text>
                <Text style={styles.hevyStatVal}>{Math.round(activeSession.totalVolumeKg)} kg</Text>
              </View>
              <View style={styles.hevyStatItem}>
                <Text style={styles.hevyStatLabel}>Sets</Text>
                <Text style={styles.hevyStatVal}>
                  {activeSession.sets.filter(s => s.isCompleted).length}
                </Text>
              </View>
            </View>

            {/* AUTOMATIC REST TIMER COUNTDOWN BANNER */}
            <View style={styles.restTimerBanner}>
              <View style={{ flex: 1 }}>
                <Text style={styles.restTimerBannerTitle}>⏱ REST TIMER</Text>
                <Text style={styles.restTimerBannerTime}>{formatTime(restTimerSeconds)}</Text>
              </View>
              <TouchableOpacity style={styles.timerAdjustBtn} onPress={() => adjustRestTimer(-30)}>
                <Text style={styles.timerAdjustBtnText}>-30s</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.timerAdjustBtn} onPress={() => adjustRestTimer(+30)}>
                <Text style={styles.timerAdjustBtnText}>+30s</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.timerAdjustBtn, { backgroundColor: '#ef4444' }]} onPress={() => setIsRestTimerRunning(false)}>
                <Text style={styles.timerAdjustBtnText}>Skip</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.scroll}>
              {activeWorkoutExercises.map((exName, exIndex) => {
                const exSets = activeSession.sets.filter(s => s.exerciseName === exName);
                const supersetTag = activeSession.supersets ? activeSession.supersets[exName] : null;

                return (
                  <View key={exName} style={[styles.hevyExerciseCard, supersetTag && styles.supersetCardBorder]}>
                    {/* Superset Tag Badge */}
                    {supersetTag && (
                      <View style={styles.supersetBadge}>
                        <Text style={styles.supersetBadgeText}>🔗 SUPERSET {supersetTag}</Text>
                      </View>
                    )}

                    {/* Exercise Card Header with Custom Cat Lifting Logo Avatar & Move Controls */}
                    <View style={styles.hevyCardHeader}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                        <Image source={require('./assets/worthy_logo.jpg')} style={styles.headerExerciseAvatar} />
                        
                        <View style={styles.inlineDragBox}>
                          <TouchableOpacity
                            style={[styles.inlineArrowBtn, exIndex === 0 && { opacity: 0.2 }]}
                            onPress={() => moveExerciseInOrder(exIndex, exIndex - 1)}
                            disabled={exIndex === 0}
                          >
                            <Text style={styles.inlineArrowText}>▲</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[styles.inlineArrowBtn, exIndex === activeWorkoutExercises.length - 1 && { opacity: 0.2 }]}
                            onPress={() => moveExerciseInOrder(exIndex, exIndex + 1)}
                            disabled={exIndex === activeWorkoutExercises.length - 1}
                          >
                            <Text style={styles.inlineArrowText}>▼</Text>
                          </TouchableOpacity>
                        </View>

                        <Text style={styles.hevyBlueTitle}>{exIndex + 1}. {exName}</Text>
                      </View>

                      <TouchableOpacity onPress={() => {
                        setSelectedExerciseForMenu(exName);
                        setShowExerciseMenu(true);
                      }}>
                        <Text style={styles.threeDotsMenu}>⋮</Text>
                      </TouchableOpacity>
                    </View>

                    <Text style={styles.hevyRestTimerText}>⏱ Rest Timer: {formatTime(restTimerSeconds)}</Text>

                    <View style={styles.hevyColHeaderRow}>
                      <Text style={[styles.colHeader, { width: 40 }]}>SET</Text>
                      <Text style={[styles.colHeader, { flex: 1 }]}>PREVIOUS</Text>
                      <Text style={[styles.colHeader, { width: 55 }]}>KG</Text>
                      <Text style={[styles.colHeader, { width: 50 }]}>REPS</Text>
                      <Text style={[styles.colHeader, { width: 45, textAlign: 'center' }]}>RPE</Text>
                      <Text style={[styles.colHeader, { width: 40, textAlign: 'center' }]}>✓</Text>
                    </View>

                    {exSets.map((set, sIdx) => (
                      <View key={set.id} style={[styles.hevySetRow, set.isCompleted && styles.hevySetRowCompleted]}>
                        <TouchableOpacity style={styles.setTypeBtn} onPress={() => {
                          setSelectedSetForType(set);
                          setShowSetTypeModal(true);
                        }}>
                          <Text style={[
                            styles.setTypeText,
                            set.setType === 'Warmup' && { color: '#f59e0b' },
                            set.setType === 'Drop' && { color: '#a855f7' },
                            set.setType === 'Failure' && { color: '#ef4444' }
                          ]}>
                            {set.setType === 'Warmup' ? 'W' : (set.setType === 'Drop' ? 'D' : (set.setType === 'Failure' ? 'F' : (sIdx + 1)))}
                          </Text>
                        </TouchableOpacity>

                        <Text style={styles.hevySetPrev} numberOfLines={1}>{set.previousBest || '-'}</Text>
                        
                        <TextInput
                          style={styles.hevyNumInput}
                          keyboardType="numeric"
                          value={String(set.weightKg)}
                          onChangeText={(val) => updateSetWeight(set.id, val)}
                        />

                        <TextInput
                          style={styles.hevyNumInput}
                          keyboardType="numeric"
                          value={String(set.reps)}
                          onChangeText={(val) => updateSetReps(set.id, val)}
                        />

                        <TouchableOpacity style={styles.rpePillBtn} onPress={() => {
                          setSelectedSetForRPE(set);
                          setCurrentRPEValue(set.rpe || '8');
                          setShowRPEModal(true);
                        }}>
                          <Text style={styles.rpePillBtnText}>RPE {set.rpe || '8'}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.hevyCheckPill, set.isCompleted && styles.hevyCheckPillActive]} onPress={() => toggleSetCompletion(set.id)}>
                          <Text style={styles.hevyCheckPillText}>✓</Text>
                        </TouchableOpacity>
                      </View>
                    ))}

                    <TouchableOpacity style={styles.addSetFullBtn} onPress={() => addSetToExercise(exName)}>
                      <Text style={styles.addSetFullBtnText}>+ Add Set</Text>
                    </TouchableOpacity>
                  </View>
                );
              })}

              <TouchableOpacity style={styles.addExerciseBlueBtn} onPress={() => setShowSelectExerciseForWorkout(true)}>
                <Text style={styles.addExerciseBlueBtnText}>+ Add Exercise</Text>
              </TouchableOpacity>

              <View style={styles.workoutFooterActions}>
                <TouchableOpacity style={styles.discardBtn} onPress={discardWorkout}>
                  <Text style={styles.discardBtnText}>Discard Workout</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        ) : (
          /* TAB SCREENS: HOME / WORKOUT / PROFILE */
          <View style={{ flex: 1 }}>

            {/* TAB 1: HOME */}
            {activeTab === 'home' && (
              <ScrollView style={styles.scroll}>
                <View style={styles.brandTitleRow}>
                  <View style={styles.logoBadgeRow}>
                    <Image source={require('./assets/worthy_logo.jpg')} style={styles.brandCustomLogo} />
                    <View style={{ marginLeft: 10 }}>
                      <Text style={styles.brandTitle}>WORTHY</Text>
                      <Text style={styles.brandSubtitle}>EXECUTIVE FITNESS</Text>
                    </View>
                  </View>
                  <TouchableOpacity style={styles.importBtnMini} onPress={() => setShowImport(true)}>
                    <Text style={styles.importBtnMiniText}>📥 CSV Import</Text>
                  </TouchableOpacity>
                </View>

                {/* KPI STAT CARDS */}
                <View style={styles.kpiGrid}>
                  <View style={[styles.kpiCard, { borderColor: '#0084FF' }]}>
                    <Text style={styles.kpiNum}>{sessions.length}</Text>
                    <Text style={styles.kpiLabel}>TOTAL WORKOUTS</Text>
                  </View>
                  <View style={[styles.kpiCard, { borderColor: '#10b981' }]}>
                    <Text style={styles.kpiNum}>{Math.round(totalVolume)} kg</Text>
                    <Text style={styles.kpiLabel}>TOTAL VOLUME</Text>
                  </View>
                  <View style={[styles.kpiCard, { borderColor: '#f59e0b' }]}>
                    <Text style={styles.kpiNum}>{totalHours} hrs</Text>
                    <Text style={styles.kpiLabel}>TIME IN GYM</Text>
                  </View>
                  <View style={[styles.kpiCard, { borderColor: '#8b5cf6' }]}>
                    <Text style={styles.kpiNum}>{exercises.filter(e => e.maxWeight > 0).length}</Text>
                    <Text style={styles.kpiLabel}>RECORD PRs</Text>
                  </View>
                </View>

                {/* PERSONAL RECORDS SPOTLIGHT */}
                <Text style={styles.sectionTitle}>🏆 Top Personal Records ({exercises.filter(e => e.maxWeight > 0).length})</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }}>
                  {exercises.filter(e => e.maxWeight > 0).map(e => (
                    <View key={e.id} style={styles.prCard}>
                      <Text style={styles.prGroup}>{e.muscleGroup ? e.muscleGroup.toUpperCase() : 'GENERAL'}</Text>
                      <Text style={styles.prName} numberOfLines={1}>{e.name}</Text>
                      <Text style={styles.prVal}>{e.maxWeight} kg <Text style={{ fontSize: 12, color: '#f59e0b' }}>x{e.maxReps}</Text></Text>
                    </View>
                  ))}
                </ScrollView>

                {/* WORKOUT HISTORY */}
                <Text style={styles.sectionTitle}>📅 Workout History ({sessions.length})</Text>
                <Text style={styles.subText}>Tap any workout session to view full details!</Text>
                
                {sessions.map(s => (
                  <TouchableOpacity key={s.id} style={styles.sessionCard} onPress={() => setSelectedPastSession(s)}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Text style={styles.sessionTitle} numberOfLines={1}>{s.title}</Text>
                      <Text style={{ color: '#0084FF', fontWeight: 'bold', fontSize: 12 }}>Details ›</Text>
                    </View>
                    <Text style={styles.sessionMeta} numberOfLines={1}>
                      {Math.round(s.totalVolumeKg)} kg volume • {s.sets ? s.sets.length : 0} sets • {s.startDate ? s.startDate.substring(0, 10) : ''}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}

            {/* TAB 2: WORKOUT */}
            {activeTab === 'workout' && (
              <ScrollView style={styles.scroll}>
                <Text style={styles.screenMainTitle}>Workout</Text>

                <TouchableOpacity style={styles.startEmptyCard} onPress={startEmptyWorkout}>
                  <Text style={styles.startEmptyText}>+ Start Empty Workout</Text>
                </TouchableOpacity>

                <View style={styles.routinesHeaderRow}>
                  <Text style={styles.routinesTitle}>Routines</Text>
                  <TouchableOpacity style={styles.newRoutineBtn} onPress={() => setShowCreateRoutine(true)}>
                    <Text style={styles.newRoutineBtnText}>📋 New Routine</Text>
                  </TouchableOpacity>
                </View>

                <Text style={styles.myRoutinesSub}>My Routines ({routines.length})</Text>

                {routines.map(r => (
                  <View key={r.id} style={styles.hevyRoutineCard}>
                    <Text style={styles.hevyRoutineName}>{r.name}</Text>
                    <Text style={styles.hevyRoutineSub} numberOfLines={2}>{r.description}</Text>

                    <TouchableOpacity style={styles.hevyStartRoutineBtn} onPress={() => startWorkoutFromRoutine(r)}>
                      <Text style={styles.hevyStartRoutineBtnText}>Start Routine</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            )}

            {/* TAB 3: PROFILE & SETTINGS */}
            {activeTab === 'profile' && (
              <ScrollView style={styles.scroll}>
                <Text style={styles.screenMainTitle}>Profile & Settings</Text>

                {/* APP LOGO HERO BANNER */}
                <View style={styles.profileHeroBanner}>
                  <Image source={require('./assets/worthy_logo.jpg')} style={styles.profileHeroLogo} />
                  <View style={{ marginLeft: 14, flex: 1 }}>
                    <Text style={styles.profileHeroTitle}>WORTHY</Text>
                    <Text style={styles.profileHeroSub}>GYM KITTEN EDITION</Text>
                  </View>
                </View>

                {/* DEFAULT REST TIMER DURATION SETTING */}
                <View style={styles.settingsBox}>
                  <Text style={styles.settingsBoxTitle}>⏱ Default Rest Timer Duration</Text>
                  <Text style={styles.subText}>Configured timer starts automatically when you check off a set!</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 8 }}>
                    {[
                      { label: '1 min', sec: 60 },
                      { label: '1.5 min', sec: 90 },
                      { label: '2 min', sec: 120 },
                      { label: '2.5 min', sec: 150 },
                      { label: '3 min', sec: 180 },
                      { label: '4 min', sec: 240 },
                      { label: '5 min', sec: 300 }
                    ].map(item => (
                      <TouchableOpacity
                        key={item.sec}
                        style={[styles.timerSettingChip, defaultRestTimerSetting === item.sec && styles.timerSettingChipActive]}
                        onPress={() => handleSaveRestTimerSetting(item.sec)}
                      >
                        <Text style={[styles.timerSettingChipText, defaultRestTimerSetting === item.sec && styles.timerSettingChipTextActive]}>
                          {item.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>

                {/* EDIT BODY MEASUREMENTS */}
                <View style={[styles.titleRow, { marginTop: 14 }]}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.sectionTitle}>👤 Body Measurements</Text>
                  </View>
                  <TouchableOpacity style={styles.actionHeaderBtn} onPress={handleOpenAddMeasurement}>
                    <Text style={styles.actionHeaderBtnText}>+ Log Entry</Text>
                  </TouchableOpacity>
                </View>

                {measurements.map(m => (
                  <View key={m.id} style={styles.measurementCardRow}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.mDate}>Logged Date: {m.date}</Text>
                      <Text style={styles.mVal}>Weight: {m.weightKg} kg | Height: {m.heightCm} cm</Text>
                      {m.bodyFat && <Text style={styles.mSub}>Body Fat: {m.bodyFat}%</Text>}
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <TouchableOpacity style={styles.editMeasurementBtn} onPress={() => handleOpenEditMeasurement(m)}>
                        <Text style={styles.editMeasurementBtnText}>✏️ Edit</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.deleteMeasurementBtn} onPress={() => handleDeleteMeasurement(m.id)}>
                        <Text style={styles.deleteMeasurementBtnText}>🗑</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}

                <TouchableOpacity style={styles.resetDangerBtn} onPress={handleResetAllData}>
                  <Text style={styles.resetDangerBtnText}>⚠️ Reset All App Data & Load 155 Exercises</Text>
                </TouchableOpacity>

                {/* 155 EXERCISES CATALOG WITH FILTERS */}
                <View style={[styles.titleRow, { marginTop: 20 }]}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.sectionTitle}>🏋️ Exercise Library ({filteredExercises.length} / 155)</Text>
                  </View>
                  <TouchableOpacity style={styles.actionHeaderBtn} onPress={() => setShowCreateExercise(true)}>
                    <Text style={styles.actionHeaderBtnText}>+ Custom</Text>
                  </TouchableOpacity>
                </View>

                <TextInput
                  style={styles.searchInput}
                  placeholder="🔍 Search 155 exercises..."
                  placeholderTextColor="#64748b"
                  value={exerciseSearch}
                  onChangeText={setExerciseSearch}
                />

                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
                  {['All', 'Chest', 'Back', 'Shoulders', 'Arms', 'Legs', 'Calves', 'Core'].map(grp => (
                    <TouchableOpacity
                      key={grp}
                      style={[styles.filterChip, selectedMuscleFilter === grp && styles.filterChipActive]}
                      onPress={() => setSelectedMuscleFilter(grp)}
                    >
                      <Text style={[styles.filterChipText, selectedMuscleFilter === grp && styles.filterChipTextActive]}>{grp}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                {filteredExercises.map(ex => (
                  <View key={ex.id} style={styles.exerciseListItem}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.exerciseItemName}>{ex.name}</Text>
                      <Text style={styles.exerciseItemMeta}>
                        {ex.equipment} • {ex.primaryMuscle || ex.muscleGroup} ({ex.musclePart || 'Overall'})
                      </Text>
                    </View>
                  </View>
                ))}
              </ScrollView>
            )}

          </View>
        )}

      </View>

      {/* FLOATING MINIMIZED WORKOUT BAR */}
      {activeSession && isWorkoutMinimized && (
        <TouchableOpacity style={styles.floatingWorkoutBar} onPress={() => setIsWorkoutMinimized(false)}>
          <Text style={styles.floatingArrow}>∧</Text>
          <View style={{ flex: 1, paddingHorizontal: 10 }}>
            <Text style={styles.floatingTitle}>🟢 Active Workout ({formatTime(workoutTimer)})</Text>
            <Text style={styles.floatingSub} numberOfLines={1}>{activeSession.title}</Text>
          </View>
          <TouchableOpacity onPress={discardWorkout}>
            <Text style={styles.floatingTrash}>🗑</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      )}

      {/* ICONIC FLOATING HEVY TAB BAR */}
      <View style={styles.hevyTabBarContainer}>
        <View style={styles.hevyTabBar}>
          <TouchableOpacity style={styles.hevyTabItem} onPress={() => setActiveTab('home')}>
            <Text style={styles.hevyTabIcon}>🏠</Text>
            <Text style={[styles.hevyTabText, activeTab === 'home' && styles.hevyTabTextActive]}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.hevyTabItem} onPress={() => setActiveTab('workout')}>
            <Text style={styles.hevyTabIcon}>🏋️</Text>
            <Text style={[styles.hevyTabText, activeTab === 'workout' && styles.hevyTabTextActive]}>Workout</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.hevyTabItem} onPress={() => setActiveTab('profile')}>
            <Text style={styles.hevyTabIcon}>👤</Text>
            <Text style={[styles.hevyTabText, activeTab === 'profile' && styles.hevyTabTextActive]}>Profile</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* MODAL: SELECT SET TYPE BOTTOM SHEET */}
      <Modal visible={showSetTypeModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.bottomSheetContainer}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>Select Set Type</Text>

            <TouchableOpacity style={styles.setTypeRow} onPress={() => applySetTypeChange('Warmup')}>
              <Text style={[styles.setTypeBadgeText, { color: '#f59e0b' }]}>W</Text>
              <Text style={styles.setTypeRowTitle}>Warm Up Set</Text>
              <Text style={styles.questionMark}>?</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.setTypeRow} onPress={() => applySetTypeChange('Normal')}>
              <Text style={[styles.setTypeBadgeText, { color: '#ffffff' }]}>1</Text>
              <Text style={styles.setTypeRowTitle}>Normal Set</Text>
              <Text style={styles.questionMark}>?</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.setTypeRow} onPress={() => applySetTypeChange('Failure')}>
              <Text style={[styles.setTypeBadgeText, { color: '#ef4444' }]}>F</Text>
              <Text style={styles.setTypeRowTitle}>Failure Set</Text>
              <Text style={styles.questionMark}>?</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.setTypeRow} onPress={() => applySetTypeChange('Drop')}>
              <Text style={[styles.setTypeBadgeText, { color: '#a855f7' }]}>D</Text>
              <Text style={styles.setTypeRowTitle}>Drop Set</Text>
              <Text style={styles.questionMark}>?</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.setTypeRow, { borderBottomWidth: 0 }]} onPress={() => applySetTypeChange('REMOVE')}>
              <Text style={[styles.setTypeBadgeText, { color: '#ef4444' }]}>✕</Text>
              <Text style={[styles.setTypeRowTitle, { color: '#ef4444' }]}>Remove Set</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.startBtn, { backgroundColor: '#334155', marginTop: 10 }]} onPress={() => setShowSetTypeModal(false)}>
              <Text style={styles.startBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* MODAL: LOG SET RPE BOTTOM SHEET */}
      <Modal visible={showRPEModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.bottomSheetContainer}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>Log Set RPE</Text>
            <Text style={styles.rpeSubtext}>
              {selectedSetForRPE ? `Set ${selectedSetForRPE.setIndex}: ${selectedSetForRPE.weightKg}kg x ${selectedSetForRPE.reps} reps` : ''}
            </Text>

            <View style={styles.rpeBigDisplay}>
              <Text style={styles.rpeBigScore}>{currentRPEValue}</Text>
              <Text style={{ color: '#94a3b8', fontSize: 12, marginTop: 4 }}>Select RPE</Text>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 14 }}>
              {['6', '7', '7.5', '8', '8.5', '9', '9.5', '10'].map(val => (
                <TouchableOpacity
                  key={val}
                  style={[styles.rpeChip, currentRPEValue === val && styles.rpeChipActive]}
                  onPress={() => setCurrentRPEValue(val)}
                >
                  <Text style={[styles.rpeChipText, currentRPEValue === val && styles.rpeChipTextActive]}>{val}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity style={styles.startBtn} onPress={saveRPEScore}>
              <Text style={styles.startBtnText}>Done ✓</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* BOTTOM SHEET: HEVY EXERCISE OPTIONS MENU */}
      <Modal visible={showExerciseMenu} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.bottomSheetContainer}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>{selectedExerciseForMenu}</Text>

            <TouchableOpacity style={styles.sheetOptionRow} onPress={() => {
              setShowExerciseMenu(false);
              setShowReorderModal(true);
            }}>
              <Text style={styles.sheetOptionIcon}>↓↑</Text>
              <Text style={styles.sheetOptionText}>Reorder Exercises</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.sheetOptionRow} onPress={() => {
              setShowExerciseMenu(false);
              setShowReplaceModal(true);
            }}>
              <Text style={styles.sheetOptionIcon}>🔄</Text>
              <Text style={styles.sheetOptionText}>Replace Exercise</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.sheetOptionRow} onPress={() => toggleExerciseSuperset(selectedExerciseForMenu)}>
              <Text style={[styles.sheetOptionIcon, { color: '#a855f7' }]}>🔗</Text>
              <Text style={[styles.sheetOptionText, { color: '#a855f7' }]}>
                {activeSession && activeSession.supersets && activeSession.supersets[selectedExerciseForMenu]
                  ? 'Unlink from Superset'
                  : '+ Add to Superset'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.sheetOptionRow} onPress={() => removeExerciseFromWorkout(selectedExerciseForMenu)}>
              <Text style={[styles.sheetOptionIcon, { color: '#ef4444' }]}>✕</Text>
              <Text style={[styles.sheetOptionText, { color: '#ef4444' }]}>Remove Exercise</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.startBtn, { backgroundColor: '#334155', marginTop: 10 }]} onPress={() => setShowExerciseMenu(false)}>
              <Text style={styles.startBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* MODAL: REORDER EXERCISES LIST */}
      <Modal visible={showReorderModal} animationType="slide">
        <SafeAreaView style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Reorder Exercises</Text>
          <Text style={styles.subText}>Use Move Up / Move Down to change 1st, 2nd, 3rd sequence</Text>
          
          <ScrollView style={{ flex: 1 }}>
            {getActiveExerciseOrder().map((exName, index) => (
              <View key={exName} style={styles.reorderRow}>
                <Text style={styles.reorderNum}>{index + 1}.</Text>
                <Text style={styles.reorderTitle} numberOfLines={1}>{exName}</Text>
                
                <View style={{ flexDirection: 'row' }}>
                  <TouchableOpacity
                    style={[styles.reorderBtn, index === 0 && { opacity: 0.3 }]}
                    onPress={() => moveExerciseInOrder(index, index - 1)}
                    disabled={index === 0}
                  >
                    <Text style={styles.reorderBtnText}>▲ Move Up</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.reorderBtn, index === getActiveExerciseOrder().length - 1 && { opacity: 0.3 }]}
                    onPress={() => moveExerciseInOrder(index, index + 1)}
                    disabled={index === getActiveExerciseOrder().length - 1}
                  >
                    <Text style={styles.reorderBtnText}>▼ Move Down</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>

          <TouchableOpacity style={styles.startBtn} onPress={() => setShowReorderModal(false)}>
            <Text style={styles.startBtnText}>Done Reordering</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </Modal>

      {/* MODAL: REPLACE EXERCISE */}
      <Modal visible={showReplaceModal} animationType="slide">
        <SafeAreaView style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Replace "{selectedExerciseForMenu}" With:</Text>
          <FlatList
            data={exercises}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.selectExerciseItem} onPress={() => replaceExerciseInWorkout(selectedExerciseForMenu, item.name)}>
                <Text style={styles.selectExerciseItemName}>{item.name}</Text>
                <Text style={styles.selectExerciseItemSub}>{item.equipment} • {item.primaryMuscle || item.muscleGroup}</Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity style={[styles.startBtn, { backgroundColor: '#475569', marginTop: 10 }]} onPress={() => setShowReplaceModal(false)}>
            <Text style={styles.startBtnText}>Cancel</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </Modal>

      {/* MODAL: PAST WORKOUT DETAILS */}
      <Modal visible={!!selectedPastSession} animationType="slide">
        <SafeAreaView style={styles.modalContainer}>
          {selectedPastSession && (
            <View style={{ flex: 1 }}>
              <View style={styles.titleRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.modalTitle}>{selectedPastSession.title}</Text>
                  <Text style={{ color: '#94a3b8', fontSize: 12 }}>
                    Date: {selectedPastSession.startDate ? selectedPastSession.startDate.substring(0, 10) : ''}
                  </Text>
                </View>
                <TouchableOpacity style={styles.actionHeaderBtn} onPress={() => setSelectedPastSession(null)}>
                  <Text style={styles.actionHeaderBtnText}>Close</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.kpiGrid}>
                <View style={[styles.kpiCard, { width: '31%', borderColor: '#0084FF' }]}>
                  <Text style={styles.kpiNum}>{Math.round(selectedPastSession.totalVolumeKg)} kg</Text>
                  <Text style={styles.kpiLabel}>VOLUME</Text>
                </View>
                <View style={[styles.kpiCard, { width: '31%', borderColor: '#10b981' }]}>
                  <Text style={styles.kpiNum}>{selectedPastSession.sets ? selectedPastSession.sets.length : 0}</Text>
                  <Text style={styles.kpiLabel}>SETS</Text>
                </View>
                <View style={[styles.kpiCard, { width: '31%', borderColor: '#f59e0b' }]}>
                  <Text style={styles.kpiNum}>{formatTime(selectedPastSession.durationSeconds || 2700)}</Text>
                  <Text style={styles.kpiLabel}>DURATION</Text>
                </View>
              </View>

              <Text style={[styles.sectionTitle, { marginTop: 10 }]}>Exercises & Sets Performed</Text>
              
              <ScrollView style={{ flex: 1, marginTop: 10 }}>
                {Array.from(new Set((selectedPastSession.sets || []).map(s => s.exerciseName))).map((exName, pIdx) => {
                  const exSets = (selectedPastSession.sets || []).filter(s => s.exerciseName === exName);
                  return (
                    <View key={exName} style={styles.pastExerciseCard}>
                      <Text style={styles.pastExerciseTitle}>{pIdx + 1}. {exName}</Text>
                      {exSets.map((s, idx) => (
                        <View key={idx} style={styles.pastSetRow}>
                          <Text style={{ color: '#94a3b8', width: 50, fontSize: 12, fontWeight: 'bold' }}>Set {idx + 1}</Text>
                          <Text style={{ color: '#ffffff', flex: 1, fontWeight: 'bold', fontSize: 14 }}>
                            {s.weightKg} kg × {s.reps} reps
                          </Text>
                          <Text style={{ color: '#10b981', fontWeight: 'bold', fontSize: 12 }}>✓ Done</Text>
                        </View>
                      ))}
                    </View>
                  );
                })}
              </ScrollView>
            </View>
          )}
        </SafeAreaView>
      </Modal>

      {/* MODAL: CREATE NEW ROUTINE */}
      <Modal visible={showCreateRoutine} animationType="slide">
        <SafeAreaView style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Build Custom Routine</Text>
          <ScrollView style={{ flex: 1 }}>
            <Text style={styles.inputLabel}>Routine Name (e.g. Upper Body Power)</Text>
            <TextInput style={styles.input} value={newRoutineName} onChangeText={setNewRoutineName} placeholder="Routine Name" placeholderTextColor="#64748b" />

            <Text style={styles.inputLabel}>Category</Text>
            <View style={styles.chipRow}>
              {['Push', 'Pull', 'Legs', 'Upper', 'Lower', 'Custom'].map(cat => (
                <TouchableOpacity
                  key={cat}
                  style={[styles.chip, newRoutineCategory === cat && styles.chipActive]}
                  onPress={() => setNewRoutineCategory(cat)}
                >
                  <Text style={[styles.chipText, newRoutineCategory === cat && styles.chipTextActive]}>{cat}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.inputLabel}>Routine Exercises ({routineItems.length})</Text>
            {routineItems.map((item, idx) => (
              <View key={idx} style={styles.routineItemRow}>
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>{idx + 1}. {item.exerciseName}</Text>
                <Text style={{ color: '#94a3b8', fontSize: 12 }}>3 sets × 10 reps @ {item.targetWeight}kg</Text>
              </View>
            ))}

            <TouchableOpacity style={styles.addExerciseBlueBtn} onPress={() => setShowSelectExerciseForRoutine(true)}>
              <Text style={styles.addExerciseBlueBtnText}>+ Add Exercise to Routine</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.startBtn} onPress={handleSaveNewRoutine}>
              <Text style={styles.startBtnText}>Save Routine</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.startBtn, { backgroundColor: '#475569', marginTop: 10 }]} onPress={() => setShowCreateRoutine(false)}>
              <Text style={styles.startBtnText}>Cancel</Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* MODAL: CREATE CUSTOM EXERCISE */}
      <Modal visible={showCreateExercise} animationType="slide">
        <SafeAreaView style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Create Custom Exercise</Text>
          <Text style={styles.inputLabel}>Exercise Name (e.g. Incline Dumbbell Press)</Text>
          <TextInput style={styles.input} value={newExName} onChangeText={setNewExName} placeholder="Exercise Name" placeholderTextColor="#64748b" />

          <Text style={styles.inputLabel}>Target Muscle Region (e.g. Upper Chest, Side Delts)</Text>
          <TextInput style={styles.input} value={newExPart} onChangeText={setNewExPart} placeholder="Muscle Region" placeholderTextColor="#64748b" />

          <Text style={styles.inputLabel}>Muscle Group</Text>
          <View style={styles.chipRow}>
            {['Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Calves', 'Core'].map(grp => (
              <TouchableOpacity
                key={grp}
                style={[styles.chip, newExGroup === grp && styles.chipActive]}
                onPress={() => setNewExGroup(grp)}
              >
                <Text style={[styles.chipText, newExGroup === grp && styles.chipTextActive]}>{grp}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.startBtn} onPress={handleSaveCustomExercise}>
            <Text style={styles.startBtnText}>Save Exercise</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.startBtn, { backgroundColor: '#475569', marginTop: 10 }]} onPress={() => setShowCreateExercise(false)}>
            <Text style={styles.startBtnText}>Cancel</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </Modal>

      {/* MODAL: SELECT EXERCISE FOR ACTIVE WORKOUT */}
      <Modal visible={showSelectExerciseForWorkout} animationType="slide">
        <SafeAreaView style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Select Exercise to Add ({midWorkoutFilteredExercises.length})</Text>

          <TextInput
            style={styles.searchInput}
            placeholder="🔍 Search exercises by name..."
            placeholderTextColor="#64748b"
            value={midWorkoutSearch}
            onChangeText={setMidWorkoutSearch}
          />

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12, maxHeight: 40 }}>
            {['All', 'Chest', 'Back', 'Shoulders', 'Arms', 'Legs', 'Calves', 'Core'].map(grp => (
              <TouchableOpacity
                key={grp}
                style={[styles.filterChip, midWorkoutMuscleFilter === grp && styles.filterChipActive]}
                onPress={() => setMidWorkoutMuscleFilter(grp)}
              >
                <Text style={[styles.filterChipText, midWorkoutMuscleFilter === grp && styles.filterChipTextActive]}>{grp}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <FlatList
            data={midWorkoutFilteredExercises}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.selectExerciseItem} onPress={() => addExerciseToActiveWorkout(item.name)}>
                <Text style={styles.selectExerciseItemName}>{item.name}</Text>
                <Text style={styles.selectExerciseItemSub}>{item.equipment} • {item.primaryMuscle || item.muscleGroup} ({item.musclePart || 'Overall'})</Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity style={[styles.startBtn, { backgroundColor: '#475569', marginTop: 10 }]} onPress={() => {
            setMidWorkoutSearch('');
            setShowSelectExerciseForWorkout(false);
          }}>
            <Text style={styles.startBtnText}>Close</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </Modal>

      {/* MODAL: SELECT EXERCISE FOR ROUTINE BUILDER */}
      <Modal visible={showSelectExerciseForRoutine} animationType="slide">
        <SafeAreaView style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Add Exercise to Routine</Text>
          <FlatList
            data={exercises}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.selectExerciseItem} onPress={() => addExerciseToRoutineBuilder(item.name)}>
                <Text style={styles.selectExerciseItemName}>{item.name}</Text>
                <Text style={styles.selectExerciseItemSub}>{item.equipment} • {item.primaryMuscle || item.muscleGroup}</Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity style={[styles.startBtn, { backgroundColor: '#475569', marginTop: 10 }]} onPress={() => setShowSelectExerciseForRoutine(false)}>
            <Text style={styles.startBtnText}>Close</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </Modal>

      {/* MODAL: HEVY / STRONG CSV IMPORT */}
      <Modal visible={showImport} animationType="slide">
        <SafeAreaView style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Import All Hevy / Strong CSV Workouts</Text>
          
          <TouchableOpacity style={styles.uploadFileBtn} onPress={handlePickCSVFile}>
            <Text style={styles.uploadFileBtnText}>📁 Upload CSV File from iPhone / iCloud</Text>
          </TouchableOpacity>

          <Text style={{ color: '#94a3b8', textAlign: 'center', marginVertical: 12, fontWeight: 'bold' }}>OR PASTE FULL CSV TEXT BELOW</Text>

          <TextInput
            style={styles.csvInput}
            multiline
            placeholder="Paste entire exported CSV text here..."
            placeholderTextColor="#64748b"
            value={csvInput}
            onChangeText={setCsvInput}
          />
          <TouchableOpacity style={styles.startBtn} onPress={handleImportTextCSV}>
            <Text style={styles.startBtnText}>Import All Workouts</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.startBtn, { backgroundColor: '#475569', marginTop: 10 }]} onPress={() => setShowImport(false)}>
            <Text style={styles.startBtnText}>Cancel</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </Modal>

      {/* MODAL: ADD / EDIT BODY MEASUREMENT */}
      <Modal visible={showAddMeasurement} animationType="slide">
        <SafeAreaView style={styles.modalContainer}>
          <Text style={styles.modalTitle}>{editingMeasurement ? 'Edit Body Measurement' : 'Log Body Measurement'}</Text>
          
          <Text style={styles.inputLabel}>Weight (kg)</Text>
          <TextInput style={styles.input} keyboardType="numeric" value={weightInput} onChangeText={setWeightInput} />

          <Text style={styles.inputLabel}>Height (cm)</Text>
          <TextInput style={styles.input} keyboardType="numeric" value={heightInput} onChangeText={setHeightInput} />

          <Text style={styles.inputLabel}>Body Fat % (Optional)</Text>
          <TextInput style={styles.input} keyboardType="numeric" value={bodyFatInput} onChangeText={setBodyFatInput} />

          <TouchableOpacity style={styles.startBtn} onPress={handleSaveMeasurement}>
            <Text style={styles.startBtnText}>{editingMeasurement ? 'Save Changes' : 'Save Entry'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.startBtn, { backgroundColor: '#475569', marginTop: 10 }]} onPress={() => {
            setShowAddMeasurement(false);
            setEditingMeasurement(null);
          }}>
            <Text style={styles.startBtnText}>Cancel</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000000' },
  header: { padding: 14, backgroundColor: '#0f172a', borderBottomWidth: 1, borderBottomColor: '#1e293b' },
  brandTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  logoBadgeRow: { flexDirection: 'row', alignItems: 'center' },
  brandCustomLogo: { width: 44, height: 44, borderRadius: 12, borderWidth: 1.5, borderColor: '#ef4444' },
  brandTitle: { fontSize: 22, fontWeight: '900', color: '#ffffff', letterSpacing: 2 },
  brandSubtitle: { fontSize: 8, fontWeight: 'bold', color: '#dc2626', letterSpacing: 1 },
  importBtnMini: { backgroundColor: '#0084FF', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  importBtnMiniText: { color: '#ffffff', fontWeight: 'bold', fontSize: 11 },

  profileHeroBanner: { backgroundColor: '#0f172a', borderRadius: 16, padding: 14, marginBottom: 16, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#1e293b' },
  profileHeroLogo: { width: 60, height: 60, borderRadius: 16, borderWidth: 2, borderColor: '#ef4444' },
  profileHeroTitle: { color: '#ffffff', fontSize: 20, fontWeight: '900', letterSpacing: 1 },
  profileHeroSub: { color: '#dc2626', fontSize: 10, fontWeight: 'bold', marginTop: 2 },
  
  hevyTopHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#0f172a', borderBottomWidth: 1, borderBottomColor: '#1e293b' },
  hevyMinimizeText: { color: '#ffffff', fontSize: 22, fontWeight: 'bold', paddingRight: 10 },
  hevyHeaderTitle: { color: '#ffffff', fontSize: 17, fontWeight: 'bold', flex: 1 },
  hevyFinishPill: { backgroundColor: '#0084FF', paddingHorizontal: 16, paddingVertical: 6, borderRadius: 16 },
  hevyFinishPillText: { color: '#ffffff', fontWeight: 'bold', fontSize: 13 },

  content: { flex: 1 },
  scroll: { padding: 14 },
  screenMainTitle: { fontSize: 28, fontWeight: '900', color: '#ffffff', marginBottom: 14 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  actionHeaderBtn: { backgroundColor: '#0084FF', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  actionHeaderBtnText: { color: '#ffffff', fontWeight: 'bold', fontSize: 12 },
  
  resetDangerBtn: { backgroundColor: '#1e293b', borderWidth: 1, borderColor: '#ef4444', padding: 12, borderRadius: 12, alignItems: 'center', marginBottom: 16 },
  resetDangerBtnText: { color: '#ef4444', fontWeight: 'bold', fontSize: 12 },

  settingsBox: { backgroundColor: '#0f172a', padding: 14, borderRadius: 14, marginBottom: 14, borderWidth: 1, borderColor: '#1e293b' },
  settingsBoxTitle: { color: '#ffffff', fontSize: 15, fontWeight: 'bold', marginBottom: 2 },
  timerSettingChip: { backgroundColor: '#1e293b', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12, marginRight: 8 },
  timerSettingChipActive: { backgroundColor: '#0084FF' },
  timerSettingChipText: { color: '#94a3b8', fontSize: 12, fontWeight: 'bold' },
  timerSettingChipTextActive: { color: '#ffffff' },

  startEmptyCard: { backgroundColor: '#0f172a', padding: 16, borderRadius: 12, marginBottom: 20, alignItems: 'center', borderWidth: 1, borderColor: '#1e293b' },
  startEmptyText: { color: '#ffffff', fontSize: 15, fontWeight: 'bold' },
  routinesHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  routinesTitle: { fontSize: 18, fontWeight: 'bold', color: '#ffffff' },
  newRoutineBtn: { backgroundColor: '#1e293b', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  newRoutineBtnText: { color: '#ffffff', fontSize: 12, fontWeight: 'bold' },
  myRoutinesSub: { color: '#94a3b8', fontSize: 12, marginBottom: 12 },
  hevyRoutineCard: { backgroundColor: '#0f172a', padding: 16, borderRadius: 14, marginBottom: 12, borderWidth: 1, borderColor: '#1e293b' },
  hevyRoutineName: { color: '#ffffff', fontSize: 17, fontWeight: 'bold', marginBottom: 4 },
  hevyRoutineSub: { color: '#94a3b8', fontSize: 12, marginBottom: 12 },
  hevyStartRoutineBtn: { backgroundColor: '#0084FF', padding: 12, borderRadius: 10, alignItems: 'center' },
  hevyStartRoutineBtnText: { color: '#ffffff', fontWeight: 'bold', fontSize: 14 },

  kpiGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 16 },
  kpiCard: { width: '48%', backgroundColor: '#0f172a', padding: 12, borderRadius: 12, borderWidth: 1, marginBottom: 10 },
  kpiNum: { fontSize: 18, fontWeight: 'bold', color: '#ffffff' },
  kpiLabel: { fontSize: 9, fontWeight: 'bold', color: '#94a3b8', marginTop: 4 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#ffffff', marginBottom: 6 },
  subText: { color: '#94a3b8', fontSize: 11, marginBottom: 10 },
  prCard: { backgroundColor: '#0f172a', padding: 12, borderRadius: 12, marginRight: 10, width: 140, borderWidth: 1, borderColor: '#1e293b' },
  prGroup: { fontSize: 9, fontWeight: 'bold', color: '#0084FF' },
  prName: { fontSize: 13, fontWeight: 'bold', color: '#ffffff', marginVertical: 3 },
  prVal: { fontSize: 15, fontWeight: 'bold', color: '#10b981' },
  sessionCard: { backgroundColor: '#0f172a', padding: 14, borderRadius: 12, marginBottom: 10, borderWidth: 1, borderColor: '#1e293b' },
  sessionTitle: { fontSize: 15, fontWeight: 'bold', color: '#ffffff', flex: 1 },
  sessionMeta: { fontSize: 11, color: '#94a3b8', marginTop: 4 },
  
  startBtn: { backgroundColor: '#0084FF', padding: 12, borderRadius: 10, alignItems: 'center' },
  startBtnText: { color: '#ffffff', fontWeight: 'bold', fontSize: 13 },
  
  floatingWorkoutBar: { position: 'absolute', bottom: 70, left: 12, right: 12, backgroundColor: '#1e293b', borderRadius: 16, padding: 12, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#0084FF', zIndex: 99 },
  floatingArrow: { color: '#ffffff', fontSize: 18, fontWeight: 'bold' },
  floatingTitle: { color: '#10b981', fontWeight: 'bold', fontSize: 13 },
  floatingSub: { color: '#94a3b8', fontSize: 11, marginTop: 2 },
  floatingTrash: { color: '#ef4444', fontSize: 18, fontWeight: 'bold' },

  hevyTabBarContainer: { paddingHorizontal: 20, paddingBottom: 10, backgroundColor: '#000000' },
  hevyTabBar: { flexDirection: 'row', backgroundColor: '#0f172a', borderRadius: 28, paddingVertical: 10, paddingHorizontal: 16, borderWidth: 1, borderColor: '#1e293b', justifyContent: 'space-around' },
  hevyTabItem: { alignItems: 'center' },
  hevyTabIcon: { fontSize: 18 },
  hevyTabText: { fontSize: 11, color: '#94a3b8', marginTop: 2 },
  hevyTabTextActive: { color: '#0084FF', fontWeight: 'bold' },
  
  hevySummaryBar: { flexDirection: 'row', backgroundColor: '#0f172a', paddingVertical: 10, paddingHorizontal: 16, justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: '#1e293b' },
  hevyStatItem: { alignItems: 'flex-start' },
  hevyStatLabel: { fontSize: 10, color: '#94a3b8', fontWeight: 'bold' },
  hevyStatVal: { fontSize: 16, color: '#ffffff', fontWeight: 'bold', marginTop: 2 },
  
  restTimerBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1e293b', paddingHorizontal: 16, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#334155' },
  restTimerBannerTitle: { color: '#0084FF', fontSize: 9, fontWeight: '900', letterSpacing: 1 },
  restTimerBannerTime: { color: '#ffffff', fontSize: 20, fontWeight: 'bold' },
  timerAdjustBtn: { backgroundColor: '#334155', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, marginLeft: 6 },
  timerAdjustBtnText: { color: '#ffffff', fontSize: 11, fontWeight: 'bold' },

  hevyExerciseCard: { backgroundColor: '#000000', borderRadius: 14, marginBottom: 20 },
  supersetCardBorder: { borderLeftWidth: 4, borderLeftColor: '#a855f7', paddingLeft: 8 },
  supersetBadge: { backgroundColor: '#a855f7', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, marginBottom: 6 },
  supersetBadgeText: { color: '#ffffff', fontSize: 10, fontWeight: 'bold' },

  hevyCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  headerExerciseAvatar: { width: 28, height: 28, borderRadius: 8, marginRight: 8, borderWidth: 1, borderColor: '#ef4444' },
  inlineDragBox: { flexDirection: 'column', marginRight: 6, justifyContent: 'center' },
  inlineArrowBtn: { paddingHorizontal: 4, paddingVertical: 1 },
  inlineArrowText: { color: '#94a3b8', fontSize: 10, fontWeight: 'bold' },
  hevyBlueTitle: { color: '#0084FF', fontWeight: '900', fontSize: 17, flex: 1 },
  threeDotsMenu: { color: '#94a3b8', fontSize: 20, fontWeight: 'bold', paddingHorizontal: 10 },
  hevyRestTimerText: { color: '#0084FF', fontSize: 12, fontWeight: 'bold', marginBottom: 10 },
  hevyColHeaderRow: { flexDirection: 'row', marginBottom: 8, paddingHorizontal: 4 },
  colHeader: { color: '#94a3b8', fontSize: 10, fontWeight: 'bold' },
  
  hevySetRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#0f172a', padding: 8, borderRadius: 8, marginBottom: 6 },
  hevySetRowCompleted: { backgroundColor: '#064e3b' },
  setTypeBtn: { width: 40, alignItems: 'flex-start' },
  setTypeText: { color: '#ffffff', fontWeight: 'bold', fontSize: 13 },
  hevySetPrev: { color: '#94a3b8', fontSize: 12, flex: 1 },
  hevyNumInput: { backgroundColor: '#1e293b', color: '#ffffff', borderRadius: 6, width: 50, paddingHorizontal: 4, paddingVertical: 4, marginHorizontal: 2, textAlign: 'center', fontWeight: 'bold', fontSize: 13 },
  rpePillBtn: { backgroundColor: '#1e293b', paddingHorizontal: 6, paddingVertical: 5, borderRadius: 6, width: 45, alignItems: 'center', marginHorizontal: 2 },
  rpePillBtnText: { color: '#94a3b8', fontSize: 9, fontWeight: 'bold' },
  hevyCheckPill: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#334155', alignItems: 'center', justifyContent: 'center', marginLeft: 4 },
  hevyCheckPillActive: { backgroundColor: '#10b981' },
  hevyCheckPillText: { color: '#ffffff', fontWeight: 'bold', fontSize: 14 },

  addSetFullBtn: { backgroundColor: '#1e293b', padding: 12, borderRadius: 10, alignItems: 'center', marginTop: 6 },
  addSetFullBtnText: { color: '#ffffff', fontWeight: 'bold', fontSize: 13 },
  
  addExerciseBlueBtn: { backgroundColor: '#0084FF', padding: 14, borderRadius: 12, alignItems: 'center', marginVertical: 10 },
  addExerciseBlueBtnText: { color: '#ffffff', fontWeight: 'bold', fontSize: 14 },
  workoutFooterActions: { marginBottom: 30 },
  discardBtn: { backgroundColor: '#1e293b', padding: 12, borderRadius: 10, alignItems: 'center' },
  discardBtnText: { color: '#ef4444', fontWeight: 'bold', fontSize: 13 },

  prBanner: { position: 'absolute', top: 50, left: 14, right: 14, backgroundColor: '#8b5cf6', padding: 12, borderRadius: 12, zIndex: 100 },
  prTitle: { color: '#fef08a', fontWeight: '900', fontSize: 11 },
  prBody: { color: '#ffffff', fontWeight: 'bold', fontSize: 14, marginTop: 2 },
  
  measurementCardRow: { backgroundColor: '#0f172a', padding: 14, borderRadius: 12, marginBottom: 8, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#1e293b' },
  mDate: { color: '#0084FF', fontSize: 11, fontWeight: 'bold' },
  mVal: { color: '#ffffff', fontSize: 14, fontWeight: 'bold', marginTop: 2 },
  mSub: { color: '#94a3b8', fontSize: 11, marginTop: 2 },
  editMeasurementBtn: { backgroundColor: '#1e293b', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, marginRight: 6 },
  editMeasurementBtnText: { color: '#3b82f6', fontSize: 11, fontWeight: 'bold' },
  deleteMeasurementBtn: { backgroundColor: '#1e293b', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  deleteMeasurementBtnText: { color: '#ef4444', fontSize: 11, fontWeight: 'bold' },

  modalContainer: { flex: 1, backgroundColor: '#000000', padding: 16 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#ffffff', marginBottom: 4 },
  csvInput: { backgroundColor: '#0f172a', color: '#ffffff', padding: 12, borderRadius: 12, height: 160, marginBottom: 16, textAlignVertical: 'top' },
  uploadFileBtn: { backgroundColor: '#0084FF', padding: 16, borderRadius: 12, alignItems: 'center', marginBottom: 10 },
  uploadFileBtnText: { color: '#ffffff', fontWeight: 'bold', fontSize: 14 },
  inputLabel: { color: '#94a3b8', fontSize: 11, marginBottom: 4, marginTop: 10 },
  input: { backgroundColor: '#0f172a', color: '#ffffff', padding: 10, borderRadius: 8, fontSize: 15, marginBottom: 10 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 10 },
  chip: { backgroundColor: '#0f172a', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, marginRight: 6, marginBottom: 6 },
  chipActive: { backgroundColor: '#0084FF' },
  chipText: { color: '#94a3b8', fontSize: 12, fontWeight: 'bold' },
  chipTextActive: { color: '#ffffff' },

  searchInput: { backgroundColor: '#0f172a', color: '#ffffff', padding: 12, borderRadius: 12, fontSize: 14, marginBottom: 10, borderWidth: 1, borderColor: '#1e293b' },
  filterChip: { backgroundColor: '#0f172a', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 16, marginRight: 6, borderWidth: 1, borderColor: '#1e293b' },
  filterChipActive: { backgroundColor: '#0084FF', borderColor: '#0084FF' },
  filterChipText: { color: '#94a3b8', fontSize: 12, fontWeight: 'bold' },
  filterChipTextActive: { color: '#ffffff' },

  exerciseListItem: { backgroundColor: '#0f172a', padding: 12, borderRadius: 10, marginBottom: 8, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#1e293b' },
  exerciseItemName: { color: '#ffffff', fontWeight: 'bold', fontSize: 14 },
  exerciseItemMeta: { color: '#94a3b8', fontSize: 11, marginTop: 2 },
  selectExerciseItem: { backgroundColor: '#0f172a', padding: 14, borderRadius: 10, marginBottom: 8 },
  selectExerciseItemName: { color: '#ffffff', fontWeight: 'bold', fontSize: 15 },
  selectExerciseItemSub: { color: '#94a3b8', fontSize: 12, marginTop: 2 },
  routineItemRow: { backgroundColor: '#0f172a', padding: 10, borderRadius: 8, marginBottom: 6 },

  pastExerciseCard: { backgroundColor: '#0f172a', padding: 14, borderRadius: 12, marginBottom: 10, borderWidth: 1, borderColor: '#1e293b' },
  pastExerciseTitle: { color: '#0084FF', fontWeight: 'bold', fontSize: 16, marginBottom: 8 },
  pastSetRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 4, borderBottomWidth: 1, borderBottomColor: '#1e293b' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  bottomSheetContainer: { backgroundColor: '#0f172a', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, borderTopWidth: 1, borderTopColor: '#1e293b' },
  sheetHandle: { width: 40, height: 4, backgroundColor: '#334155', borderRadius: 2, alignSelf: 'center', marginBottom: 14 },
  sheetTitle: { color: '#ffffff', fontWeight: 'bold', fontSize: 17, marginBottom: 16, textAlign: 'center' },
  sheetOptionRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#1e293b' },
  sheetOptionIcon: { color: '#ffffff', fontSize: 18, width: 34, fontWeight: 'bold' },
  sheetOptionText: { color: '#ffffff', fontSize: 15, fontWeight: '600' },

  setTypeRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#1e293b' },
  setTypeBadgeText: { fontSize: 18, fontWeight: 'bold', width: 40, textAlign: 'center' },
  setTypeRowTitle: { color: '#ffffff', fontSize: 16, fontWeight: 'bold', flex: 1 },
  questionMark: { color: '#64748b', fontSize: 16, fontWeight: 'bold' },

  rpeSubtext: { color: '#94a3b8', fontSize: 12, textAlign: 'center', marginBottom: 10 },
  rpeBigDisplay: { backgroundColor: '#1e293b', padding: 20, borderRadius: 16, alignItems: 'center', marginVertical: 10 },
  rpeBigScore: { color: '#0084FF', fontSize: 36, fontWeight: '900' },
  rpeChip: { backgroundColor: '#1e293b', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, marginRight: 8 },
  rpeChipActive: { backgroundColor: '#0084FF' },
  rpeChipText: { color: '#94a3b8', fontSize: 14, fontWeight: 'bold' },
  rpeChipTextActive: { color: '#ffffff' },

  reorderRow: { backgroundColor: '#0f172a', padding: 12, borderRadius: 12, marginBottom: 10, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#1e293b' },
  reorderNum: { color: '#0084FF', fontSize: 16, fontWeight: 'bold', width: 30 },
  reorderTitle: { color: '#ffffff', fontSize: 15, fontWeight: 'bold', flex: 1 },
  reorderBtn: { backgroundColor: '#1e293b', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6, marginLeft: 6 },
  reorderBtnText: { color: '#ffffff', fontSize: 11, fontWeight: 'bold' }
});
