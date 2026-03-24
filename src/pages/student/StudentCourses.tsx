import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Download, FileText, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface CourseRecord {
  id: string;
  code: string;
  name: string;
  semester: number | null;
  year: number | null;
  faculty_id: string | null;
  faculty_profile?: { full_name: string } | null;
  materials_count: number;
}

export default function StudentCourses() {
  const { user, profile } = useAuth();
  const [courses, setCourses] = useState<CourseRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      // Fetch courses for the student's department/year or all courses
      let query = supabase.from("courses").select("id, code, name, semester, year, faculty_id");

      if (profile?.department_id) {
        query = query.eq("department_id", profile.department_id);
      }

      const { data: coursesData } = await query;

      if (!coursesData || coursesData.length === 0) {
        setLoading(false);
        return;
      }

      // Get material counts
      const courseIds = coursesData.map((c) => c.id);
      const { data: materials } = await supabase
        .from("course_materials")
        .select("course_id")
        .in("course_id", courseIds);

      const matCountMap: Record<string, number> = {};
      (materials || []).forEach((m) => {
        matCountMap[m.course_id] = (matCountMap[m.course_id] || 0) + 1;
      });

      // Get faculty profiles
      const facultyIds = [...new Set(coursesData.filter((c) => c.faculty_id).map((c) => c.faculty_id!))];
      const { data: facProfiles } = facultyIds.length > 0
        ? await supabase.from("profiles").select("user_id, full_name").in("user_id", facultyIds)
        : { data: [] };

      const facMap = new Map((facProfiles || []).map((p) => [p.user_id, p]));

      setCourses(
        coursesData.map((c) => ({
          ...c,
          faculty_profile: facMap.get(c.faculty_id || "") || null,
          materials_count: matCountMap[c.id] || 0,
        }))
      );
      setLoading(false);
    };
    load();
  }, [profile]);

  const handleDownload = () => {
    toast.info("PDF download coming soon!", {
      description: "Course materials will be available for download once uploaded by faculty.",
    });
  };

  const gradients = ["gradient-primary", "gradient-teal", "gradient-accent", "gradient-success"];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="page-header animate-slide-up">
        <h2 className="page-title">Courses & Materials</h2>
        <p className="page-subtitle">Current semester subjects and learning resources</p>
      </div>

      {courses.length === 0 ? (
        <Card className="glass-card">
          <CardContent className="p-8 text-center text-muted-foreground">
            <BookOpen className="w-12 h-12 mx-auto mb-3 text-muted-foreground/40" />
            <p className="font-medium">No courses found for your department.</p>
            <p className="text-sm mt-1">Courses will appear once assigned by management.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {courses.map((course, i) => (
            <Card key={course.id} className={`glass-card-elevated animate-slide-up stagger-${Math.min(i + 1, 6)}`}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-2xl ${gradients[i % gradients.length]} flex items-center justify-center shadow-sm`}>
                    <BookOpen className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <Badge variant="secondary" className="font-mono text-xs rounded-lg">{course.code}</Badge>
                </div>
                <h3 className="text-lg font-bold font-display text-foreground mb-1">{course.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {course.faculty_profile?.full_name || "TBD"}
                  {course.semester && ` · Sem ${course.semester}`}
                </p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-5 p-2.5 rounded-xl bg-muted/40">
                  <Layers className="w-4 h-4" />
                  <span>{course.materials_count} materials available</span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 rounded-xl h-9" onClick={handleDownload}>
                    <FileText className="w-4 h-4 mr-1.5" /> Materials
                  </Button>
                  <Button variant="outline" size="sm" className="rounded-xl h-9" onClick={handleDownload}>
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
