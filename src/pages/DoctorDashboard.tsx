
import React, { useState, useEffect } from 'react';
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import AppointmentCalendar from '@/components/doctor/AppointmentCalendar';
import AppointmentSlots from '@/components/doctor/AppointmentSlots';
import DoctorNotifications from '@/components/doctor/DoctorNotifications';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { checkDoctorAccess } from '@/services/doctorService';
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";

const DoctorDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState("calendar");
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isPending, setIsPending] = useState(false);
  const [selectedSpecialization, setSelectedSpecialization] = useState<string>("all");
  const [doctorSpecializations, setDoctorSpecializations] = useState<string[]>([]);

  // List of available specializations
  const availableSpecializations = [
    "General Practice",
    "Cardiology",
    "Dermatology",
    "Neurology",
    "Orthopedics",
    "Pediatrics",
    "Psychiatry",
    "Radiology",
    "Surgery",
    "Gynecology",
    "Oncology",
    "Ophthalmology",
    "Emergency Medicine",
    "Internal Medicine",
    "Family Medicine"
  ];

  // Fetch doctor's specializations
  useEffect(() => {
    const fetchDoctorSpecializations = async () => {
      if (user && hasAccess) {
        try {
          const { data, error } = await supabase
            .from('doctors')
            .select('specialization')
            .eq('id', user.id)
            .single();

          if (!error && data?.specialization) {
            setDoctorSpecializations([data.specialization]);
            setSelectedSpecialization(data.specialization);
          }
        } catch (error) {
          console.error("Error fetching doctor specializations:", error);
        }
      }
    };

    fetchDoctorSpecializations();
  }, [user, hasAccess]);

  // Check if user has doctor access
  useEffect(() => {
    const checkAccess = async () => {
      if (user) {
        try {
          const hasDocAccess = await checkDoctorAccess(user.id);
          setHasAccess(hasDocAccess);
          
          if (!hasDocAccess) {
            // Check if user has a pending doctor application
            const { data, error } = await supabase
              .from('doctors')
              .select('verified')
              .eq('id', user.id)
              .maybeSingle();
            
            if (!error && data && data.verified === false) {
              setIsPending(true);
              toast({
                title: "Application Pending",
                description: "Your doctor application is still pending approval from an admin.",
                variant: "default"
              });
            } else {
              toast({
                title: "Access Denied",
                description: "You don't have permission to access the doctor dashboard.",
                variant: "destructive"
              });
            }
            
            navigate('/dashboard');
          }
        } catch (error) {
          console.error("Error checking doctor access:", error);
          navigate('/dashboard');
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
        navigate('/');
      }
    };
    
    checkAccess();
  }, [user, navigate, toast]);
  
  if (loading) {
    return (
      <div className="container mx-auto py-6 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!user || !hasAccess) {
    return null;
  }
  
  return (
    <div className="container mx-auto px-3 py-4 md:px-6 md:py-6">
      <div className="flex flex-col space-y-4 md:space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-blue-600">Doctor Dashboard</h1>
            <p className="text-slate-500 text-sm md:text-base">Manage your appointments, schedule, and patient health checks</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <div className="space-y-2">
              <Label htmlFor="specialization" className="text-sm font-medium">
                Filter by Specialization
              </Label>
              <Select value={selectedSpecialization} onValueChange={setSelectedSpecialization}>
                <SelectTrigger className="w-[200px] border-sage-200 focus:ring-sage-500">
                  <SelectValue placeholder="Select specialization" />
                </SelectTrigger>
                <SelectContent className="bg-white border-sage-200">
                  <SelectItem value="all">All Specializations</SelectItem>
                  {doctorSpecializations.map((spec) => (
                    <SelectItem key={spec} value={spec}>
                      {spec}
                    </SelectItem>
                  ))}
                  {availableSpecializations
                    .filter(spec => !doctorSpecializations.includes(spec))
                    .map((spec) => (
                      <SelectItem key={spec} value={spec} disabled>
                        {spec} (Not your specialty)
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Tabs defaultValue="calendar" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className={`${isMobile ? 'grid grid-cols-1 h-auto space-y-1 bg-white/60 p-1' : 'grid grid-cols-3'} w-full max-w-2xl`}>
            <TabsTrigger 
              value="calendar"
              className={`text-xs md:text-sm ${isMobile ? 'w-full py-3' : ''}`}
            >
              Calendar View
            </TabsTrigger>
            <TabsTrigger 
              value="slots"
              className={`text-xs md:text-sm ${isMobile ? 'w-full py-3' : ''}`}
            >
              Appointment Slots
            </TabsTrigger>
            <TabsTrigger 
              value="notifications"
              className={`text-xs md:text-sm ${isMobile ? 'w-full py-3' : ''}`}
            >
              Patient Health Checks
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="calendar">
            <Card className="modern-card">
              <CardHeader>
                <CardTitle className="text-lg md:text-xl">Appointment Calendar</CardTitle>
                <CardDescription className="text-sm md:text-base">
                  View and manage your scheduled appointments
                  {selectedSpecialization !== "all" && (
                    <span className="block text-blue-600 font-medium mt-1">
                      Filtered by: {selectedSpecialization}
                    </span>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AppointmentCalendar selectedSpecialization={selectedSpecialization} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="slots">
            <Card className="modern-card">
              <CardHeader>
                <CardTitle className="text-lg md:text-xl">Appointment Slots</CardTitle>
                <CardDescription className="text-sm md:text-base">
                  Create and manage your available appointment slots
                  {selectedSpecialization !== "all" && (
                    <span className="block text-blue-600 font-medium mt-1">
                      Filtered by: {selectedSpecialization}
                    </span>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AppointmentSlots selectedSpecialization={selectedSpecialization} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card className="modern-card">
              <CardHeader>
                <CardTitle className="text-lg md:text-xl">Patient Health Check Notifications</CardTitle>
                <CardDescription className="text-sm md:text-base">
                  Review health check data shared by your patients for upcoming appointments
                  {selectedSpecialization !== "all" && (
                    <span className="block text-blue-600 font-medium mt-1">
                      Filtered by: {selectedSpecialization}
                    </span>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DoctorNotifications selectedSpecialization={selectedSpecialization} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DoctorDashboard;
