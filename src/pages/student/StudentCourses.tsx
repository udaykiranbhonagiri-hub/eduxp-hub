import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Download, FileText, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function StudentCourses() {
  const courses = [
    { code: "CS301", name: "Data Structures & Algorithms", faculty: "Dr. Smith", credits: 4, materials: 12, color: "gradient-primary" },
    { code: "CS302", name: "Database Management Systems", faculty: "Prof. Johnson", credits: 4, materials: 8, color: "gradient-teal" },
    { code: "CS303", name: "Operating Systems", faculty: "Dr. Williams", credits: 3, materials: 15, color: "gradient-accent" },
    { code: "CS304", name: "Web Technologies", faculty: "Prof. Brown", credits: 3, materials: 10, color: "gradient-success" },
    { code: "MA301", name: "Discrete Mathematics", faculty: "Dr. Davis", credits: 3, materials: 6, color: "gradient-primary" },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="page-header animate-slide-up">
        <h2 className="page-title">Courses & Materials</h2>
        <p className="page-subtitle">Current semester subjects and learning resources</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {courses.map((course, i) => (
          <Card key={i} className={`glass-card-elevated animate-slide-up stagger-${Math.min(i + 1, 6)}`}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-2xl ${course.color} flex items-center justify-center shadow-sm`}>
                  <BookOpen className="w-6 h-6 text-primary-foreground" />
                </div>
                <Badge variant="secondary" className="font-mono text-xs rounded-lg">{course.code}</Badge>
              </div>
              <h3 className="text-lg font-bold font-display text-foreground mb-1">{course.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">{course.faculty} · {course.credits} Credits</p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-5 p-2.5 rounded-xl bg-muted/40">
                <Layers className="w-4 h-4" />
                <span>{course.materials} materials available</span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 rounded-xl h-9">
                  <FileText className="w-4 h-4 mr-1.5" /> Materials
                </Button>
                <Button variant="outline" size="sm" className="rounded-xl h-9">
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
