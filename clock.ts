// clock state
interface Clock {
  timestamp: number; // milliseconds since epoch
  clocks: [
    {
      name: string;
      time: number; // milliseconds remaining as of timestamp
    }
  ];
  running: number; // running clock index or null
}
