'use client';

import { useState, useRef, useEffect } from 'react';
import React from 'react';
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../../components/ui/card";
import { Header } from "../../components/header";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch (error) {
      console.error("Error processing message:", error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "Sorry, there was an error processing your message. Please try again." 
      }]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <main className="flex min-h-screen flex-col items-center ">
          <Card className="w-full max-w-4xl rounded-xl shadow-lg overflow-hidden">
            <CardHeader className="bg-primary rounded-t-xl px-6 py-4">
              <CardTitle className="text-2xl font-bold text-primary-foreground">Hedera Agent Chat</CardTitle>
            </CardHeader>
            
            <CardContent className="p-0">
              <div 
                ref={chatContainerRef}
                className="h-[600px] overflow-y-auto p-6 space-y-4"
              >
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <Card 
                      className={`max-w-[80%] shadow-md ${
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground rounded-2xl rounded-tr-sm'
                          : 'bg-muted rounded-2xl rounded-tl-sm'
                      }`}
                    >
                      <CardContent className="p-4">
                        <pre className="whitespace-pre-wrap font-sans">
                          {message.content}
                        </pre>
                      </CardContent>
                    </Card>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <Card className="bg-muted rounded-2xl rounded-tl-sm shadow-md">
                      <CardContent className="p-4">
                        <div className="animate-pulse">Thinking...</div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            </CardContent>

            <CardFooter className="p-6 border-t">
              <form onSubmit={handleSubmit} className="flex w-full space-x-3">
                <Input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 rounded-full px-4 py-2"
                  disabled={isLoading}
                />
                <Button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  variant="default"
                  className="rounded-full px-6"
                >
                  Send
                </Button>
              </form>
            </CardFooter>
          </Card>
        </main>
      </div>
    </>
  );
}
