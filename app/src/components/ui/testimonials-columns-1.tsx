import React from "react";
import { motion } from "framer-motion";

const testimonials = [
  {
    text: "ABN Amro is exploring how to issue various tokenized assets such as bonds, real estate and investment funds. Having purpose-built infrastructure to facilitate the omnichain issuance and distribution of these assets has the potential to be highly relevant for traditional financial institutions.",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    name: "Amzah Moelah",
    role: "Lead Digital Asset Intrapreneur · ABN AMRO",
  },
  {
    text: "Franklin Templeton has always been a pioneer in issuing our assets on new chains and managing our assets omnichain. We welcome purpose-built infrastructure for asset managers that will make it easier to issue and manage securities omnichain going forward.",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    name: "Sandy Kaul",
    role: "Head of Digital Assets · Franklin Templeton",
  },
  {
    text: "Interest in tokenized investment products is growing amongst traditional financial institutions, signaling a need for robust risk management and controls to help these organizations migrate onchain.",
    image: "https://randomuser.me/api/portraits/men/55.jpg",
    name: "Glenn Morgan",
    role: "SVP Digital Asset Practice Leader · Aon",
  },
  {
    text: "We believe the next step going forward will be the tokenization of financial assets. This is a technological transformation for financial assets.",
    image: "https://randomuser.me/api/portraits/men/68.jpg",
    name: "Larry Fink",
    role: "Founder, Chairman and CEO · BlackRock",
  },
  {
    text: "Regulated institutions have long desired more purpose-built infrastructure that meets their needs and makes it easier for them to transact onchain. This is an innovation that has the potential to help move institutions and capital markets onchain.",
    image: "https://randomuser.me/api/portraits/men/76.jpg",
    name: "Matt Higginson",
    role: "Partner & Global Leader of Digital Assets · McKinsey",
  },
];

export const TestimonialsColumn = (props: {
  className?: string;
  testimonials: typeof testimonials;
  duration?: number;
}) => {
  return (
    <div className={props.className}>
      <motion.div
        animate={{
          translateY: "-50%",
        }}
        transition={{
          duration: props.duration || 10,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-6 pb-6 bg-background"
      >
        {[...new Array(2).fill(0).map((_, index) => (
          <React.Fragment key={index}>
            {props.testimonials.map(({ text, image, name, role }, i) => (
              <div
                className="p-8 rounded-3xl border border-border shadow-lg shadow-primary/10 max-w-xs w-full bg-background"
                key={i}
              >
                <div className="text-sm leading-relaxed text-foreground/80">&ldquo;{text}&rdquo;</div>
                <div className="flex items-center gap-2 mt-5">
                  <img
                    width={40}
                    height={40}
                    src={image}
                    alt={name}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div className="flex flex-col">
                    <div className="font-medium tracking-tight leading-5 text-foreground">{name}</div>
                    <div className="leading-5 opacity-60 tracking-tight text-xs">{role}</div>
                  </div>
                </div>
              </div>
            ))}
          </React.Fragment>
        ))]}
      </motion.div>
    </div>
  );
};

export { testimonials };
