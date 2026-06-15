import { Globe, Mail, Phone } from "lucide-react";
import { FaGithub, FaLinkedinIn } from "react-icons/fa6";
import type { SocialLink } from "@/types";

export function SocialIcon({ icon, size = 18 }: { icon: SocialLink["icon"]; size?: number }) {
  switch (icon) {
    case "github":
      return <FaGithub size={size} />;
    case "linkedin":
      return <FaLinkedinIn size={size} />;
    case "mail":
      return <Mail size={size} />;
    case "phone":
      return <Phone size={size} />;
    case "globe":
      return <Globe size={size} />;
    default:
      return null;
  }
}
