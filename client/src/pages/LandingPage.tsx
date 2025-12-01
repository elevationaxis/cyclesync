import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Moon, Sparkles, Users, Calendar, MessageCircle, Utensils, BookOpen } from "lucide-react";

interface LandingPageProps {
  onGetStarted: () => void;
}

export default function LandingPage({ onGetStarted }: LandingPageProps) {
  const features = [
    {
      icon: Moon,
      title: "Cycle Tracking",
      description: "Understand your four phases and what each one means for your energy and mood"
    },
    {
      icon: MessageCircle,
      title: "Ask Aunt B",
      description: "Get warm, supportive guidance from your wise AI companion whenever you need it"
    },
    {
      icon: Utensils,
      title: "Spoon Tracker",
      description: "Track your daily energy with spoon theory - because some days you just have fewer spoons"
    },
    {
      icon: Users,
      title: "Partner Support",
      description: "Help your loved ones understand how to support you through each phase"
    },
    {
      icon: Calendar,
      title: "Cycle Calendar",
      description: "Plan ahead with a visual calendar that shows your upcoming phases"
    },
    {
      icon: BookOpen,
      title: "Ritual Library",
      description: "Discover self-care rituals tailored to how you're feeling right now"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--cozy-lilac))] via-background to-[hsl(var(--cozy-lilac)/0.3)]" />
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-[hsl(var(--cozy-lavender)/0.2)] blur-3xl" />
        <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-[hsl(var(--cozy-peach)/0.15)] blur-3xl" />
        
        <div className="relative container mx-auto px-6 py-20 md:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[hsl(var(--cozy-lilac))] mb-8">
              <Heart className="w-10 h-10 text-[hsl(var(--cozy-plum))]" />
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
              Hey there, love.
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-4 leading-relaxed">
              I'm <span className="text-primary font-semibold">Aunt B</span> — your warm, grounded guide through every phase of your cycle.
            </p>
            
            <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
              Let's make this simple. Track your energy, understand your body, and get the support you deserve — all in one cozy place.
            </p>
            
            <Button 
              size="lg" 
              onClick={onGetStarted}
              className="text-lg px-10 py-6 rounded-full shadow-lg"
              data-testid="button-get-started"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Let's Get Started
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-semibold mb-4">
              Everything you need, nothing you don't
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Simple tools that actually help — no complicated charts or overwhelming data
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card 
                  key={index} 
                  className="border-0 shadow-sm hover:shadow-md transition-shadow duration-300"
                  data-testid={`card-feature-${index}`}
                >
                  <CardContent className="p-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[hsl(var(--cozy-lilac))] mb-4">
                      <Icon className="w-6 h-6 text-[hsl(var(--cozy-plum))]" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6">
          <Card className="max-w-3xl mx-auto border-0 shadow-md bg-[hsl(var(--cozy-lilac))]">
            <CardContent className="p-8 md:p-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-background mb-6">
                <MessageCircle className="w-8 h-8 text-primary" />
              </div>
              
              <h2 className="text-2xl md:text-3xl font-semibold mb-4">
                A note from Aunt B
              </h2>
              
              <blockquote className="text-lg leading-relaxed text-muted-foreground mb-6 italic">
                "Honey, your cycle isn't something to fight against — it's wisdom your body is sharing with you. Let me help you listen to it, work with it, and find your own rhythm. No judgment here, just support."
              </blockquote>
              
              <Button 
                variant="secondary" 
                size="lg"
                onClick={onGetStarted}
                className="rounded-full px-8"
                data-testid="button-start-journey"
              >
                Start Your Journey
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="py-16 bg-[hsl(var(--cozy-taupe)/0.3)]">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-semibold mb-4">
              What's spoon theory?
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Imagine you start each day with a set number of "spoons" — that's your energy. Some days you wake up with 10 spoons, some days with 3. Every task uses spoons. This tracker helps you plan your day with compassion, based on the spoons you actually have — not the ones you wish you had.
            </p>
            <p className="text-sm text-muted-foreground">
              Perfect for neurodivergent folks and anyone who needs to manage their energy mindfully.
            </p>
          </div>
        </div>
      </section>

      <footer className="py-12 border-t">
        <div className="container mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 mb-4">
            <Heart className="w-5 h-5 text-primary" />
            <span className="font-semibold">Cycle Sync</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Made with care for you and your cycle
          </p>
        </div>
      </footer>
    </div>
  );
}
