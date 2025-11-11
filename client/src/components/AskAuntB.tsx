import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, Heart } from 'lucide-react';
import { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface AskAuntBProps {
  onSendMessage?: (message: string) => Promise<string>;
}

export default function AskAuntB({ onSendMessage }: AskAuntBProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hey love, I'm Aunt B. Ask me anything about your cycle, hormones, or how you're feeling. I'm here to help you understand what your body's telling you.",
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const response = onSendMessage 
      ? await onSendMessage(input)
      : "That's a great question! Your body's wisdom is speaking to you. Take a deep breath and listen to what it needs right now.";

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: response,
    };

    setMessages(prev => [...prev, assistantMessage]);
    setIsLoading(false);
  };

  return (
    <Card className="flex flex-col h-[600px] max-w-3xl mx-auto">
      <div className="p-6 border-b flex items-center gap-3">
        <Heart className="w-6 h-6 text-primary" />
        <h2 className="text-2xl font-semibold">Ask Aunt B</h2>
      </div>

      <ScrollArea className="flex-1 p-6">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <Avatar className="w-10 h-10">
                <AvatarFallback className={message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-accent text-accent-foreground'}>
                  {message.role === 'user' ? 'You' : 'AB'}
                </AvatarFallback>
              </Avatar>
              <div
                className={`max-w-[80%] rounded-xl p-4 ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                <p className="text-base leading-loose">{message.content}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-3">
              <Avatar className="w-10 h-10">
                <AvatarFallback className="bg-accent text-accent-foreground">AB</AvatarFallback>
              </Avatar>
              <div className="bg-muted rounded-xl p-4">
                <p className="text-sm text-muted-foreground">Aunt B is thinking...</p>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-6 border-t">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex gap-2"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Aunt B anything..."
            className="flex-1"
            disabled={isLoading}
            data-testid="input-message"
          />
          <Button type="submit" size="icon" disabled={isLoading || !input.trim()} data-testid="button-send">
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </Card>
  );
}
