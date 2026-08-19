import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  USER: 'gymfit_user',
  EXERCISES: 'gymfit_exercises',
  ROUTINES: 'gymfit_routines',
  SESSIONS: 'gymfit_sessions',
  MEASUREMENTS: 'gymfit_measurements'
};

export const ALL_155_EXERCISES = [
  // CHEST (1 - 20)
  { id: 'ex_1', name: 'Barbell Bench Press', equipment: 'Barbell', muscleGroup: 'Chest', primaryMuscle: 'Chest', musclePart: 'Mid chest', secondaryMuscles: 'Triceps, Anterior deltoids', isCompound: true },
  { id: 'ex_2', name: 'Incline Barbell Bench Press', equipment: 'Barbell', muscleGroup: 'Chest', primaryMuscle: 'Chest', musclePart: 'Upper chest', secondaryMuscles: 'Triceps, Anterior deltoids', isCompound: true },
  { id: 'ex_3', name: 'Decline Barbell Bench Press', equipment: 'Barbell', muscleGroup: 'Chest', primaryMuscle: 'Chest', musclePart: 'Lower chest', secondaryMuscles: 'Triceps, Anterior deltoids', isCompound: true },
  { id: 'ex_4', name: 'Smith Machine Bench Press', equipment: 'Smith', muscleGroup: 'Chest', primaryMuscle: 'Chest', musclePart: 'Mid chest', secondaryMuscles: 'Triceps, Anterior deltoids', isCompound: true },
  { id: 'ex_5', name: 'Smith Machine Incline Press', equipment: 'Smith', muscleGroup: 'Chest', primaryMuscle: 'Chest', musclePart: 'Upper chest', secondaryMuscles: 'Triceps, Anterior deltoids', isCompound: true },
  { id: 'ex_6', name: 'Smith Machine Decline Press', equipment: 'Smith', muscleGroup: 'Chest', primaryMuscle: 'Chest', musclePart: 'Lower chest', secondaryMuscles: 'Triceps, Anterior deltoids', isCompound: true },
  { id: 'ex_7', name: 'Dumbbell Bench Press', equipment: 'Dumbbell', muscleGroup: 'Chest', primaryMuscle: 'Chest', musclePart: 'Mid chest', secondaryMuscles: 'Triceps, Anterior deltoids', isCompound: true },
  { id: 'ex_8', name: 'Incline Dumbbell Press', equipment: 'Dumbbell', muscleGroup: 'Chest', primaryMuscle: 'Chest', musclePart: 'Upper chest', secondaryMuscles: 'Triceps, Anterior deltoids', isCompound: true },
  { id: 'ex_9', name: 'Decline Dumbbell Press', equipment: 'Dumbbell', muscleGroup: 'Chest', primaryMuscle: 'Chest', musclePart: 'Lower chest', secondaryMuscles: 'Triceps, Anterior deltoids', isCompound: true },
  { id: 'ex_10', name: 'Dumbbell Fly', equipment: 'Dumbbell', muscleGroup: 'Chest', primaryMuscle: 'Chest', musclePart: 'Overall chest', secondaryMuscles: 'Anterior deltoids', isCompound: false },
  { id: 'ex_11', name: 'Incline Dumbbell Fly', equipment: 'Dumbbell', muscleGroup: 'Chest', primaryMuscle: 'Chest', musclePart: 'Upper chest', secondaryMuscles: 'Anterior deltoids', isCompound: false },
  { id: 'ex_12', name: 'Cable Chest Fly', equipment: 'Cable', muscleGroup: 'Chest', primaryMuscle: 'Chest', musclePart: 'Overall chest', secondaryMuscles: 'Anterior deltoids', isCompound: false },
  { id: 'ex_13', name: 'Low-to-High Cable Fly', equipment: 'Cable', muscleGroup: 'Chest', primaryMuscle: 'Chest', musclePart: 'Upper chest', secondaryMuscles: 'Anterior deltoids', isCompound: false },
  { id: 'ex_14', name: 'High-to-Low Cable Fly', equipment: 'Cable', muscleGroup: 'Chest', primaryMuscle: 'Chest', musclePart: 'Lower chest', secondaryMuscles: 'Anterior deltoids', isCompound: false },
  { id: 'ex_15', name: 'Machine Chest Press', equipment: 'Machine', muscleGroup: 'Chest', primaryMuscle: 'Chest', musclePart: 'Mid chest', secondaryMuscles: 'Triceps', isCompound: true },
  { id: 'ex_16', name: 'Incline Chest Press Machine', equipment: 'Machine', muscleGroup: 'Chest', primaryMuscle: 'Chest', musclePart: 'Upper chest', secondaryMuscles: 'Triceps', isCompound: true },
  { id: 'ex_17', name: 'Pec Deck Fly', equipment: 'Machine', muscleGroup: 'Chest', primaryMuscle: 'Chest', musclePart: 'Mid/inner chest', secondaryMuscles: 'Anterior deltoids', isCompound: false },
  { id: 'ex_18', name: 'Push-Ups', equipment: 'Bodyweight', muscleGroup: 'Chest', primaryMuscle: 'Chest', musclePart: 'Overall chest', secondaryMuscles: 'Triceps, Core', isCompound: true },
  { id: 'ex_19', name: 'Weighted Dips', equipment: 'Bodyweight', muscleGroup: 'Chest', primaryMuscle: 'Chest', musclePart: 'Lower chest', secondaryMuscles: 'Triceps', isCompound: true },
  { id: 'ex_20', name: 'Chest Press Plate-Loaded', equipment: 'Machine', muscleGroup: 'Chest', primaryMuscle: 'Chest', musclePart: 'Mid chest', secondaryMuscles: 'Triceps', isCompound: true },

  // BACK (21 - 45)
  { id: 'ex_21', name: 'Barbell Bent-Over Row', equipment: 'Barbell', muscleGroup: 'Back', primaryMuscle: 'Back', musclePart: 'Mid back', secondaryMuscles: 'Biceps, Rear delts, Forearms', isCompound: true },
  { id: 'ex_22', name: 'Pendlay Row', equipment: 'Barbell', muscleGroup: 'Back', primaryMuscle: 'Back', musclePart: 'Mid/upper back', secondaryMuscles: 'Biceps, Latissimus', isCompound: true },
  { id: 'ex_23', name: 'Underhand Barbell Row', equipment: 'Barbell', muscleGroup: 'Back', primaryMuscle: 'Back', musclePart: 'Lats', secondaryMuscles: 'Biceps', isCompound: true },
  { id: 'ex_24', name: 'Wide-Grip Barbell Row', equipment: 'Barbell', muscleGroup: 'Back', primaryMuscle: 'Back', musclePart: 'Upper back', secondaryMuscles: 'Rear delts', isCompound: true },
  { id: 'ex_25', name: 'T-Bar Row', equipment: 'Barbell', muscleGroup: 'Back', primaryMuscle: 'Back', musclePart: 'Mid back', secondaryMuscles: 'Biceps, Traps', isCompound: true },
  { id: 'ex_26', name: 'Landmine Row', equipment: 'Barbell', muscleGroup: 'Back', primaryMuscle: 'Back', musclePart: 'Lats/mid back', secondaryMuscles: 'Biceps', isCompound: true },
  { id: 'ex_27', name: 'Smith Machine Bent-Over Row', equipment: 'Smith', muscleGroup: 'Back', primaryMuscle: 'Back', musclePart: 'Mid back', secondaryMuscles: 'Biceps', isCompound: true },
  { id: 'ex_28', name: 'Smith Machine Row', equipment: 'Smith', muscleGroup: 'Back', primaryMuscle: 'Back', musclePart: 'Upper/mid back', secondaryMuscles: 'Biceps', isCompound: true },
  { id: 'ex_29', name: 'Smith Machine Meadows Row', equipment: 'Smith', muscleGroup: 'Back', primaryMuscle: 'Back', musclePart: 'Upper back/lats', secondaryMuscles: 'Rear delts', isCompound: true },
  { id: 'ex_30', name: 'Conventional Deadlift', equipment: 'Barbell', muscleGroup: 'Back', primaryMuscle: 'Back', musclePart: 'Lower back', secondaryMuscles: 'Glutes, Hamstrings, Traps', isCompound: true },
  { id: 'ex_31', name: 'Sumo Deadlift', equipment: 'Barbell', muscleGroup: 'Back', primaryMuscle: 'Back', musclePart: 'Lower back', secondaryMuscles: 'Quads, Glutes', isCompound: true },
  { id: 'ex_32', name: 'Romanian Deadlift', equipment: 'Barbell', muscleGroup: 'Back', primaryMuscle: 'Hamstrings', musclePart: 'Posterior chain', secondaryMuscles: 'Glutes, Lower back', isCompound: true },
  { id: 'ex_33', name: 'Rack Pull', equipment: 'Barbell', muscleGroup: 'Back', primaryMuscle: 'Back', musclePart: 'Upper/lower back', secondaryMuscles: 'Traps', isCompound: true },
  { id: 'ex_34', name: 'Barbell Shrug', equipment: 'Barbell', muscleGroup: 'Back', primaryMuscle: 'Traps', musclePart: 'Upper traps', secondaryMuscles: 'Forearms', isCompound: false },
  { id: 'ex_35', name: 'Smith Machine Shrug', equipment: 'Smith', muscleGroup: 'Back', primaryMuscle: 'Traps', musclePart: 'Upper traps', secondaryMuscles: 'Forearms', isCompound: false },
  { id: 'ex_36', name: 'Pull-Ups', equipment: 'Bodyweight', muscleGroup: 'Back', primaryMuscle: 'Lats', musclePart: 'Upper lats', secondaryMuscles: 'Biceps', isCompound: true },
  { id: 'ex_37', name: 'Chin-Ups', equipment: 'Bodyweight', muscleGroup: 'Back', primaryMuscle: 'Lats', musclePart: 'Lower/overall lats', secondaryMuscles: 'Biceps', isCompound: true },
  { id: 'ex_38', name: 'Lat Pulldown', equipment: 'Cable', muscleGroup: 'Back', primaryMuscle: 'Lats', musclePart: 'Overall lats', secondaryMuscles: 'Biceps', isCompound: true },
  { id: 'ex_39', name: 'Wide-Grip Lat Pulldown', equipment: 'Cable', muscleGroup: 'Back', primaryMuscle: 'Lats', musclePart: 'Upper lats', secondaryMuscles: 'Biceps', isCompound: true },
  { id: 'ex_40', name: 'Close-Grip Lat Pulldown', equipment: 'Cable', muscleGroup: 'Back', primaryMuscle: 'Lats', musclePart: 'Lower lats', secondaryMuscles: 'Biceps', isCompound: true },
  { id: 'ex_41', name: 'Seated Cable Row', equipment: 'Cable', muscleGroup: 'Back', primaryMuscle: 'Back', musclePart: 'Mid back', secondaryMuscles: 'Biceps', isCompound: true },
  { id: 'ex_42', name: 'Close-Grip Cable Row', equipment: 'Cable', muscleGroup: 'Back', primaryMuscle: 'Back', musclePart: 'Mid/lower back', secondaryMuscles: 'Biceps', isCompound: true },
  { id: 'ex_43', name: 'Single-Arm Cable Row', equipment: 'Cable', muscleGroup: 'Back', primaryMuscle: 'Lats', musclePart: 'Individual lat', secondaryMuscles: 'Biceps', isCompound: true },
  { id: 'ex_44', name: 'Chest-Supported Row', equipment: 'Machine', muscleGroup: 'Back', primaryMuscle: 'Back', musclePart: 'Mid back', secondaryMuscles: 'Biceps, Rear delts', isCompound: true },
  { id: 'ex_45', name: 'Machine High Row', equipment: 'Machine', muscleGroup: 'Back', primaryMuscle: 'Back', musclePart: 'Upper back/lats', secondaryMuscles: 'Biceps', isCompound: true },

  // SHOULDERS (46 - 65)
  { id: 'ex_46', name: 'Barbell Overhead Press', equipment: 'Barbell', muscleGroup: 'Shoulders', primaryMuscle: 'Shoulders', musclePart: 'Front delts', secondaryMuscles: 'Triceps, Upper traps', isCompound: true },
  { id: 'ex_47', name: 'Barbell Military Press', equipment: 'Barbell', muscleGroup: 'Shoulders', primaryMuscle: 'Shoulders', musclePart: 'Front delts', secondaryMuscles: 'Triceps', isCompound: true },
  { id: 'ex_48', name: 'Seated Barbell Shoulder Press', equipment: 'Barbell', muscleGroup: 'Shoulders', primaryMuscle: 'Shoulders', musclePart: 'Front delts', secondaryMuscles: 'Triceps', isCompound: true },
  { id: 'ex_49', name: 'Behind-the-Neck Press', equipment: 'Barbell', muscleGroup: 'Shoulders', primaryMuscle: 'Shoulders', musclePart: 'Front/side delts', secondaryMuscles: 'Triceps', isCompound: true },
  { id: 'ex_50', name: 'Smith Machine Shoulder Press', equipment: 'Smith', muscleGroup: 'Shoulders', primaryMuscle: 'Shoulders', musclePart: 'Front delts', secondaryMuscles: 'Triceps', isCompound: true },
  { id: 'ex_51', name: 'Smith Machine Behind-Neck Press', equipment: 'Smith', muscleGroup: 'Shoulders', primaryMuscle: 'Shoulders', musclePart: 'Delts', secondaryMuscles: 'Triceps', isCompound: true },
  { id: 'ex_52', name: 'Dumbbell Shoulder Press', equipment: 'Dumbbell', muscleGroup: 'Shoulders', primaryMuscle: 'Shoulders', musclePart: 'Front delts', secondaryMuscles: 'Triceps', isCompound: true },
  { id: 'ex_53', name: 'Arnold Press', equipment: 'Dumbbell', muscleGroup: 'Shoulders', primaryMuscle: 'Shoulders', musclePart: 'Front/side delts', secondaryMuscles: 'Triceps', isCompound: true },
  { id: 'ex_54', name: 'Dumbbell Lateral Raise', equipment: 'Dumbbell', muscleGroup: 'Shoulders', primaryMuscle: 'Shoulders', musclePart: 'Side delts', secondaryMuscles: 'Upper traps', isCompound: false },
  { id: 'ex_55', name: 'Cable Lateral Raise', equipment: 'Cable', muscleGroup: 'Shoulders', primaryMuscle: 'Shoulders', musclePart: 'Side delts', secondaryMuscles: 'Upper traps', isCompound: false },
  { id: 'ex_56', name: 'Machine Lateral Raise', equipment: 'Machine', muscleGroup: 'Shoulders', primaryMuscle: 'Shoulders', musclePart: 'Side delts', secondaryMuscles: 'Upper traps', isCompound: false },
  { id: 'ex_57', name: 'Leaning Cable Lateral Raise', equipment: 'Cable', muscleGroup: 'Shoulders', primaryMuscle: 'Shoulders', musclePart: 'Side delts', secondaryMuscles: 'Upper traps', isCompound: false },
  { id: 'ex_58', name: 'Front Plate Raise', equipment: 'Plate', muscleGroup: 'Shoulders', primaryMuscle: 'Shoulders', musclePart: 'Front delts', secondaryMuscles: 'Upper chest', isCompound: false },
  { id: 'ex_59', name: 'Dumbbell Front Raise', equipment: 'Dumbbell', muscleGroup: 'Shoulders', primaryMuscle: 'Shoulders', musclePart: 'Front delts', secondaryMuscles: 'Upper chest', isCompound: false },
  { id: 'ex_60', name: 'Cable Front Raise', equipment: 'Cable', muscleGroup: 'Shoulders', primaryMuscle: 'Shoulders', musclePart: 'Front delts', secondaryMuscles: 'Upper chest', isCompound: false },
  { id: 'ex_61', name: 'Reverse Pec Deck', equipment: 'Machine', muscleGroup: 'Shoulders', primaryMuscle: 'Rear delts', musclePart: 'Rear delts', secondaryMuscles: 'Upper back', isCompound: false },
  { id: 'ex_62', name: 'Cable Rear Delt Fly', equipment: 'Cable', muscleGroup: 'Shoulders', primaryMuscle: 'Rear delts', musclePart: 'Rear delts', secondaryMuscles: 'Upper back', isCompound: false },
  { id: 'ex_63', name: 'Dumbbell Rear Delt Fly', equipment: 'Dumbbell', muscleGroup: 'Shoulders', primaryMuscle: 'Rear delts', musclePart: 'Rear delts', secondaryMuscles: 'Upper back', isCompound: false },
  { id: 'ex_64', name: 'Face Pull', equipment: 'Cable', muscleGroup: 'Shoulders', primaryMuscle: 'Rear delts', musclePart: 'Rear delts', secondaryMuscles: 'Upper traps', isCompound: false },
  { id: 'ex_65', name: 'Upright Row', equipment: 'Barbell', muscleGroup: 'Shoulders', primaryMuscle: 'Shoulders', musclePart: 'Side delts/traps', secondaryMuscles: 'Biceps', isCompound: true },

  // BICEPS (66 - 80)
  { id: 'ex_66', name: 'Barbell Curl', equipment: 'Barbell', muscleGroup: 'Arms', primaryMuscle: 'Biceps', musclePart: 'Overall biceps', secondaryMuscles: 'Brachialis, Forearms', isCompound: false },
  { id: 'ex_67', name: 'EZ-Bar Curl', equipment: 'EZ Bar', muscleGroup: 'Arms', primaryMuscle: 'Biceps', musclePart: 'Overall biceps', secondaryMuscles: 'Brachialis', isCompound: false },
  { id: 'ex_68', name: 'Close-Grip Barbell Curl', equipment: 'Barbell', muscleGroup: 'Arms', primaryMuscle: 'Biceps', musclePart: 'Biceps short head', secondaryMuscles: 'Forearms', isCompound: false },
  { id: 'ex_69', name: 'Wide-Grip Barbell Curl', equipment: 'Barbell', muscleGroup: 'Arms', primaryMuscle: 'Biceps', musclePart: 'Biceps short head', secondaryMuscles: 'Forearms', isCompound: false },
  { id: 'ex_70', name: 'Reverse Barbell Curl', equipment: 'Barbell', muscleGroup: 'Arms', primaryMuscle: 'Brachialis', musclePart: 'Brachialis/forearms', secondaryMuscles: 'Brachioradialis', isCompound: false },
  { id: 'ex_71', name: 'Smith Machine Curl', equipment: 'Smith', muscleGroup: 'Arms', primaryMuscle: 'Biceps', musclePart: 'Overall biceps', secondaryMuscles: 'Forearms', isCompound: false },
  { id: 'ex_72', name: 'Dumbbell Curl', equipment: 'Dumbbell', muscleGroup: 'Arms', primaryMuscle: 'Biceps', musclePart: 'Overall biceps', secondaryMuscles: 'Forearms', isCompound: false },
  { id: 'ex_73', name: 'Alternating Dumbbell Curl', equipment: 'Dumbbell', muscleGroup: 'Arms', primaryMuscle: 'Biceps', musclePart: 'Overall biceps', secondaryMuscles: 'Forearms', isCompound: false },
  { id: 'ex_74', name: 'Hammer Curl', equipment: 'Dumbbell', muscleGroup: 'Arms', primaryMuscle: 'Brachialis', musclePart: 'Brachialis', secondaryMuscles: 'Brachioradialis', isCompound: false },
  { id: 'ex_75', name: 'Cross-Body Hammer Curl', equipment: 'Dumbbell', muscleGroup: 'Arms', primaryMuscle: 'Brachialis', musclePart: 'Brachialis', secondaryMuscles: 'Forearms', isCompound: false },
  { id: 'ex_76', name: 'Incline Dumbbell Curl', equipment: 'Dumbbell', muscleGroup: 'Arms', primaryMuscle: 'Biceps', musclePart: 'Long head', secondaryMuscles: 'Brachialis', isCompound: false },
  { id: 'ex_77', name: 'Preacher Curl', equipment: 'EZ/Dumbbell', muscleGroup: 'Arms', primaryMuscle: 'Biceps', musclePart: 'Short head', secondaryMuscles: 'Brachialis', isCompound: false },
  { id: 'ex_78', name: 'Cable Curl', equipment: 'Cable', muscleGroup: 'Arms', primaryMuscle: 'Biceps', musclePart: 'Overall biceps', secondaryMuscles: 'Forearms', isCompound: false },
  { id: 'ex_79', name: 'Bayesian Cable Curl', equipment: 'Cable', muscleGroup: 'Arms', primaryMuscle: 'Biceps', musclePart: 'Long head', secondaryMuscles: 'Forearms', isCompound: false },
  { id: 'ex_80', name: 'Concentration Curl', equipment: 'Dumbbell', muscleGroup: 'Arms', primaryMuscle: 'Biceps', musclePart: 'Short head', secondaryMuscles: 'Brachialis', isCompound: false },

  // TRICEPS (81 - 95)
  { id: 'ex_81', name: 'Close-Grip Bench Press', equipment: 'Barbell', muscleGroup: 'Arms', primaryMuscle: 'Triceps', musclePart: 'Overall triceps', secondaryMuscles: 'Chest, Anterior delts', isCompound: true },
  { id: 'ex_82', name: 'Smith Machine Close-Grip Bench Press', equipment: 'Smith', muscleGroup: 'Arms', primaryMuscle: 'Triceps', musclePart: 'Overall triceps', secondaryMuscles: 'Chest', isCompound: true },
  { id: 'ex_83', name: 'Skull Crushers', equipment: 'EZ Bar', muscleGroup: 'Arms', primaryMuscle: 'Triceps', musclePart: 'Overall triceps', secondaryMuscles: 'Forearms', isCompound: false },
  { id: 'ex_84', name: 'Barbell Overhead Triceps Extension', equipment: 'Barbell', muscleGroup: 'Arms', primaryMuscle: 'Triceps', musclePart: 'Long head', secondaryMuscles: 'Shoulders', isCompound: false },
  { id: 'ex_85', name: 'Smith Machine JM Press', equipment: 'Smith', muscleGroup: 'Arms', primaryMuscle: 'Triceps', musclePart: 'Overall triceps', secondaryMuscles: 'Chest', isCompound: true },
  { id: 'ex_86', name: 'JM Press', equipment: 'Barbell', muscleGroup: 'Arms', primaryMuscle: 'Triceps', musclePart: 'Overall triceps', secondaryMuscles: 'Chest', isCompound: true },
  { id: 'ex_87', name: 'Dumbbell Overhead Extension', equipment: 'Dumbbell', muscleGroup: 'Arms', primaryMuscle: 'Triceps', musclePart: 'Long head', secondaryMuscles: 'Shoulders', isCompound: false },
  { id: 'ex_88', name: 'Single-Arm Overhead Extension', equipment: 'Dumbbell', muscleGroup: 'Arms', primaryMuscle: 'Triceps', musclePart: 'Long head', secondaryMuscles: 'Shoulders', isCompound: false },
  { id: 'ex_89', name: 'Cable Triceps Pushdown', equipment: 'Cable', muscleGroup: 'Arms', primaryMuscle: 'Triceps', musclePart: 'Lateral/medial heads', secondaryMuscles: 'Forearms', isCompound: false },
  { id: 'ex_90', name: 'Rope Pushdown', equipment: 'Cable', muscleGroup: 'Arms', primaryMuscle: 'Triceps', musclePart: 'Lateral/medial heads', secondaryMuscles: 'Forearms', isCompound: false },
  { id: 'ex_91', name: 'Reverse-Grip Pushdown', equipment: 'Cable', muscleGroup: 'Arms', primaryMuscle: 'Triceps', musclePart: 'Medial head', secondaryMuscles: 'Forearms', isCompound: false },
  { id: 'ex_92', name: 'Single-Arm Cable Pushdown', equipment: 'Cable', muscleGroup: 'Arms', primaryMuscle: 'Triceps', musclePart: 'Lateral/medial heads', secondaryMuscles: 'Forearms', isCompound: false },
  { id: 'ex_93', name: 'Cable Overhead Extension', equipment: 'Cable', muscleGroup: 'Arms', primaryMuscle: 'Triceps', musclePart: 'Long head', secondaryMuscles: 'Shoulders', isCompound: false },
  { id: 'ex_94', name: 'Triceps Dips', equipment: 'Bodyweight', muscleGroup: 'Arms', primaryMuscle: 'Triceps', musclePart: 'Overall triceps', secondaryMuscles: 'Chest, Shoulders', isCompound: true },
  { id: 'ex_95', name: 'Bench Dips', equipment: 'Bodyweight', muscleGroup: 'Arms', primaryMuscle: 'Triceps', musclePart: 'Overall triceps', secondaryMuscles: 'Chest, Shoulders', isCompound: true },

  // QUADRICEPS (96 - 110)
  { id: 'ex_96', name: 'Barbell Back Squat', equipment: 'Barbell', muscleGroup: 'Legs', primaryMuscle: 'Quadriceps', musclePart: 'Overall quads', secondaryMuscles: 'Glutes, Hamstrings, Calves', isCompound: true },
  { id: 'ex_97', name: 'High-Bar Back Squat', equipment: 'Barbell', muscleGroup: 'Legs', primaryMuscle: 'Quadriceps', musclePart: 'Quads', secondaryMuscles: 'Glutes', isCompound: true },
  { id: 'ex_98', name: 'Low-Bar Back Squat', equipment: 'Barbell', muscleGroup: 'Legs', primaryMuscle: 'Glutes', musclePart: 'Posterior chain', secondaryMuscles: 'Quads, Hamstrings', isCompound: true },
  { id: 'ex_99', name: 'Front Squat', equipment: 'Barbell', muscleGroup: 'Legs', primaryMuscle: 'Quadriceps', musclePart: 'Quads', secondaryMuscles: 'Core, Glutes', isCompound: true },
  { id: 'ex_100', name: 'Barbell Hack Squat', equipment: 'Barbell', muscleGroup: 'Legs', primaryMuscle: 'Quadriceps', musclePart: 'Quads', secondaryMuscles: 'Glutes', isCompound: true },
  { id: 'ex_101', name: 'Smith Machine Squat', equipment: 'Smith', muscleGroup: 'Legs', primaryMuscle: 'Quadriceps', musclePart: 'Quads', secondaryMuscles: 'Glutes', isCompound: true },
  { id: 'ex_102', name: 'Smith Machine Front Squat', equipment: 'Smith', muscleGroup: 'Legs', primaryMuscle: 'Quadriceps', musclePart: 'Quads', secondaryMuscles: 'Core', isCompound: true },
  { id: 'ex_103', name: 'Smith Machine Hack Squat', equipment: 'Smith', muscleGroup: 'Legs', primaryMuscle: 'Quadriceps', musclePart: 'Quads', secondaryMuscles: 'Glutes', isCompound: true },
  { id: 'ex_104', name: 'Smith Machine Split Squat', equipment: 'Smith', muscleGroup: 'Legs', primaryMuscle: 'Quadriceps', musclePart: 'Quads', secondaryMuscles: 'Glutes', isCompound: true },
  { id: 'ex_105', name: 'Bulgarian Split Squat', equipment: 'Dumbbell', muscleGroup: 'Legs', primaryMuscle: 'Quadriceps', musclePart: 'Quads', secondaryMuscles: 'Glutes', isCompound: true },
  { id: 'ex_106', name: 'Leg Press', equipment: 'Machine', muscleGroup: 'Legs', primaryMuscle: 'Quadriceps', musclePart: 'Quads', secondaryMuscles: 'Glutes', isCompound: true },
  { id: 'ex_107', name: 'Narrow-Stance Leg Press', equipment: 'Machine', muscleGroup: 'Legs', primaryMuscle: 'Quadriceps', musclePart: 'Quads', secondaryMuscles: 'Glutes', isCompound: true },
  { id: 'ex_108', name: 'Hack Squat', equipment: 'Machine', muscleGroup: 'Legs', primaryMuscle: 'Quadriceps', musclePart: 'Quads', secondaryMuscles: 'Glutes', isCompound: true },
  { id: 'ex_109', name: 'Leg Extension', equipment: 'Machine', muscleGroup: 'Legs', primaryMuscle: 'Quadriceps', musclePart: 'Quads', secondaryMuscles: 'None', isCompound: false },
  { id: 'ex_110', name: 'Walking Lunges', equipment: 'Dumbbell', muscleGroup: 'Legs', primaryMuscle: 'Quadriceps', musclePart: 'Quads', secondaryMuscles: 'Glutes, Hamstrings', isCompound: true },

  // HAMSTRINGS & GLUTES (111 - 130)
  { id: 'ex_111', name: 'Barbell Romanian Deadlift', equipment: 'Barbell', muscleGroup: 'Legs', primaryMuscle: 'Hamstrings', musclePart: 'Hamstrings', secondaryMuscles: 'Glutes, Lower back', isCompound: true },
  { id: 'ex_112', name: 'Dumbbell Romanian Deadlift', equipment: 'Dumbbell', muscleGroup: 'Legs', primaryMuscle: 'Hamstrings', musclePart: 'Hamstrings', secondaryMuscles: 'Glutes', isCompound: true },
  { id: 'ex_113', name: 'Stiff-Leg Deadlift', equipment: 'Barbell', muscleGroup: 'Legs', primaryMuscle: 'Hamstrings', musclePart: 'Hamstrings', secondaryMuscles: 'Glutes, Lower back', isCompound: true },
  { id: 'ex_114', name: 'Smith Machine Romanian Deadlift', equipment: 'Smith', muscleGroup: 'Legs', primaryMuscle: 'Hamstrings', musclePart: 'Hamstrings', secondaryMuscles: 'Glutes', isCompound: true },
  { id: 'ex_115', name: 'Barbell Hip Thrust', equipment: 'Barbell', muscleGroup: 'Legs', primaryMuscle: 'Glutes', musclePart: 'Glute max', secondaryMuscles: 'Hamstrings', isCompound: true },
  { id: 'ex_116', name: 'Smith Machine Hip Thrust', equipment: 'Smith', muscleGroup: 'Legs', primaryMuscle: 'Glutes', musclePart: 'Glute max', secondaryMuscles: 'Hamstrings', isCompound: true },
  { id: 'ex_117', name: 'Dumbbell Hip Thrust', equipment: 'Dumbbell', muscleGroup: 'Legs', primaryMuscle: 'Glutes', musclePart: 'Glute max', secondaryMuscles: 'Hamstrings', isCompound: true },
  { id: 'ex_118', name: 'Bulgarian Split Squat (Glute Focus)', equipment: 'Dumbbell', muscleGroup: 'Legs', primaryMuscle: 'Glutes', musclePart: 'Glutes', secondaryMuscles: 'Quads', isCompound: true },
  { id: 'ex_119', name: 'Reverse Lunge', equipment: 'Dumbbell', muscleGroup: 'Legs', primaryMuscle: 'Glutes', musclePart: 'Glutes', secondaryMuscles: 'Quads', isCompound: true },
  { id: 'ex_120', name: 'Barbell Reverse Lunge', equipment: 'Barbell', muscleGroup: 'Legs', primaryMuscle: 'Glutes', musclePart: 'Glutes', secondaryMuscles: 'Quads', isCompound: true },
  { id: 'ex_121', name: 'Smith Machine Reverse Lunge', equipment: 'Smith', muscleGroup: 'Legs', primaryMuscle: 'Glutes', musclePart: 'Glutes', secondaryMuscles: 'Quads', isCompound: true },
  { id: 'ex_122', name: 'Cable Pull-Through', equipment: 'Cable', muscleGroup: 'Legs', primaryMuscle: 'Glutes', musclePart: 'Glute max', secondaryMuscles: 'Hamstrings', isCompound: true },
  { id: 'ex_123', name: 'Glute Kickback', equipment: 'Cable', muscleGroup: 'Legs', primaryMuscle: 'Glutes', musclePart: 'Glute max', secondaryMuscles: 'Hamstrings', isCompound: false },
  { id: 'ex_124', name: 'Machine Glute Kickback', equipment: 'Machine', muscleGroup: 'Legs', primaryMuscle: 'Glutes', musclePart: 'Glute max', secondaryMuscles: 'Hamstrings', isCompound: false },
  { id: 'ex_125', name: 'Lying Leg Curl', equipment: 'Machine', muscleGroup: 'Legs', primaryMuscle: 'Hamstrings', musclePart: 'Hamstrings', secondaryMuscles: 'Calves', isCompound: false },
  { id: 'ex_126', name: 'Seated Leg Curl', equipment: 'Machine', muscleGroup: 'Legs', primaryMuscle: 'Hamstrings', musclePart: 'Hamstrings', secondaryMuscles: 'Calves', isCompound: false },
  { id: 'ex_127', name: 'Standing Leg Curl', equipment: 'Machine', muscleGroup: 'Legs', primaryMuscle: 'Hamstrings', musclePart: 'Hamstrings', secondaryMuscles: 'Calves', isCompound: false },
  { id: 'ex_128', name: 'Nordic Hamstring Curl', equipment: 'Bodyweight', muscleGroup: 'Legs', primaryMuscle: 'Hamstrings', musclePart: 'Hamstrings', secondaryMuscles: 'Glutes', isCompound: true },
  { id: 'ex_129', name: 'Good Morning', equipment: 'Barbell', muscleGroup: 'Legs', primaryMuscle: 'Hamstrings', musclePart: 'Posterior chain', secondaryMuscles: 'Glutes, Lower back', isCompound: true },
  { id: 'ex_130', name: 'Smith Machine Good Morning', equipment: 'Smith', muscleGroup: 'Legs', primaryMuscle: 'Hamstrings', musclePart: 'Posterior chain', secondaryMuscles: 'Glutes, Lower back', isCompound: true },

  // CALVES (131 - 140)
  { id: 'ex_131', name: 'Standing Barbell Calf Raise', equipment: 'Barbell', muscleGroup: 'Calves', primaryMuscle: 'Calves', musclePart: 'Gastrocnemius', secondaryMuscles: 'Soleus', isCompound: false },
  { id: 'ex_132', name: 'Smith Machine Calf Raise', equipment: 'Smith', muscleGroup: 'Calves', primaryMuscle: 'Calves', musclePart: 'Gastrocnemius', secondaryMuscles: 'Soleus', isCompound: false },
  { id: 'ex_133', name: 'Standing Calf Raise', equipment: 'Machine', muscleGroup: 'Calves', primaryMuscle: 'Calves', musclePart: 'Gastrocnemius', secondaryMuscles: 'Soleus', isCompound: false },
  { id: 'ex_134', name: 'Seated Calf Raise', equipment: 'Machine', muscleGroup: 'Calves', primaryMuscle: 'Calves', musclePart: 'Soleus', secondaryMuscles: 'Gastrocnemius', isCompound: false },
  { id: 'ex_135', name: 'Dumbbell Calf Raise', equipment: 'Dumbbell', muscleGroup: 'Calves', primaryMuscle: 'Calves', musclePart: 'Gastrocnemius', secondaryMuscles: 'Soleus', isCompound: false },
  { id: 'ex_136', name: 'Leg Press Calf Raise', equipment: 'Machine', muscleGroup: 'Calves', primaryMuscle: 'Calves', musclePart: 'Gastrocnemius', secondaryMuscles: 'Soleus', isCompound: false },
  { id: 'ex_137', name: 'Single-Leg Calf Raise', equipment: 'Bodyweight', muscleGroup: 'Calves', primaryMuscle: 'Calves', musclePart: 'Gastrocnemius', secondaryMuscles: 'Soleus', isCompound: false },
  { id: 'ex_138', name: 'Smith Machine Single-Leg Calf Raise', equipment: 'Smith', muscleGroup: 'Calves', primaryMuscle: 'Calves', musclePart: 'Gastrocnemius', secondaryMuscles: 'Soleus', isCompound: false },
  { id: 'ex_139', name: 'Donkey Calf Raise', equipment: 'Machine', muscleGroup: 'Calves', primaryMuscle: 'Calves', musclePart: 'Gastrocnemius', secondaryMuscles: 'Soleus', isCompound: false },
  { id: 'ex_140', name: 'Tibialis Raise', equipment: 'Bodyweight', muscleGroup: 'Calves', primaryMuscle: 'Tibialis', musclePart: 'Tibialis anterior', secondaryMuscles: 'Shin', isCompound: false },

  // CORE / ABS (141 - 155)
  { id: 'ex_141', name: 'Barbell Ab Rollout', equipment: 'Barbell', muscleGroup: 'Core', primaryMuscle: 'Abs', musclePart: 'Rectus abdominis', secondaryMuscles: 'Lats, Shoulders', isCompound: true },
  { id: 'ex_142', name: 'Hanging Leg Raise', equipment: 'Bodyweight', muscleGroup: 'Core', primaryMuscle: 'Abs', musclePart: 'Lower abs', secondaryMuscles: 'Hip flexors', isCompound: false },
  { id: 'ex_143', name: 'Hanging Knee Raise', equipment: 'Bodyweight', muscleGroup: 'Core', primaryMuscle: 'Abs', musclePart: 'Lower abs', secondaryMuscles: 'Hip flexors', isCompound: false },
  { id: 'ex_144', name: 'Cable Crunch', equipment: 'Cable', muscleGroup: 'Core', primaryMuscle: 'Abs', musclePart: 'Rectus abdominis', secondaryMuscles: 'Upper abs', isCompound: false },
  { id: 'ex_145', name: 'Weighted Crunch', equipment: 'Plate', muscleGroup: 'Core', primaryMuscle: 'Abs', musclePart: 'Rectus abdominis', secondaryMuscles: 'Upper abs', isCompound: false },
  { id: 'ex_146', name: 'Decline Sit-Up', equipment: 'Bodyweight', muscleGroup: 'Core', primaryMuscle: 'Abs', musclePart: 'Rectus abdominis', secondaryMuscles: 'Hip flexors', isCompound: false },
  { id: 'ex_147', name: 'Machine Crunch', equipment: 'Machine', muscleGroup: 'Core', primaryMuscle: 'Abs', musclePart: 'Rectus abdominis', secondaryMuscles: 'Upper abs', isCompound: false },
  { id: 'ex_148', name: 'Ab Wheel Rollout', equipment: 'Equipment', muscleGroup: 'Core', primaryMuscle: 'Abs', musclePart: 'Rectus abdominis', secondaryMuscles: 'Lats, Core', isCompound: true },
  { id: 'ex_149', name: 'Plank', equipment: 'Bodyweight', muscleGroup: 'Core', primaryMuscle: 'Core', musclePart: 'Deep core', secondaryMuscles: 'Shoulders, Glutes', isCompound: false },
  { id: 'ex_150', name: 'Side Plank', equipment: 'Bodyweight', muscleGroup: 'Core', primaryMuscle: 'Obliques', musclePart: 'Obliques', secondaryMuscles: 'Deep core', isCompound: false },
  { id: 'ex_151', name: 'Cable Woodchopper', equipment: 'Cable', muscleGroup: 'Core', primaryMuscle: 'Obliques', musclePart: 'Obliques', secondaryMuscles: 'Core', isCompound: true },
  { id: 'ex_152', name: 'Russian Twist', equipment: 'Plate', muscleGroup: 'Core', primaryMuscle: 'Obliques', musclePart: 'Obliques', secondaryMuscles: 'Abs', isCompound: false },
  { id: 'ex_153', name: 'Pallof Press', equipment: 'Cable', muscleGroup: 'Core', primaryMuscle: 'Core', musclePart: 'Obliques/core', secondaryMuscles: 'Shoulders', isCompound: false },
  { id: 'ex_154', name: 'Reverse Crunch', equipment: 'Bodyweight', muscleGroup: 'Core', primaryMuscle: 'Abs', musclePart: 'Lower abs', secondaryMuscles: 'Deep core', isCompound: false },
  { id: 'ex_155', name: 'Bicycle Crunch', equipment: 'Bodyweight', muscleGroup: 'Core', primaryMuscle: 'Abs', musclePart: 'Rectus/obliques', secondaryMuscles: 'Obliques', isCompound: false }
];

const DEFAULT_ROUTINES = [
  {
    id: 'r1',
    name: 'Push Day (Chest, Shoulders & Triceps)',
    category: 'Push',
    description: 'Heavy compound push workout',
    items: [
      { exerciseName: 'Barbell Bench Press', sets: 4, reps: 8, targetWeight: 80 },
      { exerciseName: 'Incline Dumbbell Press', sets: 3, reps: 10, targetWeight: 28 },
      { exerciseName: 'Dumbbell Shoulder Press', sets: 3, reps: 10, targetWeight: 22 },
      { exerciseName: 'Rope Pushdown', sets: 3, reps: 12, targetWeight: 25 }
    ]
  },
  {
    id: 'r2',
    name: 'Pull Day (Back & Biceps)',
    category: 'Pull',
    description: 'Back thickness and bicep hypertrophy',
    items: [
      { exerciseName: 'Lat Pulldown', sets: 4, reps: 10, targetWeight: 65 },
      { exerciseName: 'Barbell Bent-Over Row', sets: 4, reps: 8, targetWeight: 70 },
      { exerciseName: 'Barbell Curl', sets: 3, reps: 12, targetWeight: 30 }
    ]
  },
  {
    id: 'r3',
    name: 'Leg Day (Quads, Hamstrings & Calves)',
    category: 'Legs',
    description: 'Lower body strength session',
    items: [
      { exerciseName: 'Barbell Back Squat', sets: 4, reps: 8, targetWeight: 100 },
      { exerciseName: 'Leg Press', sets: 3, reps: 12, targetWeight: 180 },
      { exerciseName: 'Barbell Romanian Deadlift', sets: 3, reps: 10, targetWeight: 85 }
    ]
  }
];

export const StorageService = {
  async getUser() {
    const data = await AsyncStorage.getItem(KEYS.USER);
    return data ? JSON.parse(data) : null;
  },
  
  async saveUser(user) {
    await AsyncStorage.setItem(KEYS.USER, JSON.stringify(user));
  },
  
  async getExercises() {
    const data = await AsyncStorage.getItem(KEYS.EXERCISES);
    if (!data || JSON.parse(data).length < 50) {
      await AsyncStorage.setItem(KEYS.EXERCISES, JSON.stringify(ALL_155_EXERCISES));
      return ALL_155_EXERCISES;
    }
    return JSON.parse(data);
  },
  
  async saveExercises(exercises) {
    await AsyncStorage.setItem(KEYS.EXERCISES, JSON.stringify(exercises));
  },
  
  async getRoutines() {
    const data = await AsyncStorage.getItem(KEYS.ROUTINES);
    if (!data) {
      await AsyncStorage.setItem(KEYS.ROUTINES, JSON.stringify(DEFAULT_ROUTINES));
      return DEFAULT_ROUTINES;
    }
    return JSON.parse(data);
  },
  
  async saveRoutines(routines) {
    await AsyncStorage.setItem(KEYS.ROUTINES, JSON.stringify(routines));
  },
  
  async getSessions() {
    const data = await AsyncStorage.getItem(KEYS.SESSIONS);
    return data ? JSON.parse(data) : [];
  },
  
  async saveSessions(sessions) {
    await AsyncStorage.setItem(KEYS.SESSIONS, JSON.stringify(sessions));
  },
  
  async getMeasurements() {
    const data = await AsyncStorage.getItem(KEYS.MEASUREMENTS);
    return data ? JSON.parse(data) : [];
  },
  
  async saveMeasurements(measurements) {
    await AsyncStorage.setItem(KEYS.MEASUREMENTS, JSON.stringify(measurements));
  },

  // RESET ALL DATA TO FRESH STATE
  async resetAllData() {
    await AsyncStorage.removeItem(KEYS.USER);
    await AsyncStorage.removeItem(KEYS.SESSIONS);
    await AsyncStorage.removeItem(KEYS.MEASUREMENTS);
    await AsyncStorage.setItem(KEYS.EXERCISES, JSON.stringify(ALL_155_EXERCISES));
    await AsyncStorage.setItem(KEYS.ROUTINES, JSON.stringify(DEFAULT_ROUTINES));
  }
};
