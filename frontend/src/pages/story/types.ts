export interface Story {
  id: number;
  heading: string;
  description: string[];
}

export interface BiographySection {
  id: number;
  title: string;
  heading: string;
  description: string[];
  imageUrl: string;
  imagePosition: 'left' | 'right';
}
