import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Users,
  MessageSquare,
  Calendar,
  CheckSquare,
  DollarSign,
  ChevronDown,
  ChevronUp,
  Lock,
  Menu,
  X,
  ArrowRight
} from "lucide-react";
import logoImage from "@/assets/logo.png";

export default function Landing() {
  const [activeTab, setActiveTab] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setMobileMenuOpen(false);
  };

  const handleOpenApp = () => {
    // Replace this URL with your actual app URL
    window.location.href = "https://swiftshaadi.com/app";
  };

  const featureTabs = [
    {
      title: "Guests & RSVPs",
      description: "Add your guest list with phone numbers, dietary preferences, and side of family. Track confirmed, pending, and declined responses in one view.",
      icon: Users
    },
    {
      title: "Invite templates",
      description: "Choose from ready-made templates for roka, mehendi, sangeet, wedding, and reception. Copy the message and send it from your own WhatsApp or SMS.",
      icon: MessageSquare
    },
    {
      title: "Timeline & tasks",
      description: "Plan every event with dates and venues. Assign tasks to family members and track what is done and what is pending.",
      icon: Calendar
    },
    {
      title: "Budget overview",
      description: "Set a total budget and add expenses by category. See how much you have spent and how much is left at a glance.",
      icon: DollarSign
    }
  ];

  const faqItems = [
    {
      question: "Is Swift Shaadi free to use?",
      answer: "Yes, Swift Shaadi is completely free to use right now. You can manage guests, RSVPs, timeline, tasks, budget, and send invite messages without paying anything."
    },
    {
      question: "Can my parents and siblings also log in?",
      answer: "Yes! You can invite family members to your wedding with different roles. Parents can be added as Family Admins with full access, while others can be Helpers with limited permissions."
    },
    {
      question: "Do you send WhatsApp messages automatically?",
      answer: "No, we do not send messages on your behalf. We provide ready-to-use templates that you copy and paste into WhatsApp or SMS. This keeps your invitations personal and coming from your own number."
    },
    {
      question: "Does this work on my phone?",
      answer: "Yes! Swift Shaadi is designed mobile-first. It works in any modern browser on your phone, tablet, or computer. No app download needed."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-background/95 backdrop-blur-sm shadow-sm" : "bg-transparent"
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src={logoImage} alt="Swift Shaadi" className="w-8 h-8 object-contain" />
            <span className="text-xl font-semibold text-foreground">Swift Shaadi</span>
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            <button
              onClick={() => scrollToSection("features")}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection("how-it-works")}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              How it works
            </button>
            <button
              onClick={() => scrollToSection("pricing")}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Pricing
            </button>
            <button
              onClick={() => scrollToSection("faq")}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              FAQ
            </button>
            <Button onClick={handleOpenApp}>
              Open app
            </Button>
          </div>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-background border-t px-4 py-4 space-y-3">
            <button
              onClick={() => scrollToSection("features")}
              className="block w-full text-left text-sm text-muted-foreground hover:text-foreground py-2"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection("how-it-works")}
              className="block w-full text-left text-sm text-muted-foreground hover:text-foreground py-2"
            >
              How it works
            </button>
            <button
              onClick={() => scrollToSection("pricing")}
              className="block w-full text-left text-sm text-muted-foreground hover:text-foreground py-2"
            >
              Pricing
            </button>
            <button
              onClick={() => scrollToSection("faq")}
              className="block w-full text-left text-sm text-muted-foreground hover:text-foreground py-2"
            >
              FAQ
            </button>
            <Button onClick={handleOpenApp} className="w-full">
              Open app
            </Button>
          </div>
        )}
      </nav>
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="text-center md:text-left">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 leading-tight">All your wedding planning, finally in one app</h1>
              <p className="text-lg text-muted-foreground mb-6">Because planning your wedding should feel just as joyful as the day itself.</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                <Button size="lg" onClick={handleOpenApp}>
                  Start planning now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={() => scrollToSection("how-it-works")}
                >
                  See how it works
                </Button>
              </div>
            </div>

            {/* App mockup */}
            <div className="relative">
              <div className="bg-gradient-to-br from-accent/30 to-secondary/30 rounded-2xl p-6 md:p-8">
                <Card className="p-4 mb-3 transform rotate-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <Users className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Guest List</p>
                      <p className="text-xs text-muted-foreground">124 guests added</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded">89 confirmed</span>
                    <span className="text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 px-2 py-0.5 rounded">35 pending</span>
                  </div>
                </Card>
                <Card className="p-4 mb-3 transform -rotate-1 ml-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-secondary/50 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Sangeet Night</p>
                      <p className="text-xs text-muted-foreground">Dec 20, 2025</p>
                    </div>
                  </div>
                </Card>
                <Card className="p-4 transform rotate-2 ml-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-accent/50 flex items-center justify-center">
                      <CheckSquare className="w-5 h-5 text-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">12 tasks completed</p>
                      <p className="text-xs text-muted-foreground">8 remaining</p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Strip */}
      <section className="py-6 bg-accent/20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">Made for Indian weddings, from roka to reception.</p>
        </div>
      </section>
      {/* Problem Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
            Planning a wedding should not feel chaotic.
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="p-5 text-center">
              <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-3">
                <MessageSquare className="w-6 h-6 text-destructive" />
              </div>
              <p className="text-sm text-muted-foreground">
                Guest lists scattered across WhatsApp and sheets.
              </p>
            </Card>
            <Card className="p-5 text-center">
              <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-3">
                <Calendar className="w-6 h-6 text-destructive" />
              </div>
              <p className="text-sm text-muted-foreground">
                No clear view of RSVPs, timeline, and tasks.
              </p>
            </Card>
            <Card className="p-5 text-center">
              <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-destructive" />
              </div>
              <p className="text-sm text-muted-foreground">
                Hard to align parents, siblings, and planners.
              </p>
            </Card>
          </div>
        </div>
      </section>
      {/* Solution Section */}
      <section className="py-16 px-4 bg-secondary/20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-2">
            Meet Swift Shaadi.
          </h2>
          <p className="text-center text-muted-foreground mb-10">
            Designed for Indian weddings. Built for families.
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="p-5">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-3">
                <CheckSquare className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Plan in one place</h3>
              <p className="text-sm text-muted-foreground">
                Guests, RSVPs, timeline, tasks, budget - everything organised together.
              </p>
            </Card>
            <Card className="p-5">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-3">
                <MessageSquare className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Share invites easily</h3>
              <p className="text-sm text-muted-foreground">
                Ready templates you copy and send from your own number.
              </p>
            </Card>
            <Card className="p-5">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-3">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Coordinate smoothly</h3>
              <p className="text-sm text-muted-foreground">
                Roles for parents, siblings, and cousins to work together.
              </p>
            </Card>
          </div>
        </div>
      </section>
      {/* Feature Highlights Section */}
      <section id="features" className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
            Everything you need to plan your wedding
          </h2>
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {featureTabs.map((tab, index) => (
              <Button
                key={index}
                variant={activeTab === index ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveTab(index)}
                className="transition-all"
              >
                {tab.title}
              </Button>
            ))}
          </div>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                {(() => {
                  const Icon = featureTabs[activeTab].icon;
                  return (
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                  );
                })()}
                <h3 className="text-xl font-semibold">{featureTabs[activeTab].title}</h3>
              </div>
              <p className="text-muted-foreground">
                {featureTabs[activeTab].description}
              </p>
            </div>
            <Card className="p-6 bg-accent/10">
              {activeTab === 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-background rounded-md">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-secondary"></div>
                      <div>
                        <p className="font-medium text-sm">Sharma Family</p>
                        <p className="text-xs text-muted-foreground">4 members</p>
                      </div>
                    </div>
                    <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded">Confirmed</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-background rounded-md">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-secondary"></div>
                      <div>
                        <p className="font-medium text-sm">Gupta Family</p>
                        <p className="text-xs text-muted-foreground">6 members</p>
                      </div>
                    </div>
                    <span className="text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 px-2 py-1 rounded">Pending</span>
                  </div>
                </div>
              )}
              {activeTab === 1 && (
                <div className="space-y-3">
                  <div className="p-4 bg-background rounded-md">
                    <p className="text-xs text-muted-foreground mb-2">Sangeet Invitation</p>
                    <p className="text-sm">
                      With love and laughter, we invite you to celebrate with us at the Sangeet ceremony of...
                    </p>
                    <Button variant="outline" size="sm" className="mt-3">
                      Copy template
                    </Button>
                  </div>
                </div>
              )}
              {activeTab === 2 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-background rounded-md">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <div>
                      <p className="font-medium text-sm">Mehendi</p>
                      <p className="text-xs text-muted-foreground">Dec 18, 2025</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-background rounded-md">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    <div>
                      <p className="font-medium text-sm">Sangeet</p>
                      <p className="text-xs text-muted-foreground">Dec 19, 2025</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-background rounded-md">
                    <div className="w-2 h-2 rounded-full bg-accent"></div>
                    <div>
                      <p className="font-medium text-sm">Wedding</p>
                      <p className="text-xs text-muted-foreground">Dec 20, 2025</p>
                    </div>
                  </div>
                </div>
              )}
              {activeTab === 3 && (
                <div className="space-y-3">
                  <div className="p-4 bg-background rounded-md">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Total Budget</span>
                      <span className="font-semibold">25,00,000</span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Spent</span>
                      <span>18,50,000</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2 mt-3">
                      <div className="bg-primary h-2 rounded-full" style={{ width: "74%" }}></div>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </section>
      {/* How it Works Section */}
      <section id="how-it-works" className="py-16 px-4 bg-secondary/20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
            Start using Swift Shaadi in three simple steps.
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="font-semibold mb-2">Create your wedding</h3>
              <p className="text-sm text-muted-foreground">
                Add names, date, and city. Set up in under a minute.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="font-semibold mb-2">Add guests, events, and tasks</h3>
              <p className="text-sm text-muted-foreground">
                Keep everything in one space. Invite family to help.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="font-semibold mb-2">Share invite messages</h3>
              <p className="text-sm text-muted-foreground">
                Copy templates, send from your phone, track RSVPs.
              </p>
            </div>
          </div>
          <div className="text-center mt-10">
            <Button onClick={handleOpenApp}>
              Open app
            </Button>
          </div>
        </div>
      </section>
      {/* Pricing Section */}
      <section id="pricing" className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
            Simple, transparent pricing
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="p-6 border-2 border-primary">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">Free</h3>
                <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">Available now</span>
              </div>
              <ul className="space-y-3 text-sm text-muted-foreground mb-6">
                <li className="flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-primary" />
                  Guests & RSVPs
                </li>
                <li className="flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-primary" />
                  Invite templates
                </li>
                <li className="flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-primary" />
                  Timeline & events
                </li>
                <li className="flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-primary" />
                  Task management
                </li>
                <li className="flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-primary" />
                  Budget tracker
                </li>
                <li className="flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-primary" />
                  Team roles
                </li>
              </ul>
              <Button className="w-full" onClick={handleOpenApp}>
                Get started free
              </Button>
            </Card>
            <Card className="p-6 relative overflow-visible">
              <div className="absolute top-3 right-3 flex items-center gap-1 text-xs text-muted-foreground bg-secondary px-2 py-1 rounded">
                <Lock className="w-3 h-3" />
                Coming soon
              </div>
              <h3 className="text-xl font-bold mb-4">Premium</h3>
              <ul className="space-y-3 text-sm text-muted-foreground mb-6">
                <li className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Guest notifications
                </li>
                <li className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Shared album
                </li>
                <li className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Custom website
                </li>
                <li className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Vendor marketplace
                </li>
                <li className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Advanced analytics
                </li>
              </ul>
              <Button variant="outline" className="w-full" disabled>
                Coming soon
              </Button>
            </Card>
          </div>
        </div>
      </section>
      {/* Testimonials Section */}
      <section className="py-16 px-4 bg-accent/20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
            Loved by modern Indian families.
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="p-5">
              <p className="text-sm text-muted-foreground mb-4 italic">
                "We finally organised everything without five different spreadsheets."
              </p>
              <p className="font-medium text-sm">Priya S.</p>
              <p className="text-xs text-muted-foreground">Bride, Mumbai</p>
            </Card>
            <Card className="p-5">
              <p className="text-sm text-muted-foreground mb-4 italic">
                "My parents could see tasks clearly and felt in control."
              </p>
              <p className="font-medium text-sm">Rahul M.</p>
              <p className="text-xs text-muted-foreground">Groom, Delhi</p>
            </Card>
            <Card className="p-5">
              <p className="text-sm text-muted-foreground mb-4 italic">"The RSVP tracker saved us so much time with relatives."</p>
              <p className="font-medium text-sm">Anjali K.</p>
              <p className="text-xs text-muted-foreground">Bride, Bangalore</p>
            </Card>
          </div>
        </div>
      </section>
      {/* FAQ Section */}
      <section id="faq" className="py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
            Frequently asked questions
          </h2>
          <div className="space-y-3">
            {faqItems.map((item, index) => (
              <Card
                key={index}
                className="overflow-visible"
              >
                <button
                  className="w-full p-4 flex items-center justify-between text-left"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                >
                  <span className="font-medium text-sm">{item.question}</span>
                  {openFaq === index ? (
                    <ChevronUp className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  )}
                </button>
                {openFaq === index && (
                  <div className="px-4 pb-4">
                    <p className="text-sm text-muted-foreground">{item.answer}</p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>
      {/* Final CTA Section */}
      <section className="py-16 px-4 bg-primary/10">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to make wedding planning calmer?
          </h2>
          <p className="text-muted-foreground mb-6">
            Open Swift Shaadi, create your wedding, and invite your family to plan together today.
          </p>
          <Button size="lg" onClick={handleOpenApp}>
            Open Swift Shaadi
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>
      {/* Footer */}
      <footer className="py-8 px-4 border-t">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              2025 Swift Shaadi. Made with love for Indian families.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
              <button onClick={() => scrollToSection("features")} className="hover:text-foreground transition-colors">
                Features
              </button>
              <button onClick={() => scrollToSection("how-it-works")} className="hover:text-foreground transition-colors">
                How it works
              </button>
              <button onClick={() => scrollToSection("pricing")} className="hover:text-foreground transition-colors">
                Pricing
              </button>
              <button onClick={() => scrollToSection("faq")} className="hover:text-foreground transition-colors">
                FAQ
              </button>
              <a href="mailto:contact@swiftshaadi.com" className="hover:text-foreground transition-colors">
                Contact
              </a>
              <span className="cursor-default">Privacy</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
