'use client'

import { useState, useEffect } from 'react'
import {
  Mail,
  MessageCircle,
  Instagram,
  Music2,
  Send,
  Gamepad2,
  Github,
  Twitter,
  Linkedin,
  Youtube,
  Link2,
} from 'lucide-react'

const ICON_MAP = {
  email: Mail,
  whatsapp: MessageCircle,
  instagram: Instagram,
  tiktok: Music2,
  telegram: Send,
  discord: Gamepad2,
  github: Github,
  twitter: Twitter,
  linkedin: Linkedin,
  youtube: Youtube,
  custom: Link2,
}

const COLOR_MAP = {
  email: 'text-gray-600 hover:text-red-500',
  whatsapp: 'text-gray-600 hover:text-green-600',
  instagram: 'text-gray-600 hover:text-pink-500',
  tiktok: 'text-gray-600 hover:text-black',
  telegram: 'text-gray-600 hover:text-blue-500',
  discord: 'text-gray-600 hover:text-indigo-500',
  github: 'text-gray-600 hover:text-black',
  twitter: 'text-gray-600 hover:text-blue-400',
  linkedin: 'text-gray-600 hover:text-blue-700',
  youtube: 'text-gray-600 hover:text-red-600',
  custom: 'text-gray-600 hover:text-black',
}

export default function SocialLinks({ className = '' }) {
  const [links, setLinks] = useState([])

  useEffect(() => {
    fetch('/api/social')
      .then((r) => r.json())
      .then((data) => setLinks(data.filter((l) => l.visible)))
      .catch(() => {})
  }, [])

  if (links.length === 0) return null

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {links.map((link) => {
        const Icon = ICON_MAP[link.platform] || Link2
        const color = COLOR_MAP[link.platform] || 'text-gray-600 hover:text-black'
        return (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`transition ${color}`}
            title={link.label || link.platform}
          >
            <Icon size={20} />
          </a>
        )
      })}
    </div>
  )
}
