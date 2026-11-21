import Image from "next/image";
import Link from "next/link";
import LayoutContainer from "@/components/layout/LayoutContainer";

const PromotionBanner = () => (
  <section className="py-12">
    <LayoutContainer size="wide">
      <div className="overflow-hidden rounded-2xl md:rounded-3xl bg-[#141518] border border-stone-800 p-6 sm:p-10 md:p-12 text-white shadow-sm">
        <div className="grid items-center gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded bg-[#fef08a] px-2 py-0.5 font-mono text-[10px] font-bold text-[#854d0e] border border-[#fde047]">
                LIMITED DEAL
              </span>
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-stone-400">
                GAMING WEEK SPECIAL
              </span>
            </div>
            <h2 className="mt-4 text-2xl font-bold tracking-tight text-white sm:text-4xl">
              Level up your setup without slowing down
            </h2>
            <p className="mt-3 max-w-lg text-xs sm:text-sm leading-6 text-stone-300">
              From immersive audio to high-precision controllers, discover gaming gear built for competitive play and ultimate comfort.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                className="rounded-xl bg-[#f5c344] hover:bg-[#e6b02e] px-6 py-3 text-xs font-bold text-stone-950 transition shadow-sm"
                href="/all-products?category=Console"
              >
                Shop gaming gear →
              </Link>
              <span className="text-xs text-stone-400">● 100% verified brand warranty</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4">
            <div className="hidden rounded-2xl bg-[#1c1d22] border border-stone-800 p-4 md:block">
              <Image alt="Soundbox" className="size-32 object-contain" height={140} src={"/assets/jbl_soundbox_image.png"} width={140} />
            </div>
            <div className="rounded-2xl bg-[#1c1d22] border border-stone-800 p-5">
              <Image alt="Controller" className="size-40 object-contain" height={180} src={"/assets/md_controller_image.png"} width={180} />
            </div>
          </div>
        </div>
      </div>
    </LayoutContainer>
  </section>
);

export default PromotionBanner;
