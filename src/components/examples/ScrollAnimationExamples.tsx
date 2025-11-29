'use client';

import React from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { useScrollAnimationMulti } from '@/hooks/useScrollAnimationMulti';

/**
 * Scroll Animation Examples Component
 * 
 * Demonstrates various scroll-triggered animation patterns using the
 * useScrollAnimation and useScrollAnimationMulti hooks.
 */
export function ScrollAnimationExamples() {
    // Single element example
    const example1 = useScrollAnimation<HTMLDivElement>({ triggerOnce: true });
    const example2 = useScrollAnimation<HTMLDivElement>({ triggerOnce: true });
    const example3 = useScrollAnimation<HTMLDivElement>({ triggerOnce: true });
    const example4 = useScrollAnimation<HTMLDivElement>({ triggerOnce: true });

    // Multi-element staggered example
    const { refs: cardRefs, visibilityStates: cardStates } = useScrollAnimationMulti<HTMLDivElement>({
        count: 4,
        staggerDelay: 150,
    });

    // List items with default stagger
    const { refs: listRefs, visibilityStates: listStates } = useScrollAnimationMulti<HTMLDivElement>({
        count: 6,
        staggerDelay: 100,
    });

    return (
        <div className="min-h-screen bg-background py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-32">
                {/* Header */}
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-bold text-foreground">
                        Scroll Animation Examples
                    </h1>
                    <p className="text-xl text-muted-foreground">
                        Scroll down to see various animation patterns in action
                    </p>
                </div>

                {/* Example 1: Fade  In Up */}
                <section className="space-y-6">
                    <h2 className="text-3xl font-semibold text-foreground">
                        1. Fade In Up (Default)
                    </h2>
                    <div
                        ref={example1.ref}
                        className={`scroll-animate-hidden ${example1.isVisible ? 'scroll-animate-fade-in-up' : ''
                            }`}
                    >
                        <div className="bg-card border border-border rounded-lg p-8 shadow-lg">
                            <h3 className="text-2xl font-semibold mb-4">Fade In Up Animation</h3>
                            <p className="text-muted-foreground">
                                This is the most common scroll animation. The element fades in while sliding up from below.
                                Perfect for hero sections, feature cards, and content blocks.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Example 2: Fade In From Left */}
                <section className="space-y-6">
                    <h2 className="text-3xl font-semibold text-foreground">
                        2. Fade In From Left
                    </h2>
                    <div
                        ref={example2.ref}
                        className={`scroll-animate-hidden ${example2.isVisible ? 'scroll-animate-fade-in-left' : ''
                            }`}
                    >
                        <div className="bg-gradient-to-r from-primary to-secondary text-white rounded-lg p-8 shadow-lg">
                            <h3 className="text-2xl font-semibold mb-4">Sliding From Left</h3>
                            <p>
                                Great for timeline items or content that flows from one side. This creates
                                a sense of horizontal movement and progression.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Example 3: Scale In */}
                <section className="space-y-6">
                    <h2 className="text-3xl font-semibold text-foreground">
                        3. Scale In
                    </h2>
                    <div
                        ref={example3.ref}
                        className={`scroll-animate-hidden ${example3.isVisible ? 'scroll-animate-scale-in' : ''
                            }`}
                    >
                        <div className="bg-accent text-white rounded-lg p-8 shadow-lg">
                            <h3 className="text-2xl font-semibold mb-4">Scale Animation</h3>
                            <p>
                                The element grows from 95% to 100% while fading in. Creates a subtle
                                "pop" effect that draws attention.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Example 4: Rotate In */}
                <section className="space-y-6">
                    <h2 className="text-3xl font-semibold text-foreground">
                        4. Rotate In
                    </h2>
                    <div
                        ref={example4.ref}
                        className={`scroll-animate-hidden ${example4.isVisible ? 'scroll-animate-rotate-in' : ''
                            }`}
                    >
                        <div className="bg-highlight text-white rounded-lg p-8 shadow-lg">
                            <h3 className="text-2xl font-semibold mb-4">Rotate Animation</h3>
                            <p>
                                Combines rotation, scale, and fade for a more dramatic entrance.
                                Use sparingly for special emphasis.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Example 5: Staggered Cards */}
                <section className="space-y-6">
                    <h2 className="text-3xl font-semibold text-foreground">
                        5. Staggered Grid (Multi-Element)
                    </h2>
                    <p className="text-muted-foreground">
                        Multiple elements animate in sequence with a 150ms delay between each.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                            { title: 'Card 1', color: 'bg-blue-500' },
                            { title: 'Card 2', color: 'bg-purple-500' },
                            { title: 'Card 3', color: 'bg-green-500' },
                            { title: 'Card 4', color: 'bg-orange-500' },
                        ].map((card, index) => (
                            <div
                                key={index}
                                ref={cardRefs[index]}
                                className={`scroll-animate-hidden ${cardStates[index] ? 'scroll-animate-fade-in-up' : ''
                                    }`}
                            >
                                <div className={`${card.color} text-white rounded-lg p-6 shadow-lg`}>
                                    <h4 className="text-xl font-semibold mb-2">{card.title}</h4>
                                    <p className="text-sm opacity-90">
                                        Stagger delay: {index * 150}ms
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Example 6: Staggered List */}
                <section className="space-y-6">
                    <h2 className="text-3xl font-semibold text-foreground">
                        6. Staggered List
                    </h2>
                    <p className="text-muted-foreground">
                        List items animate one after another with a 100ms delay.
                    </p>
                    <div className="space-y-4">
                        {[
                            'First item appears',
                            'Then second item',
                            'Followed by third',
                            'Then fourth',
                            'And fifth',
                            'Finally sixth',
                        ].map((item, index) => (
                            <div
                                key={index}
                                ref={listRefs[index]}
                                className={`scroll-animate-hidden ${listStates[index] ? 'scroll-animate-fade-in-left' : ''
                                    }`}
                            >
                                <div className="bg-card border border-border rounded-lg p-4 shadow">
                                    <p className="text-foreground font-medium">{item}</p>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        Delay: {index * 100}ms
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Footer Info */}
                <section className="text-center space-y-4 pb-20">
                    <h3 className="text-2xl font-semibold text-foreground">
                        Accessibility First
                    </h3>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        All animations automatically respect the user's "prefers-reduced-motion" setting.
                        If a user has motion reduced enabled in their OS, elements will appear instantly
                        without animation.
                    </p>
                </section>
            </div>
        </div>
    );
}
