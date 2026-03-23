import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function FacultyMarks() {
  const students = [
    { name: "Alice Johnson", rollNo: "CS301-01", marks: 42 },
    { name: "Bob Smith", rollNo: "CS301-02", marks: 35 },
    { name: "Carol Williams", rollNo: "CS301-03", marks: 48 },
    { name: "David Brown", rollNo: "CS301-04", marks: 30 },
    { name: "Eve Davis", rollNo: "CS301-05", marks: 44 },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground" style={{ fontFamily: 'var(--font-display)' }}>Update Marks</h2>

      <div className="flex gap-4 flex-wrap">
        <Select>
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Select Course" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cs301">CS301 - Data Structures</SelectItem>
            <SelectItem value="cs302">CS302 - DBMS</SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Exam Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="mid">Mid Semester</SelectItem>
            <SelectItem value="quiz">Quiz</SelectItem>
            <SelectItem value="assignment">Assignment</SelectItem>
          </SelectContent>
        </Select>
        <Button className="gradient-primary text-primary-foreground">Save Marks</Button>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle style={{ fontFamily: 'var(--font-display)' }}>Enter Marks (out of 50)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {students.map((s, i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-secondary/50">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                  {s.name[0]}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{s.name}</p>
                  <p className="text-xs text-muted-foreground">{s.rollNo}</p>
                </div>
                <Input type="number" defaultValue={s.marks} className="w-24 text-center" min={0} max={50} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
