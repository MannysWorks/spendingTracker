import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export const CursorTrail = () => {
    const [trail, setTrail] = useState<{ x: number; y: number; id: number }[]>([])

    useEffect(() => {
        const handleMove = (e: MouseEvent) => {
            const newDot = { x: e.clientX, y: e.clientY, id: Date.now() }
            setTrail(prev => [...prev.slice(-15), newDot])
        }
        window.addEventListener('mousemove', handleMove)
        return () => window.removeEventListener('mousemove', handleMove)
    }, [])

    return (
        <AnimatePresence>
            {trail.map(dot => (
                <motion.div
                    key={dot.id}
                    initial={{ opacity: 1, scale: 1 }}
                    animate={{ opacity: 0, scale: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    style={{
                        position: 'fixed',
                        left: dot.x,
                        top: dot.y,
                        width: 8,
                        height: 8,
                        backgroundColor: '#1a6e1a',
                        pointerEvents: 'none',
                        zIndex: 9999,
                    }}
                />
            ))}
        </AnimatePresence>
    )
}