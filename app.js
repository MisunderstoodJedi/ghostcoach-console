const DAY_MS = 86400000;
const STORE_KEY = "hyroxPlannerState";
const LEGACY_STORE_KEYS = ["trainingCommandCenterState", "hyroxProtocolState"];
const OFFICIAL_PROGRAMME_START = "2026-08-10";
const TARGET_EVENT_DATE = "2027-03-10";
const START_MIGRATION_KEY = "hyroxPlannerMarchTarget20260809";
const TOTAL_PROGRAMME_WEEKS = 31;
const ROUTES = ["dashboard", "today", "programme", "reviews", "progress", "settings"];

const workoutImages = {
  run: {
    src: "assets/workout-run.svg",
    title: "Running Guide",
    caption: "Relaxed posture, easy breathing, and tidy pacing matter more than heroics."
  },
  strength: {
    src: "assets/workout-strength.svg",
    title: "Strength and Core Guide",
    caption: "Controlled reps, full-body tension, and clean positions beat rushing for volume."
  },
  cross: {
    src: "assets/workout-cross.svg",
    title: "Cross-Training Guide",
    caption: "Use the bike or rower to build engine without chewing up your legs."
  },
  hyrox: {
    src: "assets/workout-hyrox.svg",
    title: "HYROX Skills Guide",
    caption: "Practise the stations smoothly first, then make them harder."
  },
  mixed: {
    src: "assets/workout-mixed.svg",
    title: "Compromised Running Guide",
    caption: "Learn to settle your breathing and keep moving when your legs are already loaded."
  },
  recovery: {
    src: "assets/workout-recovery.svg",
    title: "Recovery Guide",
    caption: "Easy work counts when it helps you come back ready for the next proper session."
  }
};

const phases = [
  ["5K Plan", "#45d483", [1, 8], "Run consistency first. Build the habit, add strength support, and finish the week feeling capable."],
  ["10K Plan", "#3bd6c0", [9, 16], "Extend the aerobic base while keeping two to three strength touches each week."],
  ["15K Plan", "#f4aa49", [17, 26], "Extend the running base again while keeping the existing strength and cross-training support."],
  ["HYROX Specific", "#ff7474", [27, 29], "Practise race rhythm, station transitions, and gym-specific pieces."],
  ["Peak + Taper", "#7ee787", [30, 31], "Reduce fatigue, keep the legs awake, and arrive sharp on Wednesday 10 March 2027."]
].map(([name, color, weeks, focus]) => ({ name, color, weeks, focus }));

const baseKit = {
  treadmill: "Walking treadmill",
  rower: "Rowing machine",
  bike: "Stationary bike",
  kettlebells16: "2 x 16 kg kettlebells",
  dumbbells10: "2 x 10 kg dumbbells",
  vest: "Weighted vest (5-10 kg if adjustable)",
  bars: "Pull-up / dip / leg raise station",
  mat: "Pilates mat",
  bag: "Water shoulder bag / sandbag (10-20 kg fill)",
  rope: "Skipping rope",
  park: "Park or outdoor route",
  gym: "Gym access (SkiErg, sled, wall balls)",
  raceLoads: "HYROX race loads by division: sleds 102/152/202 kg push, 78/103/153 kg pull, carries 2 x 16/24/32 kg, sandbag 10/20/30 kg, wall ball 4/6/9 kg"
};

const beginner5kPlan = [
  { mon: "Rest or run/walk", tue: "2.4 km run", wed: "Rest or run/walk", thu: "2.4 km run", fri: "Rest", sat: "2.4 km run", sun: "30 min walk" },
  { mon: "Rest or run/walk", tue: "2.8 km run", wed: "Rest or run/walk", thu: "2.4 km run", fri: "Rest", sat: "2.8 km run", sun: "35 min walk" },
  { mon: "Rest or run/walk", tue: "3.2 km run", wed: "Rest or run/walk", thu: "2.4 km run", fri: "Rest", sat: "3.2 km run", sun: "40 min walk" },
  { mon: "Rest or run/walk", tue: "3.6 km run", wed: "Rest or run/walk", thu: "2.4 km run", fri: "Rest", sat: "3.6 km run", sun: "45 min walk" },
  { mon: "Rest or run/walk", tue: "4.0 km run", wed: "Rest or run/walk", thu: "3.2 km run", fri: "Rest", sat: "4.0 km run", sun: "50 min walk" },
  { mon: "Rest or run/walk", tue: "4.4 km run", wed: "Rest or run/walk", thu: "3.2 km run", fri: "Rest", sat: "4.4 km run", sun: "55 min walk" },
  { mon: "Rest or run/walk", tue: "4.8 km run", wed: "Rest or run/walk", thu: "3.2 km run", fri: "Rest", sat: "4.8 km run", sun: "60 min walk" },
  { mon: "Rest or run/walk", tue: "4.8 km run", wed: "Rest or run/walk", thu: "3.2 km run", fri: "Rest", sat: "Rest", sun: "5K Race" }
];

const beginner10kPlan = [
  { mon: "Rest", tue: "4.0 km run", wed: "30 min cross", thu: "3.2 km run", fri: "Rest", sat: "40 min cross", sun: "4.8 km run" },
  { mon: "Rest", tue: "4.0 km run", wed: "30 min cross", thu: "3.2 km run", fri: "Rest", sat: "40 min cross", sun: "5.6 km run" },
  { mon: "Rest", tue: "4.0 km run", wed: "35 min cross", thu: "3.2 km run", fri: "Rest", sat: "50 min cross", sun: "6.4 km run" },
  { mon: "Rest", tue: "4.8 km run", wed: "35 min cross", thu: "3.2 km run", fri: "Rest", sat: "50 min cross", sun: "6.4 km run" },
  { mon: "Rest", tue: "4.8 km run", wed: "40 min cross", thu: "3.2 km run", fri: "Rest", sat: "60 min cross", sun: "7.2 km run" },
  { mon: "Rest", tue: "4.8 km run", wed: "40 min cross", thu: "3.2 km run", fri: "Rest", sat: "60 min cross", sun: "8.0 km run" },
  { mon: "Rest", tue: "4.8 km run", wed: "45 min cross", thu: "3.2 km run", fri: "Rest", sat: "60 min cross", sun: "8.8 km run" },
  { mon: "Rest", tue: "4.8 km run", wed: "30 min cross", thu: "3.2 km run", fri: "Rest", sat: "Rest", sun: "10 km run" }
];

const beginner15kPlan = [
  { mon: "Stretch & strengthen", tue: "3.2 km run", wed: "30 min cross", thu: "3.2 km run + strength", fri: "Rest", sat: "3.2 km run", sun: "30 min cross" },
  { mon: "Stretch & strengthen", tue: "4.8 km run", wed: "30 min cross", thu: "3.2 km run + strength", fri: "Rest", sat: "4.8 km run", sun: "30 min cross" },
  { mon: "Stretch & strengthen", tue: "4.8 km run", wed: "35 min cross", thu: "3.2 km run + strength", fri: "Rest", sat: "6.4 km run", sun: "30 min cross" },
  { mon: "Stretch & strengthen", tue: "3.2 km run", wed: "35 min cross", thu: "3.2 km run + strength", fri: "Rest", sat: "3.2 km run", sun: "40 min cross" },
  { mon: "Stretch & strengthen", tue: "6.4 km run", wed: "40 min cross", thu: "4.8 km run + strength", fri: "Rest", sat: "8.1 km run", sun: "40 min cross" },
  { mon: "Stretch & strengthen", tue: "6.4 km run", wed: "40 min cross", thu: "4.8 km run + strength", fri: "Rest", sat: "9.7 km run", sun: "50 min cross" },
  { mon: "Stretch & strengthen", tue: "4.8 km run", wed: "45 min cross", thu: "4.8 km run + strength", fri: "Rest", sat: "6.4 km run", sun: "50 min cross" },
  { mon: "Stretch & strengthen", tue: "8.1 km run", wed: "45 min cross", thu: "4.8 km run + strength", fri: "Rest", sat: "11.3 km run", sun: "60 min cross" },
  { mon: "Stretch & strengthen", tue: "8.1 km run", wed: "45 min cross", thu: "4.8 km run + strength", fri: "Rest", sat: "12.9 km run", sun: "60 min cross" },
  { mon: "Stretch & strengthen", tue: "4.8 km run", wed: "30 min cross", thu: "3.2 km run + strength", fri: "3.2 km run or rest", sat: "Rest", sun: "15K Race" }
];

let apiOnline = false;
let currentRoute = "dashboard";
let guideSession = null;
let saveTimer = null;
let state = loadLocalState();

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function isoDaysBetween(start, end) {
  const a = new Date(`${start}T00:00:00`);
  const b = new Date(`${end}T00:00:00`);
  return Math.floor((b - a) / DAY_MS);
}

function addDays(date, amount) {
  const [year, month, day] = String(date).split("-").map(Number);
  const d = new Date(year, month - 1, day);
  d.setDate(d.getDate() + amount);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function weekdayIndex(date) {
  const [year, month, day] = String(date).split("-").map(Number);
  return new Date(year, month - 1, day).getDay();
}

function weekdayName(date) {
  return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][weekdayIndex(date)];
}

function startOfWeekMonday(date) {
  const weekday = weekdayIndex(date);
  const daysFromMonday = weekday === 0 ? 6 : weekday - 1;
  return addDays(date, -daysFromMonday);
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function uid(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function programmeWeekFromDate(date, programmeStart = OFFICIAL_PROGRAMME_START) {
  const days = isoDaysBetween(startOfWeekMonday(programmeStart), startOfWeekMonday(date));
  return clamp(Math.floor(days / 7) + 1, 1, TOTAL_PROGRAMME_WEEKS);
}

function phaseForWeek(week) {
  return phases.find(phase => week >= phase.weeks[0] && week <= phase.weeks[1]) || phases[0];
}

function defaultState() {
  const now = todayISO();
  return {
    version: 1,
    activeDate: now,
    activeWeek: programmeWeekFromDate(now),
    settings: {
      programmeStart: OFFICIAL_PROGRAMME_START,
      eventDate: TARGET_EVENT_DATE,
      weeklyWorkoutTarget: 6,
      startMigration: START_MIGRATION_KEY
    },
    checkins: {},
    workoutLogs: [],
    weeklyReviews: {}
  };
}

function sanitiseLogs(logs = []) {
  return Array.isArray(logs) ? logs.map(log => ({
    id: log.id || uid("workout"),
    date: log.date || todayISO(),
    workoutId: log.workoutId || "",
    title: log.title || "",
    status: log.status || "",
    duration: log.duration || "",
    distance: log.distance || log.distanceRun || "",
    effort: log.effort || "",
    notes: log.notes || "",
    completedExercises: Array.isArray(log.completedExercises) ? log.completedExercises : [],
    plannedChecklist: Array.isArray(log.plannedChecklist) ? log.plannedChecklist : []
  })) : [];
}

function normaliseState(input) {
  const defaults = defaultState();
  const merged = {
    ...defaults,
    ...(input || {})
  };
  merged.settings = {
    ...defaults.settings,
    ...(input?.settings || {})
  };
  merged.checkins = input?.checkins || {};
  merged.workoutLogs = sanitiseLogs(input?.workoutLogs);
  merged.weeklyReviews = input?.weeklyReviews || {};

  const needsPlanMigration = merged.settings.startMigration !== START_MIGRATION_KEY;
  if (needsPlanMigration) {
    merged.settings = { ...defaults.settings };
    merged.activeDate = defaults.activeDate;
    merged.activeWeek = defaults.activeWeek;
  } else {
    merged.activeWeek = programmeWeekFromDate(merged.activeDate, merged.settings.programmeStart);
  }

  return merged;
}

function loadLocalState() {
  try {
    const raw = localStorage.getItem(STORE_KEY) || LEGACY_STORE_KEYS.map(key => localStorage.getItem(key)).find(Boolean);
    return normaliseState(raw ? JSON.parse(raw) : null);
  } catch {
    return defaultState();
  }
}

function saveLocalState() {
  localStorage.setItem(STORE_KEY, JSON.stringify(state));
}

async function loadRemoteState() {
  try {
    const response = await fetch("/api/state/default");
    if (!response.ok) throw new Error(String(response.status));
    const remote = await response.json();
    apiOnline = true;
    if (remote && Object.keys(remote).length) {
      state = normaliseState(remote);
      saveLocalState();
    }
  } catch {
    apiOnline = false;
  }
}

function setSaveStatus(text) {
  const el = document.getElementById("saveStatus");
  if (!el) return;
  el.textContent = text;
  el.classList.toggle("online", apiOnline && text !== "Local");
  el.classList.toggle("local", !apiOnline || text === "Local");
}

function saveState() {
  saveLocalState();
  setSaveStatus(apiOnline ? "Saving" : "Local");
  clearTimeout(saveTimer);
  saveTimer = setTimeout(async () => {
    if (!apiOnline) {
      setSaveStatus("Local");
      return;
    }
    try {
      const response = await fetch("/api/state/default", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(state)
      });
      if (!response.ok) throw new Error(String(response.status));
      setSaveStatus("Saved");
    } catch {
      apiOnline = false;
      setSaveStatus("Local");
    }
  }, 350);
}

function programmeWeek(date = state.activeDate) {
  return programmeWeekFromDate(date, state.settings.programmeStart);
}

function weekDates(week) {
  const start = addDays(startOfWeekMonday(state.settings.programmeStart), (week - 1) * 7);
  return Array.from({ length: 7 }, (_, index) => addDays(start, index));
}

function runPlanForWeek(week) {
  if (week >= 1 && week <= 8) return beginner5kPlan[week - 1];
  if (week >= 9 && week <= 16) return beginner10kPlan[week - 9];
  if (week >= 17 && week <= 26) return beginner15kPlan[week - 17];
  return null;
}

function runPlanNameForWeek(week) {
  if (week <= 8) return "5K";
  if (week <= 16) return "10K";
  return "15K";
}

function runItemForDate(week, date) {
  const key = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"][weekdayIndex(date)];
  return runPlanForWeek(week)?.[key] || "";
}

function supportLevelForRunWeek(week) {
  if (week <= 4) return 0;
  if (week <= 8) return 1;
  if (week <= 12) return 2;
  return 3;
}

function supportSets(level) {
  return level <= 2 ? 3 : 4;
}

function strengthBlockA(week) {
  const sets = supportSets(supportLevelForRunWeek(week));
  return [
    `Goblet squat with 16 kg kettlebell: ${sets} x 8-12`,
    `Dumbbell floor press with 2 x 10 kg or push-up: ${sets} x 8-12`,
    `Farmers carry with 2 x 16 kg kettlebells: ${sets} x 30-40 m`,
    "Dead bug: 3 x 8/side",
    "Front plank: 3 x 30-45 sec"
  ];
}

function strengthBlockB(week) {
  const sets = supportSets(supportLevelForRunWeek(week));
  const lungeLoad = week <= 4 ? "bodyweight" : "2 x 10 kg dumbbells";
  return [
    `Kettlebell Romanian deadlift with 2 x 16 kg: ${sets} x 8-12`,
    `Reverse lunge (${lungeLoad}): ${sets} x 6-8/leg`,
    `Pull-up negative, assisted pull-up or body-row pattern: ${sets} x 5-8`,
    "Hanging knee raise or lying leg raise: 3 x 8-12",
    "Side plank: 3 x 20-40 sec/side"
  ];
}

function strengthBlockC(week) {
  const sets = supportSets(supportLevelForRunWeek(week));
  return [
    `Bike or row easy warm-up: 5-8 min`,
    `Weighted-vest step-up (5-10 kg) or split squat with 2 x 10 kg dumbbells: ${sets} x 8/leg`,
    `Dumbbell row with 10 kg: ${sets} x 10-12/side`,
    `Water-bag bear hug carry (10-20 kg): ${sets} x 30-40 m`,
    "Powerball or grip donut: 3 short rounds"
  ];
}

function coreFinisher() {
  return [
    "Dead bug: 2 x 8/side",
    "Side plank: 2 x 20-30 sec/side",
    "Hip and calf mobility: 5 min"
  ];
}

function sessionTemplate({ week, date, type, title, duration, intensity, objective, segments, notes, equipment, imageKey, isRecovery = false }) {
  const checklist = segments.flatMap(segment => segment.checklist || segment.items || []);
  return {
    id: `w${week}-${date}-${type.toLowerCase().replace(/[^a-z]+/g, "-")}`,
    week,
    date,
    day: weekdayName(date),
    type,
    title,
    duration,
    intensity,
    objective,
    segments,
    notes,
    equipment,
    imageKey,
    checklist,
    isRecovery
  };
}

function runSessionForDate(date, week) {
  const planName = runPlanNameForWeek(week);
  const item = runItemForDate(week, date);
  const weekday = weekdayIndex(date);
  const lower = String(item).toLowerCase();
  const isBenchmark = lower.includes("race") || lower.includes("10k run") || lower.includes("10 km run") || lower.includes("15k race");
  const minutes = Number(String(item).match(/(\d+)\s*min/i)?.[1] || 0);
  const km = Number(String(item).match(/(\d+(?:\.\d+)?)\s*km/i)?.[1] || 0);
  const miles = Number(String(item).match(/(\d+(?:\.\d+)?)\s*mi/i)?.[1] || 0);
  const runDuration = minutes || (km ? Math.max(25, Math.round(km * 8)) : miles ? Math.max(30, Math.round(miles * 13)) : 25);
  const benchmarkDuration = planName === "15K" ? 150 : 120;

  if (week <= 8) {
    if (weekday === 1) {
      return sessionTemplate({
        week,
        date,
        type: "Strength",
        title: "Strength A + Optional Run/Walk",
        duration: 40,
        intensity: "Moderate",
        objective: "Start building legs, trunk, and posture from day one without stealing from the run plan.",
        segments: [
          { title: "Supplied 5K plan", items: [`${planName} plan: ${item}`], checklist: [`${planName} plan: ${item}`] },
          { title: "Strength support", items: strengthBlockA(week), checklist: strengthBlockA(week) }
        ],
        notes: [
          "Skip the optional run/walk before cutting the strength block.",
          "Move cleanly. Stop one rep before form gets sloppy."
        ],
        equipment: ["kettlebells16", "dumbbells10", "mat", "park"],
        imageKey: "strength"
      });
    }
    if (weekday === 2) {
      return sessionTemplate({
        week,
        date,
        type: "Run",
        title: lower.includes("race") ? "5K Benchmark" : "Run Day",
        duration: lower.includes("race") ? 90 : runDuration,
        intensity: lower.includes("race") ? "Steady finish effort" : "Easy conversational",
        objective: "Follow the supplied run exactly. Let the pace stay easy enough to repeat later in the week.",
        segments: [
          { title: "Supplied 5K plan", items: [`${planName} plan: ${item}`], checklist: [`${planName} plan: ${item}`] }
        ],
        notes: ["Start slower than your ego wants.", "Treadmill or park is fine."],
        equipment: ["treadmill", "park"],
        imageKey: "run"
      });
    }
    if (weekday === 3) {
      return sessionTemplate({
        week,
        date,
        type: "Strength",
        title: "Strength B + Optional Run/Walk",
        duration: 40,
        intensity: "Moderate",
        objective: "Build hinge strength, pulling strength, and core control while the 5K base grows.",
        segments: [
          { title: "Supplied 5K plan", items: [`${planName} plan: ${item}`], checklist: [`${planName} plan: ${item}`] },
          { title: "Strength support", items: strengthBlockB(week), checklist: strengthBlockB(week) }
        ],
        notes: [
          "Use the optional run/walk as gentle movement, not a secret workout.",
          "Keep the reps slow and controlled."
        ],
        equipment: ["kettlebells16", "bars", "mat", "park"],
        imageKey: "strength"
      });
    }
    if (weekday === 4) {
      return sessionTemplate({
        week,
        date,
        type: "Run",
        title: "Run + Core Finish",
        duration: runDuration + 10,
        intensity: "Easy",
        objective: "Bank the planned run and finish with a short core top-up instead of extra junk volume.",
        segments: [
          { title: "Supplied 5K plan", items: [`${planName} plan: ${item}`], checklist: [`${planName} plan: ${item}`] },
          { title: "Core finish", items: coreFinisher(), checklist: coreFinisher() }
        ],
        notes: ["If the run feels rough, keep the core block short and crisp."],
        equipment: ["treadmill", "park", "mat"],
        imageKey: "run"
      });
    }
    if (weekday === 5) {
      return sessionTemplate({
        week,
        date,
        type: "Rest",
        title: "Rest Day",
        duration: 0,
        intensity: "Off",
        objective: "Protect recovery so the Saturday run still has quality.",
        segments: [{ title: "Rest", items: ["Supplied 5K plan: Rest"], checklist: [] }],
        notes: ["Easy walking is fine. Do not turn this into a make-up session."],
        equipment: [],
        imageKey: "recovery",
        isRecovery: true
      });
    }
    if (weekday === 6) {
      return sessionTemplate({
        week,
        date,
        type: "Run",
        title: "Weekend Run",
        duration: runDuration,
        intensity: "Easy",
        objective: "Let the Saturday run teach the body that consistent running is normal.",
        segments: [
          { title: "Supplied 5K plan", items: [`${planName} plan: ${item}`], checklist: [`${planName} plan: ${item}`] }
        ],
        notes: ["Keep this conversational unless it is race day."],
        equipment: ["treadmill", "park"],
        imageKey: "run"
      });
    }
    return sessionTemplate({
      week,
      date,
      type: lower.includes("race") ? "Recovery" : "Cross",
      title: lower.includes("race") ? "5K Race Day" : "Walk + Strength C",
      duration: lower.includes("race") ? 100 : 55,
      intensity: lower.includes("race") ? "Steady finish effort" : "Easy to moderate",
      objective: lower.includes("race") ? "Use the benchmark to learn, not to beat yourself up." : "Use the planned walk as gentle movement, then add a small carries-and-posture session.",
      segments: [
        { title: "Supplied 5K plan", items: [`${planName} plan: ${item}`], checklist: [`${planName} plan: ${item}`] },
        ...(lower.includes("race") ? [] : [
          { title: "Strength support", items: strengthBlockC(week), checklist: strengthBlockC(week) },
          { title: "Mobility", items: ["Calves, hips, hamstrings and upper back: 5-8 min"], checklist: ["Calves, hips, hamstrings and upper back: 5-8 min"] }
        ])
      ],
      notes: [lower.includes("race") ? "Record the time and effort, then move on." : "If fatigue is high, keep only the walk and mobility."],
      equipment: ["park", "rower", "bike", "vest", "dumbbells10", "bag", "mat"],
      imageKey: lower.includes("race") ? "run" : "cross",
      isRecovery: false
    });
  }

  if (weekday === 1) {
    return sessionTemplate({
      week,
      date,
      type: "Strength",
      title: lower.includes("stretch") ? "Stretch + Strength A" : "Strength A",
      duration: 40,
      intensity: "Moderate",
      objective: "Keep lower-body and trunk strength improving while the run plan lengthens.",
      segments: [
        { title: `Supplied ${planName} plan`, items: [`${planName} plan: ${item}`], checklist: [] },
        { title: "Strength support", items: strengthBlockA(week), checklist: strengthBlockA(week) }
      ],
      notes: ["Treat this as important work without adding extra running volume."],
      equipment: ["kettlebells16", "dumbbells10", "mat"],
      imageKey: "strength"
    });
  }
  if (weekday === 2) {
    return sessionTemplate({
      week,
      date,
      type: "Run",
      title: "Run Day",
      duration: runDuration,
      intensity: "Easy to steady",
      objective: "Hit the planned run and keep breathing controlled enough that Thursday still has life.",
      segments: [{ title: `Supplied ${planName} plan`, items: [`${planName} plan: ${item}`], checklist: [`${planName} plan: ${item}`] }],
      notes: ["Comfortable and tidy beats brave and ragged."],
      equipment: ["treadmill", "park"],
      imageKey: "run"
    });
  }
  if (weekday === 3) {
    return sessionTemplate({
      week,
      date,
      type: "Cross",
      title: "Cross-Training + Strength B",
      duration: minutes + 20,
      intensity: "Easy to moderate",
      objective: "Use low-impact engine work and a short strength block to support the Sunday long run.",
      segments: [
        { title: `Supplied ${planName} plan`, items: [`${planName} plan: ${item}`], checklist: [`${planName} plan: ${item}`] },
        { title: "Strength support", items: strengthBlockB(week), checklist: strengthBlockB(week) }
      ],
      notes: ["Keep the cross-training smooth. The strength work still matters."],
      equipment: ["rower", "bike", "kettlebells16", "bars", "mat"],
      imageKey: "cross"
    });
  }
  if (weekday === 4) {
    return sessionTemplate({
      week,
      date,
      type: "Run",
      title: "Run + Core Finish",
      duration: runDuration + 10,
      intensity: "Easy",
      objective: "Build run frequency and trunk stiffness without turning this into a grinder.",
      segments: [
        { title: `Supplied ${planName} plan`, items: [`${planName} plan: ${item}`], checklist: [`${planName} plan: ${item}`] },
        { title: "Core finish", items: coreFinisher(), checklist: coreFinisher() }
      ],
      notes: ["Short and sharp. No bonus fatigue."],
      equipment: ["treadmill", "park", "mat"],
      imageKey: "run"
    });
  }
  if (weekday === 5) {
    if (lower.includes("run or rest")) {
      return sessionTemplate({
        week,
        date,
        type: "Optional",
        title: "Run Or Rest",
        duration: runDuration,
        intensity: "Easy or off",
        objective: "Use this as a genuine choice based on fatigue before the weekend.",
        segments: [{ title: `Supplied ${planName} plan`, items: [`${planName} plan: ${item}`], checklist: [`${planName} plan: ${item}`] }],
        notes: ["If legs feel heavy, rest wins."],
        equipment: ["treadmill", "park"],
        imageKey: "recovery",
        isRecovery: true
      });
    }
    return sessionTemplate({
      week,
      date,
      type: "Rest",
      title: "Rest Day",
      duration: 0,
      intensity: "Off",
      objective: "Leave the legs alone so the weekend work lands well.",
      segments: [{ title: "Rest", items: [`Supplied ${planName} plan: Rest`], checklist: [] }],
      notes: ["Easy walking is enough."],
      equipment: [],
      imageKey: "recovery",
      isRecovery: true
    });
  }
  if (weekday === 6) {
    if (lower.startsWith("rest")) {
      return sessionTemplate({
        week,
        date,
        type: "Rest",
        title: "Rest Day",
        duration: 0,
        intensity: "Off",
        objective: "Protect freshness for the benchmark.",
        segments: [{ title: "Rest", items: [`Supplied ${planName} plan: Rest`], checklist: [] }],
        notes: ["Keep this properly easy."],
        equipment: [],
        imageKey: "recovery",
        isRecovery: true
      });
    }
    if (lower.includes("run")) {
      return sessionTemplate({
        week,
        date,
        type: "Run",
        title: "Weekend Run",
        duration: runDuration,
        intensity: "Easy to steady",
        objective: "Let the longer run build endurance without chasing pace.",
        segments: [{ title: `Supplied ${planName} plan`, items: [`${planName} plan: ${item}`], checklist: [`${planName} plan: ${item}`] }],
        notes: ["Keep it controlled enough to recover."],
        equipment: ["treadmill", "park"],
        imageKey: "run"
      });
    }
    return sessionTemplate({
      week,
      date,
      type: "Cross",
      title: "Cross-Training + Strength C",
      duration: minutes + 20,
      intensity: "Easy to moderate",
      objective: "Keep the engine moving and sprinkle in carries, posture, and grip work.",
      segments: [
        { title: `Supplied ${planName} plan`, items: [`${planName} plan: ${item}`], checklist: [`${planName} plan: ${item}`] },
        { title: "Strength support", items: strengthBlockC(week), checklist: strengthBlockC(week) }
      ],
      notes: ["Stay smooth so Sunday still feels like the main run."],
      equipment: ["rower", "bike", "vest", "dumbbells10", "bag"],
      imageKey: "cross"
    });
  }
  return sessionTemplate({
    week,
    date,
    type: lower.includes("cross") ? "Cross" : "Run",
    title: isBenchmark ? `${planName} Benchmark` : lower.includes("cross") ? "Easy Cross-Training" : "Long Run",
    duration: isBenchmark ? benchmarkDuration : runDuration,
    intensity: isBenchmark ? "Steady finish effort" : "Easy to steady",
    objective: isBenchmark ? `Use the ${planName} as a confidence marker, not a verdict on the whole plan.` : lower.includes("cross") ? "Keep the aerobic work low-impact and smooth." : "Let the Sunday run extend your aerobic base without chasing pace.",
    segments: [{ title: `Supplied ${planName} plan`, items: [`${planName} plan: ${item}`], checklist: [`${planName} plan: ${item}`] }],
    notes: [isBenchmark ? "Record the time and move on." : "Easy enough that form stays tidy."],
    equipment: lower.includes("cross") ? ["rower", "bike"] : ["treadmill", "park"],
    imageKey: lower.includes("cross") ? "cross" : "run"
  });
}

function hyroxLevelForWeek(week) {
  if (week <= 18) return 0;
  if (week <= 22) return 1;
  if (week <= 27) return 2;
  if (week <= 29) return 3;
  if (week <= 31) return 4;
  return 5;
}

function isDeloadWeek(week) {
  return [20, 24, 28, 30, 31].includes(week);
}

function gymSpecificWeek(week) {
  return week >= 27 || [22, 24, 26].includes(week);
}

function hyroxStrengthBlock(week) {
  const level = hyroxLevelForWeek(week);
  const sets = isDeloadWeek(week) ? 2 : level <= 1 ? 3 : 4;
  return [
    `Double-kettlebell front squat with 2 x 16 kg or goblet squat with 16 kg: ${sets} x ${level <= 1 ? "8-10" : "6-8"}`,
    `Kettlebell Romanian deadlift with 2 x 16 kg: ${sets} x ${level <= 1 ? "10-12" : "8-10"}`,
    `Dumbbell press with 2 x 10 kg or dip progression: ${sets} x 8-12`,
    `Pull-up progression or hanging knee raise: ${sets} x 5-10`,
    `Farmers carry with 2 x 16 kg or water-bag carry (10-20 kg): ${sets} x ${level <= 1 ? "30-40 m" : "40-60 m"}`,
    "Dead bug + side plank: 2-3 rounds",
    "Grip finisher: powerball or grip donut, 2 easy rounds"
  ];
}

function hyroxRunBlock(week) {
  const level = hyroxLevelForWeek(week);
  if (isDeloadWeek(week)) return ["25-35 min easy run", "4 relaxed strides if legs feel good"];
  if (level === 0) return ["30-40 min easy run", "4 short relaxed strides"];
  if (level === 1) return ["10 min easy", "6 x 2 min steady / 2 min easy", "5-10 min cool-down"];
  if (level === 2) return ["10 min easy", "5 x 800 m controlled / 2 min walk-jog", "Easy finish"];
  if (level === 3) return ["10 min easy", "4-6 x 1 km at planned HYROX run rhythm / 90 sec easy", "Easy finish"];
  return ["20-30 min easy", "3 x 1 min smooth pickups"];
}

function hyroxSkillBlock(week) {
  const level = hyroxLevelForWeek(week);
  const rounds = isDeloadWeek(week) ? 2 : level <= 1 ? 3 : level === 2 ? 4 : 5;
  if (gymSpecificWeek(week)) {
    return [
      `${rounds} controlled rounds`,
      "Run 400-800 m",
      "SkiErg 500-750 m",
      "Sled push 2-4 lengths, light/moderate gym load",
      "Sled pull 2-4 lengths, light/moderate gym load",
      "Wall balls with 6 kg ball: 10-20 reps"
    ];
  }
  return [
    `${rounds} controlled rounds`,
    "Run 400-800 m",
    `Row ${level <= 1 ? "300 m" : level === 2 ? "500 m" : "750 m"}`,
    `Kettlebell swings with 16 kg ${level <= 1 ? "10-12" : "15-20"} reps`,
    `Weighted-vest treadmill march (5-10 kg) ${level <= 1 ? "2 min" : "3 min"}`,
    `Dumbbell thrusters with 2 x 10 kg ${level <= 1 ? "8-10" : "12-15"} reps`
  ];
}

function hyroxMixedBlock(week) {
  const level = hyroxLevelForWeek(week);
  const rounds = isDeloadWeek(week) ? 2 : level <= 1 ? 3 : level === 2 ? 4 : 5;
  return [
    `${rounds} steady rounds`,
    `${level <= 1 ? "500 m" : level === 2 ? "750 m" : "1 km"} run`,
    `${level <= 1 ? "300 m" : level === 2 ? "500 m" : "750 m"} row`,
    `Farmers carry with 2 x 16 kg ${level <= 1 ? "40 m" : "60 m"}`,
    `Water-bag lunges with 10-20 kg ${level <= 1 ? "6/leg" : "8-10/leg"}`
  ];
}

function hyroxSundayBlock(week) {
  const level = hyroxLevelForWeek(week);
  if (week >= 30) return ["20-30 min easy walk, bike, or jog", "Light hips and calves mobility"];
  if (level <= 1) return ["40-50 min easy row, bike, or walk", "10 min mobility"];
  if (level === 2) return ["50-60 min easy run, bike, or mixed engine work", "10 min mobility"];
  return ["45-60 min easy aerobic session", "10 min mobility and breathing reset"];
}

function hyroxSessionForDate(date, week) {
  const weekday = weekdayIndex(date);
  const taper = week >= 30;
  const isRaceDay = date === state.settings.eventDate;
  const gymWeek = gymSpecificWeek(week);

  if (isRaceDay) {
    return sessionTemplate({
      week,
      date,
      type: "HYROX",
      title: "HYROX Race Day",
      duration: 120,
      intensity: "Race effort",
      objective: "Stay calm, settle into the runs, and keep every station smooth enough to keep moving.",
      segments: [
        {
          title: "Race order",
          items: [
            "Run 1 km + SkiErg 1000 m",
            "Run 1 km + sled push 50 m (102/152/202 kg incl. sled by division)",
            "Run 1 km + sled pull 50 m (78/103/153 kg incl. sled by division)",
            "Run 1 km + burpee broad jumps 80 m",
            "Run 1 km + row 1000 m",
            "Run 1 km + farmers carry 200 m (2 x 16/24/32 kg by division)",
            "Run 1 km + sandbag lunges 100 m (10/20/30 kg by division)",
            "Run 1 km + wall balls 100 reps (4/6/9 kg by division)"
          ],
          checklist: [
            "Run 1 km + SkiErg 1000 m",
            "Run 1 km + sled push 50 m (102/152/202 kg incl. sled by division)",
            "Run 1 km + sled pull 50 m (78/103/153 kg incl. sled by division)",
            "Run 1 km + burpee broad jumps 80 m",
            "Run 1 km + row 1000 m",
            "Run 1 km + farmers carry 200 m (2 x 16/24/32 kg by division)",
            "Run 1 km + sandbag lunges 100 m (10/20/30 kg by division)",
            "Run 1 km + wall balls 100 reps (4/6/9 kg by division)"
          ]
        }
      ],
      notes: ["Start controlled.", "Walk briefly before your form collapses.", "Finish proud."],
      equipment: ["park", "gym", "raceLoads"],
      imageKey: "hyrox"
    });
  }

  if (week === TOTAL_PROGRAMME_WEEKS && date > state.settings.eventDate) {
    return sessionTemplate({
      week,
      date,
      type: "Recovery",
      title: "Post-Race Recovery",
      duration: 20,
      intensity: "Very easy",
      objective: "Let the body calm down and enjoy the fact that the work got done.",
      segments: [
        { title: "Reset", items: ["Easy walk or bike 10-20 min", "Gentle hips, calves, and back mobility"], checklist: ["Easy walk or bike 10-20 min", "Gentle hips, calves, and back mobility"] }
      ],
      notes: ["No punishment workout. No tests."],
      equipment: ["bike", "mat"],
      imageKey: "recovery",
      isRecovery: true
    });
  }

  if (weekday === 1) {
    return sessionTemplate({
      week,
      date,
      type: "Strength",
      title: taper ? "Light Strength Tune-Up" : "Strength + Core",
      duration: taper ? 30 : 55,
      intensity: taper ? "Easy" : "Moderate",
      objective: "Keep building the body that has to carry you through repeated runs and stations.",
      segments: [
        { title: "Strength block", items: hyroxStrengthBlock(week), checklist: hyroxStrengthBlock(week) }
      ],
      notes: ["Clean reps first. Load second."],
      equipment: ["kettlebells16", "dumbbells10", "bars", "bag", "mat"],
      imageKey: "strength"
    });
  }

  if (weekday === 2) {
    return sessionTemplate({
      week,
      date,
      type: "Run",
      title: "Run Quality",
      duration: taper ? 30 : 45,
      intensity: taper ? "Easy with strides" : "Controlled hard",
      objective: "Make the race runs feel familiar rather than dramatic.",
      segments: [
        { title: "Run work", items: hyroxRunBlock(week), checklist: hyroxRunBlock(week) }
      ],
      notes: ["The goal is rhythm, not proving anything in training."],
      equipment: ["treadmill", "park"],
      imageKey: "run"
    });
  }

  if (weekday === 3) {
    return sessionTemplate({
      week,
      date,
      type: "Recovery",
      title: "Zone 2 + Mobility",
      duration: taper ? 25 : 35,
      intensity: "Easy",
      objective: "Keep the engine moving while helping weight loss and recovery.",
      segments: [
        { title: "Aerobic reset", items: hyroxSundayBlock(week).slice(0, 1), checklist: hyroxSundayBlock(week).slice(0, 1) },
        { title: "Mobility", items: ["Calves, hips, hamstrings and upper back: 8-10 min"], checklist: ["Calves, hips, hamstrings and upper back: 8-10 min"] }
      ],
      notes: ["If life is heavy, make this a walk and leave it there."],
      equipment: ["bike", "rower", "mat"],
      imageKey: "recovery",
      isRecovery: true
    });
  }

  if (weekday === 4) {
    return sessionTemplate({
      week,
      date,
      type: "HYROX",
      title: taper ? "Technique Circuit" : gymWeek ? "Gym HYROX Skills" : "Home HYROX Skills",
      duration: taper ? 35 : 60,
      intensity: taper ? "Easy to moderate" : "Moderate",
      objective: "Build skill and pacing around the stations without turning every Thursday into a test day.",
      segments: [
        { title: "Skills circuit", items: hyroxSkillBlock(week), checklist: hyroxSkillBlock(week) }
      ],
      notes: [gymWeek ? "Gym access is strongly recommended here." : "Use home substitutions and keep the movement quality high."],
      equipment: gymWeek ? ["rower", "treadmill", "vest", "bag", "gym"] : ["rower", "treadmill", "vest", "dumbbells10", "bag"],
      imageKey: "hyrox"
    });
  }

  if (weekday === 5) {
    return sessionTemplate({
      week,
      date,
      type: "Rest",
      title: "Rest Day",
      duration: 0,
      intensity: "Off",
      objective: "Recover properly before the weekend mixed work.",
      segments: [{ title: "Rest", items: ["Rest", "Optional 5-10 min gentle mobility"], checklist: [] }],
      notes: ["Let rest stay rest."],
      equipment: [],
      imageKey: "recovery",
      isRecovery: true
    });
  }

  if (weekday === 6) {
    return sessionTemplate({
      week,
      date,
      type: "Mixed",
      title: taper ? "Short Mixed Rehearsal" : "Compromised Running",
      duration: taper ? 40 : 75,
      intensity: taper ? "Controlled" : "Moderate to hard",
      objective: "Teach the body to run after stations and keep the effort honest without panic.",
      segments: [
        { title: "Mixed session", items: taper ? ["2 easy rounds", "400 m run", "250 m row", "Light carry with 10 kg or bodyweight lunges"] : hyroxMixedBlock(week), checklist: taper ? ["2 easy rounds", "400 m run", "250 m row", "Light carry with 10 kg or bodyweight lunges"] : hyroxMixedBlock(week) }
      ],
      notes: ["Steady pressure, not chaos."],
      equipment: ["rower", "treadmill", "kettlebells16", "bag", "park"],
      imageKey: "mixed"
    });
  }

  return sessionTemplate({
    week,
    date,
    type: "Recovery",
    title: taper ? "Walk + Mobility" : "Long Easy Aerobic",
    duration: taper ? 25 : 50,
    intensity: "Easy",
    objective: "Top up the aerobic base and let the harder sessions settle.",
    segments: [
      { title: "Aerobic support", items: hyroxSundayBlock(week), checklist: hyroxSundayBlock(week) }
    ],
    notes: ["This should leave you better than it found you."],
    equipment: ["bike", "rower", "park", "mat"],
    imageKey: "recovery",
    isRecovery: true
  });
}

function plannedWorkoutForDate(date = state.activeDate) {
  const week = programmeWeek(date);
  if (date < state.settings.programmeStart) {
    return sessionTemplate({
      week: 0,
      date,
      type: "Prep",
      title: "Pre-Start Prep",
      duration: 20,
      intensity: "Easy",
      objective: "Leave proper training for Monday 10 August 2026 and use today to sort the basics.",
      segments: [
        { title: "Prep", items: ["10-20 min easy walk or bike", "Check shoes, kit, and weekly schedule"], checklist: ["10-20 min easy walk or bike", "Check shoes, kit, and weekly schedule"] }
      ],
      notes: ["Everything should feel deliberately easy."],
      equipment: ["bike", "park"],
      imageKey: "recovery",
      isRecovery: true
    });
  }
  return week <= 26 ? runSessionForDate(date, week) : hyroxSessionForDate(date, week);
}

function weeklyScheduleForWeek(week) {
  return weekDates(week).map(date => plannedWorkoutForDate(date));
}

function sessionDistanceKm(session) {
  const text = session.segments.flatMap(segment => segment.items).join(" ");
  const km = Array.from(text.matchAll(/(\d+(?:\.\d+)?)\s*km/gi)).reduce((sum, match) => sum + Number(match[1]), 0);
  const miles = Array.from(text.matchAll(/(\d+(?:\.\d+)?)\s*mi\b/gi)).reduce((sum, match) => sum + Number(match[1]) * 1.60934, 0);
  return km + miles;
}

function equipmentForSessions(sessions) {
  const order = Object.keys(baseKit);
  const ids = new Set(sessions.flatMap(session => session.equipment || []));
  return Array.from(ids)
    .sort((a, b) => order.indexOf(a) - order.indexOf(b))
    .map(key => ({ key, label: baseKit[key] || key }));
}

function programmeEquipmentHtml(sessions) {
  const equipment = equipmentForSessions(sessions);
  const needsGym = equipment.some(item => item.key === "gym");
  const note = needsGym
    ? "Gym recommended this week for station-specific work."
    : "Home-friendly if you have the listed kit available.";
  return `
    <section class="panel equipment-panel">
      <div class="panel-head">
        <div>
          <p class="eyebrow">Equipment check</p>
          <h2>Kit and loading for this week</h2>
        </div>
        <span class="meta-pill">${needsGym ? "Gym" : "Home"}</span>
      </div>
      <p class="panel-copy">${note}</p>
      <div class="equipment-list">
        ${equipment.length ? equipment.map(item => `<span>${escapeHtml(item.label)}</span>`).join("") : "<span>No equipment needed</span>"}
      </div>
    </section>
  `;
}

function latestCheckin() {
  return Object.entries(state.checkins).sort(([a], [b]) => b.localeCompare(a))[0]?.[1] || {};
}

function readinessLabel(checkin = {}) {
  const sleep = Number(checkin.sleepHours) || 0;
  const energy = Number(checkin.energy) || 0;
  if (sleep >= 7 && energy >= 7) return "Ready";
  if (sleep >= 5.5 && energy >= 5) return "Steady";
  return "Ease in";
}

function weekLogs(week = programmeWeek()) {
  const dates = new Set(weekDates(week));
  return state.workoutLogs.filter(log => dates.has(log.date));
}

function logForSession(session) {
  return state.workoutLogs.find(log => log.date === session.date && log.workoutId === session.id) || null;
}

function upsertSessionLog(session, updates = {}) {
  let log = logForSession(session);
  if (!log) {
    log = {
      id: uid("workout"),
      date: session.date,
      workoutId: session.id,
      title: session.title,
      status: "",
      duration: "",
      distance: "",
      effort: "",
      notes: "",
      completedExercises: [],
      plannedChecklist: session.checklist
    };
    state.workoutLogs.push(log);
  }
  Object.assign(log, {
    title: session.title,
    plannedChecklist: session.checklist,
    ...updates
  });
  return log;
}

function workoutCompletion(log) {
  const planned = Array.isArray(log?.plannedChecklist) ? log.plannedChecklist.length : 0;
  const completed = Array.isArray(log?.completedExercises) ? log.completedExercises.length : 0;
  if (!planned) return 0;
  return Math.round((completed / planned) * 100);
}

function completedWorkoutsThisWeek(week = programmeWeek()) {
  return weekLogs(week).filter(log => ["Completed", "Partial"].includes(log.status)).length;
}

function workoutStreak() {
  const completeDates = new Set(state.workoutLogs.filter(log => log.status === "Completed").map(log => log.date));
  let streak = 0;
  for (let date = todayISO(); completeDates.has(date); date = addDays(date, -1)) streak += 1;
  return streak;
}

function longestLoggedRunKm() {
  return state.workoutLogs.reduce((max, log) => Math.max(max, Number(log.distance) || 0), 0);
}

function totalLoggedDistanceKm() {
  return state.workoutLogs.reduce((sum, log) => sum + (Number(log.distance) || 0), 0);
}

function daysToEvent() {
  return Math.max(0, isoDaysBetween(todayISO(), state.settings.eventDate));
}

function openGuide(session) {
  guideSession = session;
  const modal = document.getElementById("guideModal");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  renderGuide();
}

function closeGuide() {
  guideSession = null;
  const modal = document.getElementById("guideModal");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}

function printGuide() {
  if (!guideSession) return;
  document.body.classList.add("printing-guide");
  window.print();
}

function printableSetRow(line, section) {
  const setMatch = line.match(/:\s*(\d+)\s*x\s*(.+)$/i);
  if (setMatch) {
    return {
      section,
      name: line.slice(0, setMatch.index).trim(),
      target: `${setMatch[1]} x ${setMatch[2]}`,
      sets: Number(setMatch[1])
    };
  }

  const roundMatch = line.match(/^(\d+)\s+(?:easy |relaxed |steady |controlled )?rounds?/i);
  if (roundMatch) {
    return { section, name: line, target: "Round", sets: Number(roundMatch[1]) };
  }

  const targetMatch = line.match(/:\s*(.+)$/);
  const targetRoundMatch = line.match(/:\s*(\d+)(?:-(\d+))?\s+.*rounds?/i);
  if (targetMatch && targetRoundMatch) {
    return {
      section,
      name: line.slice(0, targetMatch.index).trim(),
      target: targetMatch[1],
      sets: Number(targetRoundMatch[2] || targetRoundMatch[1])
    };
  }

  return {
    section,
    name: targetMatch ? line.slice(0, targetMatch.index).trim() : line,
    target: targetMatch ? targetMatch[1] : "Complete",
    sets: 1
  };
}

function printableSetTrackerHtml(session) {
  const rows = session.segments.flatMap(segment =>
    segment.items.map(item => printableSetRow(item, segment.title))
  );
  const maxSets = Math.min(6, Math.max(1, ...rows.map(row => row.sets)));
  return `
    <section class="guide-block print-set-tracker">
      <h3>Set tracker</h3>
      <table>
        <thead>
          <tr>
            <th>Block</th>
            <th>Work</th>
            <th>Target</th>
            ${Array.from({ length: maxSets }, (_, index) => `<th>Set ${index + 1}</th>`).join("")}
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          ${rows.map(row => `
            <tr>
              <td>${escapeHtml(row.section)}</td>
              <td>${escapeHtml(row.name)}</td>
              <td>${escapeHtml(row.target)}</td>
              ${Array.from({ length: maxSets }, (_, index) => `<td>${index < row.sets ? '<span class="print-checkbox"></span>' : ""}</td>`).join("")}
              <td></td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </section>
  `;
}

function renderGuide() {
  const container = document.getElementById("guideContent");
  if (!guideSession) {
    container.innerHTML = "";
    return;
  }
  const image = workoutImages[guideSession.imageKey] || workoutImages.recovery;
  container.innerHTML = `
    <div class="guide-layout">
      <figure class="guide-figure">
        <img src="${image.src}" alt="${escapeAttr(image.title)}">
        <figcaption>${image.caption}</figcaption>
      </figure>
      <div class="guide-copy">
        <div class="guide-title-row">
          <div>
            <p class="eyebrow">${guideSession.type}</p>
            <h2 id="guideTitle">${guideSession.title}</h2>
          </div>
          <button class="secondary-btn compact-btn guide-actions" type="button" data-print-guide="true">Print / PDF</button>
        </div>
        <p class="guide-lead">${guideSession.objective}</p>
        <div class="guide-meta">
          <span>${guideSession.day} ${guideSession.date}</span>
          <span>${guideSession.duration} min</span>
          <span>${guideSession.intensity}</span>
        </div>
        ${printableSetTrackerHtml(guideSession)}
        ${guideSession.segments.map(segment => `
          <section class="guide-block">
            <h3>${segment.title}</h3>
            <ul>${segment.items.map(item => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
          </section>
        `).join("")}
        <section class="guide-block">
          <h3>Equipment</h3>
          <p>${guideSession.equipment.length ? guideSession.equipment.map(key => baseKit[key] || key).join(", ") : "No equipment needed."}</p>
        </section>
        <section class="guide-block">
          <h3>Notes</h3>
          <ul>${guideSession.notes.map(item => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
        </section>
      </div>
    </div>
  `;
}

function navigate(route) {
  if (!ROUTES.includes(route)) return;
  currentRoute = route;
  renderRoutes();
  render();
}

function renderRoutes() {
  document.querySelectorAll(".route").forEach(route => route.classList.toggle("active", route.id === currentRoute));
  document.querySelectorAll(".nav-btn").forEach(btn => btn.classList.toggle("active", btn.dataset.route === currentRoute));
  document.getElementById("mainNav").classList.remove("open");
}

function render() {
  const phase = phaseForWeek(programmeWeek());
  document.documentElement.style.setProperty("--accent", phase.color);
  document.getElementById("eventCountdown").textContent = `${daysToEvent()} days to race`;
  renderDashboard();
  renderToday();
  renderProgramme();
  renderReviews();
  renderProgress();
  renderSettings();
  renderGuide();
}

function renderDashboard() {
  const week = programmeWeek();
  const phase = phaseForWeek(week);
  const todaySession = plannedWorkoutForDate();
  const latest = latestCheckin();
  const weekSessions = weeklyScheduleForWeek(week);
  const weekLogsList = weekLogs(week);
  const requiredSessions = weekSessions.filter(session => session.type !== "Rest" && !session.isRecovery).length;
  const currentWeight = latest.weight ? `${latest.weight} kg` : "Not logged";
  setText("dashboardPhase", `${phase.name} · Week ${week}`);
  setText("dashboardTitle", `${todaySession.day}: ${todaySession.title}`);
  setText("dashboardFocus", phase.focus);
  renderCards("dashboardCards", [
    ["Today", todaySession.type, `${todaySession.duration} min`],
    ["Week progress", `${completedWorkoutsThisWeek(week)}/${requiredSessions}`, "completed or partial"],
    ["Days to race", daysToEvent(), state.settings.eventDate],
    ["Current weight", currentWeight, "latest check-in"],
    ["Streak", `${workoutStreak()} days`, "completed workouts"],
    ["Longest logged run", `${longestLoggedRunKm().toFixed(1)} km`, "to date"]
  ]);

  document.getElementById("dashboardToday").innerHTML = `
    <div class="panel-head">
      <div>
        <p class="eyebrow">Today's session</p>
        <h2>${todaySession.title}</h2>
      </div>
      <button class="secondary-btn compact-btn" type="button" data-guide="${todaySession.id}">View guide</button>
    </div>
    <div class="fact-list">
      <div><span>Type</span><b>${todaySession.type}</b></div>
      <div><span>Intensity</span><b>${todaySession.intensity}</b></div>
      <div><span>Duration</span><b>${todaySession.duration} min</b></div>
      <div><span>Readiness</span><b>${readinessLabel(state.checkins[state.activeDate] || latest)}</b></div>
    </div>
    <ol class="mini-list">${todaySession.checklist.slice(0, 5).map(item => `<li>${escapeHtml(item)}</li>`).join("")}</ol>
  `;

  document.getElementById("dashboardWeek").innerHTML = `
    <div class="panel-head">
      <div>
        <p class="eyebrow">This week</p>
        <h2>Week ${week} rhythm</h2>
      </div>
    </div>
    <div class="week-strip">
      ${weekSessions.map(session => {
        const log = logForSession(session);
        return `
          <button class="day-chip ${log?.status === "Completed" ? "done" : ""}" type="button" data-guide="${session.id}">
            <strong>${session.day}</strong>
            <span>${session.title}</span>
          </button>
        `;
      }).join("")}
    </div>
    <div class="fact-list compact">
      <div><span>Review</span><b>${state.weeklyReviews[week]?.headline ? "Saved" : "Due"}</b></div>
      <div><span>Logged sessions</span><b>${weekLogsList.length}</b></div>
      <div><span>Total distance</span><b>${weekLogsList.reduce((sum, log) => sum + (Number(log.distance) || 0), 0).toFixed(1)} km</b></div>
      <div><span>Focus</span><b>${phase.name}</b></div>
    </div>
  `;
}

function renderToday() {
  const session = plannedWorkoutForDate();
  const dateInput = document.getElementById("activeDate");
  if (dateInput.value !== state.activeDate) dateInput.value = state.activeDate;
  const checkin = state.checkins[state.activeDate] || {};
  const log = logForSession(session) || {};
  document.getElementById("readinessBadge").textContent = readinessLabel(checkin);
  document.getElementById("checkinForm").innerHTML = [
    inputField("weight", "Weight", "number", checkin.weight, "kg", "0.1"),
    inputField("sleepHours", "Sleep", "number", checkin.sleepHours, "hours", "0.1"),
    inputField("energy", "Energy", "range", checkin.energy || 6, "1-10", "1", 1, 10),
    textareaField("notes", "Check-in note", checkin.notes)
  ].join("");

  document.getElementById("todaysWorkout").innerHTML = `
    <div class="panel-head">
      <div>
        <p class="eyebrow">Workout tracker</p>
        <h2>${session.title}</h2>
      </div>
      <button class="secondary-btn compact-btn" type="button" data-guide="${session.id}">View guide</button>
    </div>
    <div class="fact-list">
      <div><span>Type</span><b>${session.type}</b></div>
      <div><span>Duration</span><b>${session.duration} min</b></div>
      <div><span>Intensity</span><b>${session.intensity}</b></div>
      <div><span>Progress</span><b>${log.status || "Not saved"}</b></div>
    </div>
    <p class="panel-copy">${session.objective}</p>
    ${session.segments.map(segment => `
      <div class="segment-block">
        <h3>${segment.title}</h3>
        <div class="exercise-list">
          ${(segment.checklist || []).map(item => {
            const index = session.checklist.indexOf(item);
            const checked = Array.isArray(log.completedExercises) && log.completedExercises.includes(index);
            return `
              <label class="exercise-check">
                <input type="checkbox" data-check-index="${index}" ${checked ? "checked" : ""}>
                <span>${escapeHtml(item)}</span>
              </label>
            `;
          }).join("")}
        </div>
      </div>
    `).join("")}
    <form id="workoutLogForm" class="form-grid">
      ${selectField("status", "Status", ["", "Completed", "Partial", "Skipped"], log.status || "")}
      ${inputField("duration", "Actual duration", "number", log.duration, "minutes")}
      ${inputField("distance", "Distance", "number", log.distance, "km", "0.1")}
      ${inputField("effort", "Effort", "range", log.effort || 6, "1-10", "1", 1, 10)}
      ${textareaField("notes", "Session note", log.notes)}
      <div class="button-row span-2">
        <button id="saveWorkoutLog" class="primary-btn" type="button">Save workout</button>
      </div>
    </form>
  `;
}

function renderProgramme() {
  const week = state.activeWeek || programmeWeek();
  const select = document.getElementById("weekSelect");
  if (!select.options.length) {
    select.innerHTML = Array.from({ length: TOTAL_PROGRAMME_WEEKS }, (_, index) => `<option value="${index + 1}">Week ${index + 1}</option>`).join("");
  }
  select.value = week;
  const phase = phaseForWeek(week);
  const sessions = weeklyScheduleForWeek(week);
  document.getElementById("phaseTimeline").innerHTML = phases.map(item => `
    <button class="phase-chip ${item.name === phase.name ? "active" : ""}" type="button" data-phase-week="${item.weeks[0]}" style="--chip:${item.color}">
      <strong>${item.name}</strong>
      <span>Weeks ${item.weeks[0]}-${item.weeks[1]}</span>
    </button>
  `).join("");
  document.getElementById("weekSummary").innerHTML = `
    <div><span>Phase</span><b>${phase.name}</b></div>
    <div><span>Focus</span><b>${phase.focus}</b></div>
    <div><span>Planned distance</span><b>${sessions.reduce((sum, session) => sum + sessionDistanceKm(session), 0).toFixed(1)} km</b></div>
  `;
  document.getElementById("equipmentSummary").innerHTML = programmeEquipmentHtml(sessions);
  document.getElementById("weekPlan").innerHTML = sessions.map(sessionCardHtml).join("");
}

function renderReviews() {
  const week = state.activeWeek || programmeWeek();
  const select = document.getElementById("reviewWeekSelect");
  if (!select.options.length) {
    select.innerHTML = Array.from({ length: TOTAL_PROGRAMME_WEEKS }, (_, index) => `<option value="${index + 1}">Week ${index + 1}</option>`).join("");
  }
  select.value = week;
  const review = state.weeklyReviews[week] || {};
  const sessions = weeklyScheduleForWeek(week);
  const logs = weekLogs(week);
  const requiredSessions = sessions.filter(session => session.type !== "Rest" && !session.isRecovery).length;
  renderCards("reviewSummaryCards", [
    ["Week", week, phaseForWeek(week).name],
    ["Logged", `${logs.length}/${sessions.length}`, "all session entries"],
    ["Done", `${completedWorkoutsThisWeek(week)}/${requiredSessions}`, "completed or partial"],
    ["Distance", `${logs.reduce((sum, log) => sum + (Number(log.distance) || 0), 0).toFixed(1)} km`, "logged"]
  ]);
  document.getElementById("weeklyReviewForm").innerHTML = [
    textareaField("headline", "Headline", review.headline),
    textareaField("wins", "What went well?", review.wins),
    textareaField("friction", "What felt hard?", review.friction),
    textareaField("adjust", "What changes next week?", review.adjust),
    inputField("confidence", "Confidence", "range", review.confidence || 6, "1-10", "1", 1, 10),
    '<div class="button-row span-2"><button id="saveWeeklyReview" class="primary-btn" type="button">Save review</button></div>'
  ].join("");
  document.getElementById("reviewArchive").innerHTML = Array.from({ length: TOTAL_PROGRAMME_WEEKS }, (_, index) => {
    const reviewWeek = index + 1;
    const saved = state.weeklyReviews[reviewWeek];
    return `
      <article class="archive-row ${saved ? "saved" : ""}">
        <strong>Week ${reviewWeek}</strong>
        <span>${phaseForWeek(reviewWeek).name}</span>
        <p>${saved?.headline || "No review saved yet."}</p>
      </article>
    `;
  }).join("");
}

function renderProgress() {
  const latest = latestCheckin();
  renderCards("progressCards", [
    ["Completed workouts", state.workoutLogs.filter(log => log.status === "Completed").length, "all time"],
    ["Current streak", `${workoutStreak()} days`, "completed workouts"],
    ["Longest logged run", `${longestLoggedRunKm().toFixed(1)} km`, "all time"],
    ["Total logged distance", `${totalLoggedDistanceKm().toFixed(1)} km`, "all time"],
    ["Latest weight", latest.weight ? `${latest.weight} kg` : "Not logged", "latest check-in"],
    ["Latest sleep", latest.sleepHours ? `${latest.sleepHours} h` : "Not logged", "latest check-in"]
  ]);
  const logs = state.workoutLogs.slice().sort((a, b) => b.date.localeCompare(a.date)).slice(0, 18);
  document.getElementById("workoutLogList").innerHTML = logs.length ? logs.map(log => `
    <article class="table-row">
      <div>${log.date}</div>
      <div>${escapeHtml(log.title || "Workout")}</div>
      <div>${log.status || "-"}</div>
      <div>${log.duration ? `${log.duration} min` : "-"}</div>
      <div>${log.distance ? `${log.distance} km` : "-"}</div>
      <div>${log.notes ? escapeHtml(log.notes) : `${workoutCompletion(log)}% checklist complete`}</div>
    </article>
  `).join("") : emptyState("No workouts logged yet.");
}

function renderSettings() {
  document.getElementById("settingsForm").innerHTML = [
    inputField("programmeStart", "Programme start", "date", state.settings.programmeStart, ""),
    inputField("eventDate", "HYROX date", "date", state.settings.eventDate, ""),
    inputField("weeklyWorkoutTarget", "Weekly target", "number", state.settings.weeklyWorkoutTarget, "sessions"),
    '<div class="span-2 form-note">Import/export is available here. The app syncs locally first and will also save to the API when it is online.</div>'
  ].join("");
}

function sessionCardHtml(session) {
  const log = logForSession(session);
  return `
    <article class="session-card ${log?.status === "Completed" ? "done" : ""}">
      <div class="session-top">
        <span>${session.day} ${session.date.slice(5)}</span>
        <span>${session.type}</span>
      </div>
      <h3>${session.title}</h3>
      <p>${session.objective}</p>
      <div class="detail-grid">
        <div><span>Duration</span><b>${session.duration} min</b></div>
        <div><span>Intensity</span><b>${session.intensity}</b></div>
        <div><span>Status</span><b>${log?.status || "Not logged"}</b></div>
      </div>
      <ol class="mini-list">${session.checklist.slice(0, 4).map(item => `<li>${escapeHtml(item)}</li>`).join("")}</ol>
      <div class="card-actions">
        <button class="secondary-btn compact-btn" type="button" data-guide="${session.id}">View guide</button>
      </div>
    </article>
  `;
}

function renderCards(id, cards) {
  document.getElementById(id).innerHTML = cards.map(([label, value, sub]) => `
    <article class="summary-card">
      <span>${label}</span>
      <strong>${value}</strong>
      <small>${sub}</small>
    </article>
  `).join("");
}

function inputField(name, label, type, value = "", hint = "", step = "", min = "", max = "") {
  return `<label><span>${label}</span><input name="${name}" type="${type}" value="${escapeAttr(value ?? "")}" placeholder="${escapeAttr(hint)}" ${step ? `step="${step}"` : ""} ${min !== "" ? `min="${min}"` : ""} ${max !== "" ? `max="${max}"` : ""}></label>`;
}

function textareaField(name, label, value = "") {
  return `<label class="span-2"><span>${label}</span><textarea name="${name}">${escapeHtml(value || "")}</textarea></label>`;
}

function selectField(name, label, options, value = "") {
  return `<label><span>${label}</span><select name="${name}">${options.map(option => `<option ${option === value ? "selected" : ""}>${option}</option>`).join("")}</select></label>`;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[char]));
}

function escapeAttr(value) {
  return escapeHtml(value);
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function formObject(form) {
  return Object.fromEntries(new FormData(form).entries());
}

function emptyState(text) {
  return `<div class="empty-state">${text}</div>`;
}

function toast(message) {
  const el = document.getElementById("toast");
  el.textContent = message;
  el.classList.add("show");
  setTimeout(() => el.classList.remove("show"), 1800);
}

function updateCheckinFromForm() {
  state.checkins[state.activeDate] = {
    ...(state.checkins[state.activeDate] || {}),
    ...formObject(document.getElementById("checkinForm")),
    date: state.activeDate
  };
  saveState();
  renderDashboard();
  renderToday();
}

function toggleChecklistItem(index, checked) {
  const session = plannedWorkoutForDate();
  const log = upsertSessionLog(session);
  const set = new Set(log.completedExercises || []);
  if (checked) set.add(index);
  else set.delete(index);
  log.completedExercises = Array.from(set).sort((a, b) => a - b);
  if (!log.status) {
    log.status = log.completedExercises.length === session.checklist.length ? "Completed" : log.completedExercises.length ? "Partial" : "";
  } else if (log.status !== "Skipped") {
    log.status = log.completedExercises.length === session.checklist.length ? "Completed" : log.completedExercises.length ? "Partial" : log.status;
  }
  saveState();
  renderDashboard();
  renderToday();
  renderProgress();
}

function saveWorkoutLog() {
  const session = plannedWorkoutForDate();
  const data = formObject(document.getElementById("workoutLogForm"));
  const log = upsertSessionLog(session, data);
  if (!data.status) {
    log.status = log.completedExercises.length === session.checklist.length ? "Completed" : log.completedExercises.length ? "Partial" : "";
  }
  saveState();
  render();
  toast("Workout saved");
}

function saveWeeklyReview() {
  const week = Number(document.getElementById("reviewWeekSelect").value);
  state.weeklyReviews[week] = formObject(document.getElementById("weeklyReviewForm"));
  saveState();
  renderReviews();
  renderDashboard();
  toast("Weekly review saved");
}

function exportState() {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `hyrox-planner-${todayISO()}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

async function importState(file) {
  if (!file) return;
  try {
    const text = await file.text();
    state = normaliseState(JSON.parse(text));
    saveState();
    renderRoutes();
    render();
    toast("Data imported");
  } catch {
    toast("Import failed");
  }
}

function findSessionById(id) {
  for (let week = 1; week <= TOTAL_PROGRAMME_WEEKS; week += 1) {
    const match = weeklyScheduleForWeek(week).find(session => session.id === id);
    if (match) return match;
  }
  return null;
}

document.addEventListener("click", event => {
  const routeTarget = event.target.closest("[data-route]");
  if (routeTarget) {
    navigate(routeTarget.dataset.route);
    return;
  }

  const shiftTarget = event.target.closest("[data-day-shift]");
  if (shiftTarget) {
    state.activeDate = addDays(state.activeDate, Number(shiftTarget.dataset.dayShift));
    state.activeWeek = programmeWeek(state.activeDate);
    saveState();
    render();
    return;
  }

  if (event.target.id === "mobileMenuToggle") {
    document.getElementById("mainNav").classList.toggle("open");
  }
  if (event.target.id === "saveWorkoutLog") saveWorkoutLog();
  if (event.target.id === "saveWeeklyReview") saveWeeklyReview();
  if (event.target.id === "exportState") exportState();
  if (event.target.id === "closeGuide" || event.target.dataset.closeGuide === "true") closeGuide();
  if (event.target.closest("[data-print-guide]")) printGuide();

  const guideTarget = event.target.closest("[data-guide]");
  if (guideTarget) {
    const session = findSessionById(guideTarget.dataset.guide) || plannedWorkoutForDate();
    openGuide(session);
  }

  const phaseTarget = event.target.closest("[data-phase-week]");
  if (phaseTarget) {
    state.activeWeek = Number(phaseTarget.dataset.phaseWeek);
    saveState();
    renderProgramme();
  }
});

document.addEventListener("change", event => {
  if (event.target.id === "activeDate") {
    state.activeDate = event.target.value || todayISO();
    state.activeWeek = programmeWeek(state.activeDate);
    saveState();
    render();
  }
  if (event.target.name && event.target.closest("#checkinForm")) {
    updateCheckinFromForm();
  }
  if (event.target.dataset.checkIndex) {
    toggleChecklistItem(Number(event.target.dataset.checkIndex), event.target.checked);
  }
  if (event.target.id === "weekSelect") {
    state.activeWeek = Number(event.target.value);
    saveState();
    renderProgramme();
  }
  if (event.target.id === "reviewWeekSelect") {
    state.activeWeek = Number(event.target.value);
    saveState();
    renderReviews();
  }
  if (event.target.name && event.target.closest("#settingsForm")) {
    state.settings = {
      ...state.settings,
      ...formObject(document.getElementById("settingsForm"))
    };
    saveState();
    render();
  }
  if (event.target.id === "importState") {
    importState(event.target.files?.[0]);
  }
});

window.addEventListener("keydown", event => {
  if (event.key === "Escape" && guideSession) closeGuide();
});

window.addEventListener("afterprint", () => {
  document.body.classList.remove("printing-guide");
});

async function startApp() {
  history.scrollRestoration = "manual";
  renderRoutes();
  render();
  await loadRemoteState();
  render();
  setSaveStatus(apiOnline ? "Saved" : "Local");
}

startApp();
