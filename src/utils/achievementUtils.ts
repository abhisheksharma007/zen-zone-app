
export interface Achievement {
  id: string;
  name: string;
  description: string;
  points: number;
  earned: boolean;
}

export const calculatePoints = (beforeMood: string, afterMood: string, withinLimit: boolean): number => {
  let points = 0;
  
  // Points for completing mood check-in
  points += 10;
  
  // Bonus points for improving or maintaining positive mood
  if (beforeMood === "terrible" && ["neutral", "good", "great"].includes(afterMood)) points += 20;
  if (beforeMood === "bad" && ["good", "great"].includes(afterMood)) points += 15;
  
  // Points for staying within time limit
  if (withinLimit) points += 25;
  
  return points;
};
