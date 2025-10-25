// JohnGPT Dashboard - Phase 3 placeholder
// Coming soon: Conversation history, settings, and more.

import { BrainIcon } from '@/components/ui/BrainIcon';

export default function JohnGPTPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="text-center max-w-md mx-auto">
        <BrainIcon size={80} className="text-primary opacity-80 mx-auto mb-6" />
        <h1 className="text-2xl font-bold text-foreground mb-2">JohnGPT Dashboard</h1>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Coming soon: Conversation history, settings, and more.
        </p>
        <p className="text-muted-foreground text-xs mt-4 italic">
          Tap the JohnGPT tab below to start a conversation.
        </p>
      </div>
    </div>
  );
}
