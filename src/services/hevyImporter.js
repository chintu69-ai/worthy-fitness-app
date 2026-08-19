export class HevyImporter {
  // RFC 4180 compliant CSV parser handling multiline quotes, commas inside text, and carriage returns
  static parseCSVRows(csvString) {
    const rows = [];
    let currentRow = [];
    let currentField = '';
    let inQuotes = false;
    
    for (let i = 0; i < csvString.length; i++) {
      const char = csvString[i];
      const nextChar = csvString[i + 1];
      
      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          currentField += '"';
          i++; // Skip escaped quote
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        currentRow.push(currentField.trim());
        currentField = '';
      } else if ((char === '\n' || char === '\r') && !inQuotes) {
        if (char === '\r' && nextChar === '\n') {
          i++;
        }
        currentRow.push(currentField.trim());
        if (currentRow.some(field => field.length > 0)) {
          rows.push(currentRow);
        }
        currentRow = [];
        currentField = '';
      } else {
        currentField += char;
      }
    }
    
    if (currentField || currentRow.length > 0) {
      currentRow.push(currentField.trim());
      if (currentRow.some(field => field.length > 0)) {
        rows.push(currentRow);
      }
    }
    
    return rows;
  }

  static parseCSV(csvString) {
    const allRows = this.parseCSVRows(csvString);
    if (allRows.length < 2) return [];
    
    const rawHeaders = allRows[0].map(h => h.toLowerCase().replace(/[^a-z0-9_]/g, ''));
    
    // Find matching columns flexible for Hevy, Strong, and generic app exports
    const dateIdx = rawHeaders.findIndex(h => h.includes('start_time') || h.includes('date') || h.includes('created') || h.includes('time'));
    const titleIdx = rawHeaders.findIndex(h => h.includes('title') || h.includes('workout_name') || h.includes('name'));
    const exerciseIdx = rawHeaders.findIndex(h => h.includes('exercise_title') || h.includes('exercise_name') || h.includes('exercise'));
    const weightIdx = rawHeaders.findIndex(h => h.includes('weight_kg') || h.includes('weight') || h.includes('kg'));
    const repsIdx = rawHeaders.findIndex(h => h.includes('reps') || h.includes('rep'));
    const setTypeIdx = rawHeaders.findIndex(h => h.includes('set_type') || h.includes('type'));

    const dIdx = dateIdx >= 0 ? dateIdx : 0;
    const tIdx = titleIdx >= 0 ? titleIdx : 1;
    const eIdx = exerciseIdx >= 0 ? exerciseIdx : 2;
    const wIdx = weightIdx >= 0 ? weightIdx : 3;
    const rIdx = repsIdx >= 0 ? repsIdx : 4;

    const sessionsMap = {};
    
    for (let i = 1; i < allRows.length; i++) {
      const row = allRows[i];
      if (!row || row.length <= Math.max(dIdx, eIdx)) continue;
      
      const dateVal = row[dIdx] || new Date().toISOString();
      const titleVal = (tIdx < row.length && row[tIdx]) ? row[tIdx] : 'Workout Session';
      const exerciseVal = row[eIdx] || '';
      const weightVal = wIdx < row.length ? (parseFloat(row[wIdx].replace(/[^0-9.]/g, '')) || 0) : 0;
      const repsVal = rIdx < row.length ? (parseInt(row[rIdx].replace(/[^0-9]/g, ''), 10) || 0) : 0;
      const setTypeVal = setTypeIdx >= 0 && setTypeIdx < row.length ? row[setTypeIdx] : 'Normal';

      if (!exerciseVal || exerciseVal.trim() === '') continue;

      // Group by exact timestamp / date string + title for 100% accurate session separation
      const sessionKey = `${dateVal.trim()}_${titleVal.trim()}`;

      if (!sessionsMap[sessionKey]) {
        sessionsMap[sessionKey] = {
          id: 'imp_' + i + '_' + Math.random().toString(36).substring(2, 7),
          title: titleVal.trim() || 'Workout',
          startDate: dateVal.trim(),
          durationSeconds: 2700,
          totalVolumeKg: 0,
          sets: []
        };
      }

      const setObj = {
        id: 'set_' + i + '_' + Math.random().toString(36).substring(2, 7),
        exerciseName: exerciseVal.trim(),
        weightKg: weightVal,
        reps: repsVal,
        setType: setTypeVal.toLowerCase().includes('warmup') ? 'Warmup' : 'Normal',
        isCompleted: true
      };

      sessionsMap[sessionKey].sets.push(setObj);
      sessionsMap[sessionKey].totalVolumeKg += (weightVal * repsVal);
    }
    
    const resultSessions = Object.values(sessionsMap);
    return resultSessions;
  }
}
