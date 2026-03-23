import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { UserPlus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function ManageFaculty() {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [department, setDepartment] = useState("");

  const faculty = [
    { name: "Dr. Smith", dept: "Computer Science", courses: ["Data Structures", "Algorithms"] },
    { name: "Prof. Johnson", dept: "Computer Science", courses: ["DBMS"] },
    { name: "Dr. Williams", dept: "Electronics", courses: ["Digital Circuits", "Microprocessors"] },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground" style={{ fontFamily: 'var(--font-display)' }}>Manage Faculty</h2>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2" style={{ fontFamily: 'var(--font-display)' }}>
            <UserPlus className="w-5 h-5 text-success" /> Add Faculty Member
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Faculty name" />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="faculty@college.edu" />
            </div>
            <div className="space-y-2">
              <Label>Department</Label>
              <Select value={department} onValueChange={setDepartment}>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="cs">Computer Science</SelectItem>
                  <SelectItem value="ec">Electronics</SelectItem>
                  <SelectItem value="me">Mechanical</SelectItem>
                  <SelectItem value="ce">Civil</SelectItem>
                  <SelectItem value="it">Information Technology</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={() => toast.success("Faculty member added!")} className="gradient-primary text-primary-foreground">
            <UserPlus className="w-4 h-4 mr-2" /> Add Faculty
          </Button>
        </CardContent>
      </Card>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle style={{ fontFamily: 'var(--font-display)' }}>Faculty Members</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {faculty.map((f, i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-secondary/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center text-sm font-bold text-success">{f.name[0]}</div>
                <div>
                  <p className="font-medium text-foreground">{f.name}</p>
                  <p className="text-sm text-muted-foreground">{f.dept}</p>
                </div>
              </div>
              <div className="flex gap-1 flex-wrap justify-end">
                {f.courses.map((c) => (
                  <Badge key={c} variant="secondary" className="text-xs">{c}</Badge>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
