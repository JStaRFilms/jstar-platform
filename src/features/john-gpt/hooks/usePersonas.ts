import { useState, useEffect } from 'react';

export type Persona = {
    id: string;
    name: string;
    role: string;
    description: string;
    systemPrompt: string;
};

/**
 * Custom hook for fetching and managing personas
 * 
 * Handles:
 * - Fetching personas from API
 * - Loading state
 * - Setting default active persona
 */
export function usePersonas() {
    const [personas, setPersonas] = useState<Persona[]>([]);
    const [isLoadingPersonas, setIsLoadingPersonas] = useState(true);
    const [activePersona, setActivePersona] = useState<Persona | null>(null);

    useEffect(() => {
        async function fetchPersonas() {
            try {
                const res = await fetch('/api/johngpt/personas');
                if (!res.ok) throw new Error('Failed to fetch personas');
                const data = await res.json();
                setPersonas(data);
                if (data.length > 0) setActivePersona(data[0]);
            } catch (error) {
                console.error('Error fetching personas:', error);
            } finally {
                setIsLoadingPersonas(false);
            }
        }
        fetchPersonas();
    }, []);

    return {
        personas,
        activePersona,
        setActivePersona,
        isLoadingPersonas,
    };
}
