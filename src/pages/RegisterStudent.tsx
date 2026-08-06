import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import PageLayout from "@/components/layout/PageLayout";
import { Eye, EyeOff, Check } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";

import { toast } from "@/components/ui/sonner";
import { useAuth } from "@/contexts/AuthContext";
import { detectUserTimeZone } from "@/utils/timezone";

const CLASS_OPTIONS = [
  "Class 1",
  "Class 2",
  "Class 3",
  "Class 4",
  "Class 5",
  "Class 6",
  "Class 7",
  "Class 8",
  "Class 9",
  "Class 10",
  "Class 11",
  "Class 12",
  "College / University",
  "Other"
];

const capitalizeName = (str: string): string => {
  return str
    .split(' ')
    .map(word => word ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() : '')
    .join(' ');
};

const RegisterStudent = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [studentOrParent, setStudentOrParent] = useState("Student");
  const [studentClass, setStudentClass] = useState("");
  const [customClass, setCustomClass] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signUp, googleSignIn, user, role } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (user) {
      if (role === "student") {
        navigate("/dashboard/student");
      } else if (role === "tutor") {
        navigate("/dashboard/tutor");
      } else if (role === "admin") {
        navigate("/dashboard/admin");
      }
    }
  }, [user, role, navigate]);

  const queryParams = new URLSearchParams(location.search);
  const redirectUrl = queryParams.get("redirect");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const finalClass = studentClass === "Other" ? customClass.trim() : studentClass;
    if (!finalClass) {
      toast.error("Please select or specify your class / grade.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Password and confirm password must match.");
      return;
    }

    if (!agreeTerms) {
      toast.error("You must accept the Terms & Conditions to register.");
      return;
    }

    setLoading(true);
    const { error } = await signUp(email, password, {
      full_name: name,
      phone,
      student_class: finalClass,
      student_or_parent: studentOrParent,
      role: "student",
      timezone: detectUserTimeZone(),
    });
    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }

    // Create student record after auth — wait for session
    toast.success("Account created! Please check your email to confirm, then log in.");
    setLoading(false);
    navigate(redirectUrl ? `/login?redirect=${encodeURIComponent(redirectUrl)}` : "/login");
  };

  return (
    <PageLayout>
      <div className="w-full min-h-[calc(100vh-64px)] flex items-stretch">
        <div className="grid grid-cols-1 lg:grid-cols-12 w-full items-stretch">
          {/* Left Column: Dark Blue Blueprint Value Proposition */}
          <div className="relative hidden lg:flex lg:col-span-5 bg-slate-950 text-white p-12 flex-col justify-start overflow-hidden">
            {/* Grid overlay lines */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none animate-pulse duration-1000" />
            
            {/* Theme-colored gradient overlay to inject theme color dynamically without being too bright */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-primary/5 to-transparent pointer-events-none" />
            
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/20 rounded-full blur-[100px] pointer-events-none -mr-40 -mt-40" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-primary/10 rounded-full blur-[80px] pointer-events-none -ml-20 -mb-20" />

            {/* Top Logo & Portal Info */}
            <div className="relative z-10">
              <div className="flex items-center gap-2.5">
                <img src="/logo.png" alt="Logo" className="h-10 w-auto" />
                <div>
                  <span className="font-bold text-lg tracking-tight block leading-none text-white">Cuvasol</span>
                  <span className="text-[10px] uppercase tracking-wider text-white/80 font-bold mt-1 block">Student Portal</span>
                </div>
              </div>
            </div>

            {/* Middle Value Props */}
            <div className="relative z-10 py-4 max-w-md mt-10 lg:mt-14">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white/90 text-xs font-semibold uppercase tracking-wider mb-6 border border-white/5">
                <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                Student Portal
              </span>
              <h2 className="text-3xl font-extrabold tracking-tight text-white mb-8">
                Your Questions, Answered.
              </h2>

              <div className="space-y-6">
                {[
                  {
                    q: "Why should I register?",
                    a: "To connect with 200+ background-verified, hand-picked tutors specializing in your exact subjects and boards."
                  },
                  {
                    q: "What benefits will I receive?",
                    a: "Access to a personal student dashboard, direct chat with tutors, easy scheduling, and progress tracking."
                  },
                  {
                    q: "Is it free?",
                    a: "Yes! Creating an account, browsing tutors, and booking your initial demo class is 100% free of charge."
                  },
                  {
                    q: "What happens after I register?",
                    a: "You'll browse tutor profiles, request a demo slot in their availability calendar, and start your first session."
                  }
                ].map((item, idx) => (
                  <div key={idx} className="space-y-1.5 animate-in fade-in slide-in-from-bottom-2 duration-300" style={{ animationDelay: `${idx * 75}ms` }}>
                    <div className="flex items-start gap-2.5">
                      <div className="flex-shrink-0 h-5 w-5 rounded-full bg-white/15 border border-white/20 flex items-center justify-center mt-0.5">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                      <h3 className="text-sm sm:text-base font-bold text-white leading-tight">
                        {item.q}
                      </h3>
                    </div>
                    <p className="text-xs sm:text-sm text-white/70 pl-7 leading-relaxed">
                      {item.a}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Footer */}
            <div className="relative z-10 text-xs text-white/60 font-medium mt-auto pt-8">
              © 2026 Cuvasol - Live classes powered by Cuvasol Live
            </div>
          </div>

          {/* Right Column: Registration Card & Grid background */}
          <div className="col-span-1 lg:col-span-7 flex items-center justify-center p-4 sm:p-8 relative bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px] bg-background">
            <Card className="w-full max-w-md shadow-2xl border border-border/60 bg-card/95 backdrop-blur-sm relative z-10 my-8">
              <CardHeader className="text-center pb-2">
                <div className="mx-auto mb-2 flex h-14 w-auto items-center justify-center">
                  <img src="/logo.png" alt="Logo" className="h-14 w-auto" />
                </div>
                <CardTitle className="text-2xl font-bold">Student Registration</CardTitle>
                <CardDescription>Create your free student account and start learning</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" required maxLength={100} value={name} onChange={(e) => setName(capitalizeName(e.target.value.replace(/[^a-zA-Z\s'-]/g, '')))} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" required maxLength={255} value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                   <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" type="tel" required value={phone} onChange={(e) => setPhone(e.target.value.replace(/[^0-9+\s-]/g, ''))} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="studentOrParent">Are you a Student or Parent?</Label>
                    <Select value={studentOrParent} onValueChange={setStudentOrParent} required>
                      <SelectTrigger id="studentOrParent">
                        <SelectValue placeholder="Select Option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Student">Student</SelectItem>
                        <SelectItem value="Parent">Parent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="studentClass">Class / Grade</Label>
                    <Select value={studentClass} onValueChange={setStudentClass} required>
                      <SelectTrigger id="studentClass">
                        <SelectValue placeholder="Select Class / Grade" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[260px]">
                        {CLASS_OPTIONS.map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {studentClass === "Other" && (
                    <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
                      <Label htmlFor="customClass">Specify Class / Grade</Label>
                      <Input
                        id="customClass"
                        required
                        placeholder="e.g. Masters, Diploma, Grade 5"
                        value={customClass}
                        onChange={(e) => setCustomClass(e.target.value)}
                      />
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        required
                        minLength={8}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground hover:text-foreground"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        required
                        minLength={8}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground hover:text-foreground"
                        aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5 pt-2 pb-1">
                    <Checkbox 
                      id="agreeTerms" 
                      checked={agreeTerms} 
                      onCheckedChange={(checked) => setAgreeTerms(checked === true)} 
                    />
                    <Label htmlFor="agreeTerms" className="text-xs text-muted-foreground leading-snug cursor-pointer">
                      I have read and agree to the{" "}
                      <Link to="/terms" target="_blank" className="text-primary font-semibold underline hover:text-primary/80">
                        Terms & Conditions
                      </Link>{" "}
                      and Privacy Policy. <span className="text-destructive">*</span>
                    </Label>
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Creating Account..." : "Sign Up"}
                  </Button>
                </form>

                <div className="mt-6 text-center text-sm text-muted-foreground">
                  Already have an account? <Link to={redirectUrl ? `/login?redirect=${encodeURIComponent(redirectUrl)}` : "/login"} className="text-primary hover:underline font-semibold">Log in</Link>
                  <br />
                  <span className="inline-block mt-2">
                    Want to teach? <Link to="/register/tutor" className="text-primary hover:underline font-semibold">Register as Tutor</Link>
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default RegisterStudent;
