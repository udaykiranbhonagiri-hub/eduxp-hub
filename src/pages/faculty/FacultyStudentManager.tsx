import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Save, Users, Loader2, CheckCircle, Search } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Course {
  id: string;
  code: string;
  name: string;
}

interface StudentRow {
  user_id: string;
  full_name: string;
  email: string;
  section: string | null;
  attendancePct: number;
  totalClasses: number;
  presentClasses: number;
  latestMarks: number;
  latestMaxMarks: number;
  latestExamType: string;
  latestMarkId: string | null;
  // editable state
  editAttPct: string;
  editMarks: string;
  saving: boolean;
  saved: boolean;
}

export default function FacultyStudentManager() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Load faculty courses
  useEffect(() => {
    if (!user) return;
    supabase
      .from("courses")
      .select("id, code, name")
      .eq("faculty_id", user.id)
      .then(({ data }) => setCourses(data || []));
  }, [user]);

  // Load students for selected course
  const loadStudents = useCallback(async (courseId: string) => {
    if (!courseId || !user) return;
    setLoading(true);

    // Get all attendance records for this course
    const { data: attData } = await supabase
      .from("attendance")
      .select("student_id, status")
      .eq("course_id", courseId);

    // Get all marks records for this course
    const { data: marksData } = await supabase
      .from("marks")
      .select("id, student_id, marks_obtained, max_marks, exam_type, created_at")
      .eq("course_id", courseId)
      .order("created_at", { ascending: false });

    // Collect unique student IDs from both tables
    const studentIds = [
      ...new Set([
        ...(attData || []).map((a) => a.student_id),
        ...(marksData || []).map((m) => m.student_id),
      ]),
    ];

    if (studentIds.length === 0) {
      setStudents([]);
      setLoading(false);
      return;
    }

    // Get profiles for these students
    const { data: profiles } = await supabase
      .from("profiles")
      .select("user_id, full_name, email, section")
      .in("user_id", studentIds);

    const profileMap = new Map((profiles || []).map((p) => [p.user_id, p]));

    // Compute per-student attendance
    const attMap: Record<string, { total: number; present: number }> = {};
    (attData || []).forEach((a) => {
      if (!attMap[a.student_id]) attMap[a.student_id] = { total: 0, present: 0 };
      attMap[a.student_id].total++;
      if (a.status === "present") attMap[a.student_id].present++;
    });

    // Get latest marks per student
    const latestMarkMap: Record<string, { id: string; obtained: number; max: number; type: string }> = {};
    (marksData || []).forEach((m) => {
      if (!latestMarkMap[m.student_id]) {
        latestMarkMap[m.student_id] = {
          id: m.id,
          obtained: Number(m.marks_obtained),
          max: Number(m.max_marks),
          type: m.exam_type,
        };
      }
    });

    const rows: StudentRow[] = studentIds.map((sid) => {
      const prof = profileMap.get(sid);
      const att = attMap[sid] || { total: 0, present: 0 };
      const pct = att.total > 0 ? Math.round((att.present / att.total) * 100) : 0;
      const mark = latestMarkMap[sid];
      return {
        user_id: sid,
        full_name: prof?.full_name || "Unknown",
        email: prof?.email || "",
        section: prof?.section || null,
        attendancePct: pct,
        totalClasses: att.total,
        presentClasses: att.present,
        latestMarks: mark?.obtained ?? 0,
        latestMaxMarks: mark?.max ?? 100,
        latestExamType: mark?.type ?? "exam",
        latestMarkId: mark?.id ?? null,
        editAttPct: String(pct),
        editMarks: String(mark?.obtained ?? 0),
        saving: false,
        saved: false,
      };
    });

    rows.sort((a, b) => a.full_name.localeCompare(b.full_name));
    setStudents(rows);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    if (selectedCourse) loadStudents(selectedCourse);
  }, [selectedCourse, loadStudents]);

  const updateField = (userId: string, field: "editAttPct" | "editMarks", value: string) => {
    setStudents((prev) =>
      prev.map((s) => (s.user_id === userId ? { ...s, [field]: value, saved: false } : s))
    );
  };

  const handleSave = async (student: StudentRow) => {
    if (!user || !selectedCourse) return;

    setStudents((prev) =>
      prev.map((s) => (s.user_id === student.user_id ? { ...s, saving: true } : s))
    );

    try {
      const newAttPct = Math.min(100, Math.max(0, parseInt(student.editAttPct) || 0));
      const newMarks = Math.max(0, parseFloat(student.editMarks) || 0);

      // Update attendance: insert today's record as present/absent to adjust percentage
      // If new pct > current pct, mark present; otherwise mark absent
      const today = new Date().toISOString().split("T")[0];

      // Check if today's attendance already exists
      const { data: existingAtt } = await supabase
        .from("attendance")
        .select("id")
        .eq("student_id", student.user_id)
        .eq("course_id", selectedCourse)
        .eq("date", today)
        .maybeSingle();

      const newStatus = newAttPct >= student.attendancePct ? "present" : "absent";

      if (existingAtt) {
        await supabase
          .from("attendance")
          .update({ status: newStatus, marked_by: user.id })
          .eq("id", existingAtt.id);
      } else {
        await supabase.from("attendance").insert({
          student_id: student.user_id,
          course_id: selectedCourse,
          date: today,
          status: newStatus,
          marked_by: user.id,
        });
      }

      // Update marks: upsert latest marks record
      if (student.latestMarkId) {
        await supabase
          .from("marks")
          .update({ marks_obtained: newMarks, marked_by: user.id })
          .eq("id", student.latestMarkId);
      } else {
        await supabase.from("marks").insert({
          student_id: student.user_id,
          course_id: selectedCourse,
          exam_type: "exam",
          marks_obtained: newMarks,
          max_marks: 100,
          marked_by: user.id,
        });
      }

      setStudents((prev) =>
        prev.map((s) =>
          s.user_id === student.user_id
            ? { ...s, saving: false, saved: true, attendancePct: newAttPct, latestMarks: newMarks }
            : s
        )
      );

      toast.success(`Saved changes for ${student.full_name}`);
    } catch (err: any) {
      toast.error("Failed to save: " + (err.message || "Unknown error"));
      setStudents((prev) =>
        prev.map((s) => (s.user_id === student.user_id ? { ...s, saving: false } : s))
      );
    }
  };

  const filteredStudents = students.filter(
    (s) =>
      s.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="page-header animate-slide-up">
        <h2 className="page-title">Student Manager</h2>
        <p className="page-subtitle">
          View and update attendance & marks for students in your courses
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-3 animate-slide-up stagger-1">
        <Select value={selectedCourse} onValueChange={setSelectedCourse}>
          <SelectTrigger className="w-80 h-11 rounded-xl">
            <SelectValue placeholder="Select a course to manage" />
          </SelectTrigger>
          <SelectContent>
            {courses.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.code} — {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {selectedCourse && students.length > 0 && (
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-11 rounded-xl"
            />
          </div>
        )}
      </div>

      {/* Empty states */}
      {!selectedCourse && courses.length > 0 && (
        <Card className="glass-card animate-slide-up stagger-2">
          <CardContent className="p-10 text-center text-muted-foreground">
            <Users className="w-12 h-12 mx-auto mb-3 text-muted-foreground/40" />
            <p className="font-medium">Select a course above to see your students</p>
          </CardContent>
        </Card>
      )}

      {courses.length === 0 && (
        <Card className="glass-card animate-slide-up stagger-2">
          <CardContent className="p-10 text-center text-muted-foreground">
            <Users className="w-12 h-12 mx-auto mb-3 text-muted-foreground/40" />
            <p className="font-medium">No courses assigned to you yet.</p>
            <p className="text-sm mt-1">Contact management to get courses assigned.</p>
          </CardContent>
        </Card>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Student Table */}
      {selectedCourse && !loading && students.length === 0 && (
        <Card className="glass-card animate-slide-up">
          <CardContent className="p-10 text-center text-muted-foreground">
            <p className="font-medium">No students found for this course.</p>
            <p className="text-sm mt-1">Students appear here once attendance or marks are recorded.</p>
          </CardContent>
        </Card>
      )}

      {selectedCourse && !loading && filteredStudents.length > 0 && (
        <Card className="glass-card animate-slide-up stagger-2 overflow-hidden">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="font-display text-lg flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                <Users className="w-4 h-4 text-primary-foreground" />
              </div>
              {filteredStudents.length} Student{filteredStudents.length !== 1 ? "s" : ""}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40 hover:bg-muted/40">
                    <TableHead className="font-display font-semibold text-foreground pl-6">Student</TableHead>
                    <TableHead className="font-display font-semibold text-foreground">Section</TableHead>
                    <TableHead className="font-display font-semibold text-foreground text-center">
                      Attendance %
                    </TableHead>
                    <TableHead className="font-display font-semibold text-foreground text-center">
                      Latest Marks
                    </TableHead>
                    <TableHead className="font-display font-semibold text-foreground text-center pr-6">
                      Action
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student) => {
                    const attColor =
                      parseInt(student.editAttPct) < 75
                        ? "border-destructive/50 bg-destructive/5"
                        : "border-border";
                    return (
                      <TableRow key={student.user_id} className="group hover:bg-muted/30 transition-colors">
                        <TableCell className="pl-6">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl gradient-teal flex items-center justify-center text-xs font-bold text-primary-foreground shrink-0">
                              {student.full_name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()
                                .slice(0, 2)}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-foreground truncate">
                                {student.full_name}
                              </p>
                              <p className="text-xs text-muted-foreground truncate">{student.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">
                            {student.section || "—"}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <Input
                              type="number"
                              min={0}
                              max={100}
                              value={student.editAttPct}
                              onChange={(e) =>
                                updateField(student.user_id, "editAttPct", e.target.value)
                              }
                              className={`w-20 h-9 text-center rounded-xl font-display font-bold text-sm ${attColor}`}
                            />
                            <span className="text-xs text-muted-foreground">%</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <Input
                              type="number"
                              min={0}
                              value={student.editMarks}
                              onChange={(e) =>
                                updateField(student.user_id, "editMarks", e.target.value)
                              }
                              className="w-20 h-9 text-center rounded-xl font-display font-bold text-sm"
                            />
                            <span className="text-xs text-muted-foreground">
                              / {student.latestMaxMarks}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center pr-6">
                          <Button
                            size="sm"
                            className={`rounded-xl h-9 px-4 text-xs font-semibold transition-all ${
                              student.saved
                                ? "bg-success text-success-foreground"
                                : "gradient-primary text-primary-foreground shadow-md shadow-primary/20"
                            }`}
                            disabled={student.saving}
                            onClick={() => handleSave(student)}
                          >
                            {student.saving ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : student.saved ? (
                              <>
                                <CheckCircle className="w-3.5 h-3.5 mr-1" /> Saved
                              </>
                            ) : (
                              <>
                                <Save className="w-3.5 h-3.5 mr-1" /> Save
                              </>
                            )}
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
