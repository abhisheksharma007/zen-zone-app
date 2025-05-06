export interface Achievement {
  id: string;
  name: string;
  description: string;
  points: number;
  earned: boolean;
  icon?: string;
  date?: Date;
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

export const getAchievements = (): Achievement[] => {
  // In a real app, this would come from local storage or a database
  return [
    {
      id: "first-check",
      name: "First Check-in",
      description: "Completed your first mood check-in",
      points: 10,
      earned: true,
      icon: "star",
      date: new Date(Date.now() - 86400000 * 2) // 2 days ago
    },
    {
      id: "three-day-streak",
      name: "On a Roll",
      description: "Maintained a 3-day streak",
      points: 30,
      earned: true,
      icon: "trophy",
      date: new Date(Date.now() - 86400000) // 1 day ago
    },
    {
      id: "mood-improver",
      name: "Mood Lifter",
      description: "Improved your mood after scrolling",
      points: 25,
      earned: true,
      icon: "smile",
      date: new Date()
    },
    {
      id: "time-master",
      name: "Time Master",
      description: "Stayed under budget for all platforms",
      points: 50,
      earned: false
    },
    {
      id: "week-streak",
      name: "Weekly Warrior",
      description: "Maintained a 7-day streak",
      points: 100,
      earned: false
    }
  ];
};

export const unlockAchievement = (id: string): Achievement | null => {
  // In a real app, this would update local storage or a database
  const achievements = getAchievements();
  const achievement = achievements.find(a => a.id === id && !a.earned);
  
  if (achievement) {
    achievement.earned = true;
    achievement.date = new Date();
    return achievement;
  }
  
  return null;
};

// Use the imported types from our types file
import { AchievementWithCompletion } from '@/types';
