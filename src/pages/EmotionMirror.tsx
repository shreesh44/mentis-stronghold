import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import Navigation from "@/components/Navigation";
import { MessageCircle, Send, Bot, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
}

const EmotionMirror = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm your AI Emotion Mirror. I'm here to listen and support you. How are you feeling today?",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const { toast } = useToast();

  const aiResponses = [
    "I hear that you're going through a challenging time. It's completely normal to feel this way, and I want you to know that your feelings are valid.",
    "Thank you for sharing that with me. It sounds like you're dealing with a lot right now. Let's explore some coping strategies that might help.",
    "I notice you might be feeling stressed. Here are some techniques that many students find helpful: deep breathing, taking short breaks, and breaking tasks into smaller steps.",
    "Your mental health is important. Have you tried any mindfulness exercises? Even 5 minutes of meditation can make a difference.",
    "It's great that you're reaching out for support. That shows real strength. What activities usually help you feel better?",
    "I'm sensing some anxiety in your message. Remember, it's okay to feel anxious sometimes. What would you like to focus on right now?",
  ];

  const sendMessage = () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponses[Math.floor(Math.random() * aiResponses.length)],
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-wellness rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">AI Emotion Mirror</h1>
            <p className="text-muted-foreground">
              Your personal AI companion for emotional support and guidance
            </p>
          </div>

          <Card className="shadow-wellness h-[600px] flex flex-col">
            <CardHeader className="bg-gradient-card rounded-t-lg">
              <CardTitle className="flex items-center space-x-2">
                <Bot className="h-5 w-5 text-primary" />
                <span>Emotion Mirror AI</span>
                <div className="ml-auto w-2 h-2 bg-secondary-light rounded-full animate-pulse"></div>
              </CardTitle>
            </CardHeader>
            
            <CardContent className="flex-1 flex flex-col p-0">
              <ScrollArea className="flex-1 p-6">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[70%] p-4 rounded-lg ${
                          message.sender === "user"
                            ? "bg-gradient-hero text-white"
                            : "bg-accent text-foreground border"
                        }`}
                      >
                        <div className="flex items-start space-x-2">
                          {message.sender === "ai" && (
                            <Bot className="h-4 w-4 mt-1 text-primary flex-shrink-0" />
                          )}
                          {message.sender === "user" && (
                            <User className="h-4 w-4 mt-1 text-white flex-shrink-0" />
                          )}
                          <div>
                            <p className="text-sm">{message.text}</p>
                            <p className={`text-xs mt-1 ${
                              message.sender === "user" ? "text-white/70" : "text-muted-foreground"
                            }`}>
                              {message.timestamp.toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-accent p-4 rounded-lg border">
                        <div className="flex items-center space-x-2">
                          <Bot className="h-4 w-4 text-primary" />
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
              
              <div className="p-6 border-t">
                <div className="flex space-x-2">
                  <Input
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Share what's on your mind..."
                    className="flex-1"
                    disabled={isTyping}
                  />
                  <Button 
                    onClick={sendMessage} 
                    disabled={!inputText.trim() || isTyping}
                    className="bg-gradient-wellness shadow-soft"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  This AI provides emotional support but is not a replacement for professional therapy.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EmotionMirror;