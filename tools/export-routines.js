const fs = require("fs");
const path = require("path");

const PROGRAMME_START = "2026-08-10";
const EVENT_DATE = "2027-03-10";
const TOTAL_PROGRAMME_WEEKS = 31;
const DAY_MS = 86400000;

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
  { mon: "Rest", tue: "2.5 mi run", wed: "30 min cross", thu: "2 mi run", fri: "Rest", sat: "40 min cross", sun: "3 mi run" },
  { mon: "Rest", tue: "2.5 mi run", wed: "30 min cross", thu: "2 mi run", fri: "Rest", sat: "40 min cross", sun: "3.5 mi run" },
  { mon: "Rest", tue: "2.5 mi run", wed: "35 min cross", thu: "2 mi run", fri: "Rest", sat: "50 min cross", sun: "4 mi run" },
  { mon: "Rest", tue: "3 mi run", wed: "35 min cross", thu: "2 mi run", fri: "Rest", sat: "50 min cross", sun: "4 mi run" },
  { mon: "Rest", tue: "3 mi run", wed: "40 min cross", thu: "2 mi run", fri: "Rest", sat: "60 min cross", sun: "4.5 mi run" },
  { mon: "Rest", tue: "3 mi run", wed: "40 min cross", thu: "2 mi run", fri: "Rest", sat: "60 min cross", sun: "5 mi run" },
  { mon: "Rest", tue: "3 mi run", wed: "45 min cross", thu: "2 mi run", fri: "Rest", sat: "60 min cross", sun: "5.5 mi run" },
  { mon: "Rest", tue: "3 mi run", wed: "30 min cross", thu: "2 mi run", fri: "Rest", sat: "Rest", sun: "10K Run" }
];

function addDays(date, amount) {
  const d = new Date(`${date}T00:00:00`);
  d.setDate(d.getDate() + amount);
  return d.toISOString().slice(0, 10);
}

function weekdayIndex(date) {
  return new Date(`${date}T00:00:00`).getDay();
}

function weekdayName(date) {
  return ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][weekdayIndex(date)];
}

function weekdayShort(date) {
  return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][weekdayIndex(date)];
}

function weekDates(week) {
  return Array.from({ length: 7 }, (_, index) => addDays(PROGRAMME_START, (week - 1) * 7 + index));
}

function runPlanForWeek(week) {
  if (week <= 8) return beginner5kPlan[week - 1];
  if (week <= 16) return beginner10kPlan[week - 9];
  return null;
}

function runItemForDate(week, date) {
  const key = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"][weekdayIndex(date)];
  return runPlanForWeek(week)[key];
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

function hyroxStrengthWork(week) {
  const level = hyroxLevelForWeek(week);
  const sets = isDeloadWeek(week) ? 2 : level <= 1 ? 3 : 4;
  const reps = level <= 1 ? "10-12" : "8-10";
  const carries = level <= 1 ? "4 x 30-40 m" : level === 2 ? "5 x 50 m" : "6 x 50-60 m";
  return [
    "Warm-up: 5-8 min easy row, bike or treadmill walk",
    `Goblet squat or double-kettlebell front squat: ${sets} x ${reps}`,
    `Kettlebell Romanian deadlift: ${sets} x ${reps}`,
    `Dumbbell floor press, push-up or dip progression: ${sets} x 8-12`,
    `Pull-up progression, controlled negatives or hanging knee raise: ${sets} x 5-10`,
    `Farmers carry or water-bag bear-hug carry: ${carries}`,
    "Core: dead bug, side plank and leg raise, 2-3 controlled rounds",
    "Grip: powerball or grip donut, 2 short easy rounds"
  ];
}

function hyroxRunWork(week) {
  const level = hyroxLevelForWeek(week);
  if (isDeloadWeek(week)) return ["25-35 min easy run/walk", "4 relaxed strides if legs feel good", "Finish fresh"];
  if (level === 0) return ["30-40 min easy run/walk", "4 short relaxed strides", "Keep this comfortable"];
  if (level === 1) return ["10 min easy", "6 x 2 min steady / 2 min easy", "5-10 min cool-down"];
  if (level === 2) return ["10 min easy", "5 x 800 m controlled / 2 min walk-jog", "Stop before form fades"];
  if (level === 3) return ["10 min easy", "4-6 x 1 km at planned HYROX run effort / 90 sec easy", "Cool down easy"];
  return ["20-30 min easy", "3 x 1 min smooth", "No fitness testing"];
}

function hyroxCircuitWork(week) {
  const level = hyroxLevelForWeek(week);
  const rounds = isDeloadWeek(week) ? 2 : level <= 1 ? 3 : level === 2 ? 4 : 5;
  const run = level <= 1 ? "400 m run/walk" : level === 2 ? "600 m run" : "800 m controlled run";
  const row = level <= 1 ? "300 m smooth" : level === 2 ? "500 m steady" : "750 m steady";
  if (gymSpecificWeek(week)) {
    return [
      `${rounds} rounds at controlled race practice effort`,
      run,
      "SkiErg: 500-750 m smooth technique",
      "Sled push: 2-4 lengths, build load gradually",
      "Sled pull: 2-4 lengths, smooth rope work",
      "Wall balls: 3 x 10-20 clean reps",
      "Stop with one good rep still in the tank"
    ];
  }
  return [
    `${rounds} rounds at controlled effort`,
    run,
    `Rower: ${row}`,
    `Kettlebell swings or fast high pulls: ${level <= 1 ? "10-12" : "15-20"} reps`,
    `Incline treadmill march with vest or unloaded: ${level <= 1 ? "2 min" : "3 min"}`,
    `Water-bag lunges or reverse lunges: ${level <= 1 ? "6/leg" : "8-10/leg"}`,
    `Dumbbell thrusters: ${level <= 1 ? "8-10" : "12-15"} reps`,
    "Rest enough to keep movement tidy"
  ];
}

function strengthBlockA(week) {
  const level = week <= 4 ? 0 : week <= 8 ? 1 : week <= 12 ? 2 : 3;
  const sets = level <= 2 ? 3 : 4;
  return [
    `Goblet squat: ${sets} x 8-12`,
    `Dumbbell floor press or push-up: ${sets} x 8-12`,
    `Farmers carry with 16 kg kettlebells: ${sets} x 30-40 m`,
    "Dead bug: 3 x 8/side",
    "Front plank: 3 x 30-45 sec"
  ];
}

function strengthBlockB(week) {
  const level = week <= 4 ? 0 : week <= 8 ? 1 : week <= 12 ? 2 : 3;
  const sets = level <= 2 ? 3 : 4;
  return [
    `Kettlebell Romanian deadlift: ${sets} x 8-12`,
    `Reverse lunge: ${sets} x 6-8/leg`,
    `Pull-up negative, assisted pull-up or body-row pattern: ${sets} x 5-8`,
    "Hanging knee raise or lying leg raise: 3 x 8-12",
    "Side plank: 3 x 20-40 sec/side"
  ];
}

function strengthBlockC(week) {
  const level = week <= 4 ? 0 : week <= 8 ? 1 : week <= 12 ? 2 : 3;
  const sets = level <= 2 ? 3 : 4;
  return [
    "Bike or row easy warm-up: 5-8 min",
    `Weighted-vest step-up or split squat: ${sets} x 8/leg`,
    `Dumbbell row: ${sets} x 10-12/side`,
    `Water-bag bear hug carry: ${sets} x 30-40 m`,
    "Powerball or grip donut: 3 short rounds"
  ];
}

function runSessionForDate(date, week) {
  const item = runItemForDate(week, date);
  const plan = week <= 8 ? "5K" : "10K";
  const lower = item.toLowerCase();
  const weekday = weekdayIndex(date);
  if (week <= 8) {
    if (weekday === 1) return { type: "strength", title: "Strength A + Optional Run/Walk", work: [`${plan} plan: ${item}`, ...strengthBlockA(week)] };
    if (weekday === 2) return { type: "run", title: lower.includes("race") ? "5K Benchmark" : "Run Day", work: [`${plan} plan: ${item}`] };
    if (weekday === 3) return { type: "strength", title: "Strength B + Optional Run/Walk", work: [`${plan} plan: ${item}`, ...strengthBlockB(week)] };
    if (weekday === 4) return { type: "run", title: "Run + Core Finish", work: [`${plan} plan: ${item}`, "Core finish: dead bug, side plank, mobility"] };
    if (weekday === 5) return { type: "rest", title: "Rest Day", work: [`${plan} plan: Rest`] };
    if (weekday === 6) return { type: "run", title: "Weekend Run", work: [`${plan} plan: ${item}`] };
    return lower.includes("race")
      ? { type: "recovery", title: "5K Race Day", work: [`${plan} plan: ${item}`] }
      : { type: "cross-training", title: "Walk + Strength C", work: [`${plan} plan: ${item}`, ...strengthBlockC(week), "Mobility: calves, hips, hamstrings and upper back"] };
  }
  if (week >= 9 && week <= 16) {
    if (weekday === 1) return { type: "strength", title: "Strength A", work: [`${plan} plan: ${item}`, ...strengthBlockA(week)] };
    if (weekday === 2) return { type: "run", title: "Run Day", work: [`${plan} plan: ${item}`] };
    if (weekday === 3) return { type: "cross-training", title: "Cross-Training + Strength B", work: [`${plan} plan: ${item}`, ...strengthBlockB(week)] };
    if (weekday === 4) return { type: "run", title: "Run + Core Finish", work: [`${plan} plan: ${item}`, "Core finish: dead bug, side plank, mobility"] };
    if (weekday === 5) return { type: "rest", title: "Rest Day", work: [`${plan} plan: Rest`] };
    if (weekday === 6) return { type: "cross-training", title: "Cross-Training + Strength C", work: [`${plan} plan: ${item}`, ...strengthBlockC(week)] };
    return { type: "run", title: lower.includes("10k run") ? "10K Benchmark" : "Long Run", work: [`${plan} plan: ${item}`] };
  }
  if (lower.includes("race") || lower.includes("10k run")) return { type: "run", title: `${plan} Benchmark`, work: [`${plan} plan: ${item}`] };
  if (lower === "rest or run/walk") return { type: "optional", title: "Rest Or Run/Walk", work: [`${plan} plan: ${item}`] };
  if (lower.startsWith("rest")) return { type: "rest", title: "Rest Day", work: [`${plan} plan: ${item}`] };
  if (lower.includes("cross")) return { type: "cross-training", title: "Easy Cross-Training", work: [`${plan} plan: ${item}`] };
  if (lower.includes("walk")) return { type: "run", title: "Recovery Walk", work: [`${plan} plan: ${item}`] };
  return { type: "run", title: "Easy Run", work: [`${plan} plan: ${item}`] };
}

function hyroxSessionForDate(date, week) {
  const weekday = weekdayIndex(date);
  const level = hyroxLevelForWeek(week);
  const taper = week >= 30;
  if (date === EVENT_DATE) {
    return {
      type: "hyrox",
      title: "HYROX Race Day",
      work: [
        "Run 1 km + SkiErg 1000 m",
        "Run 1 km + sled push 50 m",
        "Run 1 km + sled pull 50 m",
        "Run 1 km + burpee broad jumps 80 m",
        "Run 1 km + row 1000 m",
        "Run 1 km + farmers carry 200 m",
        "Run 1 km + sandbag lunges 100 m",
        "Run 1 km + wall balls 100 reps"
      ]
    };
  }
  if (week === TOTAL_PROGRAMME_WEEKS && date > EVENT_DATE) return { type: "recovery", title: "Post-Race Recovery", work: ["Easy walk or bike 10-20 min", "Gentle hips, calves and back mobility", "No testing, no punishment"] };
  if (weekday === 1) return { type: "strength", title: taper ? "Light Strength Tune-Up" : level <= 1 ? "Strength + Core Base" : "Strength, Carries + Core", work: taper ? hyroxStrengthWork(week).slice(0, 5) : hyroxStrengthWork(week) };
  if (weekday === 2) return { type: "run", title: "Run Quality", work: hyroxRunWork(week) };
  if (weekday === 3) return { type: "recovery", title: "Zone 2 + Core", work: [taper ? "20-25 min easy bike, row or walk" : "30-35 min easy bike, row or treadmill walk", "Core: dead bug 2 x 8/side", "Core: side plank 2 x 20-40 sec/side", "Mobility: hips, calves and upper back"] };
  if (weekday === 4) return { type: "hyrox", title: taper ? "Technique Circuit" : gymSpecificWeek(week) ? "Gym HYROX Skills" : "Home HYROX Skills", work: taper ? hyroxCircuitWork(week).slice(0, 5) : hyroxCircuitWork(week) };
  if (weekday === 6) {
    const rounds = isDeloadWeek(week) ? 2 : level <= 1 ? 3 : level === 2 ? 4 : 5;
    return {
      type: "mixed",
      title: taper ? "Short Mixed Rehearsal" : "Compromised Running",
      work: taper ? ["2 relaxed rounds", "400 m run/walk", "250 m row", "Light carries or lunges", "Stop feeling sharp"] : [
        `${rounds} steady rounds`,
        `${level <= 1 ? "500 m" : level === 2 ? "750 m" : "1 km"} run/walk`,
        `${level <= 1 ? "300 m" : level === 2 ? "500 m" : "750 m"} row`,
        `Farmers carry: ${level <= 1 ? "40 m" : "60 m"}`,
        `Water-bag or reverse lunges: ${level <= 1 ? "6/leg" : "8-10/leg"}`,
        "Easy walk between rounds as needed"
      ]
    };
  }
  if (weekday === 5) return { type: "rest", title: "Rest Day", work: ["Rest", "Optional 5-10 min gentle mobility only"] };
  return { type: "recovery", title: `${weekdayShort(date)} Recovery Day`, work: ["10-30 min easy walk or bike", "5-10 min mobility", "No fatigue chasing today"] };
}

function sessionForDate(date, week) {
  return week <= 16 ? runSessionForDate(date, week) : hyroxSessionForDate(date, week);
}

function distanceKmFromText(text) {
  if (/10k/i.test(text)) return 10;
  if (/5k/i.test(text)) return 5;
  const km = text.match(/(\d+(?:\.\d+)?)\s*km/i);
  if (km) return Number(km[1]);
  const miles = text.match(/(\d+(?:\.\d+)?)\s*mi\b/i);
  if (miles) return Number(miles[1]) * 1.60934;
  const metres = text.match(/(\d+)\s*m\b/i);
  return metres ? Number(metres[1]) / 1000 : null;
}

function parseWorkout(line) {
  const sets = line.match(/:\s*(\d+)\s*x\s*(.+)$/i);
  if (sets) return { name: line.split(":")[0], sets: Number(sets[1]), reps: sets[2] };
  const rounds = line.match(/^(\d+)\s+(?:relaxed |steady )?rounds?/i);
  if (rounds) return { name: line, sets: Number(rounds[1]), reps: "round" };
  const distanceKm = distanceKmFromText(line);
  if (distanceKm) return { name: line, sets: 1, reps: `${Number(distanceKm.toFixed(2))} km`, distanceKm: Number(distanceKm.toFixed(2)) };
  const minutes = line.match(/(\d+)(?:-\d+)?\s*min/i);
  if (minutes) return { name: line, sets: 1, reps: minutes[0] };
  return { name: line, sets: 1, reps: "complete" };
}

function toRoutineItems(session, week, daySlug) {
  const workouts = session.work.map(parseWorkout);
  const primaryDistance = workouts.reduce((sum, workout) => sum + ((workout.distanceKm || 0) * (workout.sets || 1)), 0);
  const item = {
    id: `w${week}-${daySlug}-${session.type}`,
    type: session.type,
    label: session.title,
    workouts
  };
  if (session.type === "run" && primaryDistance) item.distanceKm = Number(primaryDistance.toFixed(2));
  return [item];
}

const routines = [];
for (let week = 1; week <= TOTAL_PROGRAMME_WEEKS; week += 1) {
  for (const date of weekDates(week)) {
    const session = sessionForDate(date, week);
    const daySlug = weekdayName(date).toLowerCase();
    routines.push({
      id: `week${week}-${daySlug}`,
      title: `Week ${week} ${weekdayName(date)}`,
      subtitle: session.title,
      items: toRoutineItems(session, week, daySlug)
    });
  }
}

const output = path.resolve(__dirname, "../exports/routines.json");
const appOutput = path.resolve(__dirname, "../routines.json");
fs.writeFileSync(output, `${JSON.stringify(routines, null, 2)}\n`);
fs.writeFileSync(appOutput, `${JSON.stringify(routines, null, 2)}\n`);
console.log(`Wrote ${routines.length} routine days to ${output} and ${appOutput}`);
