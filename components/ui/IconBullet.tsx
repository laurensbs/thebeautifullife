interface IconBulletProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}

export default function IconBullet({ icon, title, subtitle }: IconBulletProps) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blush flex items-center justify-center">
        <span className="text-accent text-lg">{icon}</span>
      </div>
      <div className="pt-1">
        <p className="font-sans font-semibold text-dark text-[15px] leading-snug">
          {title}
        </p>
        <p className="font-sans font-light text-brown text-[14px] leading-relaxed mt-0.5">
          {subtitle}
        </p>
      </div>
    </div>
  );
}
