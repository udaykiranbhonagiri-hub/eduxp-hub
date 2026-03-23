import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { UserPlus, GraduationCap } from "lucide-react";
import { toast } from "sonner";

export default function ManageStudents() {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [department, setDepartment] = useState("");
  const [year, setYear] = useState("");
  const [section, setSection] = useState("");
  const [loading, setLoading] = useState(false);

  const existingStudents = [
    { name: "Alice Johnson", dept: "Computer Science", year: 3, section: "A" },
    { name: "Bob Smith", dept: "Computer Science", year: 3, section: "B" },
    { name: "Carol Williams", dept: "Electronics", year: 2, section: "A" },
    { name: "David Brown", dept: "Mechanical", year: 4, section: "A" },
  ];

  const handleAddStudent = async () => {
    if (!email || !fullName || !department || !year || !section) {
      toast.error("Please fill all fields");
      return;
    }
    setLoading(true);
    toast.success(`Student ${fullName} added successfully!`);
    setEmail(""); setFullName(""); setDepartment(""); setYear(""); setSection("");
    setLoading(false);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="page-header animate-slide-up">
        <h2 className="page-title">Manage Students</h2>
        <p className="page-subtitle">Add and organize students by department, year, and section</p>
      </div>

      <Card className="glass-card animate-slide-up stagger-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-display">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <UserPlus className="w-4 h-4 text-primary-foreground" />
            </div>
            Add New Student
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Full Name</Label>
              <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Student name" className="h-11 rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Email</Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="student@college.edu" className="h-11 rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Department</Label>
              <Select value={department} onValueChange={setDepartment}>
                <SelectTrigger className="h-11 rounded-xl"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="cs">Computer Science</SelectItem>
                  <SelectItem value="ec">Electronics</SelectItem>
                  <SelectItem value="me">Mechanical</SelectItem>
                  <SelectItem value="ce">Civil</SelectItem>
                  <SelectItem value="it">Information Technology</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Year</Label>
                <Select value={year} onValueChange={setYear}>
                  <SelectTrigger className="h-11 rounded-xl"><SelectValue placeholder="Year" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1st</SelectItem>
                    <SelectItem value="2">2nd</SelectItem>
                    <SelectItem value="3">3rd</SelectItem>
                    <SelectItem value="4">4th</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Section</Label>
                <Select value={section} onValueChange={setSection}>
                  <SelectTrigger className="h-11 rounded-xl"><SelectValue placeholder="Sec" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A">A</SelectItem>
                    <SelectItem value="B">B</SelectItem>
                    <SelectItem value="C">C</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <Button onClick={handleAddStudent} disabled={loading} className="h-11 rounded-xl gradient-primary text-primary-foreground shadow-lg shadow-primary/20">
            <UserPlus className="w-4 h-4 mr-2" /> Add Student
          </Button>
        </CardContent>
      </Card>

      <Card className="glass-card animate-slide-up stagger-2">
        <CardHeader>
          <CardTitle className="font-display text-lg">Current Students</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {existingStudents.map((s, i) => (
            <div key={i} className="flex items-center justify-between p-3.5 rounded-xl bg-muted/40 hover:bg-muted/60 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center text-xs font-bold text-primary-foreground">
                  {s.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{s.name}</p>
                  <p className="text-xs text-muted-foreground">{s.dept}</p>
                </div>
              </div>
              <div className="flex gap-1.5">
                <Badge variant="secondary" className="rounded-lg text-xs">Year {s.year}</Badge>
                <Badge variant="outline" className="rounded-lg text-xs">Sec {s.section}</Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
