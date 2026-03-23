import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";

export default function FacultyAttendance() {
  const [course, setCourse] = useState("");

  const students = [
    { name: "Alice Johnson", rollNo: "CS301-01", status: "present" },
    { name: "Bob Smith", rollNo: "CS301-02", status: "absent" },
    { name: "Carol Williams", rollNo: "CS301-03", status: "present" },
    { name: "David Brown", rollNo: "CS301-04", status: "late" },
    { name: "Eve Davis", rollNo: "CS301-05", status: "present" },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground" style={{ fontFamily: 'var(--font-display)' }}>Mark Attendance</h2>

      <div className="flex gap-4 flex-wrap">
        <Select value={course} onValueChange={setCourse}>
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Select Course" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cs301">CS301 - Data Structures</SelectItem>
            <SelectItem value="cs302">CS302 - DBMS</SelectItem>
            <SelectItem value="cs303">CS303 - Operating Systems</SelectItem>
          </SelectContent>
        </Select>
        <Button className="gradient-primary text-primary-foreground">Save Attendance</Button>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle style={{ fontFamily: 'var(--font-display)' }}>Students</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {students.map((s, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                    {s.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{s.name}</p>
                    <p className="text-xs text-muted-foreground">{s.rollNo}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant={s.status === "present" ? "default" : "outline"} className={s.status === "present" ? "bg-success text-success-foreground" : ""}>
                    <Check className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant={s.status === "absent" ? "default" : "outline"} className={s.status === "absent" ? "bg-destructive text-destructive-foreground" : ""}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
