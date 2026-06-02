import { Exam, Mock, Question } from "@/types";

export const EXAMS: Exam[] = [
  {
    id: "med-1",
    title: "NEET Medical Entrance",
    description: "National Eligibility cum Entrance Test for medical aspirants in India.",
    category: "Medical",
    thumbnail: "exam-medical",
    totalMocks: 12
  },
  {
    id: "eng-1",
    title: "JEE Main Engineering",
    description: "Joint Entrance Examination for top engineering colleges.",
    category: "Engineering",
    thumbnail: "exam-engineering",
    totalMocks: 15
  },
  {
    id: "upsc-1",
    title: "Civil Services (UPSC)",
    description: "Prestigious examination for administrative services.",
    category: "Government",
    thumbnail: "exam-civil",
    totalMocks: 8
  }
];

export const MOCK_QUESTIONS: Question[] = [
  {
    id: "q1",
    subject: "Biology",
    text: "Which of the following is known as the powerhouse of the cell?",
    options: ["Nucleus", "Mitochondria", "Ribosome", "Endoplasmic Reticulum"],
    correctAnswer: "Mitochondria",
    difficulty: "Easy"
  },
  {
    id: "q2",
    subject: "Physics",
    text: "What is the SI unit of electric current?",
    options: ["Volt", "Ohm", "Ampere", "Watt"],
    correctAnswer: "Ampere",
    difficulty: "Easy"
  },
  {
    id: "q3",
    subject: "Chemistry",
    text: "Which gas is most abundant in the Earth's atmosphere?",
    options: ["Oxygen", "Carbon Dioxide", "Hydrogen", "Nitrogen"],
    correctAnswer: "Nitrogen",
    difficulty: "Medium"
  }
];

export const SAMPLE_MOCK: Mock = {
  id: "mock-1",
  examId: "med-1",
  title: "General Science Assessment Mock 1",
  durationInMinutes: 30,
  questions: MOCK_QUESTIONS,
  totalMarks: 12
};