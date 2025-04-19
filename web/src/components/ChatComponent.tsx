import { useState } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

export default function ChatComponent() {
  const [inputValue, setInputValue] = useState("");

  const messages = [
    {
      id: 1,
      sender: "Alice",
      content: "Hey there! How are you doing today?",
      timestamp: "10:05 AM",
      isUser: false
    },
    {
      id: 2,
      sender: "You",
      content: "I'm doing great! Just working on this new project.",
      timestamp: "10:07 AM",
      isUser: true
    },
    {
      id: 3,
      sender: "Alice",
      content: "That sounds exciting! What kind of project is it?",
      timestamp: "10:08 AM",
      isUser: false
    },
    {
      id: 4,
      sender: "You",
      content:
        "It's a chat application using shadcn/ui components. I'm hoping to make it interactive soon.",
      timestamp: "10:10 AM",
      isUser: true
    },
    {
      id: 5,
      sender: "Alice",
      content: "That sounds really cool! I'd love to see it when you're done.",
      timestamp: "10:12 AM",
      isUser: false
    }
  ];

  const handleSendMessage = () => {
    if (inputValue.trim() === "") return;
    console.log("Message sent:", inputValue);
    setInputValue("");
  };

  return (
    <div className='mx-auto flex h-screen max-w-md flex-col'>
      <Card className='flex h-full flex-col'>
        <div className='border-b bg-primary/5 p-4'>
          <div className='flex items-center gap-2'>
            <Avatar className='h-8 w-8'>
              <div className='flex h-full w-full items-center justify-center rounded-full bg-primary font-medium text-primary-foreground'>
                A
              </div>
            </Avatar>
            <div>
              <h3 className='font-medium'>Alice</h3>
              <p className='text-xs text-muted-foreground'>Online</p>
            </div>
          </div>
        </div>

        <ScrollArea className='flex-1 p-4'>
          <div className='flex flex-col gap-4'>
            {messages.map(message => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs md:max-w-md ${message.isUser ? "bg-primary text-primary-foreground" : "bg-muted"} rounded-lg p-3`}
                >
                  <div className='mb-1 flex items-center justify-between'>
                    <span className='text-sm font-medium'>
                      {message.sender}
                    </span>
                    <span className='text-xs opacity-70'>
                      {message.timestamp}
                    </span>
                  </div>
                  <p className='text-sm break-words'>{message.content}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className='border-t p-4'>
          <div className='flex gap-2'>
            <Input
              placeholder='Type a message...'
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter") handleSendMessage();
              }}
              className='flex-1'
            />
            <Button size='icon' onClick={handleSendMessage}>
              <Send className='h-4 w-4' />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
