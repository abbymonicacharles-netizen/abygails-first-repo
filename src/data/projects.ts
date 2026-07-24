import type { Project } from "./types";

export const initialProjects: Project[] = [
  {
    id: "nebula-ops",
    title: "Nebula Ops",
    subtitle: "Realtime ops console for field robotics",
    genre: "robotics",
    collection: "Lab",
    favorite: true,
    archived: false,
    updatedAt: "2026-07-22",
    members: ["Abygail", "Jordan", "Sam"],
    theme: "futuristic",
    progress: 62,
    style: {
      coverColor: "#0f4c45",
      spineColor: "#083832",
      textColor: "#e8f5f2",
      texture: "speckle",
      decoration: { sticker: "⚡", bookmarkColor: "#d85a1f", icon: "bot" },
    },
    chapters: [
      {
        id: "ch-brain",
        title: "Brainstorming",
        pages: [
          {
            id: "p-ideas",
            title: "Mission ideas",
            type: "whiteboard",
            stickies: [
              { id: "s1", text: "Autonomous dock + swap", x: 8, y: 12, color: "#fde68a" },
              { id: "s2", text: "Live telemetry wall", x: 42, y: 28, color: "#bbf7d0" },
              { id: "s3", text: "Voice briefings for field crew", x: 22, y: 58, color: "#fecaca" },
              { id: "s4", text: "Offline-first maps", x: 58, y: 48, color: "#bae6fd" },
            ],
          },
          {
            id: "p-notes",
            title: "Discovery notes",
            type: "document",
            content:
              "Field teams need a single book for telemetry, checklists, and handoffs.\n\nConstraints: intermittent connectivity, harsh lighting, glove-friendly inputs.\n\nSuccess looks like: a robot status page that doubles as the daily briefing board.",
          },
        ],
      },
      {
        id: "ch-plan",
        title: "Planning",
        pages: [
          {
            id: "p-plan",
            title: "Sprint board",
            type: "kanban",
            kanban: [
              { id: "k1", title: "Define telemetry schema", column: "done", tags: ["data"] },
              { id: "k2", title: "Docking sequence mock", column: "doing", tags: ["hardware"] },
              { id: "k3", title: "Crew briefing template", column: "review", tags: ["ops"] },
              { id: "k4", title: "Offline map cache", column: "backlog", tags: ["mobile"] },
              { id: "k5", title: "Alert priority matrix", column: "backlog", tags: ["ux"] },
            ],
          },
          {
            id: "p-timeline",
            title: "Milestones",
            type: "timeline",
            timeline: [
              { id: "t1", label: "Concept freeze", date: "Jun 12", status: "done" },
              { id: "t2", label: "Hardware bench test", date: "Jul 8", status: "done" },
              { id: "t3", label: "Field pilot v1", date: "Jul 28", status: "active" },
              { id: "t4", label: "Ops handbook", date: "Aug 15", status: "upcoming" },
            ],
          },
        ],
      },
      {
        id: "ch-dev",
        title: "Development",
        pages: [
          {
            id: "p-checklist",
            title: "Build checklist",
            type: "checklist",
            checklist: [
              { id: "c1", title: "CAN bus adapter drivers", done: true, priority: "high", assignee: "Jordan" },
              { id: "c2", title: "Live map layer", done: false, priority: "high", due: "Jul 26", assignee: "Sam" },
              { id: "c3", title: "Voice note sync", done: false, priority: "medium", due: "Aug 2" },
            ],
          },
        ],
      },
      {
        id: "ch-meet",
        title: "Meetings",
        pages: [
          {
            id: "p-meet",
            title: "Weekly sync notes",
            type: "notebook",
            content:
              "Jul 21 — Pilot blockers: battery telemetry drift, map tiles too large for offline packs.\nAction: compress tiles, add calibration ritual page.",
          },
        ],
      },
    ],
    tasks: [
      { id: "task-1", title: "Calibrate dock sensors", done: false, priority: "high", due: "Jul 25", assignee: "Jordan" },
      { id: "task-2", title: "Draft field handbook chapter", done: false, priority: "medium", due: "Jul 30", assignee: "Abygail" },
      { id: "task-3", title: "Share Figma frame with crew", done: true, priority: "low", assignee: "Sam" },
    ],
    messages: [
      { id: "m1", author: "Jordan", text: "Dock mock is up — peek at Planning → Sprint board.", time: "09:14", channel: "project" },
      { id: "m2", author: "Sam", text: "Map cache under 80MB now. Ready for tablet test.", time: "10:02", channel: "project" },
      { id: "m3", author: "Abygail", text: "AI summary of yesterday’s call is on Meetings.", time: "11:20", channel: "project" },
    ],
    history: [
      { id: "h1", at: "Jul 22", label: "Added Field pilot milestone", kind: "milestone" },
      { id: "h2", at: "Jul 21", label: "Uploaded dock sequence sketches", kind: "upload" },
      { id: "h3", at: "Jul 20", label: "Team discussion on offline maps", kind: "discussion" },
      { id: "h4", at: "Jul 18", label: "Moved telemetry schema to Done", kind: "task" },
    ],
  },
  {
    id: "atelier-site",
    title: "Atelier Site",
    subtitle: "Brand site + launch campaign book",
    genre: "marketing",
    collection: "Studio",
    favorite: true,
    archived: false,
    updatedAt: "2026-07-20",
    members: ["Abygail", "Riley"],
    theme: "minimal",
    progress: 44,
    style: {
      coverColor: "#9a3412",
      spineColor: "#7c2d12",
      textColor: "#fff7ed",
      texture: "linen",
      decoration: { sticker: "◆", bookmarkColor: "#0f6e62", icon: "spark" },
    },
    chapters: [
      {
        id: "ch-mood",
        title: "Mood Boards",
        pages: [
          {
            id: "p-mood",
            title: "Visual direction",
            type: "moodboard",
            stickies: [
              { id: "ms1", text: "Cool mist greens", x: 12, y: 20, color: "#bbf7d0" },
              { id: "ms2", text: "Copper bookmarks", x: 48, y: 35, color: "#fed7aa" },
              { id: "ms3", text: "Syne headlines", x: 28, y: 62, color: "#e2e8f0" },
            ],
          },
        ],
      },
      {
        id: "ch-plan-m",
        title: "Planning",
        pages: [
          {
            id: "p-cal",
            title: "Launch calendar",
            type: "calendar",
            content: "Week of Jul 27: soft launch assets\nAug 4: soft launch\nAug 18: full campaign",
          },
          {
            id: "p-kanban-m",
            title: "Campaign board",
            type: "kanban",
            kanban: [
              { id: "mk1", title: "Hero photography brief", column: "done" },
              { id: "mk2", title: "Landing copy v2", column: "doing" },
              { id: "mk3", title: "Partner outreach list", column: "backlog" },
            ],
          },
        ],
      },
      {
        id: "ch-pres",
        title: "Presentations",
        pages: [
          {
            id: "p-pitch",
            title: "Pitch outline",
            type: "document",
            content:
              "1. The problem with folders\n2. Projects as books\n3. Chapters that match how teams think\n4. AI that lives inside the project",
          },
        ],
      },
    ],
    tasks: [
      { id: "mt1", title: "Finalize cover textures", done: false, priority: "medium", due: "Jul 24" },
      { id: "mt2", title: "Record launch teaser", done: false, priority: "high", due: "Jul 29", assignee: "Riley" },
    ],
    messages: [
      { id: "mm1", author: "Riley", text: "Mood board feels right — more linen, less neon.", time: "16:40", channel: "project" },
    ],
    history: [
      { id: "mh1", at: "Jul 20", label: "Updated visual direction stickies", kind: "edit" },
      { id: "mh2", at: "Jul 19", label: "Milestone: brand freeze", kind: "milestone" },
    ],
  },
  {
    id: "thesis-garden",
    title: "Thesis Garden",
    subtitle: "Research book for urban ecology study",
    genre: "research",
    collection: "School",
    favorite: false,
    archived: false,
    updatedAt: "2026-07-18",
    members: ["Abygail"],
    theme: "vintage",
    progress: 28,
    style: {
      coverColor: "#3d5a40",
      spineColor: "#2d4230",
      textColor: "#f0fdf4",
      texture: "canvas",
      decoration: { sticker: "✿", bookmarkColor: "#ca8a04", icon: "leaf" },
    },
    chapters: [
      {
        id: "ch-res",
        title: "Research",
        pages: [
          {
            id: "p-sources",
            title: "Source notebook",
            type: "notebook",
            content:
              "Key papers on green corridors and microclimate cooling.\nNeed interview scripts for community gardeners.",
          },
        ],
      },
      {
        id: "ch-write",
        title: "Writing",
        pages: [
          {
            id: "p-draft",
            title: "Chapter draft",
            type: "document",
            content:
              "Cities remember water. This chapter maps how pocket gardens reshape heat islands across East Trinidad neighborhoods.",
          },
          {
            id: "p-tasks-w",
            title: "Writing checklist",
            type: "checklist",
            checklist: [
              { id: "wc1", title: "Lit review outline", done: true, priority: "high" },
              { id: "wc2", title: "Interview guide", done: false, priority: "high", due: "Jul 27" },
              { id: "wc3", title: "Figure captions", done: false, priority: "low" },
            ],
          },
        ],
      },
    ],
    tasks: [
      { id: "rt1", title: "Schedule garden interviews", done: false, priority: "high", due: "Jul 26" },
    ],
    messages: [],
    history: [
      { id: "rh1", at: "Jul 18", label: "Started chapter draft", kind: "edit" },
    ],
  },
  {
    id: "frame-story",
    title: "Frame Story",
    subtitle: "Short film pre-production book",
    genre: "film",
    collection: "Studio",
    favorite: false,
    archived: false,
    updatedAt: "2026-07-15",
    members: ["Abygail", "Dev", "Maya"],
    theme: "fantasy",
    progress: 51,
    style: {
      coverColor: "#1f2937",
      spineColor: "#111827",
      textColor: "#f8fafc",
      texture: "leather",
      decoration: { sticker: "✦", bookmarkColor: "#e11d48", icon: "film" },
    },
    chapters: [
      {
        id: "ch-script",
        title: "Script",
        pages: [
          {
            id: "p-script",
            title: "Treatment",
            type: "document",
            content:
              "A courier delivers messages between two neighborhoods that no longer share a map. Night scenes; practical lights; minimal VFX.",
          },
        ],
      },
      {
        id: "ch-prod",
        title: "Production",
        pages: [
          {
            id: "p-shots",
            title: "Shot board",
            type: "kanban",
            kanban: [
              { id: "fk1", title: "Alley night master", column: "doing", tags: ["night"] },
              { id: "fk2", title: "Courier close-ups", column: "backlog", tags: ["portrait"] },
              { id: "fk3", title: "Bridge establishing", column: "review", tags: ["wide"] },
            ],
          },
        ],
      },
    ],
    tasks: [
      { id: "ft1", title: "Scout night locations", done: false, priority: "high", due: "Jul 28", assignee: "Dev" },
    ],
    messages: [
      { id: "fm1", author: "Maya", text: "Mood stills dropped in Resources.", time: "19:05", channel: "project" },
    ],
    history: [
      { id: "fh1", at: "Jul 15", label: "Locked treatment v3", kind: "milestone" },
    ],
  },
  {
    id: "ledger-ops",
    title: "Ledger Ops",
    subtitle: "Internal tooling for finance ops",
    genre: "business",
    collection: "Work",
    favorite: false,
    archived: false,
    updatedAt: "2026-07-10",
    members: ["Abygail", "Chris"],
    theme: "professional",
    progress: 73,
    style: {
      coverColor: "#1e3a5f",
      spineColor: "#152a45",
      textColor: "#eef6ff",
      texture: "matte",
      decoration: { bookmarkColor: "#ca8a04", icon: "chart" },
    },
    chapters: [
      {
        id: "ch-dash",
        title: "Dashboard",
        pages: [
          {
            id: "p-dash",
            title: "Ops overview",
            type: "dashboard",
            content: "Approvals pending: 12\nAvg cycle time: 2.4d\nAutomation coverage: 68%",
          },
        ],
      },
      {
        id: "ch-plan-b",
        title: "Planning",
        pages: [
          {
            id: "p-road",
            title: "Roadmap",
            type: "timeline",
            timeline: [
              { id: "bt1", label: "Invoice intake", date: "May", status: "done" },
              { id: "bt2", label: "Approval flows", date: "Jun", status: "done" },
              { id: "bt3", label: "Audit export", date: "Jul", status: "active" },
              { id: "bt4", label: "Vendor portal", date: "Sep", status: "upcoming" },
            ],
          },
        ],
      },
    ],
    tasks: [
      { id: "btask1", title: "Write audit export spec", done: false, priority: "medium", due: "Jul 31" },
    ],
    messages: [
      { id: "bm1", author: "Chris", text: "Can we pin the audit export page?", time: "14:11", channel: "project" },
    ],
    history: [
      { id: "bh1", at: "Jul 10", label: "Approval flows shipped", kind: "milestone" },
    ],
  },
  {
    id: "archive-pilot",
    title: "Archive Pilot",
    subtitle: "Old experiment — kept for history",
    genre: "custom",
    collection: "Archive",
    favorite: false,
    archived: true,
    updatedAt: "2026-05-02",
    members: ["Abygail"],
    theme: "custom",
    progress: 100,
    style: {
      coverColor: "#57534e",
      spineColor: "#44403c",
      textColor: "#fafaf9",
      texture: "matte",
      decoration: { bookmarkColor: "#a8a29e" },
    },
    chapters: [
      {
        id: "ch-arch",
        title: "Notes",
        pages: [
          {
            id: "p-arch",
            title: "What we learned",
            type: "document",
            content: "Books beat folders when teams need narrative memory, not just files.",
          },
        ],
      },
    ],
    tasks: [],
    messages: [],
    history: [{ id: "ah1", at: "May 2", label: "Archived project", kind: "milestone" }],
  },
];

export const collections = ["All", "Lab", "Studio", "School", "Work", "Archive"] as const;

export const integrations = [
  "Google Drive",
  "Google Docs",
  "Microsoft Office",
  "Canva",
  "Figma",
  "GitHub",
  "Slack",
  "Discord",
  "Zoom",
  "Google Meet",
  "Dropbox",
  "OneDrive",
  "Notion",
  "Jira",
  "Calendars",
] as const;
