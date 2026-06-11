"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { MessageCircle, Camera, Send, DollarSign, ExternalLink } from "lucide-react";
import type { Translations } from "@/i18n";

interface SocialHubProps {
  t: Translations;
}

const socials = [
  {
    name: "Discord",
    icon: MessageCircle,
    url: "https://discord.gg/ZCWYcpDwDE",
    color: "#5865F2",
    description: "Join the community",
  },
  {
    name: "Instagram",
    icon: Camera,
    url: "https://www.instagram.com/ladislav_v_/",
    color: "#E4405F",
    description: "Behind the scenes",
  },
  {
    name: "VK",
    icon: Send,
    url: "https://vk.com/chernyacko",
    color: "#4680C2",
    description: "Russian community",
  },
  {
    name: "DonationAlerts",
    icon: DollarSign,
    url: "https://www.donationalerts.com/r/kloyn1",
    color: "#C4A35A",
    description: "Support the channel",
  },
];

export default function SocialHub({ t }: SocialHubProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="social" className="relative py-32 px-6">
      <div className="max-w-5xl mx-auto" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-xs font-mono text-accent tracking-[0.3em] uppercase">
            {t.social.title}
          </span>
          <h2 className="font-display text-3xl sm:text-4xl mt-4 tracking-wide">
            {t.social.subtitle}
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {socials.map((social, i) => (
            <motion.a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group glass-card rounded-xl p-6 text-center relative overflow-hidden"
            >
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: `radial-gradient(circle at 50% 100%, ${social.color}15, transparent 70%)`,
                }}
              />

              <div className="relative z-10">
                <div
                  className="w-14 h-14 mx-auto rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
                  style={{ backgroundColor: `${social.color}15` }}
                >
                  <social.icon size={24} style={{ color: social.color }} />
                </div>
                <h3 className="font-semibold text-foreground mb-1">{social.name}</h3>
                <p className="text-xs text-muted">{social.description}</p>
                <div className="mt-4 flex items-center justify-center gap-1 text-accent opacity-0 group-hover:opacity-100 transition-opacity text-xs font-mono">
                  Visit <ExternalLink size={10} />
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
