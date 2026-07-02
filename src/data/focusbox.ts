export const focusBox = {
  name: 'FocusBox',
  tagline:
    'FocusBox is a practical, boxing-inspired method for training focus, breathing, and emotional control under pressure.',
  pillars: [
    {
      title: 'Focus',
      description:
        'Round-based drills and single-task sequences sharpen attention so you stay present when noise and pressure build.',
      detail:
        'Each round has one job—track the breath, hold a rhythm, finish a sequence. You train the mind to return when it wanders, the same way a fighter returns to the center of the ring.',
      points: [
        'Three-minute focus rounds with a clear start and stop',
        'Single-task cues: jab-cross rhythm, footwork patterns, shadow sequences',
        'Recovery between rounds to reset attention before the next effort',
      ],
    },
    {
      title: 'Breathing',
      description:
        'Inhale on recovery, exhale on effort—boxing rhythm steadies the nervous system before, during, and after intensity.',
      detail:
        'Breath is the metronome. Exhale on the work, inhale on the reset. That pattern lowers arousal when adrenaline spikes and gives you something concrete to anchor to under stress.',
      points: [
        'Nasal inhale on recovery, controlled exhale through the mouth on effort',
        'Breath-count drills tied to round length (e.g. 4-count, 6-count)',
        'Downshift patterns for after conflict, before sleep, or pre-meeting calm',
      ],
    },
    {
      title: 'Emotional Control',
      description:
        'Practice staying composed when stakes rise. Respond with intention instead of reacting on autopilot.',
      detail:
        'Pressure shows up in the body first—tight jaw, shallow breath, clenched fists. FocusBox gives you physical cues to notice that spike and choose your next move instead of being dragged by it.',
      points: [
        'Body scans at the bell: shoulders, hands, breath before each round',
        'Pause-and-respond drills when frustration or anxiety climbs mid-session',
        'Exit ritual: slow exhale, unclench, name one thing you handled well',
      ],
    },
  ],
} as const;

export const landingSectionContent: Partial<
  Record<
    string,
    {
      lead?: string;
    }
  >
> = {
  about: {
    lead: focusBox.tagline,
  },
  work: {
    lead: 'One-to-one sessions, team workshops, and guided round sequences tailored to your pace.',
  },
  journal: {
    lead: 'Notes on breath, focus, and recovery—from the mat to everyday pressure.',
  },
  contact: {
    lead: 'Book a session or ask about FocusBox for your team.',
  },
  jobs: {
    lead: 'We are building a network of coaches who teach calm under pressure.',
  },
};

export const servicesSection = {
  watermark: 'Services',
  headline: 'Breath',
} as const;
