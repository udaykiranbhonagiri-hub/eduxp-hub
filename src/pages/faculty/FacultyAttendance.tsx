import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check, X, Save } from "lucide-react";

export default function FacultyAttendance() {
  const [course, setCourse] = useState("");
  const [attendance, setAttendance] = useState<Record<number, string>>({
    0: "present", 1: "absent", 2: "present", 3: "late", 4: "present"
  });

  const students = [
    { name: "Alice Johnson", rollNo: "CS301-01" },
    { name: "Bob Smith", rollNo: "CS301-02" },
    { name: "Carol Williams", rollNo: "CS301-03" },
    { name: "David Brown", rollNo: "CS301-04" },
    { name: "Eve Davis", rollNo: "CS301-05" },
  ];

  const toggleStatus = (i: number, status: string) => {
    setAttendance(prev => ({ ...prev, [i]: status }));
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="page-header animate-slide-up">
        <h2 className="page-title">Mark Attendance</h2>
        <p className="page-subtitle">Record daily attendance for your courses</p>
      </div>

      <div className="flex gap-3 flex-wrap animate-slide-up stagger-1">
        <Select value={course} onValueChange={setCourse}>
          <SelectTrigger className="w-72 h-11 rounded-xl">
            <SelectValue placeholder="Select Course" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cs301">CS301 - Data Structures</SelectItem>
            <SelectItem value="cs302">CS302 - DBMS</SelectItem>
            <SelectItem value="cs303">CS303 - Operating Systems</SelectItem>
          </SelectContent>
        </Select>
        <Button className="h-11 rounded-xl gradient-primary text-primary-foreground shadow-lg shadow-primary/20">
          <Save className="w-4 h-4 mr-2" /> Save Attendance
        </Button>
      </div>

      <Card className="glass-card animate-slide-up stagger-2">
        <CardHeader className="pb-3">
          <CardTitle className="font-display text-lg">Students</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {students.map((s, i) => (
            <div key={i} className="flex items-center justify-between p-3.5 rounded-xl bg-muted/40 hover:bg-muted/60 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center text-xs font-bold text-primary-foreground">
                  {s.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{s.name}</p>
                  <p className="text-xs text-muted-foreground font-mono">{s.rollNo}</p>
                </div>
              </div>
              <div className="flex gap-1.5">
                <button
                  onClick={() => toggleStatus(i, "present")}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                    attendance[i] === "present" ? "bg-success text-success-foreground shadow-sm" : "bg-muted text-muted-foreground hover:bg-success/10 hover:text-success"
                  }`}
                >
                  <Check className="w-4 h-4" />
                </button>
                <button
                  onClick={() => toggleStatus(i, "absent")}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                    attendance[i] === "absent" ? "bg-destructive text-destructive-foreground shadow-sm" : "bg-muted text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                  }`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
