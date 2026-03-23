import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save } from "lucide-react";

export default function FacultyMarks() {
  const students = [
    { name: "Alice Johnson", rollNo: "CS301-01", marks: 42 },
    { name: "Bob Smith", rollNo: "CS301-02", marks: 35 },
    { name: "Carol Williams", rollNo: "CS301-03", marks: 48 },
    { name: "David Brown", rollNo: "CS301-04", marks: 30 },
    { name: "Eve Davis", rollNo: "CS301-05", marks: 44 },
  ];

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="page-header animate-slide-up">
        <h2 className="page-title">Update Marks</h2>
        <p className="page-subtitle">Enter and manage exam and quiz scores</p>
      </div>

      <div className="flex gap-3 flex-wrap animate-slide-up stagger-1">
        <Select>
          <SelectTrigger className="w-64 h-11 rounded-xl">
            <SelectValue placeholder="Select Course" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cs301">CS301 - Data Structures</SelectItem>
            <SelectItem value="cs302">CS302 - DBMS</SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="w-48 h-11 rounded-xl">
            <SelectValue placeholder="Exam Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="mid">Mid Semester</SelectItem>
            <SelectItem value="quiz">Quiz</SelectItem>
            <SelectItem value="assignment">Assignment</SelectItem>
          </SelectContent>
        </Select>
        <Button className="h-11 rounded-xl gradient-primary text-primary-foreground shadow-lg shadow-primary/20">
          <Save className="w-4 h-4 mr-2" /> Save Marks
        </Button>
      </div>

      <Card className="glass-card animate-slide-up stagger-2">
        <CardHeader className="pb-3">
          <CardTitle className="font-display text-lg">Enter Marks <span className="text-sm font-normal text-muted-foreground">(out of 50)</span></CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {students.map((s, i) => (
            <div key={i} className="flex items-center gap-4 p-3.5 rounded-xl bg-muted/40 hover:bg-muted/60 transition-colors">
              <div className="w-9 h-9 rounded-xl gradient-teal flex items-center justify-center text-xs font-bold text-teal-foreground">
                {s.name.split(" ").map(n => n[0]).join("")}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{s.name}</p>
                <p className="text-xs text-muted-foreground font-mono">{s.rollNo}</p>
              </div>
              <Input type="number" defaultValue={s.marks} className="w-20 h-10 text-center rounded-xl font-display font-bold text-lg" min={0} max={50} />
              <span className="text-sm text-muted-foreground font-mono">/ 50</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
