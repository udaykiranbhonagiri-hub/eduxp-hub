import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Download, FileText, Video } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function StudentCourses() {
  const courses = [
    { code: "CS301", name: "Data Structures & Algorithms", faculty: "Dr. Smith", credits: 4, materials: 12 },
    { code: "CS302", name: "Database Management Systems", faculty: "Prof. Johnson", credits: 4, materials: 8 },
    { code: "CS303", name: "Operating Systems", faculty: "Dr. Williams", credits: 3, materials: 15 },
    { code: "CS304", name: "Web Technologies", faculty: "Prof. Brown", credits: 3, materials: 10 },
    { code: "MA301", name: "Discrete Mathematics", faculty: "Dr. Davis", credits: 3, materials: 6 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground" style={{ fontFamily: 'var(--font-display)' }}>Courses & Materials</h2>
        <p className="text-muted-foreground">Current semester subjects and resources</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {courses.map((course, i) => (
          <Card key={i} className="glass-card hover:shadow-xl transition-all group">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="font-mono">{course.code}</Badge>
                <span className="text-xs text-muted-foreground">{course.credits} Credits</span>
              </div>
              <CardTitle className="text-lg mt-2" style={{ fontFamily: 'var(--font-display)' }}>{course.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{course.faculty}</p>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                <FileText className="w-4 h-4" />
                <span>{course.materials} materials available</span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <BookOpen className="w-4 h-4 mr-1" /> View Materials
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
