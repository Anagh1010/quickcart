import facebook_icon from "@/assets/facebook_icon.svg";
import twitter_icon from "@/assets/twitter_icon.svg";
import instagram_icon from "@/assets/instagram_icon.svg";
import BrandLogo from "@/components/common/BrandLogo";
import React from "react";
import Image from "next/image";

const Footer = () => {
  return (
    <div className="flex md:flex-row flex-col-reverse items-center justify-between text-left w-full px-10">
      <div className="flex items-center gap-4">
        <BrandLogo size="sm" className="hidden md:flex" />
        <div className="hidden md:block h-7 w-px bg-border-subtle" />
        <p className="py-4 text-center text-xs md:text-sm text-stone-500">
          Copyright 2026 © quickcart.com All Right Reserved.
        </p>
      </div>
      <div className="flex items-center gap-3">
        <a href="#">
          <Image src={facebook_icon} alt="facebook_icon" />
        </a>
        <a href="#">
          <Image src={twitter_icon} alt="twitter_icon" />
        </a>
        <a href="#">
          <Image src={instagram_icon} alt="instagram_icon" />
        </a>
      </div>
    </div>
  );
};

export default Footer;
