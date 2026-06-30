import { ComingSoon } from '@/components/sections/coming-soon'
import { MessagesSquare } from 'lucide-react'
import React from 'react'

export default function CommunityForum() {
    return (
        <ComingSoon
            icon={MessagesSquare}
            eyebrow="Community Forum · Coming soon"
            title="Where founders and experts talk"
            description="Secure, focused spaces to ask real questions and get answers from verified experts — not anonymous strangers."
            bullets={[
                "Topic-based rooms across every business need",
                "Verified expert answers, not guesswork",
                "Private threads for sensitive questions",
            ]}
        />
    )
}
