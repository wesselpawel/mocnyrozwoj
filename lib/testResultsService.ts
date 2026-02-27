import { addDocument, getDocuments } from "@/firebase";

export interface TestResult {
  id: string;
  userId: string | null;
  testName: string;
  answers: { question: string; answer: string }[];
  report: Record<string, unknown>;
  createdAt: string;
}

const COLLECTION_NAME = "test_results";

export const testResultsService = {
  async saveTestResult({
    userId,
    testName,
    answers,
    report,
  }: Omit<TestResult, "id" | "createdAt">): Promise<string> {
    const id = Date.now().toString();
    const createdAt = new Date().toISOString();
    const result: TestResult = {
      id,
      userId: userId || null,
      testName,
      answers,
      report,
      createdAt,
    };
    await addDocument(COLLECTION_NAME, id, result);
    return id;
  },

  async getUserTestResults(userId: string): Promise<TestResult[]> {
    const allResults = await getDocuments(COLLECTION_NAME);
    return (allResults as TestResult[]).filter((r) => r.userId === userId);
  },
};
