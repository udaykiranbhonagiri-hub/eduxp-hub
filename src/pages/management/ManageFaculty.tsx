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
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="page-header animate-slide-up">
        <h2 className="page-title">Manage Faculty</h2>
        <p className="page-subtitle">Add faculty members and assign them to departments</p>
      </div>

      <Card className="glass-card animate-slide-up stagger-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-display">
            <div className="w-8 h-8 rounded-lg gradient-success flex items-center justify-center">
              <UserPlus className="w-4 h-4 text-success-foreground" />
            </div>
            Add Faculty Member
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Full Name</Label>
              <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Faculty name" className="h-11 rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Email</Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="faculty@college.edu" className="h-11 rounded-xl" />
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
          </div>
          <Button onClick={() => toast.success("Faculty member added!")} className="h-11 rounded-xl gradient-primary text-primary-foreground shadow-lg shadow-primary/20">
            <UserPlus className="w-4 h-4 mr-2" /> Add Faculty
          </Button>
        </CardContent>
      </Card>

      <Card className="glass-card animate-slide-up stagger-2">
        <CardHeader>
          <CardTitle className="font-display text-lg">Faculty Members</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {faculty.map((f, i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-muted/40 hover:bg-muted/60 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl gradient-success flex items-center justify-center text-sm font-bold text-success-foreground">
                  {f.name.split(" ").pop()?.[0]}
                </div>
                <div>
                  <p className="font-medium text-foreground">{f.name}</p>
                  <p className="text-sm text-muted-foreground">{f.dept}</p>
                </div>
              </div>
              <div className="flex gap-1.5 flex-wrap justify-end">
                {f.courses.map((c) => (
                  <Badge key={c} variant="secondary" className="rounded-lg text-xs">{c}</Badge>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
