export type Cost = 0 | 1 | 2;
export type Distance = "block" | "3blocks" | "walk";

export type Adventure = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  /** 1 = totally chill, 2 = stay aware, 3 = bring a friend */
  safety: 1 | 2 | 3;
  cost: Cost;
  minAge: 13 | 16 | 18;
  minutes: 15 | 30 | 60;
  distance: Distance;
  daylightOnly: boolean;
  custom?: boolean;
  createdBy?: string;
  flagged?: boolean;
};

export const COST_LABEL: Record<Cost, string> = {
  0: "Free",
  1: "Under $5",
  2: "Under $15",
};

export const DISTANCE_LABEL: Record<Distance, string> = {
  block: "This block",
  "3blocks": "3 blocks",
  walk: "Short walk",
};

export const SAFETY_LABEL: Record<1 | 2 | 3, string> = {
  1: "Totally chill",
  2: "Stay aware",
  3: "Bring a friend",
};

export const ALL_TAGS = [
  "photo",
  "food",
  "people",
  "nature",
  "weird",
  "creative",
  "kind",
  "quiet",
  "move",
] as const;

type Seed = Omit<Adventure, "id"> & { id: string };

function a(
  id: string,
  title: string,
  description: string,
  tags: string[],
  opts: Partial<Omit<Adventure, "id" | "title" | "description" | "tags">> = {},
): Seed {
  return {
    id,
    title,
    description,
    tags,
    safety: 1,
    cost: 0,
    minAge: 13,
    minutes: 30,
    distance: "3blocks",
    daylightOnly: false,
    ...opts,
  };
}

export const SEED_ADVENTURES: Adventure[] = [
  a("s1", "Weirdest soda hunt", "Find the strangest flavored soda or drink at a nearby corner store. Buy it. Rate it out of 10.", ["food", "weird"], { cost: 1, minutes: 30 }),
  a("s2", "Oldest building on the block", "Photograph the oldest-looking building within 3 blocks. Guess its age, then look it up.", ["photo"], { minutes: 15 }),
  a("s3", "Follow the blue", "Pick a color. Walk until you've photographed 7 things in that exact shade.", ["photo", "creative"]),
  a("s4", "Bodega mystery snack", "Ask the person behind the counter for their personal favorite snack. Buy it, no questions.", ["food", "people"], { cost: 1, minutes: 15 }),
  a("s5", "Bench archaeology", "Find a public bench you've never sat on. Sit for 6 full minutes. No phone.", ["quiet"], { minutes: 15, distance: "block" }),
  a("s6", "Sticker safari", "Hunt for stickers, tags, and paste-ups on poles and signs. Collect 10 photos.", ["photo", "weird"]),
  a("s7", "Reverse route", "Walk a route you always take, but backwards. Note 3 things you'd never seen.", ["move"]),
  a("s8", "Pet interview", "Compliment a stranger's dog and ask for its name and one fact about it.", ["people", "kind"], { minutes: 15 }),
  a("s9", "Cheapest thing challenge", "Buy the single cheapest item in a nearby shop. Give it a dramatic backstory.", ["creative"], { cost: 1, minutes: 15 }),
  a("s10", "Tiny nature", "Find something growing out of concrete. Photograph it like a magazine cover.", ["nature", "photo"], { minutes: 15 }),
  a("s11", "Menu roulette", "Photograph a menu outside a place you've never eaten. Order it someday, decide what today.", ["food"], { minutes: 15 }),
  a("s12", "Silent block", "Find the quietest spot within 3 blocks. Record 60 seconds of it.", ["quiet"]),
  a("s13", "Doorway portraits", "Photograph 5 front doors with completely different personalities.", ["photo"]),
  a("s14", "Elevation quest", "Find the highest publicly reachable point nearby. Photograph the view.", ["move", "photo"], { minutes: 60, distance: "walk" }),
  a("s15", "Stack the shelf", "In a store, find the most confusing product on the shelves and read the whole label.", ["weird"], { minutes: 15 }),
  a("s16", "Handwriting hunt", "Find handwritten signage in a window. Photograph the best letterform.", ["photo", "creative"]),
  a("s17", "Cloud casting", "Lie back somewhere safe and name 5 clouds after people you know.", ["nature", "quiet"], { daylightOnly: true }),
  a("s18", "The 100-step rule", "Walk 100 steps in a direction you never go. Photograph whatever's there.", ["move"], { minutes: 15 }),
  a("s19", "Library smash-and-grab", "Enter a library or free book box. Leave with the weirdest title you can find.", ["creative"], { distance: "walk" }),
  a("s20", "Two-dollar gift", "Spend under $2 on something small and give it to someone you love.", ["kind"], { cost: 1 }),
  a("s21", "Local legend", "Ask someone who's lived nearby a while for one story about the neighborhood.", ["people"], { minAge: 16 }),
  a("s22", "Sunset spot scouting", "Find the best sunset-facing window, stoop, or wall nearby. Bookmark it.", ["photo", "nature"], { daylightOnly: true }),
  a("s23", "One-ingredient snack", "Build a snack from one shop using exactly three items under $5 total.", ["food"], { cost: 1 }),
  a("s24", "Puddle mirror", "Find a reflection — puddle, window, chrome — and take a photo through it.", ["photo", "creative"], { minutes: 15 }),
  a("s25", "Playground physics", "Use a public playground or park equipment like you're 8 years old again.", ["move"], { daylightOnly: true }),
  a("s26", "Alphabet walk", "Find letters A through J in signage around you, in order.", ["photo"], { minutes: 60 }),
  a("s27", "Free sample scavenger", "Find one genuinely free thing nearby: a sample, a flyer, a pamphlet, water.", ["weird"]),
  a("s28", "Bus stop biography", "Sit at a stop and invent a full life story for the next bus route number you see.", ["creative", "quiet"], { minutes: 15 }),
  a("s29", "Trash to treasure", "Pick up 5 pieces of litter in a park. Photograph the before and after.", ["kind", "nature"]),
  a("s30", "Best door handle", "Rate the door handles of 5 nearby businesses. Crown a winner.", ["weird"], { minutes: 15 }),
  a("s31", "Mural mission", "Find any painted wall or mural within walking distance and pose with it.", ["photo"], { distance: "walk" }),
  a("s32", "Stranger's soundtrack", "Ask a friend or a barista for one song rec. Listen to it walking home.", ["people", "move"], { minutes: 15 }),
  a("s33", "Cheap thrill dessert", "Find the cheapest sweet thing within 3 blocks. Eat it somewhere with a view.", ["food"], { cost: 1 }),
  a("s34", "Shadow shapes", "Photograph 3 shadows that look like something they're not.", ["photo", "creative"], { daylightOnly: true, minutes: 15 }),
  a("s35", "Neighborhood tree census", "Count the trees on one block. Name your favorite one.", ["nature"], { distance: "block" }),
  a("s36", "Window shopping fiction", "Pick a shop window. Choose the outfit for your alter ego. Photograph it.", ["creative"], { minutes: 15 }),
  a("s37", "Left-right-left", "At each corner, alternate left and right turns for 10 minutes. Document where you land.", ["move"], { distance: "walk" }),
  a("s38", "Hidden staircase", "Find a staircase, ramp, or alley you've never used. Climb or walk it.", ["move"], { minAge: 16 }),
  a("s39", "Compliment quota", "Give three genuine compliments to three different people today.", ["kind", "people"]),
  a("s40", "Ice cube experiment", "Buy the cheapest cold drink nearby. Rank the ice against your last three drinks.", ["food", "weird"], { cost: 1, minutes: 15 }),
  a("s41", "Public art audit", "Find a statue, plaque, or memorial nearby and read every word on it.", ["quiet", "photo"]),
  a("s42", "Sock-drawer museum", "Photograph the most-worn thing you own where you found it. Then go show it the block.", ["creative"], { minutes: 15, distance: "block" }),
  a("s43", "Sound map", "Stand still and list every sound you hear for 3 minutes. Read it back like a poem.", ["quiet"], { minutes: 15, distance: "block" }),
  a("s44", "Store cat quest", "Find a shop pet within walking distance. Photograph respectfully.", ["people", "photo"], { distance: "walk" }),
  a("s45", "One-block portrait", "Take 10 photos on one block, then keep only the best one.", ["photo"], { distance: "block" }),
  a("s46", "Free-fruit recon", "Find something edible growing nearby — herbs, berries, a fig tree. Don't eat it, just find it.", ["nature"], { distance: "walk" }),
  a("s47", "Chalk drop", "Leave a small friendly message in chalk somewhere people will see it.", ["kind", "creative"], { cost: 1 }),
  a("s48", "Night-lit windows", "Photograph the most cinematic lit-up window on your block. Stay on the sidewalk.", ["photo", "quiet"], { minAge: 16, safety: 2, minutes: 15, distance: "block" }),
  a("s49", "Late-night vending", "Find a vending machine after dark and let it choose your snack.", ["food", "weird"], { minAge: 18, safety: 2, cost: 1 }),
  a("s50", "Skyline count", "Count how many stars or planes you can see from your doorstep in 5 minutes.", ["nature", "quiet"], { minutes: 15, distance: "block" }),
];