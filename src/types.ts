export interface AllergenEntry {
  id: string;
  allergen: string;
  date: Date;
  hadReaction: boolean;
  notes?: string;
}

export interface AllergenDay {
  date: Date;
  entries: AllergenEntry[];
  hasReaction: boolean;
}
