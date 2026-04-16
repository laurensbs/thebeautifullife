interface IconBulletProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}

export default function IconBullet({ icon, title, subtitle }: IconBulletProps) {
  return (
    <div className="flex items-start gap-3 md:gap-4">
      <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-full bg-blush flex items-center justify-center">
        <span className="text-accent">{icon}</span>
      </div>
      <div className="pt-0.5 md:pt-1">
        <p className="font-sans font-semibold text-dark text-[14px] md:text-[15px] leading-snug">
          {title}
        </p>
        <p className="font-sans font-light text-brown text-[13px] md:text-[14px] leading-relaxed mt-0.5">
          {subtitle}
        </p>
      </div>
    </div>
  );
}
