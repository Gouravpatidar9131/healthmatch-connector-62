import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Heart, 
  Calendar, 
  FileText, 
  Shield, 
  Users, 
  Clock,
  ArrowRight,
  CheckCircle,
  Sparkles,
  Star
} from "lucide-react";

const Homepage = () => {
  const features = [
    {
      icon: Heart,
      title: "AI Health Analysis",
      description: "Advanced symptom analysis powered by machine learning for accurate health insights.",
      color: "bg-blue-50 text-blue-600"
    },
    {
      icon: Calendar,
      title: "Smart Scheduling",
      description: "Effortlessly book appointments with top healthcare professionals in your area.",
      color: "bg-emerald-50 text-emerald-600"
    },
    {
      icon: FileText,
      title: "Digital Health Records",
      description: "Secure, encrypted access to your complete medical history and test results.",
      color: "bg-purple-50 text-purple-600"
    }
  ];

  const benefits = [
    "24/7 AI Health Assistant",
    "HIPAA Compliant Security",
    "Expert Healthcare Network",
    "Comprehensive Analytics"
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
      {/* Modern Floating Navigation */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm border-b border-blue-100/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg">
                <Heart className="text-white h-6 w-6" />
              </div>
              <span className="font-bold text-2xl bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Curezy
              </span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <button 
                onClick={() => scrollToSection('services')}
                className="text-gray-600 hover:text-blue-500 font-medium transition-colors cursor-pointer"
              >
                Services
              </button>
              <button 
                onClick={() => scrollToSection('about')}
                className="text-gray-600 hover:text-blue-500 font-medium transition-colors cursor-pointer"
              >
                About
              </button>
              <button 
                onClick={() => scrollToSection('contact')}
                className="text-gray-600 hover:text-blue-500 font-medium transition-colors cursor-pointer"
              >
                Contact
              </button>
              <Link 
                to="/login" 
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-3 rounded-xl font-medium transition-all shadow-lg hover:shadow-xl"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section with Modern Design */}
      <section className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-10">
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <Sparkles className="h-8 w-8 text-blue-500" />
                  <span className="text-blue-600 font-semibold text-lg">AI-Powered Healthcare</span>
                </div>
                <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                  Your Health,
                  <span className="bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent"> Reimagined</span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed max-w-xl">
                  Experience next-generation healthcare with AI-powered symptom analysis, 
                  smart appointment booking, and comprehensive health monitoring.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-6">
                <Link to="/login">
                  <Button 
                    size="xl" 
                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-10 py-6 rounded-2xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                  >
                    Get Started Today
                    <ArrowRight className="ml-3 h-6 w-6" />
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  size="xl"
                  className="border-2 border-blue-200 text-blue-600 hover:bg-blue-50 px-10 py-6 rounded-2xl text-lg font-semibold hover:border-blue-300 transition-all"
                >
                  Learn More
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-6 pt-8">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-6 w-6 text-emerald-500" />
                    <span className="text-gray-700 font-medium">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="relative z-10">
                <div className="bg-white/70 backdrop-blur-md rounded-3xl shadow-2xl p-8 border border-blue-100/50">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-8 text-white">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-semibold">Health Dashboard</h3>
                      <div className="flex gap-1">
                        <Star className="h-5 w-5 text-yellow-300 fill-current" />
                        <Star className="h-5 w-5 text-yellow-300 fill-current" />
                        <Star className="h-5 w-5 text-yellow-300 fill-current" />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center bg-white/10 rounded-xl p-4">
                        <span>Heart Rate</span>
                        <span className="font-bold text-emerald-300">72 BPM</span>
                      </div>
                      <div className="flex justify-between items-center bg-white/10 rounded-xl p-4">
                        <span>Blood Pressure</span>
                        <span className="font-bold text-blue-200">120/80</span>
                      </div>
                      <div className="flex justify-between items-center bg-white/10 rounded-xl p-4">
                        <span>Next Appointment</span>
                        <span className="font-bold text-purple-200">Today 2:00 PM</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Floating decorative elements */}
              <div className="absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-xl"></div>
              <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-gradient-to-r from-emerald-400/20 to-blue-400/20 rounded-full blur-xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="services" className="py-24 bg-white/40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Intelligent Healthcare Solutions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Harness the power of AI and modern technology to transform 
              your healthcare experience with personalized insights.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-white/70 backdrop-blur-md border border-blue-100/50 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 group overflow-hidden">
                <CardContent className="p-10">
                  <div className={`inline-flex p-4 rounded-2xl ${feature.color} mb-8 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="h-10 w-10" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-lg">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              About Curezy
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're revolutionizing healthcare with AI-powered solutions that make 
              quality medical care accessible, efficient, and personalized for everyone.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900">Our Mission</h3>
              <p className="text-gray-600 leading-relaxed">
                At Curezy, we believe healthcare should be intelligent, accessible, and patient-centered. 
                Our AI-powered platform combines cutting-edge technology with compassionate care to 
                deliver personalized health solutions that adapt to your unique needs.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <Shield className="h-6 w-6 text-blue-500" />
                  <span className="text-gray-700 font-medium">HIPAA Compliant</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Users className="h-6 w-6 text-emerald-500" />
                  <span className="text-gray-700 font-medium">Expert Network</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="h-6 w-6 text-purple-500" />
                  <span className="text-gray-700 font-medium">24/7 Available</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Sparkles className="h-6 w-6 text-blue-500" />
                  <span className="text-gray-700 font-medium">AI-Powered</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white/70 backdrop-blur-md rounded-3xl shadow-xl p-8 border border-blue-100/50">
              <div className="space-y-6">
                <h4 className="text-xl font-semibold text-gray-900">Why Choose Curezy?</h4>
                <ul className="space-y-4">
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-emerald-500 mt-1" />
                    <span className="text-gray-600">Advanced AI symptom analysis with 95% accuracy</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-emerald-500 mt-1" />
                    <span className="text-gray-600">Instant appointment booking with verified doctors</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-emerald-500 mt-1" />
                    <span className="text-gray-600">Secure, encrypted health records management</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-emerald-500 mt-1" />
                    <span className="text-gray-600">Emergency assistance with real-time support</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-gradient-to-r from-blue-500 to-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-center text-white">
            <div className="space-y-4">
              <div className="text-5xl font-bold">50K+</div>
              <div className="text-xl text-blue-100">Happy Patients</div>
            </div>
            <div className="space-y-4">
              <div className="text-5xl font-bold">1K+</div>
              <div className="text-xl text-blue-100">Healthcare Providers</div>
            </div>
            <div className="space-y-4">
              <div className="text-5xl font-bold">24/7</div>
              <div className="text-xl text-blue-100">AI Assistant</div>
            </div>
            <div className="space-y-4">
              <div className="text-5xl font-bold">99.9%</div>
              <div className="text-xl text-blue-100">Uptime Guarantee</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
            Ready to Transform Your Healthcare?
          </h2>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Join thousands of users who trust HealthMatch for intelligent, 
            personalized healthcare management.
          </p>
          <Link to="/login">
            <Button 
              size="xl" 
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-16 py-6 rounded-2xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              Start Your Journey
              <ArrowRight className="ml-3 h-6 w-6" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-white/40 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Get in Touch
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Have questions about Curezy? We're here to help you on your healthcare journey.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center space-y-4">
              <div className="inline-flex p-4 bg-blue-50 rounded-2xl">
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">24/7 Support</h3>
              <p className="text-gray-600">Round-the-clock assistance for all your healthcare needs</p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="inline-flex p-4 bg-emerald-50 rounded-2xl">
                <Heart className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Email Support</h3>
              <p className="text-gray-600">admin@curezy.in</p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="inline-flex p-4 bg-purple-50 rounded-2xl">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Phone Support</h3>
              <p className="text-gray-600">1-800-HEALTH</p>
            </div>
          </div>
          
          <div className="text-center">
            <Link to="/login">
              <Button 
                size="xl" 
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-12 py-6 rounded-2xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                Start Your Journey Today
                <ArrowRight className="ml-3 h-6 w-6" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-500 rounded-xl">
                  <Heart className="text-white h-6 w-6" />
                </div>
                <span className="font-bold text-xl text-white">
                  Curezy
                </span>
              </div>
              <p className="text-gray-400">
                Your trusted partner in healthcare management and wellness.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-white font-semibold text-lg">Services</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Health Monitoring</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Appointments</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Medical Records</a></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-white font-semibold text-lg">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-white font-semibold text-lg">Contact</h3>
              <ul className="space-y-2">
                <li className="flex items-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span>24/7 Support</span>
                </li>
                <li>admin@curezy.in</li>
                <li>1-800-HEALTH</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-400">
              © {new Date().getFullYear()} Curezy. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;
