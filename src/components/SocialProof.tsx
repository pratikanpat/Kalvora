'use client';

import { Star } from 'lucide-react';

const testimonials = [
    {
        name: 'Sneha Arora',
        role: 'Residential Interior Designer',
        location: 'Mumbai',
        quote: 'I used to spend 2 hours formatting each proposal in Word. Kalvora does it in 5 minutes. My clients actually compliment my proposals now.',
        avatar: 'SA',
        avatarBg: 'bg-gradient-to-br from-brand-600 to-brand-700',
        stars: 5,
    },
    {
        name: 'Rajesh Kapoor',
        role: 'Founder, Vastu Interiors Studio',
        location: 'Pune',
        quote: 'The moment I saw that a client viewed my proposal, I called them. Closed the deal that same evening. That one feature paid for itself.',
        avatar: 'RK',
        avatarBg: 'bg-gradient-to-br from-emerald-600 to-emerald-700',
        stars: 5,
    },
    {
        name: 'Ananya Mehta',
        role: 'Freelance Interior Designer',
        location: 'Bangalore',
        quote: "No more 'sir, did you check my proposal?' messages. I send a link, they approve, invoice is ready. My workflow completely changed.",
        avatar: 'AM',
        avatarBg: 'bg-gradient-to-br from-amber-500 to-amber-600',
        stars: 5,
    },
];

export default function SocialProof() {
    return (
        <section className="landing-section pt-10 sm:pt-14" id="reviews">
            <div className="text-center mb-10 sm:mb-12">
                <p className="text-brand-400 text-[10px] font-bold uppercase tracking-[0.25em] mb-4">
                    What Designers Say
                </p>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
                    Trusted by Interior Designers
                </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
                {testimonials.map((t, i) => (
                    <div key={i} className="testimonial-card animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                        {/* Stars */}
                        <div className="testimonial-stars mb-4">
                            {Array.from({ length: t.stars }).map((_, j) => (
                                <Star key={j} size={14} fill="currentColor" />
                            ))}
                        </div>

                        {/* Quote */}
                        <p className="text-[#c0c0d0] text-sm leading-relaxed mb-5">
                            &ldquo;{t.quote}&rdquo;
                        </p>

                        {/* Author */}
                        <div className="flex items-center gap-3">
                            <div className={`testimonial-avatar ${t.avatarBg}`}>
                                {t.avatar}
                            </div>
                            <div>
                                <p className="text-white text-sm font-semibold">{t.name}</p>
                                <p className="text-[#6a6a80] text-xs">{t.role} · {t.location}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
