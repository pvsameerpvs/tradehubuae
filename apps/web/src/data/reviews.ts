export interface Review {
  name: string;
  rating: number;
  text: string;
}

export const productReviews: Review[] = [
  { name: "Omar R.", rating: 5, text: "Excellent laptop! Fast delivery and great price." },
  { name: "Sara A.", rating: 4, text: "Very good quality. Battery life is impressive." },
  { name: "Khalid M.", rating: 5, text: "Perfect for my business needs. Highly recommended!" },
];
