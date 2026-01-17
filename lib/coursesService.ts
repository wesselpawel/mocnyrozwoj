import {
  addDocument,
  getDocuments,
  getDocument,
  removeDocument,
  updateDocument,
  uploadFile,
} from "@/firebase";
import { Course } from "@/types";

const COLLECTION_NAME = "courses";

export const coursesService = {
  // Add a new course to the database
  async addCourse(
    courseData: Omit<Course, "id" | "createdAt" | "updatedAt">
  ): Promise<string> {
    const id = Date.now().toString(); // Simple ID generation
    const now = new Date().toISOString();

    const course: Course = {
      ...courseData,
      id,
      createdAt: now,
      updatedAt: now,
    };

    await addDocument(COLLECTION_NAME, id, course);
    return id;
  },

  // Get all courses from the database
  async getAllCourses(): Promise<Course[]> {
    const courses = await getDocuments(COLLECTION_NAME);
    return courses as Course[];
  },

  // Get only visible courses (for public display)
  async getVisibleCourses(): Promise<Course[]> {
    const allCourses = await this.getAllCourses();
    // Filter out courses that might have a visibility flag in the future
    return allCourses;
  },

  // Get a single course by ID
  async getCourseById(id: string): Promise<Course | null> {
    const course = await getDocument(COLLECTION_NAME, id);
    return course as Course | null;
  },

  // Update a course
  async updateCourse(id: string, updates: Partial<Course>): Promise<void> {
    const now = new Date().toISOString();
    const updateData = {
      ...updates,
      updatedAt: now,
    };

    const keys = Object.keys(updateData);
    const values = Object.values(updateData);

    await updateDocument(keys, values, COLLECTION_NAME, id);
  },

  // Delete a course
  async deleteCourse(id: string): Promise<void> {
    await removeDocument(COLLECTION_NAME, id);
  },

  // Upload course image
  async uploadCourseImage(file: File): Promise<string> {
    const path = `courses/images/${Date.now()}_${file.name}`;
    return await uploadFile(file, path);
  },

  // Upload course PDF
  async uploadCoursePdf(file: File): Promise<string> {
    const path = `courses/pdfs/${Date.now()}_${file.name}`;
    return await uploadFile(file, path);
  },
};
