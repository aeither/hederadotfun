'use client';

import { useState, useRef, useEffect } from 'react';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../../components/ui/card";
import { Header } from "../../components/header";
import { Sparkles } from "lucide-react";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const suggestions = [
  {
    title: "Create Token",
    text: "create token hbartest2 test2 with 100 million max supply and supply key 0.0.5615279",
    icon: "✨"
  },
  {
    title: "Mint Tokens",
    text: "mint 50 million tokens to treasury account",
    icon: "🔨"
  },
  {
    title: "Transfer Tokens",
    text: "transfer 1000 tokens to account 0.0.5615279",
    icon: "💸"
  },
  {
    title: "Token Info",
    text: "show me information about token 0.0.5615279",
    icon: "ℹ️"
  }
];

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
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 sm:px-6 lg:px-8 py-8"
      >
        <main className="flex min-h-screen flex-col items-center">
          <Card className="w-full max-w-4xl rounded-xl shadow-lg overflow-hidden">
            <CardHeader className="bg-primary rounded-t-xl px-6 py-4">
              <CardTitle className="text-2xl font-bold text-primary-foreground">Hedera Agent Chat</CardTitle>
            </CardHeader>
            
            <CardContent className="p-0">
              <div 
                ref={chatContainerRef}
                className="h-[600px] overflow-y-auto p-6 space-y-4"
              >
                {messages.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-4"
                  >
                    <div className="text-center text-muted-foreground">
                      <Sparkles className="h-8 w-8 mx-auto mb-2 text-primary" />
                      <h3 className="text-lg font-medium mb-2">Start a conversation</h3>
                      <p className="text-sm">Click on a suggestion or type your own message</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                      {suggestions.map((suggestion, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 + 0.3 }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Card 
                            className="cursor-pointer hover:bg-muted/50 transition-colors"
                            onClick={() => {
                              setInput(suggestion.text);
                              const inputElement = document.querySelector('input[type="text"]');
                              if (inputElement) {
                                inputElement.focus();
                              }
                            }}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xl">{suggestion.icon}</span>
                                <h4 className="font-medium">{suggestion.title}</h4>
                              </div>
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {suggestion.text}
                              </p>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
                <AnimatePresence mode="popLayout">
                  {messages.map((message, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
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
                    </motion.div>
                  ))}
                </AnimatePresence>
                {isLoading && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="flex justify-start"
                  >
                    <Card className="bg-muted rounded-2xl rounded-tl-sm shadow-md">
                      <CardContent className="p-4">
                        <div className="animate-pulse">Thinking...</div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </div>
            </CardContent>

            <CardFooter className="p-6 border-t">
              <motion.form 
                onSubmit={handleSubmit} 
                className="flex w-full space-x-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
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
              </motion.form>
            </CardFooter>
          </Card>
        </main>
      </motion.div>
    </>
  );
}
